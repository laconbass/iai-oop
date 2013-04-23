var _ = require('./utils');
/*
  @utils
  @method isInterface(o): Asserts o is an Interface
*/
_.isInterface = function(o){
  return o && o.constructor === Interface
};
/*
  @class Interface: interface, what else?
*/
var expect = _.assertor('Interface constructor');
function Interface(name, methods) {

  expect(arguments.length == 2, 'exactly 2 arguments');
  expect(_.isString(name), 'name to be string');
  expect(_.isArray(methods), 'methods to be array');

  this.name = name;
  this.methods = [];
  
  methods.forEach(function(name){
    expect(_.isString(name), 'method names to be strings');
    this.methods.push(name);
  }, this);
};
module.exports = Interface;
/*
  @static
  @method 
*/

// Static class method.
var expect2 = _.assertor('Interface.implements');
Interface.implements = function(o) {
  expect2(arguments.length >= 2, 'at least 2 arguments');

  _.slice(arguments, 1).forEach(function(interface){
    expect2(_.isInterface(interface),
            'arg2 and above to be Interfaces');

    interface.methods.forEach(function(name){
      expect2( o[name] && _.isFunction(o[name]), _.format(
              "object %s to implement the method '%s' of '%s' interface",
               o, name, interface.name));
    }, this);
  }, this);
};
