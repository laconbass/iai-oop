var util = require( 'util' )
  , f = util.format
  , oop = require( './oop' )
  , slice = Array.prototype.slice
  , errors = module.exports = {}
;

/**
 * @NOTE
 * Native Error Types on ECMA script 5, just for reference
 * See also [ECMA-262 Standard](http://www.ecma-international.org/publications/files/ECMA-ST/Ecma-262.pdf)
 *
 *
 * `Error`:          Base class for all the Native Error 
 *                   Types.
 * `EvalError`:      Not used. It's kept for backwards
 *                   compatibility.
 * `RangeError`:     Indicates a numeric value has exceeded 
 *                   the allowable range.
 * `ReferenceError`: Indicates that an invalid reference
 *                   value has been detected.
 * `SyntaxError`:    Indicates that a parsing error has 
 *                   occurred.
 * `TypeError`:      Indicates the actual type of an operand
 *                   is different than the expected type.
 * `URIError`:       Indicates that one of the global URI 
 *                   handling functions was used in a way 
 *                   that is incompatible with the *ECMA 5 
 *                   Standard definition*.
 */

/*
 * @prototype CustomError
 *   @inherits from Error.prototype
 */

var CustomError = oop.create( Error.prototype, {
  name: 'CustomizedError',
  message: '(empty error message)',
  init: function() {
    Error.captureStackTrace( this, this.init );
    this.message = f.apply( f, arguments );
  }
});

/**
 * @callable BaseError: creates a CustomError
 */

errors.BaseError = oop.callable( CustomError );

/**
 * @callable ValidationError: creates a ValidationError
 */

errors.ValidationError = oop.callableFrom( CustomError, {
  name: 'ValidationError',
  code: 'invalid',
  init: function( message, code ) {
    CustomError.init.call( this, message );
    this.code = code;
  }
})

/**
 * Custom automated creation errors
 * The following errors are created automatically,
 * are designed to clarify the error output with an 
 * errortype and doesn't have any special behaviour
 * rather the standard BaseError
 *
 *  - IOError
 *  - ValueError
 *  - ArityError
 *  - ImplementationError
 */

var custom = [
  'IOError',
  'ValueError',
  'ArityError',
  'ImplementationError',
  'FlowError'
];

for( var i in custom ) {
  errors[ custom[ i ] ] = oop.callableFrom( CustomError, {
    name: custom[ i ]
  });
}

/**
 * Exposes all error types on the global namespace
 * TODO make this a function???
 */

for( var name in errors ) {
  if( global[ name ] !== undefined ) {
    throw ValueError( f( 'global["%s"] is in use', name ) );
  }
  global[ name ] = errors[ name ];
}
