require("dotenv").config();
const MINUTES_FOR_SESSION = process.env.MINUTES_FOR_SOCKET || 5;
const { getMachineNameById } = require("./machines");
const {startShell} = require("./dockerHelper/containerCommands");

const setSocketCon = (wss) => {
  const { runDocker } = require("./dockerHelper/docker_run");
  const { removeContainer } = require("./dockerHelper/manage_containers");
  
  // to be used 1 time only to pull docker images if they do not exist.
  // const downloadImages = require("./dockerHelper/docker_download_images"); 
  // const dowloadSuccessfull = downloadImages();

  let containerCounter = 0;
  wss.on("connection", async (socket, request) => {

    //init url params:
    const url = request.url;
    const urlParts = url.split("/");
    const id = urlParts[1];
    const socketEvent = urlParts[2];
    let conrainerId = "";

    //validate params:
    if ((socketEvent === "connect" && Number(id)) === false) {
      console.log(`Rejected WebSocket connection to URL: ${url}`);
      socket.close();
      return;
    }
    console.log(`WebSocket machine ${id} connected by URL: ${url}`);

    //get machine to connect
    const machineName = getMachineNameById(id);
    if (!machineName) {
      console.log(`Couldnt retrieve machine type from id ${id}`);
      socket.close();
      return;
    }

    
    //set params for running:
    let timeoutId;        // timeoutId to be in use for removing idle containers
    containerCounter++;   // containerCounter to create new insatnces
    const machineType = machineName.split("-")[0];   // convert 'node-12' to 'node'
    const containerName = 'my-' + machineType + '-' + containerCounter;
    console.log("trying to create containerName", containerName, "...");

    //initiate container on docker command:
    try {
      conrainerId = await runDocker(containerName, machineName);
      if (conrainerId) {
        console.log(new Date().toLocaleTimeString());
        console.log("container created successfully. conrainerId:", conrainerId);

        // create shell on the container:
        await startShell(containerName, machineName, socket);
      }

    } catch(exception){
      console.log(`error: `, exception);
    }finally {
      //if there is exception because container already exist this - it will be removed anyway:
      setTimer();
    }

    socket.on("message", async (messageBuffer) => {
      // this will eventaully remove the container when idle for X minutes:
      resetTimer();
    });


    // Function to set the timer
    function setTimer() {
      timeoutId = setTimeout(() => {
        removeContainer(containerName);
        console.log(
          `${new Date().toLocaleTimeString()}: ${containerName} removed after ${MINUTES_FOR_SESSION} minutes`
        );
      }, MINUTES_FOR_SESSION * 60 * 1000);
    }

    // Function to reset the timer
    function resetTimer() {
      clearTimeout(timeoutId);
      setTimer();
    }

    // WebSocket disconnect handling
    socket.on("close", () => {
      console.log(`machine ${containerName} disconnected`);
      removeContainer(containerName);
    });
  });

  wss.on("error", async (socket, request) => {
    console.log("WebSocket Error occured.");
  });
};

module.exports = setSocketCon;
