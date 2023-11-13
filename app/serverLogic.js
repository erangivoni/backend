const {myMachines} = require('./machines');
const moment = require('moment');

const getRunningContainers = (listContainers) =>{
    const runningContainers = [];
    listContainers.forEach(containerInfo => {
        console.log(`Container ID: ${containerInfo.Id}, Name: ${containerInfo.Names[0]}, Status: ${containerInfo.Status}`);
        if(containerInfo.State === 'running'){
            const myind = myMachines.findIndex(m=>m.image === containerInfo.Image);
            if(myind > -1){
                
                const myMachine = myMachines[myind];
                const liveContainer = {id: myMachine.id, type: myMachine.name, lastActivity: getLastActivity(containerInfo)};
                runningContainers.push(liveContainer);
            }

        }
    });
    return runningContainers;
}

function getLastActivity(containerInfo) {
    if (containerInfo && containerInfo.Created) {
      const createdTimestamp = containerInfo.Created;
      const lastActivityDate = moment(createdTimestamp * 1000).format('YYYY-MM-DD HH:mm:ss');
      return lastActivityDate;
    }
    return null; // Unable to determine last activity
}

module.exports = {getRunningContainers}