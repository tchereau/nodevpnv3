import { Tap } from 'tuntap2';
import WebSocket from 'ws';
import { config } from 'dotenv';
import fs from 'fs';
import { compressSync, decompressSync } from 'node-zpaq';

config();

const OPTIONS = {
  method: "11,128,0",
};

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

const ws = new WebSocket(process.env.WSURL, {
  rejectUnauthorized: false,
});

ws.on('open', function open() {
  if (tap) {
    tap.on('data', (buf) => {
      //console.log(`sent: ${buf}`);
      ws.send(compressSync(buf, OPTIONS));
    }
    );
    ws.on('message', (buf) => {
      //console.log(`received: ${buf}`);
      tap.write(decompressSync(buf));
    }
    );
  }
});