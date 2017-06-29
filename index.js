#!/usr/bin/env node

'use strict';

require('yargs').version().alias('v', 'version').commandDir('./commands').strict().help().argv;
