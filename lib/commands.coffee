# remote control commands
module.exports = class DenonCommands
  constructor: (@dcon)->
  
  # set volume
  # range 00-99
  volume: (vol="?")=> 
    @dcon.send "MV", vol
      
  # turn the device on/standby
  mute: (toggle=true)=> 
    @dcon.send "MU", toggle.toUpperCase()
  
  # get the state of the the device 
  # or turn the device on/standby  
  power: (toggle="?")=> 
    if toggle isnt "?"
      toggle = if toggle is true then "ON" else "STANDBY"
    @dcon.send "PW", toggle
        
  # get the selected input of the the device 
  # or change the input.
  # options are:
  #   TUNER, DVD, BD, TV, SAT/CBL, MPLAY, GAME, AUX1, NET, PANDORA, SIRIUSXM, SPOTIFY
  #   FLICKR, FAVORITES, IRADIO, SERVER, USB/IPOD, USB, IPD, IRP, FVP
  input: (value="?")=> 
    @dcon.send "SI", value.toUpperCase()
    

  # methods for when in USB/iPod DIRECT/mServer/Spotify mode
  # this is available on the AVR X1000
  # see for more possible commands the protocol.pdf document
  play: ()=> @dcon.send "NS","9A"
  pause: ()=> @dcon.send "NS","9B"
  stop: ()=> @dcon.send "NS","9C"
  next: ()=> @dcon.send "NS","9D"
  prev: ()=> @dcon.send "NS","9E"  
    
  # receive information
  info: ()=> @dcon.send "NSE"

  # send search query
  search: (query)=> @dcon.send "NSD", query
    
  # move the cursor
  cursor: (dir)=>
    switch dir.toUpperCase()
      when 'UP' then code = 90
      when 'DOWN' then code = 91
      when 'LEFT' then code = 92
      when 'RIGHT' then code = 93
      when 'ENTER' then code = 94
    @dcon.send "NS", code