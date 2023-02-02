#! /usr/bin/env node
const arg = require('arg')
const chokidar = require('chokidar');
const pgk = require('./package.json')
const { build } = require('./lib')
const path = require("path");
const {serve} = require("./lib/server");

function parseArgsIntoOptions(rawArgs) {
  const args = arg(
    {
      "--build": Boolean,
      "-b": Boolean,
      "--serve": Boolean,
      "-s": Boolean,
      "--watch": Boolean,
      "-w": Boolean,
      "--version": Boolean,
      "-v": Boolean,
    },
    {
      argv: rawArgs.slice(2)
    }
  );
  return {
    build: args["--build"] || false,
    b: args["-b"] || false,
    serve: args["--serve"] || false,
    s: args["-s"] || false,
    watch: args["--watch"] || false,
    w: args["-w"] || false,
    version: args["--version"] || false,
    v: args["-v"] || false,
  };
}
async function exec(args) {
    const options = parseArgsIntoOptions(args);
    if (options.serve || options.s) {
        const buildDir = path.join(process.cwd(), 'build');
        serve(buildDir, options.port || options.p)
      }
    if (options.version || options.v) {
      console.log(`Current Version: ${pgk.version} \n`)
    }
    if (options.build || options.b) {
      await build(options)
    }
    if (options.watch || options.w) {
        const pageDir = path.join(process.cwd(), 'pages');
        const hooksDir = path.join(process.cwd(), 'hooks');
        const publicDir = path.join(process.cwd(), 'public');
        [pageDir, hooksDir, publicDir].map(dirPath => {
            chokidar.watch(dirPath).on('all', (event, path) => {
              console.log(`rebuilding... \n`)
              build(options)
            });
        })
    }
}


exec(process.argv)
