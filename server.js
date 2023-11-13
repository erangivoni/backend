const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const cors = require("cors");
const app = express();
const bodyParser = require("body-parser");
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
const setSocketCon = require("./app/websocket");
const { myMachines, getMachineByName } = require("./app/machines");
const {getContainers} = require("./app/dockerHelper/manage_containers");
const {getRunningContainers} = require('./app/serverLogic');
// Your existing Express routes

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello, Express!");
});

app.use(cors());

app.get("/machineTypes", (req, res) => {
  console.log("received a get call -> /machineTypes");
  res.setHeader("Access-Control-Allow-Origin", "*");
  const machineNames = myMachines.map((m) => m.name);
  res.send(machineNames);
});

app.get("/machines", async (req, res) => {
  console.log("received a get call -> /machines");
  res.setHeader("Access-Control-Allow-Origin", "*");
  const listContainers = await getContainers(); // from container ecosystem provider ( Docker )
  const runningContainers = getRunningContainers(listContainers);
  res.send(runningContainers);
});

app.post("/machines", (req, res) => {
  console.log("received a post call -> /machines");
  res.setHeader("Access-Control-Allow-Origin", "*");
  const postData = req.body;
  const type = postData.type;
  if (!type) {
    return sendError(res, "machine type is not received well!", 422);
  }
  const machine = getMachineByName(type);
  if (!machine) {
    sendError(res, `machine type ${type} was not found !`, 500);
  }
  res.send(machine);
});

const sendError = (res, errMsg, statusCode) => {
  console.log("Err:" + errMsg);
  return res.status(statusCode || 404).send(errMsg);
};


// set Socket events with provider(dockerHelper folder) files
setSocketCon(wss);

// Start the server
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
