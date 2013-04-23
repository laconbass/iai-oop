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
