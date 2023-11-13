// const { exec } = require('child_process');

// const setCommand = (containerName, inputCommand) => {
    
//     const command = inputCommand || 'ls -al';
    
//     exec(`docker exec ${containerName} ${command}`, (err, stdout, stderr) => {
//       if (err) {
//         console.error('Error executing command:', err);
//         return;
//       }
    
//       console.log('Command output:', stdout);
//     });
// }
// module.exports = setCommand;