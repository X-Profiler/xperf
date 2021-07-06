'use strict';

const USAGE = Symbol('XARGS_USAGE');
const COMMANDS = Symbol('XARGS_COMMANDS');

class Args {
  constructor() {
    this[USAGE] = '';
    this[COMMANDS] = {};
  }

  get argv() {
    const args = process.argv.slice(2);
    const parsed = this.parse(args);
    return parsed;
  }

  usage(usage) {
    this[USAGE] = usage;
    return this;
  }

  command(key, check, message) {
    this[COMMANDS][key] = { check, message };
    return this;
  }

  parseCommands(args) {
    const commands = this[COMMANDS];

    let interrupt = false;

    const argsMap = args.reduce((pre, arg, index, array) => {
      if (commands.hasOwnProperty(arg)) {
        const { check, message } = commands[arg];
        const value = array[index + 1];
        if (typeof check === 'function') {
          if (check(value)) {
            pre[arg] = value;
          } else {
            if (message) {
              console.log(`${message}\n`);
            }
            interrupt = true;
            return;
          }
        } else {
          pre[arg] = value;
        }
      }
      return pre;
    }, {});

    return interrupt === true ? false : argsMap;
  }

  parse(args) {
    if (!args.length) {
      console.log(`Usage: ${this[USAGE]}\n`);
      process.exit(0);
      return;
    }

    const argsMap = this.parseCommands(args);

    if (!argsMap) {
      process.exit(0);
      return;
    }


    return argsMap;
  }
}

module.exports = new Args;