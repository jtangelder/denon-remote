# denon instances
dcon = new (require './lib/connection')
dcmd = new (require './lib/commands')(dcon)
  

# webserver
express = require 'express'
app = express()
server = require('http').createServer(app)
io = require('socket.io').listen(server)

app.set 'view engine', 'jade'
app.use express.bodyParser()
app.use express.static 'public'

app.get '/', (req, res)->
   res.render 'index'

server.listen(8000)

# socket.io
io.sockets.on 'connection', (socket)->
  # connect to the receiver
  socket.on 'denon.connect', (data)->
    dcon.connect data.host, data.port, ->
      socket.emit 'denon.connected'
    
  # call command methods
  socket.on 'denon.command', (data)->
    if dcmd[data.cmd]
      dcmd[data.cmd].apply dcmd, data.params or []
        
  # send core command
  socket.on 'denon.exec', (data)->
    dcon.send data.command, data.param
    
  # push response to the client
  dcon.response (cmd, value)->
    socket.emit 'denon.response', cmd: cmd, value: value
