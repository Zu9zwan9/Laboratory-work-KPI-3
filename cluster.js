const cluster = require("cluster");
const os = require("os");
const pid = process.pid;

// Only fork into workers the master thread
if (cluster.isMaster) {
    const cpus = os.cpus().length;
    console.log(`Clustering to ${cpus} CPUs`);
    console.log(`Master started. Pid: ${pid}`);
    for (let i = 0; i < cpus - 1; i++) {
        const worker = cluster.fork();


    }
    cluster.on('exit', (worker, code) => {
        console.log(`Worker died! Pid: ${worker.process.pid}. Code ${code}`);
        if (code !== 0 && !worker.exitedAfterDisconnect) {
            console.log("Worker crashed. Starting a new one");
            cluster.fork();
        }
    });
}
if (cluster.isWorker) {
    require("./worker.js");
}












































// // const cluster = require('cluster');
// // const os = require('os');

// // if (cluster.isMaster) {
// //   const cpus = os.cpus().length;

// //   console.log(`Forking for ${cpus} CPUs`);
// //   for (let i = 0; i<cpus; i++) {
// //     cluster.fork();
// //   }
// //   cluster.on('exit', (worker, code, signal) => {
// //     if (code !== 0 && !worker.exitedAfterDisconnect) {
// //       console.log(`Worker ${worker.id} crashed. ` +
// //                   'Starting a new worker...');
// //       cluster.fork();
// //     }
// //   });



// // //   Object.values(cluster.workers).forEach(worker => {
// // //     worker.send(`Hello User ${worker.id}`);

// // } else {
// //   require('./server');
// // }




// const cluster=require('cluster');
// const os=require('os');

// if(cluster.isMaster)
// {
//     const cpuCount = os.cpus().length;
//     console.log(`CPU count ${cpuCount}`);
//     for(var i=0;i<cpuCount;i++)
//     {
//         cluster.fork();
//     }
//     cluster.on("exit",(worker,code,signal)=>{
//         console.log(`Worker has died :${worker.process.pid}`);
//         if(!worker.exitedAfterDisconnect){
//             cluster.fork();
//         }
//     });
// }
// else
// {
//     require('./server');