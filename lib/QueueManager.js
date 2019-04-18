const Ajv = require("ajv");

const defaults = {};

function QueueManager(config) {
  this.config = {
    ...defaults,
    ...config
  };
  this.ajv = new Ajv();
}

QueueManager.prototype.add = function add(queueConfig) {
  // TODO validation
};

module.exports = QueueManager;
