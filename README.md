# Warning

 This module is a component of [the iai framework](https://npmjs.org/search?q=iai).
 It's useless for you, until some serious work has been done.

----------------------------

# iai-oop

iai-oop is a utility belt to deal with object declarations, in the context of OOP for javascript. It has been designed to standarize the inheritance pattern used within [iai](https://npmjs.org/search?q=iai) related modules.

## Design principles: Simplicity & expressiveness

The object declarations should not be verbose and must be expresive. Vanilla javascript is enough expresive but sometimes is verbose. That said, sometimes vanilla javascript produces the most simple and most descriptive code, so encourage to not use an utility function when it does not provide benefits for readability of code.

## The keys

1. Forget the concept of *classes*.
2. Completely eliminate the use of the `new` keyword.

Everything is a instance in javascript, so talking about classes, even in quotes, is a mistake. The *constructor pattern* needs to use the `new` keyword and the code produced looks like a class instantiation, confusing readers. In addition, the use of `new` is not combinable with the ECMA `Function.prototype` functionalities, specially `call` and `apply`, and breaks possible chained calls.

## ~~constructors~~ builders

Research about creational design patterns and cross out definitions that refer specifically to classes (key #1):

* ~~*Abstract Factory*:  Creates an instance of several families of classes. Provide an interface for creating families of related or dependent objects without specifying their concrete classes.~~
* *Builder*: Separates object construction from its representation. Separate the construction of a complex object from its representation so that the same construction processes can create different representations.
* ~~*Factory Method*: Creates an instance of several derived classes. Define an interface for creating an object, but let subclasses decide which class to instantiate. Factory Method lets a class defer instantiation to subclasses.~~
* *Prototype*: A fully initialized instance to be copied or cloned. Specify the kinds of objects to create using a prototypical instance, and create new objects by copying this prototype.
* ~~*Singleton*: A class of which only a single instance can exist. Ensure a class only has one instance, and provide a global point of access to it.~~

*prototype* and *builder* are the patterns that do not rely specifically on the class concept by definition. In fact, JavaScript implements both natively:

* The prototype pattern, through the native `Object`. See on the ECMA 5.1 specification:

  * [*prototype* definition](http://www.ecma-international.org/ecma-262/5.1/#sec-4.3.5)
  * [`Object.create` alghoritm](http://www.ecma-international.org/ecma-262/5.1/#sec-15.2.3.5)

        // prototype is a fully initialized instance of Object.
        var prototype = {
          // ...
        };
        // create a new object with specified prototype
        var object = Object.create( prototype );

* The builder pattern, allowing the use of a function as an object's ~constructor~ when invoked with the `new` keyword (aka. *constructor pattern*). As said previously, the use of the `new` keyword should be completely eliminated so this pattern should be avoided.

        // the function builder separates object construction from
        // its representation (aka instance)
        function builder(){
          // ...
        }
        builder.prototype = {
          // ...
        };
        // builder can create different representations with the same
        // construction process
        var object = new builder();


## ~~prototypal~~ ~~classical~~ practical inheritance

As said, the tools to implement a prototypal inheritance pattern, where object instances are created from other object instances, are natively bundled within ECMAScript specification. `Object.create` is the way to *create a new object with the specified prototype*. The challengue is a pattern that efficiently replaces the constructor pattern on the task of *initialize a newly created object with the specified prototype*. The solution is quite simple, and surprisingly somewhere between the *constructor pattern* and the *prototypal inheritance pattern* .

        function builder(){
          var instance = Object.create(prototype);
          // initialize the instance...
          return instance;
        }
        var prototype = {
          // ...
        };
        var object = builder();

The first problem found with this code is the breaking of the `instanceof` operator behaviour. On the previous example, `object instanceof builder` resolves to `false`. Fortunately, it can be fixed with ease.

        function builder(){
          var instance = Object.create(builder.prototype);
          // initialize the instance...
          return instance;
        }
        builder.prototype = {
          // ...
        };
        var object = builder();

Now `instanceof` will resolve `true`, because `Object.getPrototypeOf(object) === builder.prototype`. The big concern now is how to implement the inheritance chain.

        function builder(){
          var instance = Object.create(this);
          // initialize the instance...
          return instance;
        }
        builder.prototype = {
          // ...
        };
        var object = builder.call( builder.prototype );

        function childBuilder(){
          var instance = builder.call(this);
          // initialize the instance...
          return instance;
        }
        childBuilder.prototype = {
         // ...
        }
        var object2 = childBuilder.call( childBuilder.prototype );


Now... what?
