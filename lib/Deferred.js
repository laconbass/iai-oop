var oop = require( './oop' )
  , noop = function() {}
  , slice = Array.prototype.slice
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
  accept: function( /* args */ ) {
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
        var cb = fn.fail? fn.fail
               : fn.anyway? fn.anyway
               : fn.then? fn.then
               : null
        ;
        if ( !cb ) {
          throw error;
        }
        cb.call( emitter, error );
      })
      .once( 'done', function( args ) {
        var error = null;
        if ( fn.done ) {
          try {
            fn.done.apply( emitter, args );
          } catch( e ) {
            error = e;
          }
        }
        if( fn.anyway ) {
          fn.anyway.call( emitter, error, args );
        }
        if ( fn.then ) {
          fn.then.call( emitter, error, args );
        } else if ( error ) {
          throw error;
        }
      })
    ;
  },
  fail: setter( 'fail' ),
  done: setter( 'done' ),
  anyway: setter( 'anyway' ),
  then: function( task, ctx ) {
    // REWIND MODE
    // return the received object
    if( typeof task === 'object' ) {
      return task;
    } else if ( typeof task !== 'function' ) {
      throw TypeError( 'expecting object or function' );
    }
    // NORMAL MODE
    // received a function
    var deferred = new Deferred( ctx || this );
    setCallback( this, 'then', function( err, args ) {
      if( err ) {
        deferred.reject( err );
        return;
      }
//      console.log( 'next task',  );
      // run the task
      task.apply( this, [ function task_done( e ) {
        if ( e instanceof Error ) {
          // if error, reject
          deferred.reject( e );
        } else {
          // else accept preserving the arguments
          deferred.accept.apply( deferred, args );
          }
        } ].concat( slice.call( args, 0 ) )
      );
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
