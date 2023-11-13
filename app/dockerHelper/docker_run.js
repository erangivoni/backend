const util = require('util');
const { myMachines, getMachineByName } = require('../machines');
//const { exec } = require('child_process');
const exec = util.promisify(require('child_process').exec);

const runDocker = async (containerName, machineName) => {
    try{
      const localMachine = getMachineByName(machineName);
      if(!localMachine){
        console.log('error finding local machine!!');
      }

      const dockerRunCommand =  `docker run -d --name=${containerName} ${localMachine.image}`;
      const { err, stdout, stderr } = await exec(dockerRunCommand);
      if(err){
        console.error('Error creating Docker container:', err, stderr);
      }
      return stdout.trim();
    }
    catch(ex){
      console.error('Error creating Docker container:', ex);
    }
   
}

module.exports = {runDocker};
