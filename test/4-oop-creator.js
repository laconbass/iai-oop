var assert = require( 'chai' ).assert
  , oop = require( '..' )
;

describe( "#creator", function(){
  it( "should be exposed as a function", function(){
    assert.isFunction( oop.creator );
  })

  it( "should throw a TypeError if first arg is not a function", function(){
    var cases = {
      'null': null,
      'undefined': ''.notDefined,
      'string': 'str',
      'number': 123,
      'array': [ 1, 2, 3 ],
      'object': { a:1, b:2 }
    };
    for( var name in cases ){
      assert.throws(function(cases, name){
        oop.creator( cases[name], { test: 'value' } )
      }.bind({}, cases, name), TypeError, /.*/, name )
    }
  })

  it( "should return a Creator function with a prototype property", function(){
    var Prototype = { property: 124, method: function(){} };
    var Creator = oop.creator( function(){}, Prototype );
    assert.isFunction( Creator, "should return a function" );
    assert.deepEqual( Creator.prototype, Prototype, "should add the prototype" );
  })

  it( "should extend prototype if given an extension object", function(){
    var Prototype = { property: 124, method: function(){} };
    var Extension = { property: 666 };
    var Creator = oop.creator( function(){}, Prototype, Extension );
    assert.equal( Creator.prototype.property, 666 );
  })

  it( "should fix the instanceof checks as expected", function(){
    var Prototype = { property: 124, method: function(){} };
    var Creator = oop.creator( function(){}, Prototype );

    var case1 = Object.create( Prototype );
    var case2 = Object.create( case1 );
    var case3 = Object.create( case2 );

    assert.instanceOf( case1, Creator, "instanceof 1st grade" );
    assert.instanceOf( case2, Creator, "instanceof 2nd grade" );
    assert.instanceOf( case3, Creator, "instanceof 3nd grade" );
  })

  it( "should add toString if given a named function", function(){
    var Prototype = { property: 124, method: function(){} };
    var Creator = oop.creator( function Named(){}, Prototype );

    assert.isTrue( Prototype.hasOwnProperty('toString'), "Prototype owns toString" )
    assert.equal( Object.create(Prototype)+"", "[object Named]" )
  })

  it( "should not override toString if defined", function(){
    var Prototype = { toString: function(){} };
    var Creator = oop.creator( function Named(){}, Prototype );

    assert.notEqual( Object.create(Prototype)+"", "[object Named]" )
  })

  it( "should execute given function within prototype context and preserve arguments", function(){
    var Prototype = { property: 124, method: function(){} };
    var Creator = oop.creator( function( a1, a2, a3 ){
      assert.deepEqual( this, Prototype, "context should match prototype" );
      assert.equal( a1, 1, "should preserve argument 1" );
      assert.equal( a2, "two", "should preserve argument 2" );
      assert.equal( a3, 3, "should preserve argument 3" );
    }, Prototype );
    Creator( 1, "two", 3 );
  })

})
