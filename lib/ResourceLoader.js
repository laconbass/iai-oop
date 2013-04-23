var util = require('util')
  , ImprovedEmitter = require('./ImprovedEmitter')
;

function ResourceLoader() {
  ResourceLoader.super_.apply(this, arguments);
}
module.exports = ResourceLoader;
util.inherits(ResourceLoader, ImprovedEmitter);
Object.defineProperties(ResourceLoader.prototype, {
  load: { value: function(resource_name){
    throw "<"+this.class+"> must implement 'load'";
  }}
});
