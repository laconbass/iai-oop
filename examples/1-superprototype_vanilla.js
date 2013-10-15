/**
 * For creating "super" prototypes, vanilla javascript is enought descriptive
 * and not verbose. It doesn't make sense to use a helper function here.
 */


var MyVanillaSuperPrototype = module.exports = {
  superMethod: function(){
    return "superMethod from MyVanillaSuperPrototype";
  },
  extendableMethod: function(){
    return "extendableMethod from MyVanillaSuperPrototype";
  }
};
