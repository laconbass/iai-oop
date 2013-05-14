var oop = require('../oop')
  , iu = {
      isString: function(o) { 
        return typeof o == 'string';
      }
    }
  , f = require('util').format
  , slice = Array.prototype.slice
;
/*
  @prototype GenericComposite
    @implements Composite, Iterable
    @inherits from oop.Factory
 */

module.exports = oop.create( oop.GenericFactory, {
  _implement: [ oop.Composite, oop.Iterable ],
  // Initializes the Composite
  init: function( id ) {
    console.assert( iu.isString(id) && !!id,
      'Composite::init requires arg 1 to be a non-empty string' );

    Object.defineProperties(this, {
      'id': { value: id },
      'length': { value: 0, writable: true }
    });
  },
  add: function compositeAdd( /*[child1[, child2[, ...[, childN]]]*/ ) {
    slice.call( arguments, 0 )
    .forEach(function(child){
      // childs must implement the same interfaces
      //  as the object does
      this._implements( child );
      // childs are stored array-like
      this[this.length++] = child;
    }, this);
    return this;
  },
  get: function compositeGet( index ) {
    throw new Error("NOT YET IMPLEMENTED");
    //return this._components[index];
  },
  remove: function compositeRemove( child ) {
    throw new Error("NOT YET IMPLEMENTED");
  },
  each: function compositeEach( fn ) {
    for( var i in this ) {
      if( !this.propertyIsEnumerable(i) ) {
        continue;
      }
      fn( this[i] );
    }
  },
  toHash: function() {
    var r = {
      id: this.id,
      childs: []
    };
    this.each(function(child){
      r.childs.push( child.toHash() );
    });
    return r;
  },
  toString: function() {
    return f( '[Composite #%s]', this.id );
  }
});
