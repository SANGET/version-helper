#!/usr/bin/env node
/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on('unhandledRejection', err => {
  throw err;
});

const spawn = require('cross-spawn');
const { version } = require('./common-config');

const args = process.argv.slice(2);

const scriptIndex = args.findIndex(
  x => x === 'build' || x === 'eject' || x === 'start' || x === 'test'
);
const script = scriptIndex === -1 ? args[0] : args[scriptIndex];
const nodeArgs = scriptIndex > 0 ? args.slice(0, scriptIndex) : [];

switch (script) {
  case '-v':
    console.log(version);
    break;
  case 'gen':
  case 'gen:version':
    const result = spawn.sync(
      'sh',
      nodeArgs
        .concat(require.resolve('.././version/set-app-version.sh'))
        .concat(args.slice(scriptIndex + 1)),
      { stdio: 'inherit' }
    );
    break;
  default:
    console.log('Unknown script "' + script + '".');
    break;
}
