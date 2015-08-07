import BridgeBase from './bridge-base';

export default class DataAttributeBridge extends BridgeBase {
  constructor(attributeName = 'data-test-selector') {
    super(...arguments);
  }

  defaultSelectorFor(value = '', filter = '') {
    return `[${this.attributeName}="${value}"]${filter}`;
  }

  buttonSelector(value = '', filter = '') {
    return this._selectorFor('button', ...arguments);
  }

  linkSelector(value = '', filter = '') {
    return this._selectorFor('a', ...arguments);
  }

  inputSelector(value = '', filter = '') {
    return this._selectorFor('input', ...arguments);
  }

  _selectorFor(tagName, value = '', filter = '') {
    return `${tagName}${this.defaultSelectorFor(value, filter)}`;
  }
}
