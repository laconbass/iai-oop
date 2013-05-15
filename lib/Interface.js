var util = require('util')
  , isArray = util.isArray
  , f = util.format
  , slice = Array.prototype.slice
;
/**
 * @class Interface: interface, what else?
 * NOTE: This interface implementation is a sighly modified version of the 
 *       "Interface Class" proposed by Ross Harmes and Dustin Diaz on the book
 *       "Pro Javascript Design Patterns".
*/

function Interface(name, methods) {
  if( arguments.length != 2 ) {
    throw new Error('Interface constructor expects exactly 2 arguments');
  }
  if( typeof name !== 'string' ) {
    throw new Error('Interface constructor expects name to be string');
  }
  if( !isArray( methods ) ) {
    throw new Error('Interface constructor expects methods to be array');
  }

  Object.defineProperties(this, {
    name: { value: name },
    methods: { value: methods.map(String) }
  });
};
module.exports = Interface;
/*
  @static
  @method implements
*/

Interface.implements = function(o) {
  if( arguments.length < 2 ) {
    throw new Error('Interface.implements expects at least 2 arguments');
  }
  if( typeof o === undefined ){
    throw new Error('Interface.implements expects argument 1 not to be undefined');
  }
  slice.call(arguments, 1).forEach(function(i, k){
    if( !(i instanceof Interface) ) {
      throw Error(f('Interface.implements expects argument 2 and onwards to be Interfaces, arg %d is not.', k+2));
    }
    i.methods.forEach(function(name){
      if( !o[name] || 'function' !== typeof o[name] ) {
        throw ImplementationError( 
          "<%s> must implement the method '%s' of '%s' interface",
          typeof o == 'function'? '[Function]' : o, name,
          i.name
        );
      }
    });
  });
  return true;
};
