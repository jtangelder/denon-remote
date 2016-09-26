const colors = require('colors');

module.exports = (cli, denon) => {
  cli.command('conf <key> [value]', 'Configure this tool.')
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




