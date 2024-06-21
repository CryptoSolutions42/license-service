import dotenv from "dotenv";
import express from "express";
import bodyParser from "body-parser";
import cluster from "cluster";
import { cpus } from "os";
import { SocketConnector } from "./socket/socket-connector";
dotenv.config();

const app = express();
const port = +process.env.PORT!;
const numCPUs = cpus().length;

app.use(bodyParser.json());

if (cluster.isMaster) {
    console.log(`Master ${process.pid} is running`);

    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    cluster.on("exit", (worker, code, signal) => {
        console.log(`worker ${worker.process.pid} died`);
    });
} else {
    app.get("/getLicense", async (req, res) => {
        res.send(req.body);
    });
    
    app.get("/checkingLicense", async (req, res) => {
        res.send(req.body);
    });

    app.post("/generateLicense", async (req, res) => {
        res.send(req.body);
    });

    app.listen(port, () => console.log(`Trading service listening on port ${port}!`));
    new SocketConnector(port);

    console.log(`Worker ${process.pid} started`);
}
