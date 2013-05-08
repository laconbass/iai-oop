# Warning

This module is a component of [the iai framework](https://npmjs.org/search?q=iai).
 It's useless for you, until some serious work has been done.

# The main goal

This node module attemps to be an abstraction layer with all the desired 
practices for OOP on [iai](https://github.com/laconbass/iai) components or 
sub-components. It should provide the lower level prototypes, constructors, 
and util functions to solve and implement any kind of logic related to OOP. 

# Practical inheritance

Classical vs Prototypal inheritance is a trend topic on javascript OOP. 
The iai phylosophy is to use the good sense: Practical inheritance. 

## Introduction

Let's clarify some concepts before anything:

**Constructor**: Forgot the "class" concept. Let's call things by their 
name. Javascript does not have the traditional classes as other OOP 
languages do. It has *constructors* instead. This way of OOP for javascript 
is called Classical inheritance by its similarity with the traditional 
concept of classes. Let's clarify the concept of constructor with an 
example:

    function MyConstructor(){
      // object initialization
    }
    // now we could define a prototype, or not

    // and the constructor is ready to be used
    myConstructorInstance = new MyConstructor();

**Prototype**: Talking about an object's prototype is like talking
about its immediate ancestor on the *prototype chain*.

**Prototype Chain**: The hierarchy that an object inherits from. The 
prototype chain always ends on Object.prototype.

If you don't know about what are we talking about,
please search further reading about *JavaScript* before continue reading.

## It's all about how we write

Traditionally most people uses Classical inheritance instead Prototypal 
inheritance. Generally it's said - and considered truth - that *most 
developers feel more comfortable writing `constructors` because they 
seem more like traditional classes*.


