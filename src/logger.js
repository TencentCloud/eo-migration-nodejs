

const chalk = require('chalk');

const logger = {
  warn: (msg) => {
    console.log(chalk.yellow.bold(msg));
  },
  error: (msg) => {
    console.log(chalk.red.bold(msg));
  },
  info: (msg) => {
    console.log(msg);
  },
  success: (msg) => {
    console.log(chalk.green.bold(msg));
  },
};


module.exports = logger;