var MyParent = require( "./1-superprototype_(vanilla)" )
  , oop = require( '..' )
;

module.exports = oop.extend( MyParent, {
  subMethod: function(){
    return "subMethod from MyExtendedPrototype";
  },
  extendableMethod: function(){
    return "extendableMethod from MyExtendedPrototype"
          +"parent says: "+Parent.extendableMethod.call(this);
  }
});
