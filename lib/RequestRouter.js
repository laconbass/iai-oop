var util = require('util')
  , http = require('http')
  , NameResolver = require('./NameResolver')
  , ResourceLoader = require('./ResourceLoader')
  , ImprovedEmitter = require('./ImprovedEmitter')
;
/*

  @class Router: Automates the process of resolving requests and sending responses asynchronously. Designed to be a parent class to all routers, not an instantiable class. The request logic is done in several phases:
    - Resolve: the request is resolved to a resource name
    - Load: the requested resource is loaded
    - Send: the loaded resource is processed to a string and sent
  @extends ImprovedEmitter

  @event 'request': Emitted before a request is processed. Normally used to modify the request and/or response objects
  @event 'send': Emitted before a resource is loaded and sent to a response. Callback receives "resource_name", "response"
  @event 'sent': Emitted after the response is sent. Callback receives "resource".
  @event 'abort': Emitted if the response should be aborted for some reason. Callback reives "status_code", "message"

*/
function Router(resolver, loader) {
  // check & define properties
  if(!(resolver instanceof NameResolver))
    throw "Router's resolver must be a NameResolver";
  if(!(loader instanceof ResourceLoader))
    throw "Router's loader must be a ResourceLoader";

  Object.defineProperties(this, {
    'resolver': { value: resolver }
    ,'loader': { value: loader }
  });
  // call super constructor
  Router.super_.call(this);

  // catch logs and errors
  resolver.delegate_on(this, 'name resolver');
  loader.delegate_on(this, 'resource loader');
}
module.exports = Router;
util.inherits(Router, ImprovedEmitter);
Object.defineProperties(Router.prototype, {
  // logging color
  LOG_FG_IN: { value: '\033[035m' }
  // shortcut to throw errors with custom properties
  ,abort: { value: function(code, req, res, msg) {
    this.emit('abort', code, req, res, msg);
    return this;
  }}
  /*
    @method request: Perform a request
    Request logic is common on all routers. The event bindings that must be added and removed are hard and complex to do so it's better to keep things done right, in one place. Bad event binding implementations could cause memory leaks.
  */
  ,request: { value: function(req, res) {
    // check req and res are http.? instances
    if(!(req instanceof http.IncomingMessage))
      return this.error("request must be an IncomingMessage object");
    if(!(res instanceof http.OutgoingMessage))
      return this.error("response must be an OutgoingMessage object");
    if(!req.headers.host)
      return this.abort(400, req, res, 'host header missed');
    // TODO OTHER CHECKS
    // TODO CLEAN event logic, avoid memory leaks, catch any errors
    var router = this;
    this
      // until request completes, all router errors are request errors
      .bypass('error').to(res)
      .emit('requested', req, res)
    ;
    router.resolver
      .once('resolved', function(resource_name){
        // resource found || notfound logic
        router.loader
          .opt()
            .set('found', function found(resource){
              router.send(resource, req, res);
            })
            .set('notfound', function notfound(resource_name){
              router.abort(404, req, res, 'resource not found');
            })
            .set('error', function(err){
              console.log('requestrouter.js loader err=', err.code)
              switch(err.code){
             // special error case which 403 is preferred over 500
              case 'NOTINSIDE':
                return router.abort(403, req, res, "try again ;)");
              default: router.error('loader error', err);
              }
            })
          .done()
          .load(resource_name);
        ;
      })
      .resolve(req, res)
    ;
    return this;
  }}
  // send logic must be implemented on each router
  ,send: { value: function(resource, response){
    throw "<"+this.class+"> must implement send";
  }}
});
