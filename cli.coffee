connection = new (require './lib/connection')
command = new (require './lib/commands')(connection)

process.stdin.resume()
process.stdin.setEncoding('utf8')

connection.connect process.argv[2] || "denon", 23, ()->
  process.stdout.write "connected to the receiver\r"

process.stdin.on 'data', (chunk)->
  [cmd, param] = chunk.split(" ").map((val)-> val.trim())
  
  if command[cmd]
    command[cmd](param)
  else
    connection.send cmd, param

connection.response (cmd, value)->
  process.stdout.write "#{cmd}: #{value}\r" 