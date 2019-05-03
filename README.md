# React JS module for [Wu framework](https://github.com/migueldelmazo/wu)
[![Wu](https://raw.githubusercontent.com/migueldelmazo/wu/master/resources/wu-logotype-03.png)](https://github.com/migueldelmazo/wu)

### ReactJS

Wu allows you to use [React JS classes](https://reactjs.org) that are already integrated with the functionality of Wu
in addition to integrating other utilities.

## Integration between Wu and React JS:

### `onChange()`

Wu React JS provides the `onChange` method to specify **the paths of the data model to watch**.
When one of these paths change in the Wu data model, **the view is auto rendered**.

This method must return the same as expected by the
[`wu.model.watch()`](https://github.com/migueldelmazo/wu/blob/master/docs/documentation-public-model-methods.md#wumodelwatch)
method as the first parameter: **a string or an array of strings**.

```javascript
import React from 'react'
import WuReactComponent from 'wu-reactjs'

export default class MyView extends WuReactComponent {
  onChange () {
    return 'user.name'
  }
  render () {
    return (
      <div>
        Name: { this.get('user.name') }
      </div>
    )
  }
}
```

## React JS utilities
In order to make the programming in React JS **more declarative** we have created some methods
so that they can be used from the HTML code of a React JS view:

### `onEv()`
Bind a function (and its parameters) to be executed when the user trigger an event.

**Arguments:**
* `methodName (string) [required]:` Name of the method to execute. This can be a view method or a Wu setter.
* `...args (*) [optional]:` Arguments that the method receives.

**Important:**
* If you want to execute **several methods at the same time**, you can group these parameters in an array.
* If the DOM element that executes this method is an input, **the method will receive the input value** as the last argument.
* If an argument starts with `#state` or by `#props` the argument value is replaced with the value of `this.state` or `this.props`.

**Example: execute a view method**
```javascript
import React from 'react'
import WuReactComponent from 'wu-reactjs'

export default class MyView extends WuReactComponent {
  sendLogin () {...}
  render () {
    return (
      <button onClick={ this.onEv('sendLogin') }>Login</button>
    )
  }
}
// 'sendLogin' is executed
```

**Example: execute a Wu setter**
```javascript
// file user.js
wu.create('setter', 'sendLogin', {...})

// file view.js
import React from 'react'
import WuReactComponent from 'wu-reactjs'

export default class MyView extends WuReactComponent {
  render () {
    return (
      <button onClick={ this.onEv('sendLogin') }>Login</button>
    )
  }
}
// 'sendLogin' Wu setter is executed
```

**Example: execute a method with arguments**
```javascript
import React from 'react'
import WuReactComponent from 'wu-reactjs'

export default class MyView extends WuReactComponent {
  render () {
    return (
      <button onClick={ this.onEv('sendLogin', 'email@email.com', '12345678') }>Login</button>
    )
  }
}
// 'sendLogin' is executed with 'email@email.com' and '12345678' arguments
```

**Example: execute several methods at the same time**
```javascript
import React from 'react'
import WuReactComponent from 'wu-reactjs'

export default class MyView extends WuReactComponent {
  render () {
    return (
      <button onClick={ this.onEv(
        ['sendLogin', 'email@email.com', '12345678'],
        ['setState', 'sendingLogin', true]
      ) }>Login</button>
    )
  }
}
// first 'sendLogin' is executed and then 'setState' is executed
```

**Example: the method receives the input value as the last argument**
```javascript
import React from 'react'
import WuReactComponent from 'wu-reactjs'

export default class MyView extends WuReactComponent {
  initialState () {
    return { email: '' }
  }
  render () {
    return (
      <input type='email' onChange={ this.onEv('setState', 'email') } />
    )
  }
}
// 'setState' is executed with 'email' as first argument and input value as second argument
```

**Example: replace the value of the argument for the state value**
```javascript
import React from 'react'
import WuReactComponent from 'wu-reactjs'

export default class MyView extends WuReactComponent {
  initialState () {
    return { email: 'email@email.com'}
  }
  render () {
    return (
      <button onClick={ this.onEv('sendLogin', '#state.email') }>Login</button>
    )
  }
}
// 'sendLogin' is executed with 'email@email.com' argument
```
___
### `initialState()`
In **initialState** method you can define the view initial state, without having to do this in the view constructor.

**Example:**
```javascript
import React from 'react'
import WuReactComponent from 'wu-reactjs'

export default class MyView extends WuReactComponent {
  initialState () {
    return {
      open: false
    }
  }
  render () {...}
}
```
___
### `setState()`
Until now with **React JS** you could pass an **object** to setState, like `this.setState({ email: 'email@email.com' })`.
Now with **Wu React JS** you can also pass as the first argument the **name of the property** and
as a second argument **the value**, like `this.setState('email', 'email@email.com')`.
This is useful for calling setState from the HTML code. You can use dot notation.

**Arguments:**
* `path (string) [required]:` view state path property.
* `value (*) [required]:` value.


**Example:**
```javascript
import React from 'react'
import WuReactComponent from 'wu-reactjs'

export default class MyView extends WuReactComponent {
  initialState () {
    return {
      status: {
        open: false
      }
    }
  }
  render () {
    return (
      <button onClick={ this.onEv('setState', 'status.open', true) }>Open</button>
    )
  }
}
// view state will be { status: { open: true } }
```
___
### `toggleState()`
**toggleState** is a wrapper of **setState** method to toggle the value of a property of the state.

**Arguments:**
* `path (string) [required]:` view state path property.

**Example:**
```javascript
import React from 'react'
import WuReactComponent from 'wu-reactjs'

export default class MyView extends WuReactComponent {
  initialState () {
    return {
      status: {
        open: false
      }
    }
  }
  render () {
    return (
      <button onClick={ this.onEv('toggleState', 'status.open') }>Toggle</button>
    )
  }
}
// view state will be { status: { open: true } }
```
___
### `getClassName()`
Returns one or the other class name depending on the value of a variable.

**Arguments:**
* `status (boolean) [required]:` variable to be evaluated.
* `trueClass (string) [required]:` class name to be rendered if status is true.
* `falseClass (string) [optional]:` class name to be rendered if status is false.
* `prefixClass (string) [optional]:` class name that will always be rendered as a prefix.
* `sufixClass (string) [optional]:` class name that will always be rendered as a sufix.

**Example:**
```javascript
import React from 'react'
import WuReactComponent from 'wu-reactjs'

export default class MyView extends WuReactComponent {
  initialState () {
    return { open: true }
  }
  render () {
    return (
      <div className={ this.getClassName(this.state.open, 'open', 'close', 'is-', ' active') }>Lorem ipsum</button>
    )
  }
}
// div is rendered with 'is-open active' class name
```
