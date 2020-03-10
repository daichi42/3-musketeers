const axios = require('axios');
const money = require('money');

const RATES_URL = 'https://api.exchangeratesapi.io/latest';
const BLOCKCHAIN_URL = 'https://blockchain.info/ticker';
const CURRENCY_BITCOIN = 'BTC';

const isAnyBTC = (from, to) => [from, to].includes(CURRENCY_BITCOIN);

module.exports = async opts => {
  const {amount = 1, from = 'USD', to = CURRENCY_BITCOIN} = opts; // on recupere les val de opts et si elle sont vides on mets les valeurs par defaut
  const promises = [];
  let base = from;

  const anyBTC = isAnyBTC(from, to);
  // booleen qui nous permet de savoir si des bitcoin sont demandé
  if (anyBTC) {
    base = from === CURRENCY_BITCOIN ? to : from;
    promises.push(axios(BLOCKCHAIN_URL));
  }
  //on recupere les valeur de convertion des bitcoin si la monnaie bitcoin a été choisi
  promises.unshift(axios(`${RATES_URL}?base=${base}`));
  // on recupere les valeur de conversion des monnaie disponible sur le site https://api.exchangeratesapi.io/latest
  try {
    const responses = await Promise.all(promises);
    const [rates] = responses;

    money.base = rates.data.base;
    money.rates = rates.data.rates;
    // dans money on a la base c'est à dire la base monétaire (usd, eur, etc) et le taux d'échange
    const conversionOpts = {
      from,
      to
    };

    if (anyBTC) {
      const blockchain = responses.find(response =>
        response.data.hasOwnProperty(base)
      );

      Object.assign(money.rates, {
        'BTC': blockchain.data[base].last
      });
    }
    // on dout changer un peu money si on a du bitcoin
    if (anyBTC) {
      Object.assign(conversionOpts, {
        'from': to,
        'to': from
      });

    return money.convert(amount, conversionOpts);
  } catch (error) {
    throw new Error (
      '💵 Please specify a valid `from` and/or `to` currency value!'
    );
  }
};
