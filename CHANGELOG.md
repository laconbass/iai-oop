# version 0.0.4
  - Main package file moved from "index.js" to "lib/oop.js"
  - The module no longer depends on 'iai-util'
  - The module no longer exports 'iu'
  - The module now depends on 'iai-util' for development (testing)
  - Redefined the OOP philoshopy:
    - this behaviour is being documented on the package README file
  - Now the module exports:
    - The following interfaces
      - 'Prototype'
      - 'Factory'
      - 'Composite'
      - 'Iterable'
      - 'Transversable'
    - The following prototypes
      - GenericFactory
      - GenericComposite
  - Now the module provides the followin custom error types, 
    which are stored on the global scope as constructors.
    - 'BaseError'
    - 'ValidationError'
    - 'IOError'
    - 'ValueError'
    - 'ArityError'
    - 'ImplementationError'

# version 0.0.31
  - Old classes (deprecated) moved to 'lib/old-classes/'
  - README.md is now a bit more descriptive
  - 'Interface::ensureImplements' (class method) renamed to 'Interface::implements'
  - 'Interface::implements' (class method) now returns true on success
  - The module now exports 'inherits', alias of node-core 'util.inherits'
  - Added @interface 'i.Prototype'
  - Added @interface 'i.Composite'
  - Added @interface 'i.Iterable'
  - Added @interface 'i.Transversable'
  - Added abstract @prototype 'Prototype'
  - Added abstract @prototype 'Composite'

# version 0.0.3
  - This module is not backwards compatible as it is being full-reviewed
  - The module now depends on 'iai-util'
  - The module now exports 'iu', a reference to iai-util
  - The module adds the following util: 'isInterface'
  - Added 'Interface' class
  - The following classes are deprecated and not exported.
    - ImprovedEmitter
    - ResourceLoader
    - RequestRouter
    - ArrayLike
    - NameResolver

# version 0.0.2
  - Changues on class ImprovedEmitter
    - Added '.log' method
    - Added 'LOG_FG_IN' attribute
    - Event 'other' is not emitted anymore
    - Added 'delegate_on' method
    - Added 'bypass' method
    - Added 'snapshot' method
    - Added 'reverse' method
    - Added 'opt' method
    - Customized 'on' behaviour
      - log a message on possible memory leaks
      - emit 'newLogListener' if there are lazy logs waiting for emission
  - Added Classes:
    - ResourceLoader
    - RequestRouter
    - ArrayLike
  - Lots of improvements and bugfixes

# version 0.0.12
  - Note this module is not backwards compatible from 0.0.1
  - Deleted unneeded require from NameResolver file
  - Deleted the old ParentClass file
  - Other minor modifications

# version 0.0.11
  - Fixed bugs on ImprovedEmitter
  - Now ImprovedEmitter has a 'class' property

# version 0.0.1
  - Added Classes:
    - NameResolver
  - Now the module exports an object which allows accessing the classes

# version 0.0.0
  - Added Classes:
    - ImprovedEmitter
