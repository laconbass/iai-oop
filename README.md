# iai-oop

iai-oop is a utility belt to deal with object declarations, in the context of OOP for javascript. It has been designed to standarize the inheritance pattern used within [iai](https://npmjs.org/search?q=iai) related modules.

## Design principles: Simplicity & expressiveness

The object declarations should not be verbose and must be expresive. Vanilla javascript is enough expresive but sometimes is verbose. That said, sometimes vanilla javascript produces the most simple and most descriptive code, so encourage to not use an utility function when it does not provide benefits for readability of code.

## The keys

1. Forget the concept of *classes*.
2. Completely eliminate the use of the `new` keyword.

Everything is a instance in javascript, so talking about classes, even in quotes, is a mistake. The *constructor pattern* needs to use the `new` keyword and the code produced looks like a class instantiation, confusing readers. In addition, the use of `new` is not combinable with the ECMA `Function.prototype` functionalities, specially `call` and `apply`, and breaks possible chained calls.

## ~~constructors~~ builders

Research about creational design patterns and cross out definitions that refer specifically to the concept of *classes*. *Prototype* and *Builder* are the patterns that do not rely specifically on the class concept by definition. In fact, JavaScript implements both natively:

* The prototype pattern, through the native `Object`. See on the ECMA 5.1 specification:

  * [*prototype* definition](http://www.ecma-international.org/ecma-262/5.1/#sec-4.3.5)
  * [`Object.create` alghoritm](http://www.ecma-international.org/ecma-262/5.1/#sec-15.2.3.5)

            // prototype is a fully initialized instance of Object.
            var prototype = {
              // ...
            };
            // create a new object with specified prototype
            var object = Object.create( prototype );

* The builder pattern, allowing the use of a function as an object's ~~constructor~~ when invoked with the `new` keyword (aka. *constructor pattern*). As said previously, the use of the `new` keyword should be completely eliminated so this pattern should be avoided.

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

As said, the tools to implement a prototypal inheritance pattern, where object instances are created from other object instances, are natively bundled within ECMAScript specification. `Object.create` is the way to *create a new object with the specified prototype*. The challengue is a pattern that efficiently replaces the ~~constructor~~ builder pattern on the task of *initialize a newly created object with the specified prototype*. The solution is quite simple, and surprisingly somewhere between the *constructor pattern* and the *prototypal inheritance pattern* .

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
