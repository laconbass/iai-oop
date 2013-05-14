var oop = require('../oop')
  , isArray = require('util').isArray
  , implements = oop.implements
;

/*
  @prototype GenericFactory
    @implements Factory, Prototype
 */
module.exports = {
  _implement: [ oop.Factory, oop.Prototype ],
  // ensure o implements same interfaces as this
  _implements: function( o ) {
    implements.apply( {}, [ o ].concat( this._implement ) );
  },
  // creates and intitializes a new instance
  create: function() {
    var instance = oop.create( this );
    
    if( !isArray( this._implement ) || !isArray( instance._implement ) ){
      throw TypeError( '_implement must be an array' );
    }
    Object.defineProperty(instance, '_implement', {
      value: this._implement.concat( instance._implement )
    });

    // check that instance implements the proper Interfaces
    // note _implements behaviour may be override
    instance._implements( instance );

    // initialize the instance and return it
    instance.init.apply( instance, arguments );
    return instance;
  },
  // defines normal properties through direct assign
/*  def: function(o) {
    console.assert( typeof o == 'object' && o.constructor === Object
      , 'Prototype::def arg 1 must be an object literal' );
    var fname;
    for( fname in o ) {
      this[fname] = o[fname];
    }
    return this;
  },*/
  init: oop.abstract('oop.Factory::init')
};
