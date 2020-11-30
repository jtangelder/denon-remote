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

function range(num, min, max) {
  return Math.max(Math.min(num, max), min);
}

module.exports = (cli, denon) => {
  cli.command('on').action(()=> denon.command('PWON'));
  cli.command('off').action(()=> denon.command('PWSTANDBY'));

  cli.command('play').action(()=> denon.command('NS9A'));
  cli.command('pause').action(()=> denon.command('NS9B'));
  cli.command('stop').action(()=> denon.command('NS9C'));
  cli.command('next').action(()=> denon.command('NS9D'));
  cli.command('prev').action(()=> denon.command('NS9E'));

  cli.command('volume [level]', 'Volume, 0-99')
    .alias('v')
    .action(args => {
      const arg = args.level != null ? range(args.level, 0, 99) : '?';
      return denon.command(`MV${arg}`)
    });

  cli.command('input [type]', singleSpaces(`
        Signal input. Tuner, dvd, bd, tv, sat/cbl, mplay, game, aux1, net, pandora,
        siriusxm, spotify, flickr, favorites, iradio, server, usb/ipod, usb, ipd, irp, fvp.`))
    .action(args => denon.command(`SI${args.type ? args.type.toUpperCase() : '?'}`));

  cli.command('mode [type]', singleSpaces(`
        Surround mode. Movie, music, game, direct, stereo, mstereo, standard,
        dolby, dts, rock, jazz.`))
    .action(args => denon.command(`MS${args.type ? getSurroundMode(args.type) : '?'}`));

  cli.command('command <cmd> [opt...]', 'Custom command.')
    .alias('c')
    .action(args => denon.command(
      Array.isArray(args.opt) ? [args.cmd, ...args.opt].join(' ') : args.cmd)
    );
};
