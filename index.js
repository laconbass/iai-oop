var is = require( 'iai-is' )
  , isFn = is( 'Function' )
  , isObject = is( 'Object' )
  , builder = require( 'practical-inheritance' )
;

/**
 * @builder OopStandardApi: provides the standard oop api
 *
 * The standard oop api is designed to provide a chainable way for defining
 * object properties and its atributes. On creation, an object is put on stage,
 * and each api call will perform its action over the staged object. The staged
 * object is accesible through the "o" property of the api instance.
 */

var oop = module.exports = builder(function OopStandardApi(o){
  var instance = Object.create(this);
  instance.o = o;
  return instance;
}, {
  /** @function hidden: defines a non-enumerable, non-writable, data descriptor
   * on the staged object.
   *   @param pname [String]: the property name
   *   @param value [String]: the property value
   */
  hidden: function( pname, value ){
    Object.defineProperty( this.o, pname, { value: value } );
    return this;
  },
  /**
   * @function visible: defines a enumerable, non-writable, data descriptor on
   * the staged object.
   *   @param pname [String]: the property name
   *   @param value [String]: the property value
   */
  visible: function( pname, value ){
    Object.defineProperty( this.o, pname, { value: value, enumerable: true } );
    return this;
  },
  /**
   * @function set: defines a new property through direct assign on the staged
   * object.
   *   @param pname [String]: the property name
   *   @param value [String]: the property value
   *
   * see ECMA 5.1 spec ["DefineOwnProperty" algorithm](http://www.ecma-international.org/ecma-262/5.1/#sec-8.12.9)
   */
  set: function( pname, value ){
    this.o[pname] = value;
    return this;
  },
  /**
   * @function extend: defines through direct assign as many properties as the own
   * enumerable properties of the given object, on the staged object.
   *
   * As aditional reference, see on the ECMA 5.1 spec...
   * - ["property" definition](http://www.ecma-international.org/ecma-262/5.1/#sec-4.3.23)
   * - ["own property" definition](http://www.ecma-international.org/ecma-262/5.1/#sec-4.3.30)
   * - ["attribute" definition](http://www.ecma-international.org/ecma-262/5.1/#sec-4.3.29)
   * - [property attributes](http://www.ecma-international.org/ecma-262/5.1/#sec-8.6.1)
   * - [Object.prototype.hasOwnProperty algorithm](http://www.ecma-international.org/ecma-262/5.1/#sec-15.2.4.5)
   */
  extend: function( object ){
    if( !isObject( object ) ){
      throw TypeError( "Expecting extension object to be an Object" );
    }
    for( var property in object ){
      if( object.hasOwnProperty(property) ){
        this.o[property] = object[property]; // should i use this.set here???
      }
    }
    return this;
  },
  /**
   * @function delegate: delegate on object the methods named from argument 2 onwards.
   * For each argument from 2 onwards, defines an enumerable, non-writable, data
   * descriptor on the staged object whose value will be a function. Each new method is
   * a decorator that applies to the `object`'s method whose name is the same and
   * returns the current context.
   */
  delegate: function( object, method1, methodN ){
    var methods = Array.prototype.slice.call( arguments, 1 );
    methods.forEach(function( name ){
      this.visible( name, use( object, name ) )
    }, this )
    return this;
  },
  /**
   * Descriptive toString method to ease debugging
   */
  toString: function(){
    return "[OopStandardApi <"+this.o+">]";
  }
});

// DRY helper. creates a method delegator (internal use)
function use( object, method ){
  if( !isFn(object[ method ]) ) {
    throw Error( "object does not have a method named " + method );
  }
  return function delegator(){
    object[ method ].apply( object, arguments );
    return this;
  };
}

/**
 * @function create: creates a new object with the specified prototype
 * and returns a new standard oop api with the new object staged.
 *   @param prototype [object]: the object to be used as prototype
 *
 * This is a shortcut for `oop( Object.create(prototype) )`
 *
 * As aditional reference, see on the ECMA 5.1 spec...
 * - [Object.create alghoritm](http://www.ecma-international.org/ecma-262/5.1/#sec-15.2.3.5)
 * - ["prototype" definition](http://www.ecma-international.org/ecma-262/5.1/#sec-4.3.5)
 */

oop.create = function( prototype ){
  return oop( Object.create(prototype) );
};

/**
 * @function extend: port for practical-inheritance.extend
 */

oop.extend = builder.extend;

/**
 * @function builder: port for practical-inheritance, adding error-checking.
 */

oop.builder = function( fn, prototype, extension ){
  if( !isFn(fn) ){
    throw TypeError( "builder must be a function" );
  }
  if( !isObject(prototype) && prototype !== null ){
    throw TypeError( "prototype must be an object or null" );
  }
  return builder.apply( builder, arguments );
};
