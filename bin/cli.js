#! /usr/bin/env node
const yargs = require('yargs');
const run = require('../src/index');

const argv = yargs
  .version()
  .scriptName('sov-minter')
  .usage('$0 [options]')
  .option('pk', {
    type: 'string',
    describe: 'private key of account used for sending transactions'
  })
  .option('rpc', {
    type: 'string',
    default: 'homestead',
    describe: 'url of rpc node'
  })
  .option('gasPrice', {
    type: 'number',
    alias: 'g',
    default: 5000000000,
    describe: 'gas price in wei'
  })
  .option('frequency', {
    type: 'number',
    alias: 'f',
    default: 4,
    describe: 'number of transaction to execute per minute'
  })
  .demandOption(['pk'])
  .argv

return run(argv.pk, argv.rpc, argv.gasPrice, argv.frequency)
