import WebSocket from "ws";

export class SocketConnector {
    private wss: WebSocket.Server;

    constructor(private port: number) {
        this.wss = new WebSocket.Server({ port: this.port });

        this.wss.on("connection", (ws: WebSocket) => {
            ws.on("getLicense", (message: string) => {
                console.log(`Received message: ${message}`);
                // Process the incoming message
            });

            ws.on("checkingLicense", (message: string) => {
                console.log(`Received message: ${message}`);
                // Process the incoming message
            });

            ws.on("generateLicense", (message: string) => {
                console.log(`Received message: ${message}`);
                // Process the incoming message
            });

            ws.send("Hello, client!"); // Send a message to the connected client

            ws.on("close", () => {
                console.log("Client disconnected");
            });
        });
    }
}
