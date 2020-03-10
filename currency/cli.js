#!/usr/bin/env node

const currency = require('./');
const ora = require('ora');

const argv = process.argv.slice(2);

function help () {
  console.log(
    [
      '',
      '  Example',
      '    ❯ currency 1650 dkk eur',
      '    1650 DKK = 220.79486154 EUR',
      '',
      '  See README.md for detailed usage.'
    ].join('\n')
  );
}

const spinner = ora('Fetching exchange data..');

async function start (opts) {
  try {
    const {amount, from, to} = opts;
    const result = await currency(opts);

    spinner.stop();
    console.log(`${amount} ${from} = ${result} ${to}`);
  } catch (error) {
    spinner.stop();
    console.log(error);
    process.exit(1);
  }
}
/*
fonction start : recupere la valeur de opts
format opt : ammout (montant), from (monnaie a convertir), to (la monnaie dans laquel on veut convertir)
result : resultat de la convertion
*/
if (argv.indexOf('--help') !== - 1) {
  help();
  process.exit(0);
}

spinner.start();

const opts = {
  'amount': argv[0] || 1,
  'from': (argv[1] || 'USD').toUpperCase(),
  'to': (argv[2] || 'BTC').toUpperCase()
};
/*
ammount : prend la valeur de 1 si aucun valeur n est entrée
from : prend la valeur USD par defaut sinon prend la valeur mis en argument en majuscule
to : pareil mais avec BTC
*/
start(opts);
