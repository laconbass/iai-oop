var util = require('util')
  , oop = module.exports = {};
;

oop.Interface = require('./Interface');

//
//  INHERITANCE HELPERS
//

/*
  Alias for Interface.implements
  checks whether first argument is an object and implements all the given interfaces (args 2 and onwards), throws an error on failture
 */
oop.implements = module.exports.Interface.implements
/*
  Alias for util.inherits
  Utility for classical inheritance
  sets the first arg's prototype to the prototype of the second argument and adds a super_ attribute  to ease the access to "super" constructor and methods within the class
 */
oop.inherits = util.inherits;
/*
  Utility for prototypal inheritance.
  Returns a new object whose prototype is set to given object

  Example of use:
    
    // Create a new prototype which inherits from a parent
    var ChildPrototype = oop.create( ParentPrototype );

    // add properties to the new prototype through direct assignment
    // this sets keys as data descriptors for values
    ChildPrototype.def({
      someMethod: function() {}
      // ...
    });

    // you can also chain the calls
    var ChildPrototype = oop.create( ParentPrototype ).def({
      // ...
    })

    // note the parent prototype must inherit or be a @prototype Prototype
    // to allow the use of def({ ... })
*/
oop.create = function(prototype, properties) {
  var o = function(){};
  properties = properties || {}

  o.prototype = prototype;
  o = new o();
  
  for( var pname in properties ) {
     o[pname] = properties[pname];
  }
  return o;
};
/*
  Utility for flag methods as "abstract"
*/
oop.abstract = function(name) {
  return function abstractDecorator() {
    throw new Error(
      util.format("%s is intended to be abstract", name)
    );
  }
};

/*
  DESIGN PATTERNS INTERFACES
 */

oop.i = oop.interfaces = {
  Prototype: new oop.Interface( 'Prototype', ['create', 'init'] ),
  Composite: new oop.Interface( 'Composite', ['add', 'remove', 'get'] ),
  Iterable: new oop.Interface( 'Iterable', ['each'] ),
  Transversable: new oop.Interface( 'Transversable', ['$'] )
};

/*
  DESIGN PATTERNS ABSTRACT CLASSES
 */
var PROTO_PATH = './prototypes/';

oop.Prototype = require( PROTO_PATH + 'Prototype' );
oop.Composite = require( PROTO_PATH + 'Composite' );

/*
 * Utility for creating factory methods for any Prototype
 * 
 */
oop.factory = function(proto){
  oop.implements(proto, oop.i.Prototype);
  return function(){
    return proto.create.apply(proto, arguments);
  };
}
