var oop = require('../../index')
  , iu = oop.iu
;
/*
  @prototype Composite pattern
    @implements Composite
    @created from oop.Prototype
 */
module.exports = oop.create(oop.Prototype).def({
  // Initializes the Composite
  _components: [],
  init: function(id) {
    console.assert( iu.isString(id) && !!id,
      'Composite::init arg 1 must be a non-empty string' );

    Object.defineProperty(this, 'id', { value: id });
    this._components = [];
  },
  add: function( /*[child1[, child2[, ...[, childN]]]*/ ) {
    Array.prototype.slice.call( arguments, 0 )
      .forEach(function(){
        // childs must implement the same interfaces as Composite does
        oop.implements( child, oop.i.Composite );
        this._components.push( child );
      }, this)
    ;
  },
  get: function( index ) {
    return this._components[index];
  },
  remove: function( child ) {
    var i = this._components.indexOf( child );
    if( i > -1) {
      this._components.splice( i, 1 );
      return true;
    }
    return false;
  }
});
