var _ = require('util');
exports = module.exports = _;

_.isFunction = function(o){ return typeof o === 'function'; };
  /*
     Callback sequence helper.
     @iterable (object or array): Any iterable object (for..in)
     @step (function): executed for each item in sequence
       @key (mixed): key in iterable for the current step
       @val (mixed): value in iterable for the current step
       @next (function): calls the next step in the sequence
     @complete (function): The last step in the sequence
     @context (object): Optional. Step's and complete's context
  */
 _.sequence = function(context, iterable, step, complete) {
    if( !_.isFunction(step) || !_.isFunction(complete) )
      throw new Error("must provide step and complete callback as functions");
    var sequence = [], count = 0, context = context || {};
    // push steps on sequence
    for (var key in iterable)
      sequence.push((function(step_n, key) {
        return function(){
          step.call(context, key, iterable[key], sequence[step_n+1]);
        }
      })(count++, key));
    // push complete on sequence and start it
    sequence.push(function(){ complete.call(context); });
    sequence[0]();
};
// very very simple merge function for non-recursiveness-need situations
_.merge_opts= function(defaults, opts) {
  for(var key in opts) { defaults[key] = opts[key]; }
  return defaults;
};
// get a console.assert alias which decorate AssertionError messages
_.assertor = function(name){
  return function assert(expression, msg){
    console.assert(expression,
                  _.style([name, 'expects', msg].join(' '), 'red'));
  };
}

// tell whatever given object is a 'String'
_.isString = function(o){ return typeof o == 'string'; };

// isLiteral(o): tell whatever given object is a 'Plain' Object
_.isLiteral = function(o){
  return o && typeof o == 'object' && o.constructor == Object;
};

// alias of Array.prototype.slice.call
_.slice = function(array, begin, end){
  return Array.prototype.slice.call(array, begin, end);
};

// alias of _.slice(o, 0)
_.toArray = function(o) { return _.slice(o, 0); };

// cast o to Array, exec forEach with current ctx, return current ctx
_.each = function(o, fn) {
  _.toArray(o).forEach(fn, this);
  return this;
}

// alias for Object.keys
_.keys = function(o){
  return Object.keys(o);
};

// get object's values as array
_.values = function(o){
  return Object.keys(o).map(function(key){ return o[key]; });
};

// tells if value is within array
_.within = function(array, value){
  return array.indexOf(value) > -1;
}

// alias for _.within(this.implements_(interface))
_.implemented = function(i){
  return _.within(this.implements_, i)
}

// wrap text with system console ANSI color characters
_.style = function(text, style){
  if(_.style.ANSI[style])
    return '\u001b[' + _.style.ANSI[style][0] + 'm' + text +
           '\u001b[' + _.style.ANSI[style][1] + 'm';
  else
    return text
};
/*
  https://github.com/joyent/node/blob/master/lib/util.js#L143
  http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
*/
_.style.ANSI = {
  'bold' : [1, 22],
  'italic' : [3, 23],
  'underline' : [4, 24],
  'inverse' : [7, 27],
  'white' : [37, 39],
  'grey' : [90, 39],
  'black' : [30, 39],
  'blue' : [34, 39],
  'cyan' : [36, 39],
  'green' : [32, 39],
  'magenta' : [35, 39],
  'red' : [31, 39],
  'yellow' : [33, 39]
};

