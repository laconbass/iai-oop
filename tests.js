/*
  SOME STUPID TESTS
*/


process.env.NODE_ENV = 'test';

var iu = require('iai-util')
  .load('type checks')
  .load('assertor')
  , oop = require('./')
  , util = require('util')
  , Interface = oop.Interface
;

var caca = oop.constructor();

iu.isInterface = function( o ){
  return !!o && o.constructor === Interface;
}

var Saluda = new Interface('Saluda', ['hola', 'adios']);

var Fake = {
  hola: function(){}
  ,adios: function(){}
};

iu.assertor('inheritance helpers tester')
  .expects( 'implements to be a function', iu.isFunction( oop.implements) )
  .expects( 'inherits to be a function', iu.isFunction( oop.inherits) )
  .expects( 'create to be a function', iu.isFunction( oop.create) )
  .expects( 'abstract to be a function', iu.isFunction( oop.abstract) )
;

var o = oop
  , i = oop
;
iu.assertor('Interfaces')
  .expects( 'Fake to implement hola', Interface.implements(Fake, Saluda) )
  .expects( 'to export the "Prototype" interface', iu.isInterface( i.Prototype ) )
  .expects( 'to export the "Composite" interface', iu.isInterface( i.Composite ) )
  .expects( 'to export the "Iterable" interface', iu.isInterface( i.Iterable ) )
  .expects( 'to export the "Transversable" interface', iu.isInterface( i.Transversable ) )
;

function create_error( msg ) {
  return ImplementationError( "oop.create don't works as expected. " + msg );
}

iu.assertor( 'create util fn' )
  .expects( 'to be exposed', iu.isFn( oop.create ) )
  .runs( 'simple creation', function(){
    var prototype = {
      a: "a",
      b: "b"
    };
    var copy = oop.create( prototype, { c: "c" } );
    copy.b = "other";
    if( !prototype.isPrototypeOf( copy ) ) {
      throw create_error( "Result doesn't have the prototype on the chain." );
    } else if ( !copy.hasOwnProperty( "c" ) || !copy.hasOwnProperty( "b" ) ) {
      throw create_error( "Result own property expected." );
    } else if ( !copy || copy.a != "a" || copy.b != "other" || copy.c != "c" ) {
      throw create_error( "Returns an unexpected result." );
    } else if( prototype.b != "b" || !!prototype.c ) {
      throw create_error( "Modifies the original prototype." );
    }
  })
/*  .runs( 'complex creation', function(){
    var a = "a", b = "b", c = "c"
      , d = "d", e = "e", f = "f"
      , g = "g"
      , o = "other"
      , proto1 = { a: a, b: b, c: c }
      , proto2 = { d: d, e: e, f: f }
      , copy = oop.create( proto1, proto2, { g: g, o: g } )
    ;

    copy.b = o;
    copy.f = o;
    copy.o = o;

    if( !proto1.isPrototypeOf( copy ) || !proto2.isPrototypeOf( copy ) ) {
      throw create_error( "Result doesn't have all the prototypes on the chain." );
    } else if ( !copy.hasOwnProperty( g ) || !copy.hasOwnProperty( b ) || copy.hasOwnProperty( f ) ) {
      throw create_error( "Result own property expected." );
    } else if ( copy.a != a || copy.c != c ) {
      throw create_error( "Doesn't inherit the first prototype." );
    } else if ( copy.d != d || copy.e != e ) {
      throw create_error( "Doesn't inherit the second prototype." );
    } else if( proto1.b != b || !!proto1.g || !!proto1.d || proto1.e || proto1.f ) {
      throw create_error( "Modifies the first prototype." );
    } else if( proto2.f != f || !!proto2.g || !!proto2.a || !!proto2.b || !!proto2.c ) {
      throw create_error( "Modifies the second prototype." );
    } else if( copy.g != g ) {
      throw create_error( "Doesn't add properties." );
    } else if( copy.b != o || copy.f != o || copy.o != 0 ) {
      throw create_error( "Can't edit the properties." );
    }
  })// */
;

iu.assertor( 'constructor util fn' )
  .expects( 'to be exposed', iu.isFn( oop.constructor ) )
  .expects( 'to return a function', iu.isFn( oop.constructor() ) )
  .runs( 'instanceof self works', function(){
    var c = oop.constructor();
    console.assert( new c() instanceof c, 'with new keyword' );
    console.assert( c() instanceof c, 'without new keyword' );
  } )
;

iu.assertor( 'callable util fn' )
  .expects( 'to be exposed', iu.isFn( oop.callable ) )
  .expects( 'to return a function', iu.isFn( oop.callable() ) )
  .expects( 'object returned by returned fn has the given prototype on its chain',
    Error.prototype.isPrototypeOf( oop.callable( Error.prototype )( "msg" ) )
  )
  .expects( "object returned by returned fn is instanceof given prototype's constructor",
    oop.callable( Error.prototype )( "message" ) instanceof Error
  )
  .runs( "init function on initialize", function() {
    var ok = false;
    var customerror = oop.callable( oop.create( Error.prototype, {
      init: function() {
        ok = true;
      }
    } ) );
    var prueba = customerror();
    if( !ok )
      throw Error( "init is not run" );
  })
;

iu.assertor('@prototype GenericFactory tester')
  .expects( 'to be exported by the module', !!o.GenericFactory )
  .runs( 'implements <Prototype>', function(){
    o.implements( o.GenericFactory, i.Prototype )
  })
  .throws( 'the init method is called on the prototype itself', function(){
    o.GenericFactory.init();
  })
  .throws( 'the init method is called on a created object', function(){
    o.GenericFactory.create().init();
  })
;

iu.assertor('@prototype GenericComposite tester')
  .expects( 'to be exported by the module', !!o.GenericComposite )
  .runs( 'Composite.create()', function(){
    o.GenericComposite.create('test');
  })
  .runs( 'prototype implements <Prototype, Composite>', function(){
    o.implements( o.GenericComposite, i.Prototype, i.Composite )
  })
  .runs( 'created instance implements <Prototype, Composite>', function(){
    o.implements( o.GenericComposite.create('test'), i.Prototype, i.Composite )
  })
  .throws( 'the init method is called on the @prototype itself', function(){
    o.GenericComposite.init();
  })
  .throws( 'the init method is called on a created object', function(){
    o.GenericComposite.create().init();
  })
;


iu.assertor('Error tester')
  .expects( 'to expose BaseError on global scope', iu.isFn( BaseError ) )
  .expects( 'BaseError to have Error on its prototype chain',
    Error.prototype.isPrototypeOf( BaseError.prototype )
  )
  .runs( 'create a BaseError instance', function() {
    var err = BaseError( "probando" );
  })
  .expects( 'BaseError instance to be instanceof Error',
    BaseError( 'prueba' ) instanceof Error
  )
  .runs( 'catching a BaseError', function() {
    try {
      throw BaseError( "prueba" );
    } catch(e) {
      if( !e instanceof BaseError ){
        throw e;
      }
    }
  })
  .throws( BaseError, 'throw BaseError', function(){ throw BaseError( "prueba" ); } )
  .expects( 'to expose ValidationError on global scope', iu.isFn( ValidationError ) )
  .expects( 'ValidationError to have Error on its prototype chain',
    Error.prototype.isPrototypeOf( ValidationError.prototype )
  )
  .expects( 'ValidationError instance to be instanceof Error',
    ValidationError( 'prueba' ) instanceof Error
  )
;

/*console.log( require('util').inspect(

  caca()
  
, {showHidden: true, colors: true} ) );//*/
