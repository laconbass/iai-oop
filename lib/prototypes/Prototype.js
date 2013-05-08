var oop = require('../oop')
  , isArray = require('util').isArray
;

/*
  @prototype Prototype
    @implements Prototype
 */
module.exports = {
  implement: [ oop.i.Prototype ],
  // ensure o implements same interfaces as this
  implements: function(o){
    oop.implements.apply( {}, [o].concat( this.implement ) );
  },
  // creates and intitializes a new instance
  create: function() {
    var instance = oop.create(this);
    
    if( !isArray(this.implement) || !isArray(instance.implement) ){
      throw new Error('Prototype.implement must be an array of Interfaces');
    }
    Object.defineProperty(instance, 'implement', {
      value: this.implement.concat( instance.implement )
    });
    instance.implements( instance );
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
