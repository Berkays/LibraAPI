// import { Docker, Options } from 'docker-cli-js';
// import * as path from "path";

// const options = new Options(
//   /* machineName */ null,
//   /* currentWorkingDirectory */ path.join(__dirname, '..', 'LibraCli')
// );

// let docker = new Docker(options);

// docker.command('images').then(function (data) {
//     const imageName = process.env.CLI_IMAGE_NAME || 'hitsoft/libra_cli';
//     const image = data.images.find(o => o.repository === imageName);

//     if (image == undefined) {
//         console.log('Docker image not found. Building...');
//         docker.command(`build -t ${imageName} .`).then(function (data) {
//             console.log(`Built image ${imageName} successfully.`);
//             console.log('Starting new container...');
//             const suffix = String(Math.random() * 100);
//             docker.command(`run --name hitsoft/libra-cli-${suffix} -d -p 46000:46000 ${imageName}`).then(function (data) {
//                 console.log('data = ', data);
//                 console.log(`Container is running(hitsoft/libra-cli-${suffix})`);
//             });
//         });
//     }
// });

import * as path from "path";
var Docker = require('dockerode');
var docker = new Docker(); //defaults to above if env variables are not used

const imageName = process.env.CLI_IMAGE_NAME || 'hitsoft/libra_cli';

async function setup() {
    const images = await docker.listImages();
    const image = images.find(o => o.RepoTags[0] === imageName);

    if (image == undefined) {

        let stream = await docker.buildImage({
            context: path.join(__dirname, '..', 'LibraCli'),
            src: ['dockerfile']
        }, { t: imageName });
        stream.pipe(process.stdout, { end: true });
        await new Promise((resolve, reject) => {
            docker.modem.followProgress(stream, (err, res) => err ? reject(err) : resolve(res));
        });
        const container = await docker.createContainer({ Image: imageName, Cmd: ['/bin/bash'], name: 'libra-cli' });
        container.attach({ stream: true, stdout: true, stderr: true }, function (err, stream) {
            stream.pipe(process.stdout);
        });
    }
}

setup().then(() => {
    console.log("finished");
});


// docker.listImages().then(images => {
//     const image = images.find(o => o.RepoTags[0] === imageName);

//     if (image == undefined) {
//         // Build Image
//         docker.buildImage({
//             context: path.join(__dirname, '..', 'LibraCli'),
//             src: ['Dockerfile']
//         }, { t: imageName }, (err, res) => {
//             console.log(res);
//             console.log('Docker Image Built.');
//         });
//     }
// });

// function createContainer(): Promise<any> {
//     return docker.createContainer({ Image: imageName, Cmd: ['/bin/bash'], name: 'libra-cli' });
// };
