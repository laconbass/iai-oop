var util = require('util')
  , iu = require('./utils')
  , EventEmitter = require('events').EventEmitter
;

/*
  ImprovedEmitter: An Improved Event Emitter
*/
function ImprovedEmitter() {
  Object.defineProperties(this, {
    _snapshots: { value: {} }
    ,_id: { value: ImprovedEmitter.COUNT++ }
  });
  ImprovedEmitter.super_.apply(this, arguments);
/*  this
    .on('newListener',  function(type, fn){
      if(type=='log') this.emit('newLogListener', fn);
    })//*/
/*    .on('removeListener',  function(type){
      this.log("removed '%s' listener, %s left?"
        , type, this.listeners(type));
    })
  ;// */
}
module.exports = ImprovedEmitter;
util.inherits(ImprovedEmitter, EventEmitter)
/*
  Constants
*/
ImprovedEmitter.COUNT = 0;
ImprovedEmitter.IGNORED_EVENTS = [
  'newListener'
 // ,'removeListener'
  ,'log'
  //,'error'
];
ImprovedEmitter.MSG_COLOR = {
  NORMAL: '\033[0m'
  ,FG_DARK: '\033[030m'
  ,FG_RED: '\033[031m'
  ,FG_YELLOW: '\033[032m'
  ,FG_GREEN: '\033[033m'
  ,FG_BLUE: '\033[034m'
  ,FG_PURPLE: '\033[035m'
  ,FG_CYAN: '\033[036m'
};
Object.defineProperties(ImprovedEmitter.prototype, {
  /*
    @attribute class: The current instance class, understood as the current object's constructor name. If not defined, 'Anonymous' is returned instead.
  */
  class: { get: function classname() {
    return this.constructor.name || 'Anonymous';
  }}
  ,toString: { value: function() {
    return util.format("[object %s#%s]", this.class, this._id);
  }}
  /*
    @method msg: build a colored message which is useful for logging. message uses util.format() to allow quickly string formating without ugly syntaxes
  */
  ,msg: { value: function(color, str1, str2, strN){
    // color defined condition
    var def = iu.values(ImprovedEmitter.MSG_COLOR).indexOf(color) > -1;
    return util.format("%s%s %s%s"
      , def? color : ImprovedEmitter.MSG_COLOR.FG_DARK
      , this.toString()
      , util.format.apply(util, iu.slice(arguments, def? 1 : 0) )
      , ImprovedEmitter.MSG_COLOR.NORMAL
    );
  }}
  /*
    @method error: shortcut to call msg and emit an error event.
  */
  ,error: { value: function(err, str2, err1, strN, errN) {
    var args = [].slice.call(arguments, 0)
    // replace any errors with string messages
      , strs = args.map(function(value){
        return util.isError(value)? value.message : value;
      })
    ;
    // set red color
    strs.unshift(ImprovedEmitter.MSG_COLOR.FG_RED);
    // build colored message and error instance
    err = new Error( this.msg.apply(this, strs) );
    // do not lost any error data
    args
      .filter(function(value){ return util.isError(value); })
      .reverse()
      .forEach(function(e){ for(var p in e) err[p] = e[p]; })
    ;
    // emit error
    if(!this.listeners('error').length)
      throw util.format('%s does not have any error listener', this);
    this.emit('error', err);
    return this;
  }}
  // log default color
  ,LOG_FG_IN: { value: ImprovedEmitter.MSG_COLOR.FG_DARK }
  /*
    @method log: shortcut to call msg and emit a log event. If no listeners are bound to the log event, a colored message is sent to stdout
  */
  ,log: { value: function(color, msg, str1, strN) {
    var args = iu.slice(arguments, 0)
      // lazy emission condition
      , lazy = this.listeners('log').length < 1
      // color defined condition
      , def = iu.values(ImprovedEmitter.MSG_COLOR).indexOf(color) > -1
      // for code reuse
      , emit = function(a){
         this.emit('log', this.msg.apply(this, a));
      }
    ;
    // if lazy emission, decorate message. Take care not deleting color
    if(lazy) args.splice(def? 1:0, 0, '(lazy log)');
    // if not color defined, use defaut color
    if( !def ) args = [this.LOG_FG_IN].concat(args);
    // build message
    var msg = this.msg.apply(this, args);
    // if no log listeners are found, lazy emission
    if(lazy)
      this.once('newLogListener', function(){ this.emit('log', msg) })
    else
      this.emit('log', msg);
    return this;
  }}
  /*
    @method emit: Customize the EventEmitter.emit behaviour. Each time an event is emitted, do the following:
      - Log the event emision ONLY IF event MUSTN'T BE IGNORED
      - Emit the original event
  */
  ,emit: { value: function(type) {
    var emit = ImprovedEmitter.super_.prototype.emit
    ;
    // Log only non-ignored
    if( ImprovedEmitter.IGNORED_EVENTS.indexOf(type) < 0)
//    if(  type!='log' && (type!='newListener' || arguments[1]!='error') )
      this.log("emits '%s', %s listener(s) bound"
        , type
        , this.listeners(type).length
      );

    // emit the original event ALLWAYS
    return emit.apply(this, arguments);
  }}
  /*
    @method removeAllListeners: Customize the EventEmitter.removeAllListeners behaviour to accept multiple event types
  */
  ,removeAllListeners: { value: function(){
    var args = iu.slice(arguments, 0)
      , super_ = ImprovedEmitter.super_.prototype.removeAllListeners
    ;
    if(args.length > 0)
      for(var n in args)
        super_.call(this, args[n]);
    else
      super_.call(this);
    return this;
  }}
  /*
    @method addListener: Customize the EventEmitter.addListener
  */
  ,on: { value: function(type, listener){
    if(this.listeners(type).length >= 9)
      this.log(ImprovedEmitter.MSG_COLOR.FG_YELLOW, type, 'leaking');
   ImprovedEmitter.super_.prototype.on.apply(this, arguments);
   // emit "newLogListener" if need
   if(type=='log' && this.listeners('newLogListener').length > 0)
     this.emit('newLogListener', listener);
   return this;
  }}
  /*
    @method delegate_on: delegate log and error emissions on other ImprovedEmitter, optionally decorating with a message
      - Example of a common use case:
	// some fake emitters
	var main_emitter = new ImprovedEmitter();
	var secondary_emitter = new ImprovedEmitter();
	// main_emitter delegates 'log' and 'error' to secondary emitter
	main_emitter
	  .delegate_on(secondary_emitter)
          .on('other__main_emitter__event', function doSomething(){
          })
        ;
  */
  ,delegate_on: { value: function(emitter, as_name){
    main_emitter = this.removeAllListeners('error', 'log');
    if(!(emitter instanceof ImprovedEmitter))
      throw "can only delegate on ImprovedEmitter instances";
    as_name = as_name || 'delegated %s from...';
    // bind the listener for each delegated event
    ['error', 'log'].forEach(function(type){
      main_emitter.on(type, function(){
        var args = [].splice.call(arguments, 0);
        // decorate with as_name
        args.unshift(util.format(as_name, type));
        // delegate on emitter.error || emitter.log
        emitter[type].apply(emitter, args);
      })
    });
    return this;
  }}
  ,bypass: { value: function(type1, typeN){
    var main_emitter = this
      , types = iu.slice(arguments, 0)
    ;
    return {
      to: function(emitter, method){
        // check secondary emitter is an emitter
        if( !(emitter instanceof EventEmitter) )
          throw "can only sync to EventEmitter instances";
        // for each type given...
        iu.each(types, function(type){
          main_emitter
            .removeAllListeners(type)
            .on(type, function(){
              var args = iu.slice(arguments, 0)
              args.unshift(type);
              this.log("bypass '%s' to %s", type, emitter);
              emitter.emit.apply(emitter, args);
            })
          ;
        });
        return main_emitter;
      }
    }; 
  }}
  /*
    @method snapshot: Make a copy of the listeners bound to the given event types with the given identifier and remove all the listeners bound to those events
      @param id (number): The snapshot identifier, will be casted to int
      @param type1...typeN(string): The event types to be snapshooted
  */
  ,snapshot: { value: function(id, type1, type2, typeN) {
    if('number' !== typeof id)
      throw new TypeError("id must be numeric, not "+typeof id);
    // float-to-int conversion
    id = id - id % 1;
    // id (array position) must be free
    if(this._snapshots[id])
      throw "snapshot id '"+id+"' already exists for "+this;
    else
      this._snapshots[id] = {};
    // extract types from arguments
    var types = [].slice.call(arguments, 1);
    // log snapshot creation
    this.log("snapshot %s (%s)", id, types.join(", "));

    types.forEach(function(type){
      // store a copy of this.listeners(event_type), not a reference
      this._snapshots[id][type] = this.listeners(type).slice(0);
      // remove all the listeners bound to event_type
      this.removeAllListeners(type);
    }, this);
    return this;
  }}
  /*
    @method revert: Ensure bound listeners set are the same than before the last snapshot was stored
  */
  ,revert: { value: function(id) {
    if('number' !== typeof id)
      throw new TypeError("need a numeric id to revert a snapshot");
    // float-to-int conversion
    var id = id - id % 1
      , snapshot = this._snapshots[id];
    // check snapshot exists
    if(!snapshot) throw "snapshot with id '"+id+"' doesn't exist";
    // log deletion
    var types = Object.keys(snapshot)
      , deleted = types.map(function(){ return 0; })
    ;
    this.log("revert snapshot (%s)", types.join(', '));
    // loop over each event stored in snapshot
    types.forEach(function(type, n){
      // loop over a copy of the current listeners for event name
      this.listeners(type).slice(0).forEach(function(listener){ 
        if(snapshot[type].indexOf(listener) < 0){ 
          this.removeListener(type, listener);
          deleted[n]++;
        }
      }, this);
    }, this);
    // log deleted listeners and snapshot deletion success
    this.log('deleted listener%s for'
      , deleted.reduce(function(a,b){ return a + b})!=1? 's':''
      , deleted
        .map(function(e,i){ return util.format("'%s'(%s)",types[i],e); })
        .join(', ')
    );
    if(delete this._snapshots[id])
      this.log("deleted %s snapshot", id);
    else
      this.error("snapshot %s deletion failed", id);
    return this;
  }}
  /*
    @method opt: Provides an api for automatic snapshoting and reverting
  */
  ,opt: { value: function() {
    return {
       emitter: this
      ,listeners: []
      ,set: function(type, listener){
        // save listener for later use
        this.listeners.push({ type: type, fn: listener });
        return this;
      }
      ,delegate: function(type){
        return {
           api: this
          ,on: function(emitter){
            if(!(emitter instanceof ImprovedEmitter))
              throw "emitter must be an ImprovedEmitter";
            var api = this.api
              , emitter = api.emitter
            ;
            api.set(type, function(){
              this.log("delegate '%s'=>'%s'", type, emitter);
              var args = [].slice.call(arguments, 0);
              emitter.emit.apply(emitter, [type].concat(args));
            });
            return api;
          }
        };
      }
      ,done: function(){
        var types = this.listeners.slice(0)
            .map(function(val){ return val.type; })
            .filter(function(e, i, a){ return i == a.lastIndexOf(e); })
          , snap_id = Date.now()
          , emitter = this.emitter
        ;
        // make a snapshot
        emitter.snapshot.apply(emitter, [snap_id].concat(types));
        // ensure emitter will be reverted with any event type
        types.forEach(function(type){
          emitter.once(type, function(){ emitter.revert(snap_id); });
        });
        // bind the listeners
        this.listeners.forEach(function(listener){ 
          if('function' == typeof listener.fn)
            emitter.once(listener.type, listener.fn);
        });
        // return emitter to allow chaining
        return emitter;
      }
    };
  }}
});
