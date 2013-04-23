
var _ = exports = module.exports = {
  ImprovedEmitter: require('./lib/ImprovedEmitter')
  ,NameResolver: require('./lib/NameResolver')
  ,ResourceLoader: require('./lib/ResourceLoader')
  ,RequestRouter: require('./lib/RequestRouter')
  ,Interface: require('./lib/Interface')
  ,util: require('./lib/utils')
};

_.Router = _.RequestRouter;
_.implements = _.Interface.implements;

_.ArrayLike = new _.Interface('ArrayLike', ['forEach', 'join', 'map']);
_.Saludo = new _.Interface('Saludo', ['hola', 'adios']);
