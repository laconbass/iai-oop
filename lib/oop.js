var util = require('util')
  , oop = module.exports = {};
;

/**
 * @constructor Interface
 *
 * @interface Prototype
 * @interface Factory
 * @interface Composite
 * @interface Iterable
 * @interface Transversable
 */

oop.Interface = require( './Interface' );
oop.Prototype = new oop.Interface( 'Prototype', [ 'init' ] );
oop.Factory = new oop.Interface( 'Factory', [ 'create' ] );
oop.Composite = new oop.Interface( 'Composite', [
  'addChild', 'removeChild', 'getChild'
]);
oop.Iterable = new oop.Interface( 'Iterable', [ 'each' ] );
oop.Transversable = new oop.Interface( 'Transversable', [ '$' ] );

/**
 * Alias for Interface.implements
 *   checks whether first argument is an object and
 *   implements all the given interfaces (args 2 and
 *    onwards), throws an error on failture
 */

oop.implements = oop.Interface.implements

/**
 * Utility for prototypal inheritance.
 *   Returns a new object whose prototype is set
 *   to given `prototype`, optionally extend it with
 *   given `properties`.
 *
 * Example of use:
 *   
 *   // Create a new prototype which inherits from a parent
 *   var ChildPrototype = oop.create( ParentPrototype, {
 *     // new properties for ChildPrototype (optional)
 *   });
 */

// TODO multiple chain
oop.create = function(prototype, properties) {
  if( !prototype || prototype.constructor === Function ) {
    throw ReferenceError( 'please provide a prototype.'
                       // + ' typeof:' + typeof prototype
                       // + ' constructor:' + prototype.constructor
    );
  }
  properties = properties || {}

  // clone
  var o = Object.create( prototype )
  /*function(){};
  o.prototype = prototype;
  o = new o();*/
 
  // extend with properties if desired
  for( var pname in properties ) {
     o[pname] = properties[pname];
  }

  return o;
};

/**
 * Utility for creating factory functions for any prototype
 */

oop.factory = function( prototype ) {
  oop.implements( prototype, oop.Factory );
  return function(){
    return prototype.create.apply( prototype, arguments );
  };
}

/*
 * Convenience method to call oop.factory and oop.create
 */

oop.factoryFrom = function( prototype, properties ){
  return oop.factory( oop.create( prototype, properties ) );
}

/**
 * constructor: 
 *   Taken from "makeClass" - By John Resig (MIT Licensed)
 *   http://ejohn.org/blog/simple-class-instantiation/,
 *   sighly modified, and renamed following 
 *   [The iai OOP compendium]()
 *   good practices.
 *
 * Returns a generic function `constructor` that creates 
 * a new instance of itself if called without the `new` 
 * operator and calls `this.init` if called with the `new`
 * operator (if `this.init` is defined and is a function).
 * Arguments of the call are always preserved.
 *
 */

oop.constructor = function( init ) {
  init = init || 'init';
  return function constructor( args ) {
    if ( this instanceof constructor ) {
      if ( typeof this[ init ] === "function" ) {
        this[ init ].apply( this, (args && args.callee)?
                               args : arguments
        );
      }
    } else {
      return new constructor( arguments );
    }
  };
};

/**
 * @util oop.callable: Creates a *callable* prototype
 * Returns a constructor whose prototype is set to given
 * prototype (or an empty object if none given)
 */

oop.callable = function( prototype ) {
  var o = oop.constructor();
  o.prototype = prototype || {};
  return o;
};

/**
 * Convenience method to call oop.callable and oop.create,
 * mixin classical and prototypal inheritance patterns.
 */

oop.callableFrom = function( prototype, properties ) {
  return oop.callable( oop.create( prototype, properties ) );
};

/**
 * Alias for util.inherits
 * Utility for classical inheritance
 *   sets the first arg's prototype to the prototype of the
 *   second argument and adds a super_ attribute  to ease
 *   the access to "super" constructor and methods within
 *   the class
 */

oop.inherits = util.inherits;

/**
 * Utility for flag methods as "abstract"
 *   returns a function that throws an ImplementationError
 *   if it's called with a message about abstraction.
 */

oop.abstract = function( name ) {
  return function abstractDecorator() {
    throw ImplementationError(
      util.format("%s is intended to be abstract", name)
    );
  }
};


/**
 * Generic design patterns
 */

var PROTO_PATH = './prototypes/';

oop.GenericFactory = require( PROTO_PATH + 'Factory' );
oop.GenericComposite = require( PROTO_PATH + 'Composite' );


/*
 * @namespace `error`: Provides tools to create custom errors
 *
 * @IMPORTANT
 *    This require pollutes the global namespace with custom
 *    error constructors
 */

oop.errors = require( './errors' );

