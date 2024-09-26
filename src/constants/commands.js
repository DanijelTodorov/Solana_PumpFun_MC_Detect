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

const getMarketCapCommand = {
  command: 'getmc',
  description: 'get Market Cap for detection',
};

const allowUserCommand = {
  command: 'allowuser',
  description: 'Allow User',
};

const manageUserCommand = {
  command: 'manageuser',
  description: 'Manage User',
};

const commands = [startCommand, stopCommand, setMarketCapCommand, getMarketCapCommand, manageUserCommand];

module.exports = commands;
