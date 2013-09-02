# telnet connection to the denon receiver
module.exports = class DenonConnection
  constructor: ()->
    # create socket
    @socket = new (require 'net').Socket allowHalfOpen: true
    @socket.setTimeout 250
    @socket.setEncoding 'utf8'

    @connected = false
    
    # command queue
    @queue = []
    
    
  connect: (@host, @port=23, cb)=>
    if @connected then return cb()
    
    @socket.connect @port, @host, ()=>
      @connected = true
      
      setInterval =>
          cmd = @queue.shift()
          if cmd 
            @socket.write cmd
        , 1000
      cb()
    
    
  response: (cb)=>
    # command response regexes
    commands = {
      power: /^PW([A-Z]+)/,
      volume: /^MV([0-9]+)/,
      mute: /^MU([A-Z]+)/,
      input: /^SI(.+)/,
      info: /^NSE/,
    }
    
    # wait for data to come back
    @socket.on "data", (buffer)=>
      data = buffer.toString().trim()
      found = null

      for cmd, regex of commands
        # if the data matches the regex, we handle the data
        if match = data.match(regex) 
          found =
            match: match
            command: cmd
          break
      
      # we found something
      if found
        switch found.command
          # list command data
          # return an object with each list index as the key of the object entry
          when 'info'
            rows = {}            

            splitted = match.input.trim().split(/\r/)
            for line in splitted
              parts = line.match(/^NSE([0-9])(.*)/)
              if parts and parts[1] and parts[2]
                rows[parts[1]] = parts[2].toString()
            cb(found.command, rows, match)
            
          # common command data
          else
            cb(found.command, match[1], match)
      
    
  send: (command, param="")=>
    @queue.push "#{command}#{param}\r"