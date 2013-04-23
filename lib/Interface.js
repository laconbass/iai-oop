var iu = require('iai-util')
           .load('assertor')
           .load('type checks')
           .load('array utils')
  , f = require('util').format
;
/*
  @utils
  @function isInterface(o): Asserts o is an Interface
*/
iu.register('isInterface', function(o) {
  return o && o.constructor === Interface
});
/*
  @class Interface: interface, what else?
  NOTE: This interface implementation is a sighly modified version of the "Interface Class" proposed by Ross Harmes and Dustin Diaz on the book "Pro Javascript Design Patterns".
*/
function Interface(name, methods) {
  var a = iu.assertor('Interface constructor')
    .expects( 'exactly 2 arguments', arguments.length == 2 )
    .expects( 'name to be string', iu.isString(name) )
    .expects( 'methods to be array', iu.isArray(methods) )
  ;

  this.name = name;
  this.methods = [];
  
  methods.forEach(function(name){
    a.expects( 'method names to be strings', iu.isString(name) );
    this.methods.push(name);
  }, this);
};
module.exports = Interface;
/*
  @static
  @method 
*/

// Static class method.
Interface.ensureImplements = function(o) {
  var a = iu.assertor('Interface::ensureImplements')
    .expects( 'at least 2 arguments', arguments.length >= 2 )
  ;
  iu.slice(arguments, 1).forEach(function(interface){
    a.expects( 'arg2 and onwards to be Interfaces', iu.isInterface(interface) )
    ;
    interface.methods.forEach(function(name){
      a.expects( f("%s to implement the method '%s' of '%s' interface",
                   o, name, interface.name), o[name] && iu.isFunction(o[name]) )
      ;
    }, this);
  }, this);
};
