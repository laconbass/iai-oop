var oop = require( '../' )
  , MyPrototype = require( './superprototype_extend' )
;

module.exports = oop.creator(function MyCreator(){
  return Object.create( MyCreator.prototype );
  // or
  return Object.create( MyPrototype );
  // or assuming context
  return Object.create( this.prototype );
  // or use OopStandardApi stuff and return the staged object
  return oop.create( MyCreator.prototype )
    .set( 'MyCreator instance property', 'is defined within MyCreator' )
    .o
  ;
}, MyPrototype );
// prototype could be defined here instead being imported
// or being extended with a third optional argument being
// a shortcut for `oop.extend( MyPrototype, extension )`.
