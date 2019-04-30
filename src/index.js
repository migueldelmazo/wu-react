import _ from 'lodash'
import wu from 'wu'
import React from 'react'

// state

const wrapSetStateMethod = function() {
  this.setState = _.wrap(this.setState, function(setStateMethod, path, value) {
    const obj = _.isPlainObject(path) ? path : _.set({}, path, value),
      newState = _.extend({}, this.state, obj)
    if (!_.isEqual(this.state, newState)) {
      _.consoleLog('react', 'React: run ' + this.getName('name') + '.setState', 'Data:', obj)
      setStateMethod.call(this, obj)
    }
  })
}

// state and props parser

const parser = function(value) {
  if (_.isString(value)) {
    if (_.startsWith(value, '#props.')) {
      value = value.replace('#props.', '')
      return _.get(this.props, value)
    } else if (_.startsWith(value, '#state.')) {
      value = value.replace('#state.', '')
      return this.getState(value)
    }
  }
  return value
}

// wu Watchers

const watch = function() {
  const watchers = this.onChange()
  if (watchers) {
    this.watcherKey = wu.model.watch(watchers, function() {
      _.consoleGroup('react', 'React: render ' + this.getName('name'), 'onChange paths:', watchers)
      this.forceUpdate()
      _.consoleGroupEnd()
    }.bind(this))
  }
}

const stopWatching = function() {
  wu.model.stopWatching(this.watcherKey)
}

// run methods

const runMethod = function(methodName, ...args) {
  const parsedArgs = _.mapDeep(args, null, parser.bind(this))
  _.consoleGroup('react', 'React: run ' + this.getName() + '.' + methodName, 'Args:', ...parsedArgs)
  if (_.isFunction(this[methodName])) {
    this[methodName].call(this, ...parsedArgs)
  } else {
    wu.setter(methodName, ...parsedArgs)
  }
  _.consoleGroupEnd()
}

// input

const getInputValue = (ev) => {
  const target = ev.target
  if (target.tagName === 'INPUT') {
    if (target.type === 'checkbox' || target.type === 'radio') {
      return target.checked
    }
    if (target.type !== 'button' && target.type !== 'submit') {
      return target.value
    }
  }
}

export default class Component extends React.Component {

  constructor(props) {
    super(props)
    this.get = wu.getter
    this.state = this.initialState()
    wrapSetStateMethod.call(this)
  }

  componentDidMount() {
    watch.call(this)
  }

  componentWillUnmount() {
    stopWatching.call(this)
  }

  getName() {
    return this.constructor.name
  }

  onChange() {}

  // state

  initialState() {
    return {}
  }

  getState(path, defaultValue) {
    return _.get(this.state, path, defaultValue)
  }

  toggleState(path, value) {
    value = value === undefined ? !this.getState(path) : !!value
    this.setState(path, value)
  }

  // events

  onEv(...args) {
    return function(ev) {
      const eventValue = getInputValue(ev)
      const methodsArgs = _.isString(args[0]) ? [args] : args
      _.each(methodsArgs, (methodsArgs) => {
        if (eventValue === undefined) {
          runMethod.apply(this, methodsArgs)
        } else {
          runMethod.apply(this, methodsArgs.concat(eventValue))
        }
      })
    }.bind(this)
  }

  // class name

  getClassName(status, trueClass = '', falseClass = '', prefixClass = '', sufixClass = '') {
    return prefixClass + (status ? trueClass : falseClass) + sufixClass
  }

}
