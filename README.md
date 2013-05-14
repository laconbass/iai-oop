# Warning

 This module is a component of [the iai framework](https://npmjs.org/search?q=iai).
 It's useless for you, until some serious work has been done.

# The main goal

 This node module attemps to be an abstraction layer with all the desired 
 practices for OOP on [iai](https://github.com/laconbass/iai) components or 
 sub-components. It should provide the lower level prototypes, constructors, 
 and util functions to solve and implement any kind of logic related to OOP. 

----------------------------

# The iai OOP compendium.

## Status of this document
This document is being written. Its contents may change without notification.

## Index
 * [License](#license)
 * [Introduction](#introduction)
 * [Concepts and definitions](#definitions)

## <a id="license"></a> License
This work is licensed under a Creative Commons Attribution-ShareAlike 3.0 
Unported. To see a copy of the license, please visit 
http://creativecommons.org/licenses/by-sa/3.0/.

## <a id="introduction"></a>Introduction

Let's clarify some concepts before anything:

- **Classical inheritance pattern**: A pattern to define Object's structures
  based on *Constructors* (see this concept below). The name comes from 
  its similarity with the traditional concept of classes of other OOP 
  languages like C++ or Java.

- **Constructor**: Forgot the "class" concept. Let's call things by their 
  name. Javascript does not have the traditional classes as other OOP 
  languages do. It has *constructors* instead. Let's clarify this concept 
  with an example:

      function MyConstructor(){
        // object initialization
      }
      // now we could define some methods, or not
      // and the constructor is ready to be used
      myConstructorInstance = new MyConstructor();


- **Prototypal inheritance pattern**: (...)

- **Prototype**: Talking about an object's prototype is like talking
  about its immediate ancestor on the *prototype chain*.

- **Prototype Chain**: The hierarchy that an object inherits from. The 
  prototype chain always ends on Object.prototype.

If you don't know about what are we talking about,
please search further reading about *JavaScript* before continue reading.

As starting point:

 * [Eloquent JavaScript: A Modern Introduction to Programming](http://eloquentjavascript.net/), by [Marijn Haverbeke](http://marijnhaverbeke.nl/) is a free book which can help you about general concepts.
 * [An article](https://brendaneich.com/2008/04/popularity/) wrote by Brendan Eich, creator of the JavaScript language. A nice - and probably the best - resource to learn the JavaScript backgrounds.
 * [An article](http://www.ibm.com/developerworks/library/wa-protoop/) about prototypal inheritance.


## It's all about how we write

**This section should be renamed to "Inheritance patterns" and restructured, starting from this concept and making sub-sections to introduce the "classical vs prototypal" question**

Traditionally most people uses Classical inheritance instead of Prototypal 
inheritance. Generally it's said - and considered truth - that *most 
developers feel more comfortable with the classical inheritance pattern
because it seems more like traditional classes*.

Is a common mistake nowadays to reinvent the wheel looking for a clean
way to implement the classical inheritance pattern. Either the better
considered JavaScript programmers throught time has stuck with this 
mistake. It's important to learn their opinion and especially their
errors to avoid committing them.

### [Brendan Eich](https://brendaneich.com/)
The creator of the JavaScript language. At the moment I haven't found 
any article written by him about this concrete topic, but i still 
recommend learning from his publications and talks.


### [Douglas Crockford](http://www.crockford.com/)
He was the first to specify and popularize the JSON format, and the
developer of the tools JSLint and JSMin. Despite the fact he has been 
criticized by the community for various reasons (see 
[this](https://brendaneich.com/2008/04/popularity/) and 
[this](http://en.wikipedia.org/wiki/Douglas_Crockford#Criticism), i.e.)
, he wrote two great articles about OOP for JavaScript, which are 
a must-read for the topic we concern:

* [Classical Inheritance in JavaScript](http://javascript.crockford.com/inheritance.html)
* [Prototypal Inheritance in JavaScript](http://javascript.crockford.com/prototypal.html)

This two articles are really important because **he "answers"** with his 
opinion, based on his experience, **the big question: Classical 
inheritance vs Prototypal inheritance**.

The first article ends with the following words:

> I have been writing JavaScript for 8 years now, and I have never 
> once found need to use an uber function. The super idea is fairly 
> important in the classical pattern, but it appears to be unnecessary 
> in the prototypal and functional patterns. I now see my early 
> attempts to support the classical model in JavaScript as a mistake.

And the second article begins with:

> Five years ago I wrote *Classical Inheritance in JavaScript*. 
> It showed that JavaScript is a class-free, prototypal language, 
> and that it has sufficient expressive power to simulate a classical 
> system. My programming style has evolved since then, as any good 
> programmer's should. I have learned to fully embrace prototypalism, 
> and have liberated myself from the confines of the classical model.

These words reveal his opinion enough.

### [John Resig](http://ejohn.org/)
Creator of the jQuery library and author of the books
[Pro JavaScript Techniques](http://jspro.org/) and
[Secrets of the JavaScript Ninja](http://jsninja.com/), 
which reading I recommend. He also writes interesting articles
on his blog, as the following ones that are a must-read too:

* [Simple "Class" Instantation](http://ejohn.org/blog/simple-class-instantiation/)
* [Simple JavaScript Inheritance](http://ejohn.org/blog/simple-javascript-inheritance/)

The second article explains his own solution to emulate classical inheritance.

### [Dustin Diaz](http://www.dustindiaz.com/)

## Conclusion: "Practical" inheritance
 
Classical vs Prototypal inheritance is a trend topic on javascript OOP,
and will be until the end of the times. The iai phylosophy is to use 
the good sense, as it is the best practice ever. Call it "Practical" 
inheritance, or whatever you want. The goal is to provide a set of
tools to help dealing with common tasks on OOP and keep the code more 
descriptive, more maintainable, and, in definetevely, cleaner.

Using custom functions to define constructors and
prototypes allows to quickly enhance all the existant code with a
concrete inheritance pattern. ECMA Script  6 will include stuff about
classes, so it makes sense to prevent lots of modifications after it 
comes.

## <a id="definitions"></a>Concepts and expressions

Any time some text appears formatted according to the following rules
it refers to its literal definition, that can be found below.

### Rules

 * Expressions are emphatised *with italic*.
 * Concepts are wrapped as `inline code`.

### Definitions

 - `Function`: The standard "Function" object defined on ECMAScript spec.
 - `Object`: The standard "Object" object defined on ECMAScript spec.
 - *object instance(s)*: Refers to any instance, not to an `Object` instance.
 - `hash` or `namespace`: An `Object` instance.
 - `function`: A `Function` instance.
 - `method`: A `function` which also is a property of an *object instance*.
 - `constructor`: A `function` meant to instantiate objects, not necessarily with the `new` keyword.
 - `prototype`: An `Object` instance meant to be used as ancestor for *object instances*.
 - `factory`: This concept may refer to:
  * The Factory design pattern.
  * A `constructor` that defers the instantation on other *object instance*.
  * A `prototype` that has a "create" `method` which is a `constructor`.

## <a id="functions"></a>Utility Functions

To keep things clean, all the functions are grouped on the `namespace` "oop".

`function oop.create`

`function oop.factory`

`function oop.factoryFrom`

`function oop.constructor`

`function oop.callable`

`function oop.callableFrom`


