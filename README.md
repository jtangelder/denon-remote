denon-remote
============

Send/get commands from a Denon AV receiver over a network connection. Tested for my Denon AVR X1000.
In the file protocol.pdf you can find all the commands and responses from the device. 

Install [Node](http://nodejs.org) with Coffeescript (`npm install coffee-script -g`), execute `npm install`.

Run `coffee cli 192.168.1.20` to connect to the receiver. You can enter commands to send to the receiver, and read it's output.
A command could be `volume` to get the current level, or `power on` to turn the device on. The commands are the methods in commands.coffee.
You can also send the protocol commands listed in protocol.pdf, to get the volume you can send this `mv ?` 

Run `coffee server.coffee` for a simple webserver on `localhost:8000`, showing you the live status of the device. 
You may have to change the IP address of the device in the code.

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
