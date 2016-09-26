const Socket = require('net').Socket;

module.exports = class DenonClient {
  constructor () {
    const socket = new Socket({ allowHalfOpen: true });
    socket.setTimeout(250);
    socket.setEncoding('utf8');

    this.socket = socket;
    this.on = socket.on.bind(socket);
    this.end = socket.end.bind(socket);
  }

  connect (host) {
    return new Promise(resolve =>
      this.socket.connect(23, host, resolve)
    );
  }

  command (cmd) {
    return Promise.resolve(
      this.socket.write(`${cmd}\r`)
    );
  }
};