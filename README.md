denon-remote
============

Send/get commands from a Denon AV receiver over a network connection. Tested for my Denon AVR X1000.
In the file protocol.pdf you can find all the commands and responses from the device. 

Install Node with Coffeescript, execute `npm install` and run `coffee index.coffee`.
It will start a simple webserver on `localhost:8000`, showing you the live status of the device.

## How it works
You can control the receiver with a telnet connection, on port 23. 
The receiver needs to be on the network and the network remote option has to be on.

## Code sample
````coffee
connection = new (require './lib/connection')
command = new (require './lib/commands')(connection)

connection.connect '192.168.1.20', 23, ->
  console.log 'connected to the receiver'
  
  # turn it on!
  command.power true
  
  # change volume
  command.volume 30
	
connection.response (cmd, value)->
  console.log cmd, value
````