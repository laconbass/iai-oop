var assert = require( 'chai' ).assert
  , oop = require( '..' )
;

describe( "#build", function(){
  it( "should be exposed as function", function(){
    assert.isFunction( oop.build );
  })
})

describe( "being Ancestor a constructor using #build, it", function(){
  function Ancestor(){
    return oop.build( Ancestor.prototype, this );
  }
  Ancestor.prototype.foo = "bar";
  Ancestor.prototype.constructor = Ancestor;
  var ancestor = Ancestor.prototype;

  describe( "should return an object inheriting given prototype", function(){
    it( "when Ancestor.prototype was specified as context", function(){
      var obj = Ancestor.call( ancestor );
      assert( ancestor.isPrototypeOf(obj) );
      assert.instanceOf( obj, Ancestor );
    });
    it( "when Ancestor was called within its prototype", function(){
      var obj = ancestor.constructor();
      assert( ancestor.isPrototypeOf(obj) );
      assert.instanceOf( obj, Ancestor );
    });
    it( "when no context was specified (global context)", function(){
      var obj = Ancestor();
      assert( ancestor.isPrototypeOf(obj) )
      assert.instanceOf( obj, Ancestor );
    });
    it( "when context was set to null (null cant apply)", function(){
      var obj = Ancestor.call(null);
      assert( ancestor.isPrototypeOf(obj) )
      assert.instanceOf( obj, Ancestor );
    });
    it( "when context was set to undefined (it cant apply", function(){
      var obj = Ancestor.call(undefined);
      assert( ancestor.isPrototypeOf(obj) )
      assert.instanceOf( obj, Ancestor );
    });
  });

  describe( "should throw an error", function(){
    function testItFailsWith( context ){
      console.log( 'testing with', context );
      try {
        Ancestor.call( context );
        throw 'NOT_DETECTED'
      } catch( error ){
        if( error == 'NOT_DETECTED' ){
          throw new Error('Bad context not detected');
        } else if( error.code !== 'OOP_BUILD_CONTEXT' ) {
          throw error;
        }
      }
    }
    it( "when context was set to a non-descendant (empty)", function(){
      testItFailsWith( {} );
    });
  });
})
