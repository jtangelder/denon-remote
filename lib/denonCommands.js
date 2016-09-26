function singleSpaces(str) {
  return str.trim().replace(/\s{2,}/g, ' ');
}

function getSurroundMode(val) {
  const alias = {
    mstereo: 'MCH STEREO',
    dolby: 'DOLBY DIGITAL',
    dts: 'DTS SURROUND',
    rock: 'ROCK ARENA',
    jazz: 'JAZZ CLUB'
  };
  return (alias[val] || val).toUpperCase();
}

module.exports = (cli, denon) => {
  const storage = cli.localStorage;

  cli.command('connect [host]', 'Connect to the Denon AVR. Defaults to config.host.')
    .action(args => {
      const host = args.host || storage.getItem('host');
      if (!host) {
        return Promise.resolve(cli.log('Please set a host with the `config host IP` command'));
      }
      return denon.connect(host)
    });

  cli.command('disconnect').action(()=> denon.end());

  cli.command('on').action(()=> denon.command('PWON'));
  cli.command('off').action(()=> denon.command('PWSTANDBY'));

  cli.command('play').action(()=> denon.command('NS9A'));
  cli.command('pause').action(()=> denon.command('NS9B'));
  cli.command('stop').action(()=> denon.command('NS9C'));
  cli.command('next').action(()=> denon.command('NS9D'));
  cli.command('prev').action(()=> denon.command('NS9E'));

  cli.command('volume [level]', 'Set or read the volume, 0-99')
    .action(args => {
      const arg = args.level ? Math.max(Math.min(args.level, 99), 0) : '?';
      return denon.command(`MV${arg}`)
    });

  cli.command('input [type]', singleSpaces(`
        Switch to the given input. Tuner, dvd, bd, tv, sat/cbl, mplay, game, aux1, net, pandora,
        siriusxm, spotify  flickr, favorites, iradio, server, usb/ipod, usb, ipd, irp, fvp.
        Enter ? to read the current state.`))
    .action(args => denon.command(`SI${args.type ? args.type.toUpperCase() : '?'}`));

  cli.command('mode [type]', singleSpaces(`
        Switch to the given surround mode. Movie, music, game, direct, stereo, mstereo, standard, 
        dolby, dts. Enter ? to read the current state.`))
    .action(args => denon.command(`MS${args.type ? getSurroundMode(args.type) : '?'}`));

  cli.command('command <cmd>', 'Send custom command.')
    .action(args => denon.command(args.cmd))
};