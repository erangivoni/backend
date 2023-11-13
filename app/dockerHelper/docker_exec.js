const { exec } = require('child_process');

const dockerExec = (command, errMsg = '') => {
    
    const dockerCommand = command;
    
    // Execute the Docker command
    const output = exec(dockerCommand, (err, stdout, stderr) => {
      if (err) {
        console.error(errMsg, err);
        return;
      }
      return stdout.trim();
    });
    return output;
    
}
module.exports = dockerExec;