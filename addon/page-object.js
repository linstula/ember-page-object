import Ember from 'ember';
import DataAttributeBridge from './bridges/data-attribute';

const { assert: emberAssert } = Ember;

export default class PageObject {
  constructor(assert, { server, application, bridge }) {
    this.assert = assert;
    this.bridge = bridge || new DataAttributeBridge();
    this.server = server;
    this.application = application;

    emberAssert(bridge, 'You must pass a valid interaction bridge to the Page Object!');
  }

  _fillInInput(selector, value) {
    return this._andThen((bridge) => {
      const input = bridge.inputSelector(selector);

      fillIn(input, value);
    });
  }

  _click(...args) {
    return this._andThen((bridge) => {
      const selector = bridge.defaultSelectorFor(...args);

      const element = findWithAssert(selector);
      return click(element);
    });
  }

  _clickButton(...args) {
    return this._andThen((bridge) => {
      const selector = bridge.buttonSelector(...args);

      click(findWithAssert(selector));
    });
  }

  _clickLink(...args) {
    return this._andThen((bridge) => {
      const selector = bridge.linkSelector(...args);

      click(findWithAssert(selector));
    });
  }

  _find(...args) {
    const selector = this.bridge.defaultSelectorFor(...args);
    return find(selector);
  }

  _prepareResponse(path, options = {}) {
    return this._andThen(() => {
      let { method, response, status, headers } = options;
      method = method ? method.toLowerCase() : 'get';
      response = response || {};
      status = status || 200;
      headers = headers || { 'Content-Type': 'application/vnd.api+json' };

      this.server[method](path, () => {
        return [status, headers, JSON.stringify(response)];
      });
    });
  }

  _andThen(callback) {
    const { bridge, assert } = this;
    andThen(callback.call(this, bridge, assert));

    return this;
  }
}
