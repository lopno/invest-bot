const fetch = require('node-fetch');

function getJuneDefensiveSite() {
  return fetch('https://www.fundsquare.net/security/summary?idInstr=256575')
    .then(res => res.text());
}
function getJuneDefensivePriceSite() {
  return fetch('https://www.fundsquare.net/security/price?idInstr=256575')
    .then(res => res.text());
}

function getJuneModerateShortSite() {
  return fetch('https://www.fundsquare.net/security/summary?idInstr=257492')
    .then(res => res.text());
}

function getJuneModerateShortPriceSite() {
  return fetch('https://www.fundsquare.net/security/price?idInstr=257492')
    .then(res => res.text());
}

function getJuneModerateSite() {
  return fetch('https://www.fundsquare.net/security/summary?idInstr=256580')
    .then(res => res.text());
}

function getJuneModeratePriceSite() {
  return fetch('https://www.fundsquare.net/security/price?idInstr=256580')
    .then(res => res.text());
}

function getJuneBalancedSite() {
  return fetch('https://www.fundsquare.net/security/summary?idInstr=256570')
    .then(res => res.text());
}

function getJuneBalancedPriceSite() {
  return fetch('https://www.fundsquare.net/security/price?idInstr=256570')
    .then(res => res.text());
}

function getJuneProgressiveSite() {
  return fetch('https://www.fundsquare.net/security/summary?idInstr=256590')
    .then(res => res.text());
}

function getJuneProgressivePriceSite() {
  return fetch('https://www.fundsquare.net/security/price?idInstr=256590')
    .then(res => res.text());
}

function getJuneOpportunitySite() {
  return fetch('https://www.fundsquare.net/security/summary?idInstr=256585')
    .then(res => res.text());
}

function getJuneOpportunityPriceSite() {
  return fetch('https://www.fundsquare.net/security/price?idInstr=256585')
    .then(res => res.text());
}

function getJuneEquitySite() {
  return fetch('https://www.fundsquare.net/security/summary?idInstr=285763')
    .then(res => res.text());
}

function getJuneEquityPriceSite() {
  return fetch('https://www.fundsquare.net/security/price?idInstr=285763')
    .then(res => res.text());
}

module.exports = {
  getJuneDefensiveSite,
  getJuneDefensivePriceSite,
  getJuneModerateShortSite,
  getJuneModerateShortPriceSite,
  getJuneModerateSite,
  getJuneModeratePriceSite,
  getJuneBalancedSite,
  getJuneBalancedPriceSite,
  getJuneProgressiveSite,
  getJuneProgressivePriceSite,
  getJuneOpportunitySite,
  getJuneOpportunityPriceSite,
  getJuneEquitySite,
  getJuneEquityPriceSite,
};
