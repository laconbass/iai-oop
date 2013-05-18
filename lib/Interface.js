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
    throw ArityError('Interface constructor expects exactly 2 arguments');
  }
  if( typeof name !== 'string' ) {
    throw TypeError('Interface constructor expects name to be string');
  }
  if( !isArray( methods ) ) {
    throw TypeError('Interface constructor expects methods to be array');
  }

  Object.defineProperties(this, {
    name: { value: name, enumerable: true },
    methods: { value: methods.map( String ), enumerable: true }
  });
};
module.exports = Interface;
/*
  @static
  @method implements
*/

Interface.implements = function(o) {
  if( arguments.length < 2 ) {
    throw ArityError('Interface.implements expects at least 2 arguments');
  }
  if( !o ){
    throw ReferenceError('Interface.implements expects argument 1 to be something');
  }
  slice.call(arguments, 1).forEach(function(i, k){
    if( !(i instanceof Interface) ) {
      throw ValueError( 'Interface.implements %s, arg %d is not.',
        'expects argument 2 and onwards to be Interfaces', k+2
      );
    }
    i.methods.forEach(function(name){
      if( !o[name] || 'function' !== typeof o[name] ) {
        throw ImplementationError( 
          "object [%s] must implement the method '%s' of '%s' interface",
          typeof o == 'function'? '[Function]' : o, name,
          i.name
        );
      }
    });
  });
  return true;
};
