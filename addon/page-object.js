import Ember from 'ember';
import DataAttributeBridge from './bridges/data-attribute';

const { assert: emberAssert } = Ember;

export default class PageObject {
  constructor({ assert, server, application, bridge } = {}) {
    this.assert = assert;
    this.bridge = bridge || new DataAttributeBridge();
    this.server = server;
    this.application = application;

    emberAssert('You must pass a valid interaction bridge to the Page Object!', this.bridge);
  }

  visit(url) {
    visit(url);

    return this;
  }

  fillInInput(rawSelector, value) {
    return this._andThen((bridge) => {
      const inputSelector = bridge.inputSelector(rawSelector);

      fillIn(inputSelector, value);
    });
  }

  click(...args) {
    return this._andThen((bridge) => {
      const selector = bridge.defaultSelector(...args);

      click(selector);
    });
  }

  clickButton(...args) {
    return this._andThen((bridge) => {
      const selector = bridge.buttonSelector(...args);

      click(selector);
    });
  }

  clickLink(...args) {
    return this._andThen((bridge) => {
      const selector = bridge.linkSelector(...args);

      click(selector);
    });
  }

  find(...args) {
    const selector = this.bridge.defaultSelector(...args);
    return find(selector);
  }

  prepareResponse(path, options = {}) {
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

    andThen(() => {
      callback.call(this, bridge, assert);
    });

    return this;
  }
}
