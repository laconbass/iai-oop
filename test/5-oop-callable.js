var assert = require( 'chai' ).assert
  , test = require( 'iai-test' )
  , oop = require( '..' )
;

describe('#callable', function(){
  it('should be a function', function(){
    assert.isFunction( oop.callable );
  })
  it('should throw TypeError if first argument is not a function', function(){
    assert.throws(function(){
      oop.callable();
    }, TypeError, /must be a function/)
  })
  it('should throw if second argument is not a "literal"', function(){
    assert.throws(function(){
      oop.callable(function(){});
    });
  })
  it('should return a function', function(){
    assert.isFunction( oop.callable(function(){}, {}) );
  })
  describe('returned function', function(){
    it('should throw if builder function does not return a function instance', function(){
      assert.throws(function(){
        oop.callable(function(){}, {})();
      })
    })
    it('should return a function', function(){
      var callable = oop.callable(function(){
        return function tiramedai(){};
      }, {})
      assert.isFunction(callable)
    })
    it('should bind prototype methods to the function instance', function(){
      var builder = oop.callable(function(yeah){
        return oop(testing)
          .set('yeah', yeah)
          .o
        ;
        function testing(){
          return "great things happen at nights";
        }
      }, {
        prop1: "something",
        prop2: "otherthing",
        method1: function( test ){
          assert.deepEqual(this, test, "method 1 fail");
        },
        method2: function( test2 ){
          assert.deepEqual(this, test2, "method 2 fail");
        }
      })
      var callable = builder( "first argument" );
      assert.isFunction(callable, "it should be a function");
      assert.equal( callable.yeah, "first argument", "yeah should match" );
      assert.equal( callable(), "great things happen at nights", "return value should match");

      assert.isUndefined( callable.prop1, "prop1 should be not defined")
      assert.isUndefined( callable.prop2, "prop2 should be not defined")
      assert.isFunction( callable.method1, "method1 should be a function" )
      assert.isFunction( callable.method2, "method2 should be a function" )
      callable.method1( callable );
      callable.method2( callable );
    })
  })
});
