var oop = require( './oop' )
  , noop = function() {}
  , EventEmitter = require( 'events' ).EventEmitter
;

oop.DeferredTask = new oop.Interface( 'Deferred', [
  'accept', // the task was completed successfully
  'reject'  // the task produced an error
]);

oop.CallbackPromise = new oop.Interface( 'Deferred', [
  'fail',   // sets on-error callback
  'done',   // sets on-success callback
  'anyway', // sets on-complete callback
  'then'    // TODO WTF does this?
]);


/**
 * @callable Deferred
 *
 * provides an API to control the acceptance or rejection
 * of a new promise object, which is bound to `emitter`.
 */

var Deferred = module.exports = oop.callable({
  init: function( emitter ) {
    var remote = new EventEmitter();

    Object.defineProperties( this, {
      remote: { value: remote },
      promise: {
        enumerable: true,
        value: new Promise( remote, emitter )
      }
    });
  },
  accept: function() {
    complete( this );
    this.remote.emit( 'done', arguments );
    this.remote.removeAllListeners( 'error' );
  },
  reject: function( error ) {
    if ( !( error instanceof Error ) ) {
      throw TypeError( 'expecting an Error instance' );
    }
    complete( this );
    this.remote.emit( 'error', error );
    this.remote.removeAllListeners( 'done' );
  }
});

/**
 * DRY helpers
 *
 * Don't repeat yourself
 */

function complete ( deferred, status ) {
  if ( deferred.completed ) {
    throw FlowError( "deferred already completed" );
  }
  Object.defineProperty( deferred, 'completed', {
    value: true, enumerable: true
  });
}

/*
 * @callable Promise
 */

var Promise = Deferred.Promise = oop.callable({
  init: function( remote, emitter ) {
    Object.defineProperties( this, {
      callbacks: { value: {
        fail: null, done: null, anyway: null, then: null }
      }
    });
    var fn = this.callbacks;
    remote
      .once( 'error', function( error ) {
        if ( !fn.fail && !fn.anyway ) {
          if ( fn.then ) {
            fn.then( error );
            return;
          } else {
            throw error;
          }
        }
        if ( fn.fail ) {
          fn.fail.call( emitter, error );
        }
        if( fn.anyway ) {
          fn.anyway.call( emitter, error );
        }
      })
      .once( 'done', function( args ) {
        if ( fn.done ) {
          fn.done.apply( emitter, args );
        }
        if( fn.anyway ) {
          fn.anyway.call( emitter, null, args );
        }
        if( fn.then ) {
          fn.then();
        }
      })
    ;
  },
  fail: setter( 'fail' ),
  done: setter( 'done' ),
  anyway: setter( 'anyway' ),
  then: function( fn ) {
    var deferred = new Deferred( this );
    setCallback( this, 'then', function( err ) {
      if( err ) {
        deferred.reject( err );
        return;
      }
      // given a function and it expects one argument?
      if ( fn && fn.length == 1 ) {
        // async run, passing task_done function
        fn( function task_done( e ) {
          if ( e instanceof Error ) {
            // if received an error as first arg, reject
            deferred.reject( e );
          } else {
            // else accept preserving the arguments
            deferred.accept.apply( deferred, arguments );
          }
        })
      } else {
        // sync run, just try-catch
        try {
          deferred.accept( fn() );
        } catch( e ) {
          deferred.reject( e );
        }
      }
    });
    return deferred.promise;
  }
});

/**
 * DRY helpers
 *
 * Don't repeat yourself
 */

function setter ( type ) {
  return function setPromiseCallback( fn ) {
    return setCallback( this, type, fn);
  };
}

function setCallback ( promise, type, fn ) {
  if ( typeof fn !== 'function' ) {
    throw TypeError( 'Expecting a function' );
  }
  if ( promise.callbacks[ type ] ) {
    throw ValueError( '"%s" callback already set', type );
  }
  promise.callbacks[ type ] = fn;
  return promise;
}
