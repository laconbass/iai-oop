var assert = require("assert")
  , callable = require("..").callable
;


var Example = callable({
  _call: function(){
    return "called";
  },
  prop: "test"
});

assert( Example() == "called", "Example() should return called" );
assert( Example.prop == "test", "Example#prop should be test" );
