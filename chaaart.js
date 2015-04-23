#!/usr/bin/env node

var quiche = require('quiche'),
    program = require('commander'),
    https = require('https'),
    chalk = require('chalk'),
    path = require('path'),
    fs = require('fs');

function saveImage (chart) {
  var request = https.get(chart.getUrl(true));

  request.on('response', function (response) {
    var imageData = '';

    response.setEncoding('binary');

    response.on('data', function (chunk) {
      imageData += chunk;
    });

    console.log(program.output);
    response.on('end', function () {
      fs.writeFile(program.output, imageData, 'binary', function (error) {
        if (error) {
          throw error;
        }
      });
    });
  });
}

function initialize () {
  var pkg = require(path.join(__dirname, 'package.json')),
      errorMessage = 'Missing %s. Type --help for documentation';

  program.on('--help', function () {
    console.log('  Example:');
    console.log('');
    console.log('    $ chaaart --chart line --title awesome --output chart.png');
    console.log('    $ chaaart -c line -t awesome -o chart.png');
    console.log('');
  });

  program
    .version(pkg.version)
    .option('-t, --title', 'Add chart title')
    .option('-c, --chart', 'Add chart type')
    .option('-o, --output', 'Output file name')
    .parse(process.argv);

  if (!program.chart) {
    console.log(chalk.red(errorMessage), 'chart type');
    process.exit(1);
  }

  if (!program.output) {
    console.log(chalk.red(errorMessage), 'output path');
    process.exit(1);
  }
}

+function () {
  'use strict';

  var chart, months;

  initialize();

  console.log(program);

  chart = quiche(program.chart);
  months = ['', 'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Nov', 'Dic'];

  // chart.setTitle(program.title);
  chart.addData([1000, 1500, 2000, 1300, 5000, 4300, 800, 1000, 2500, 2200, 2000, 2000], 'kWh', '4e4e99');
  chart.addAxisLabels('x', months);
  chart.setWidth(430);
  chart.setHeight(230);

  saveImage(chart);
}();