var oop = require( '..' )
  , MyParent = require( './3-creator-for-prototype' )
;

module.exports = oop.creator(function MySubCreator(){
  // the instance comes from the parent creator
  return oop( MyCreator() )
    .set( 'MyCreator instance property', 'redefined within MySubCreator' )
    .o
  ;
  // or the same code in vanilla (sometimes it's clean and not verbose)
  var instance = MyCreator();
  instance['MyCreator instance property'] = 'redefined within MySubCreator';
  return instance;
  // see example #3 for other patterns
}, MyParent.prototype, {
  subCreatorMethod: function(){
    return "subCreatorMethod from MySubCreator.prototype"
  },
  extendableMethod: function(){
    return "extendableMethod from MySubCreator.prototype"
  }
})
