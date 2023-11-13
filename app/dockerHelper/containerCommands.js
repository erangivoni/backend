const Docker = require("dockerode");
const docker = new Docker();
const {getMachineByName} = require('../machines')

// Function to start a container
async function startContainer(containerIdOrName) {
  try{
    const container = docker.getContainer(containerIdOrName);
    // Start the container
    await container.start();
    // Wait for a moment to allow the container to fully start
    await new Promise((resolve) => setTimeout(resolve, 2000));
    // Return the container instance
    return container;
  }
  catch(e){
    console.log('exception', e);
  }

}

const startShell = async (containerName, machineName, ws) => {
  let machine = getMachineByName(machineName);


  const execOptions = {
    AttachStdout: true,
    AttachStderr: true,
    Tty: true,
    AttachStdin: true,
    OpenStdin: true,
    Cmd: machine.repl
  };

  const container = docker.getContainer(containerName);

  container.exec(execOptions, (err, exec) => {
    if (err) {
      console.error(err);
      return;
    }

    exec.start({ hijack: true, stdin: true, Tty: true }, (err, stream) => {
      if (err) {
        console.error(err);
        return;
      }

      stream.on("data", (chunk) => {
        const data = chunk.toString();
        ws.send(data);
      });

      ws.on("message", (chunk) => {
        const data = chunk.toString();
        stream.write(data);
      });


      // Handle WebSocket closure
      ws.on("close", () => {
        console.log("WebSocket closed.");
        stream.destroy();
      });
    });
  });
};


module.exports = { startContainer, startShell };
