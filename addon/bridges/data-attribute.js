import BridgeBase from './bridge-base';

export default class DataAttributeBridge extends BridgeBase {
  constructor(properties = {}) {
    let { attributeName } = properties;
    attributeName = attributeName || 'data-test-selector';
    properties.attributeName = attributeName;

    super(properties);
  }

  defaultSelector(value = '', filter = '') {
    return `[${this.attributeName}="${value}"]${filter}`;
  }

  buttonSelector(value = '', filter = '') {
    return this._selectorFor('button', value, filter);
  }

  linkSelector(value = '', filter = '') {
    return this._selectorFor('a', value, filter);
  }

  inputSelector(value = '', filter = '') {
    return this._selectorFor('input', value, filter);
  }

  _selectorFor(tagName, value = '', filter = '') {
    return `${tagName}${this.defaultSelector(value, filter)}`;
  }
}
