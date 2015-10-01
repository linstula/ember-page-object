import Ember from 'ember';
import DataAttributeBridge from './bridges/data-attribute';
import replaceURLSegments from './utilities/replace-url-segments';

const { assert: emberAssert } = Ember;

export default class PageObject {
  constructor({ assert, server, application, bridge } = {}) {
    this.assert = assert;
    this.bridge = bridge || new DataAttributeBridge();
    this.server = server;
    this.application = application;

    emberAssert('You must pass a valid interaction bridge to the Page Object!', this.bridge);
  }

  url() {
    return '/';
  }

  visit(segments = {}) {
    visit(replaceURLSegments(this.url(), segments));
    return this;
  }

  fillInInput(rawSelector, value) {
    return this.andThen((bridge) => {
      const inputSelector = bridge.inputSelector(rawSelector);

      fillIn(inputSelector, value);
    });
  }

  click(...args) {
    return this.andThen((bridge) => {
      const selector = bridge.defaultSelector(...args);

      click(selector);
    });
  }

  clickButton(...args) {
    return this.andThen((bridge) => {
      const selector = bridge.buttonSelector(...args);

      click(selector);
    });
  }

  clickLink(...args) {
    return this.andThen((bridge) => {
      const selector = bridge.linkSelector(...args);

      click(selector);
    });
  }

  find(...args) {
    const selector = this.bridge.defaultSelector(...args);
    return find(selector);
  }

  prepareResponse(path, options = {}) {
    return this.andThen(() => {
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

  andThen(callback) {
    const { bridge, assert } = this;

    andThen(() => {
      callback.call(this, bridge, assert);
    });

    return this;
  }

  /**
   * Pauses a test so you can look around within a PageObject chain.
   *
   * ```js
   *  test('foo', function(assert) {
   *    new SomePage(assert)
   *      .login()
   *      .embiggen()
   *      .pause()
   *      .doStuff();
   *  });
   * ```
   *
   * @public
   * @return {this}
   */
  pause() {
    return this.andThen(() => {
      // jshint ignore:start
      return pauseTest();
      // jshint ignore:end
    });
  }

  /**
   * Embiggens the testing container for easier inspection.
   *
   * @public
   * @return {this}
   */
  embiggen() {
    return this.andThen(() => {
      $('#ember-testing-container').css({ width: '100vw', height: '100vh' });
    });
  }

  /**
   * Throws a breakpoint via debugger within a PageObject chain.
   *
   * ```js
   *  test('foo', function(assert) {
   *    new SomePage(assert)
   *      .login()
   *      .embiggen()
   *      .debug()
   *      .doStuff();
   *  });
   * ```
   *
   * @public
   * @return {this}
   */
  debug() {
    // jshint ignore:start
    const context = this; // deopt so `this` is accessible
    return this.andThen((applicationInstance) => {
      console.info('Access the PageObject with `this`, and the application instance with `applicationInstance`.');
      debugger;
      eval();
    });
    // jshint ignore:end
  }

  urlForSegments(segments = {}) {
    return replaceURLSegments(this.url(), segments);
  }
}
