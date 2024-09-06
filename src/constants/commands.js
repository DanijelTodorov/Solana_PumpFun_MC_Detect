const startCommand = {
  command: 'start',
  description: 'Start detection of tokens (default $10K marketcap)',
};

const stopCommand = {
  command: 'stop',
  description: 'Stop detection of token',
};

const setMarketCapCommand = {
  command: 'setmc',
  description: 'Set Market Cap for detection',
};

const commands = [startCommand, stopCommand, setMarketCapCommand];

module.exports = commands;
