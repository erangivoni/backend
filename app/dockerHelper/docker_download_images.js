const dockerExec = require("./docker_exec");

const downloadImages = () => {
  dockerExec("docker pull ubuntu");
  dockerExec("docker pull redis");
  dockerExec("docker pull node:12");
  return true;
};
module.exports = downloadImages;
