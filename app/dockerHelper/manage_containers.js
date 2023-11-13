const Docker = require('dockerode');
const docker = new Docker();

const removeContainer = (containerName) =>{
  const container = docker.getContainer(containerName);
  // Remove the container
  container.remove({ force: true }, (err) => {
    if (err) {
      //console.error('Error removing container:', err);
    } else {
      console.log('  -->Container removed successfully. containerName', containerName);
    }
  });
}

const getContainers = async () =>{
  return new Promise((resolve, reject) => {
    let runnings = [];
    docker.listContainers({ all: true }, (err, containers) => {
      if (err) {
        reject(err);
        return;
      }
    
      resolve(containers);

    });
  });
};

// Function to check if a container is running
const getContainerState = (containerIdOrName)=> {
  return new Promise((resolve, reject) => {
    const container = docker.getContainer(containerIdOrName);

    // Check if the container is running
    container.inspect((err, data) => {
      if (err) {
        // Error occurred while inspecting the container
        reject(err);
      } else {
        // Check the running status of the container
        const conState = data.State;
        resolve(conState);
      }
    });
  });
}


module.exports = {removeContainer, getContainers, getContainerState};