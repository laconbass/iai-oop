/*
  SOME STUPID TESTS
*/

var oop = require('./index')
  , Interface = oop.Interface
;
var Saluda = new Interface('Saluda', ['hola', 'adios']);

var Fake = {
  hola: function(){}
  ,adios: function(){}
};

Interface.implements(Fake, Saluda);
