const myMachines = [
{
    id: 1,
    name: "node-12",
    image: 'ghcr.io/livecycle/livecycle-node',
    repl: ["node"]
},
{
    id: 2,
    name: "ubuntu",
    image: 'ghcr.io/livecycle/livecycle-ubuntu:latest',
    repl: ["bash"]
},
{
    id: 3,
    name: "redis",
    image: 'redis',
    repl: ["redis-cli"]
},

]

const getMachineByName = (name) =>{
    const ind = myMachines.findIndex(m=>m.name === name);
    if(ind < 0){
      return null;
    }    
    return myMachines[ind];
}

const getMachineNameById = (_id) =>{
    const ind = myMachines.findIndex(m=>m.id.toString() === _id);
    if(ind < 0){
      return null;
    }    
    return myMachines[ind].name;
}

module.exports = {myMachines, getMachineByName, getMachineNameById}
