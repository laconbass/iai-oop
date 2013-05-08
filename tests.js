/*
  SOME STUPID TESTS
*/


process.env.NODE_ENV = 'test';

var iu = require('iai-util')
  .load('type checks')
  .load('assertor')
  , oop = require('./')
  , Interface = oop.Interface
;

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
  , i = oop.i
;
iu.assertor('Interfaces')
  .expects( 'Fake to implement hola', Interface.implements(Fake, Saluda) )
  .expects( 'to export the "Prototype" interface', iu.isInterface( i.Prototype ) )
  .expects( 'to export the "Composite" interface', iu.isInterface( i.Composite ) )
  .expects( 'to export the "Iterable" interface', iu.isInterface( i.Iterable ) )
  .expects( 'to export the "Transversable" interface', iu.isInterface( i.Transversable ) )
;

iu.assertor('abstract @prototype Prototype')
  .expects( 'to be exported by the module', !!o.Prototype )
  .runs( 'implements <Prototype>', function(){
    o.implements( o.Prototype, i.Prototype )
  })
  .throws( 'the init method is called on the prototype itself', function(){
    o.Prototype.init();
  })
  .throws( 'the init method is called on a created object', function(){
    o.Prototype.create().init();
  })
;

iu.assertor('@prototype Composite tester')
  .expects( 'to be exported by the module', !!o.Composite )
  .runs( 'Composite.create()', function(){
    o.Composite.create('test');
  })
  .runs( 'prototype implements <Prototype, Composite>', function(){
    o.implements( o.Composite, i.Prototype, i.Composite )
  })
  .runs( 'created instance implements <Prototype, Composite>', function(){
    o.implements( o.Composite.create('test'), i.Prototype, i.Composite )
  })
  .throws( 'the init method is called on the @prototype itself', function(){
    o.Composite.init();
  })
  .throws( 'the init method is called on a created object', function(){
    o.Composite.create().init();
  })
;


 // console.log( require('util').inspect( o.Composite.create(), {showHidden: true, colors: true} ) );
