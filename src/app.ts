// Set up local enviroment variables.
import { config } from "dotenv";
config();

const PORT = process.env.PORT || 3000;

import * as express from "express";
import * as bodyParser from "body-parser";
import * as cors from "cors";

// Import routes
import libraRouter from "./routes/libra";  

let app = express();


var libra = require("libra-grpc");

var client = new libra.Client('ac.testnet.libra.org:8000');

var params = {
    address: Buffer.from('435fc8fc85510cf38a5b0cd6595cbb8fbb10aa7bb3fe9ad9820913ba867f79d4', 'hex')
};
client.request('get_account_state', params).then(function (result) {
    console.log(result);
});

console.log(process.env.NT);

app.disable('x-powered-by');
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(cors());

app.use('/api/v1',libraRouter);

const server = app.listen(PORT, () => {
    console.log("Server is up on port 3000");
});

module.exports = server;