var oop = require('../../index')
  , iu = oop.iu
;
/*
  @prototype Prototype
    @implements Prototype
 */
module.exports = { 
  // creates and intitializes a new instance
  create: function() {
    var instance = oop.create(this);
    instance.init.apply(instance, arguments);
    return instance;
  },
  // defines normal properties through direct assign
  def: function(o) {
    console.assert( iu.isLiteral(o), 'Prototype::def arg 1 must be an object literal' );
    var fname;
    for( fname in o ) {
      this[fname] = o[fname];
    }
    return this;
  },
  init: oop.abstract('Prototype::init')
};
