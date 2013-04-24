var iu = require('iai-util')
  , util = require('util')
;

module.exports = {
  iu: iu,
  Interface: require('./lib/Interface'),
  inherits: util.inherits
}
