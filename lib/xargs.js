'use strict';

const USAGE = Symbol('XARGS_USAGE');
const COMMANDS = Symbol('XARGS_COMMANDS');
const OPTIONS = Symbol('XARGS_OPTIONS');

class Args {
  constructor() {
    this[USAGE] = '';
    this[COMMANDS] = {};
    this[OPTIONS] = {};
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

  option(key, check, message) {
    if (typeof check === 'function') {
      this[OPTIONS][key] = { type: 'custom', check, message };
      return this;
    }

    const ctx = this;

    return {
      boolean() {
        ctx[OPTIONS][key] = { type: 'boolean', value: false, message };
        return ctx;
      },

      choices(choices) {
        ctx[OPTIONS][key] = {
          type: 'choice',
          choices: Array.isArray(choices) ? choices : [],
          message
        };
        return ctx;
      }
    };
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

  modifyOptionName(name) {
    return name.replace('--', '');
  }

  parseOptions(args) {
    const options = this[OPTIONS];

    const optionsMap = Object.entries(options).reduce((pre, [key, info]) => {
      const { type } = info;
      switch (type) {
      case 'boolean':
        pre[key] = info.value;
        break;
      default:
        break;
      }
      return pre;
    }, {});

    const argsMap = args.reduce((pre, arg, index, array) => {
      const name = this.modifyOptionName(arg);
      if (options.hasOwnProperty(name)) {
        const { type } = options[name];
        switch (type) {
        case 'boolean':
          pre[name] = true;
          break;
        default:
          break;
        }
      }
      return pre;
    }, {});

    return Object.assign({}, optionsMap, argsMap);
  }

  parse(args) {
    if (!args.length) {
      console.log(`Usage: ${this[USAGE]}\n`);
      process.exit(0);
      return;
    }

    const commandsMap = this.parseCommands(args);

    if (!commandsMap) {
      process.exit(0);
      return;
    }

    const optionsMap = this.parseOptions(args);

    return Object.assign({}, commandsMap, optionsMap);
  }
}

module.exports = new Args;