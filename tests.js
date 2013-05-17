process.env.NODE_ENV = 'test';

var iu = require('iai-util')
    .load('type checks')
    .load('assertor')
  , oop = require('./')
  , util = require('util')
  , f = util.format
  , isFn = iu.isFn
  , Interface = oop.Interface
  , isInterface = function( o ) {
    return !!o && o.constructor === Interface;
  }
;

/**
 * TEST CUSTOM ERRORS
 *
 */

iu.assertor('Error tester')
  .expects( 'to expose BaseError on global scope', isFn( BaseError ) )
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
  .expects( 'to expose ValidationError on global scope', isFn( ValidationError ) )
  .expects( 'ValidationError to have Error on its prototype chain',
    Error.prototype.isPrototypeOf( ValidationError.prototype )
  )
  .expects( 'ValidationError instance to be instanceof Error',
    ValidationError( 'prueba' ) instanceof Error
  )
;

/**
 * TEST INTERFACES
 *
 */

iu.assertor('Interfaces')
  .expects( 'Fake to implement Saluda', Interface.implements(
    { hola: function(){} },
    new Interface( 'Saluda', [ 'hola' ] )
  ) )
  .expects( 'to export the "Prototype" interface',
            isInterface( oop.Prototype )
  )
  .expects( 'to export the "Factory" interface',
            isInterface( oop.Factory )
  )
  .expects( 'to export the "Composite" interface',
            isInterface( oop.Composite )
  )
  .expects( 'to export the "Iterable" interface',
            isInterface( oop.Iterable )
  )
  .expects( 'to export the "Transversable" interface',
            isInterface( oop.Transversable )
  )
  .expects( 'to export the "DeferredTask" interface',
            isInterface( oop.DeferredTask )
  )
  .expects( 'to export the "CallbackPromise" interface',
            isInterface( oop.CallbackPromise )
  )
;

/**
 * TEST INHERITANCE HELPERS
 *
 */

iu.assertor('aliases tester')
  .expects( 'implements to be an alias for Interface.implements',
            oop.implements === Interface.implements
  )
  .expects( 'inherits to be an alias for util.inherits',
            oop.inherits === util.inherits
  )
;

iu.assertor( 'oop.abstract' )
  .expects( 'to be a function', isFn( oop.abstract ) )
  .expects( 'to return a function', isFn( oop.abstract() ) )
  .throws( ImplementationError, 'call a function created with oop.abstract',
           function() { oop.abstract( 'something' )(); }
  )
;

function create_error( msg ) {
  return ImplementationError( "oop.create don't works as expected. " + msg );
}

iu.assertor( 'create function' )
  .expects( 'to be a function', isFn( oop.create ) )
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
;

iu.assertor( 'oop.constructor' )
  .expects( 'to be a function', isFn( oop.constructor ) )
  .expects( 'to return a function', isFn( oop.constructor() ) )
  .runs( 'instanceof self works', function(){
    var c = oop.constructor();
    console.assert( new c() instanceof c, 'with new keyword' );
    console.assert( c() instanceof c, 'without new keyword' );
  } )
;

var FakeFactory = {
  create: function() { return oop.create( FakeFactory ); }
};

var FakeFactory2 = {
  create: function() { return "check"; }
};

iu.assertor( 'oop.factory' )
  .expects( 'to be a function', isFn( oop.factory ) )
  .throws( ImplementationError,
           'is called passing a prototype without a create method',
           function() { oop.factory( {} ) }
  )
  .expects( 'to return a function when called properly', isFn( oop.factory( FakeFactory ) ) )
  .expects( 'returned value of create method when returned function is called',
            oop.factory( FakeFactory2 )() === "check"
  )
  .expects( 'an object with given prototype in the chain when returned function is called',
            FakeFactory.isPrototypeOf( oop.factory( FakeFactory )() )
  )
;

// TODO oop.factoryFrom tests
iu.assertor( 'oop.factoryFrom' )
  .expects( 'to be a function', isFn( oop.factoryFrom ) )
;

iu.assertor( 'callable util fn' )
  .expects( 'to be a function', isFn( oop.callable ) )
  .expects( 'to return a function', isFn( oop.callable() ) )
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

// TODO oop.callableFrom tests
iu.assertor( 'oop.callableFrom' )
  .expects( 'to be a function', isFn( oop.callableFrom ) )
;

/*
// TODO
iu.assertor( 'createChain' )
  .runs( 'complex creation', function(){
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
  })
;
*/

/**
 * TEST DESIGN PATTERNS GENERIC PROTOTYPES
 *
 */

iu.assertor( 'oop.GenericFactory' )
  .expects( 'to be exported by the module', !!oop.GenericFactory )
  .runs( 'implements <Prototype>', function(){
    oop.implements( oop.GenericFactory, oop.Prototype )
  })
  .throws( 'the init method is called on the prototype itself', function(){
    oop.GenericFactory.init();
  })
  .throws( 'the init method is called on a created object', function(){
    oop.GenericFactory.create().init();
  })
;

iu.assertor( 'oopGenericComposite' )
  .expects( 'to be exported by the module', !!oop.GenericComposite )
  .runs( 'Composite.create()', function(){
    oop.GenericComposite.create('test');
  })
  .runs( 'prototype implements <Prototype, Composite>', function(){
    oop.implements( oop.GenericComposite, oop.Prototype, oop.Composite )
  })
  .runs( 'created instance implements <Prototype, Composite>', function(){
    oop.implements( oop.GenericComposite.create('test'), oop.Prototype, oop.Composite )
  })
  .throws( 'the init method is called on the @prototype itself', function(){
    oop.GenericComposite.init();
  })
  .throws( 'the init method is called on a created object', function(){
    oop.GenericComposite.create().init();
  })
;


/**
 * TEST DEFERRED OBJECT
 *
 */

var t = 1000;

iu.assertor( 'oop.Deferred' )
  .expects( 'to be a function', isFn( oop.Deferred ) )
  .expects( 'to have a "Promise" property, which is a function',
            isFn( oop.Deferred.Promise )
  )
  .runs( 'most simple case', function( done ) {
    var deferred = new oop.Deferred();
    // emulate an async task
    setTimeout( function(){
      deferred.accept();
    }, t );
    // done should be executed after `t`
    deferred.promise.done( done );
  })
  .throws( FlowError, "rejected without a fail callback attached",
  function( done ) {
    var deferred = new oop.Deferred();
    deferred.reject( FlowError( "testing reject" ) );
  })
  .runs( "pass a failture throught the chain", function( done ) {
    var deferred = new oop.Deferred();
    deferred.promise
      .then(function(){
        done( Error( "this should not be executed" ) )
      })
      .then(function(){
        done( Error( "neither this" ) )
      })
      .then(function(){
        done( Error( "of course this either" ) )
      })
      .fail(function( e ){
        if ( e.message == "testing reject" )
          done();
        else
          done( e );
      })
    ;
    // emulate the async task
    setTimeout(function(){
      deferred.reject( Error( "testing reject" ) );
    }, t );
  })
  .runs( "double chained sync callback", function( done ) {
    var deferred = new oop.Deferred();
    deferred.promise
      .then(function(){
        // something is done and...
        done();
      })
    ;
    // emulate the async task
    setTimeout(function(){
      deferred.accept();
    }, t );
  })
  .runs( 'reject call after accept call catching FlowError',
  function( done ) {
    var deferred = new oop.Deferred();
    // emulate an async task
    setTimeout( function(){
      deferred.accept();
    }, t );
    // emulate a reject call after accept call
    // this should not affect the promise 
    // because it's already accepted, but throws
    // an error for better Flow control
    setTimeout( function(){
      var fake = Error( 'fake error' );
      try {
        deferred.reject( fake );
      } catch(e) {
        if ( e instanceof FlowError ) {
          done();
        } else {
          done( e );
        }
      }
    }, t + t );
    // fail should not be executed
    deferred.promise.fail( done );
  })
  .runs( 'catch an error thrown on "done"',
           function( tested ){
    var deferred = new oop.Deferred()
      , fake_error = Error( "testing errors" )
    ;
    // emulate an async task
    setTimeout( function(){
      deferred.accept();
    }, t );
    deferred.promise
      .done(function(){
        console.log( 'going to throw error' );
        throw fake_error;
      })
    .then( function( next ) {
      tested( Error( "task 2 called" ) );
    } )
    .then( function( next ) {
      tested( Error( "task 3 called" ) );
    } )
      .fail( function( err ) {
        if( err === fake_error ) { 
          console.log( 'error catched' );
          tested();
        } else {
          tested( Error( "couldn't catch error" ) );
        }
      })
    ;
  })
  .runs( 'preserves context and args, rewinds',
         function( tested ){
    // DRY helper
    function check( name, ctx, args ) {
      return function( next ) {
        if ( isFn( next ) ) {
          args.unshift( next );
        }
        for ( var key in args ) {
          if ( arguments[ key ] !== args[ key ] ){
            throw f( '"%s" arg %d not ok',
                     name, key
            );
          }
        }
        console.log( '"%s" args ok', name );
        if ( this !== ctx ) {
         throw f( '"%s" context not ok', name );
        }
        console.log( '"%s" context ok', name );
        if ( isFn( next ) ) {
          args.shift();
          next.apply( ctx, args );
        }
        ;
      };
    };
    var fake_ctx = { a: "z" }
      , deferred = new oop.Deferred( fake_ctx );
    ;
    // setup the chain
    var check_ctx = deferred.promise
      .done( check( "done", fake_ctx, [
        "a", 7, true
      ] ) )
    .then( check( "then 1", fake_ctx, [
      "a", 7, true
    ] ) )
    .then( check( "then 2", deferred.promise, [
      "a", 7, true
    ] ) )
    .then( fake_ctx )
    ;
    // emulate the async task, passing args
    setTimeout(function(){
      deferred.accept( "a", 7, true );
      if ( check_ctx === fake_ctx ) {
        console.log( "then 3 rewinds ok" );
        tested();
      } else {
        tested( Error( "bad rewind" ) );
      }
    }, t );
  })
;

/*console.log( require('util').inspect(

  caca()
  
, {showHidden: true, colors: true} ) );//*/
