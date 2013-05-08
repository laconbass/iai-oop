var oop = require('../oop')
  , isArray = require('util').isArray
  , implements = oop.implements
;

/*
  @prototype Prototype
    @implements Prototype
 */
module.exports = {
  _implement: [ oop.i.Prototype ],
  // ensure o implements same interfaces as this
  _implements: function(o){
    if( !isArray( this._implement ) ){
      throw new Error('_implement must be an array');
    }
    implements.apply( {}, [o].concat( this._implement ) );
  },
  // creates and intitializes a new instance
  create: function() {
    var instance = oop.create(this);
    
    if( !isArray( this._implement )
        || !isArray( instance._implement )
    ){
      throw new Error('_implement must be an array');
    }
    Object.defineProperty(instance, '_implement', {
      value: this._implement.concat( instance._implement )
    });
    instance._implements( instance );
    instance.init.apply( instance, arguments );
    return instance;
  },
  // defines normal properties through direct assign
  def: function(o) {
    console.assert( typeof o == 'object' && o.constructor === Object
      , 'Prototype::def arg 1 must be an object literal' );
    var fname;
    for( fname in o ) {
      this[fname] = o[fname];
    }
    return this;
  },
  init: oop.abstract('Prototype::init')
};
