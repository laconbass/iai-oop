var assert = require("assert")
  , callable = require("..").callable
;

describe("callable", function(){
  it( "should be a function and return a function", function(){
    assert( "function" == typeof callable, "it should be a function" );
    var returns = callable( {} );
    assert( "function" == typeof returns, "it should return a function" );

  })
  it( "should behave as demonstrated in example #5", function(){
    require( "../examples/5-callable-prototype" );
  })

  it('should be tested after a comprehensive api is defined');

  it( "should ease debugging through callable.toString", function(){
    assert("[callable [object Object]#_call]" == callable({}).toString(), 'first' );
    assert("[callable [object Object]#something]" == callable({}, 'something').toString(), 'second' );
    var prototype = { toString: function(){ return "Something"; } };
    assert("[callable Something#other]" == callable(prototype, 'other').toString(), 'third' );
  })
})
