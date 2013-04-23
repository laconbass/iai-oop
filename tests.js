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

var Fake2 = {
};

Interface.ensureImplements(Fake, Saluda);
Interface.ensureImplements(Fake2, Saluda);
