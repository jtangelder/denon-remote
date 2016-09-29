const colors = require('colors');

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

  cli.command('config <key> [value]', 'Tool settings.')
    .action((args, cb) => {
      const storage = cli.localStorage;
      const { key, value } = args;

      if (value) {
        storage.setItem(key, value);
      } else {
        if (storage.getItem(key) !== null) {
          cli.log(storage.getItem(key));
        } else {
          cli.log(colors.red(`${key} is not configured.`));
        }
      }
      cb();
    });
};




