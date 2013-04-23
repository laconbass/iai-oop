var util = require('util')
  , ImprovedEmitter = require('./ImprovedEmitter')
;
/*
  @class NameResolver: Resolves a request to a resource name
    @extends ImprovedEmitter

  @event 'resolved': Emitted when the resolving process succeed. Callback receives "resolved_resource_name"
*/
function NameResolver() {
  NameResolver.super_.call(this);
}
module.exports = NameResolver;
util.inherits(NameResolver, ImprovedEmitter);
Object.defineProperties(NameResolver.prototype, {
  LOG_FG_IN: { value: '\033[036m' }
  /*
    EACH CHILD CLASS MUST IMPLEMENT THE FOLLOWING METHODS.
    AN ERROR IS EMITTED INSTEAD WHEN CALLING ANY OF THEM
  */
  /*
    @method resolve: Resolves request to a resource name.
      @param request (object): The request
  */
  ,resolve: { value: function(request) {
    return this.error("<"+this.class+"> must implement resolve");
    //
    // EXAMPLE IMPLEMENTATION
    //
    this.emit('resolve', request);
    // asynchronously resolve the resource name
    (function resolve_name(request) {
      // resource name is resolved here ...
      var resource_name;
      // maybe something is wrong??
      if(fatal_error) this.error('error message');
      if(deny) this.emit('abort', 401, 'access denied msg');
      if(not_allowed) this.emit('abort', 405, 'bad method');
      // and finally emit the resolved event when it's done
      if(everything_is_ok)
        this.emit('resolved', resource_name);
    }).call(this, request);
    return this;
  }}
});
