import dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import cluster from 'cluster';
import { cpus } from 'os';
import { SocketConnector } from './socket/socket-connector';
import { LicenseService } from './service/LicenseService/license.service';
import { LicenseRepository } from './repository/license.repository';
dotenv.config();

const app = express();
const port = +process.env.PORT!;
const numCPUs = cpus().length;

app.use(bodyParser.json());
const licenseService = new LicenseService(new LicenseRepository());

if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running`);

  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
  });
} else {
  app.get('/getLicense', async (req: Request, res: Response) => {
    await licenseService;
  });

  app.get('/checkingLicense', async (req: Request, res: Response) => {
    const { licenseKey, desktopId } = req.body;
    const isLicense = await licenseService.checkingLicense(licenseKey, desktopId);
    res.send({ isLicense });
  });

  app.post('/generateLicense', async (req: Request, res: Response) => {
    const { email, periodKey } = req.body;
    await licenseService.generateLicense(email, periodKey)
    res.send(req.body);
  });

  app.listen(port, () => console.log(`Trading service listening on port ${port}!`));
  new SocketConnector(port);

  console.log(`Worker ${process.pid} started`);
}
