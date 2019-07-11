import PropTypes from 'prop-types';
import React from 'react';

type PropTypesType = typeof PropTypes;
declare module "React" {
  export var PropTypes: PropTypesType;
  export function createClass(options: any): typeof React.Component;
  export interface Component {
    isMounted(): boolean;
  }
}

React.PropTypes = React.PropTypes || PropTypes;
React.createClass = React.createClass || function (options: any) {
  class ReactComponent extends React.Component {
    static displayName = options.displayName;
    static propTypes = options.propTypes;
    static defaultProps = options.getDefaultProps ?
      options.getDefaultProps() : {};
    constructor(props: any, ...args) {
      super(props, ...args);
      for (let key in this) {
        const func = this[key];
        if (typeof func === 'function') {
          this[key] = func.bind(this);
        }
      }
      this.state = options.getInitialState ?
        options.getInitialState.call(this) : {};
    }
    private __mounted = false;
    isMounted() {
      if (options.isMounted) return options.isMounted.call(this);
      return this.__mounted;
    }
    componentDidMount(...args) {
      this.__mounted = true;
      if (options.componentDidMount) {
        return options.componentDidMount.call(this, ...args);
      }
    }
    componentWillUnmount(...args) {
      this.__mounted = false;
      if (options.componentWillUnmount) {
        return options.componentWillUnmount.call(this, ...args);
      }
    }
  }
  Object.assign(ReactComponent.prototype, options);
  return ReactComponent;
};