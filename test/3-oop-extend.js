var assert = require( 'chai' ).assert
  , oop = require( '..' )
;

describe( "#extend", function(){
  it( "should behave as expected", function(){
    var prototype = { bar: "bar" };
    var foo = oop.extend( prototype, { baz: "baz" } );
    assert.deepEqual( foo, { bar: "bar", baz: "baz" }, "equivalence ok");
    assert.isFalse( foo.hasOwnProperty("bar"), "bar should be inherited" )
    assert.isTrue( foo.hasOwnProperty("baz"), "baz should be owned" )
  })
})

describe( "an object created by .extend( {}, prototype )", function(){
  beforeEach(function(){
    this.prototype1 = {
      method: function(){
        return "method returned value";
      },
      property: "property value"
    };
    this.case = oop.extend( {
      parentMethod: function(){ return "check check"; },
    }, this.prototype1 );
  })
  it( "should inherit parent's properties", function(){
    assert.isFunction( this.case.parentMethod, 'exists' )
    assert.isFalse( this.case.hasOwnProperty('parentMethod'), 'inherited' )
    assert.equal( this.case.parentMethod(), "check check" )
  })
  it( "should have the properties given as own properties", function(){
    assert.isTrue( this.case.hasOwnProperty( 'method' ),
                  "method should be owned" );
    assert.equal( this.case.method(), "method returned value" );
    assert.isTrue( this.case.hasOwnProperty( 'property' ),
                  "property should be owned" );
    assert.equal( this.case.property, "property value" );
  })
})
