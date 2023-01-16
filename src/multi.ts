import { cpus } from 'os';
import cluster from 'cluster';
import { server } from "./index";
import { IncomingMessage as IncMsg, ServerResponse as ServResp, request, createServer } from 'http';
import { port } from "./index";


const coresCount = cpus().length;
let currPort = port + 1;

if (cluster.isPrimary) {
    console.log(`Primary ${process.pid} is running, port ${port}`);

    createServer((req: IncMsg, res: ServResp) => {
        let options = {
            hostname: 'localhost',
            port: currPort,
            path: req.url,
            method: req.method,
            headers: req.headers
        };

        let proxy = request(options, function (resp: IncMsg) {
            res.writeHead(resp.statusCode! , resp.headers)
            resp.pipe(res, {end: true});

            if (currPort === port + coresCount) {
                currPort = port + 1;
            } else {
                currPort = currPort + 1;
            }
        });

        req.pipe(proxy, {end: true});

    }).listen(port);

    for (let i = 0; i < coresCount; i++) {
        cluster.fork({
            PORT: port + 1 + i
        })
    }

    cluster.on('exit', (worker) => {
        console.log(`worker ${worker.process.pid} died`);
    });

} else {
    server.listen(port);
    console.log(`Worker ${process.pid} started, port ${port}`);
}