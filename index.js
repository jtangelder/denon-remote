#! /usr/bin/env node

const colors = require('colors');
const Vorpal = require('vorpal');
const DenonClient = require('./lib/DenonClient');
const setupToolCommands = require('./lib/toolCommands');
const setupDenonCommands = require('./lib/denonCommands');

const denon = new DenonClient();
const cli = Vorpal();

denon.on('connect', ()=> {
  const address = denon.socket.remoteAddress;
  const port = denon.socket.remotePort;
  cli.log(colors.green(`Successfully connected to ${address}:${port}`));
});

denon.on('error', err => {
  cli.log(colors.red('Something went wrong'), err);
  denon.end();
});

denon.on('close', ()=> {
  cli.log(colors.red('Connection closed'));
});

denon.on('data', buffer => {
  cli.log(colors.magenta(buffer.toString().trim()));
});

cli
  .localStorage('denon-remote-v1')
  .history('denon-remote-v1')
  .delimiter('denon$')
  .show();

setupToolCommands(cli, denon);
setupDenonCommands(cli, denon);

cli.execSync('connect');
