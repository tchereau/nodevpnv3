import { Tap } from 'tuntap2';
import { WebSocketServer } from 'ws';
import { config } from 'dotenv';
import https from 'https';
import fs from 'fs';
import { compressSync, decompressSync } from 'node-zpaq';
config();

const OPTIONS = {
  method: "11,128,0",
};

let webserver = https.createServer({
  key: fs.readFileSync('./certs/key.pem'),
  cert: fs.readFileSync('./certs/cert.pem'),
  passphrase: process.env.PASSPHRASE,
}, (req, res) => {
  res.writeHead(200);
  res.end('hello world')
}).listen(process.env.PORT);

const tap = new Tap();

try {

  tap.mtu = 1400;
  tap.ipv4 = process.env.IPV4;
  tap.isUp = true;
  console.log(`created tap: ${tap.name}, ip: ${tap.ipv4}, mtu: ${tap.mtu}`);
} catch (e) {
  console.log(`error: ${e}`);
  process.exit(0);
}

var wss = new WebSocketServer({ server: webserver });
wss.on('connection', function (c) {
  console.log('client connected');
  if (tap) {
    tap.on('data', (buf) => {
      //console.log(`sent: ${buf}`);
      c.send(compressSync(buf, OPTIONS));
    }
    );
    c.on('message', (buf) => {
      //console.log(`received: ${buf}`);
      tap.write(decompressSync(buf));
    }
    );
  }
});
wss.on('error', function (e) {
  console.log(`error: ${e}`);
  process.exit(0);
}
);