import BridgeBase from './bridge-base';

export default class DataAttributeBridge extends BridgeBase {
  constructor(attributeName = 'data-test-selector') {
    super(attributeName);
  }

  defaultSelectorFor(value = '', filter = '') {
    return `[${this.attributeName}="${value}"]${filter}`;
  }

  buttonSelector(value = '', filter = '') {
    return this._selectorFor('button', filter, value);
  }

  linkSelector(value = '', filter = '') {
    return this._selectorFor('a', filter, value);
  }

  inputSelector(value = '', filter = '') {
    return this._selectorFor('input', filter, value);
  }

  _selectorFor(tagName, value = '', filter = '') {
    return `${tagName}${this.defaultSelectorFor(value, filter)}`;
  }
}
