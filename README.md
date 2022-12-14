# NodeVpn V3

## Introduction

NodeVpn is a VPN server that can be used to connect to a VPN server from a client. It is written in Node.js

## Installation

.env file
IPV4 for server example : 10.11.12.1/24
IPV4 for client example : 10.11.12.2/24
```dotenv
IPV4="10.11.12.1/24"
WSURL="wss://yourserver/"
PORT=443
PASSPHRASE="yourpassphrase"
```

## Generating a certificate

Create one with the following command:
```bash
cd certs
openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -sha256 -days 365
```
Or get one from a trusted CA.