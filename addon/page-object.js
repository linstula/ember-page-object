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

    emberAssert('You must pass a valid DOM bridge to the Page Object!', this.bridge);
  }

// Interactions
  /**
   * Visits a url. Accepts a url string or an object of url segment values that will be matched against the Page Object's `url()` function.
   *
   *
   * ```js
   *  test('foo', function(assert) {
   *    new SomePage(assert)
   *      .visit('/posts/1/comments/1')
   *  });
   * ```
   *
   * Matching against a Page Object's `url()` function:
   * ```js
   *  export default class SomePage extends PageObject {
   *     url() {
   *       return '/posts/:postID/comments/:commentID'
   *     }
   *   }
   * ```
   *
   * ```js
   *  test('foo', function(assert) {
   *    new SomePage(assert)
   *      .visit({ postID: 1, commentID: 1 })
   *  });
   * ```
   *
   * @public
   * @return {this}
   */
  visit(urlOrSegments) {
    let url = urlOrSegments;

    if (typeof urlOrSegments === 'object') {
      url = replaceURLSegments(this.url(), urlOrSegments);
    }

    visit(url);
    return this;
  }

  fillIn(rawSelector, value, callback) {
    return this.andThen((bridge) => {
      const selector = bridge.defaultSelector(rawSelector);

      fillIn(selector, value);

      if (callback) {
        callback(this.find(rawSelector));
      }
    });
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

  clickByText(rawSelector, text) {
    return this.click(rawSelector, `:contains("${text}")`);
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

  findByText(rawSelector, text) {
    return this.find(rawSelector, `:contains("${text}")`);
  }

// Assertions
  _assertPresent(rawSelector, bool, message = '') {
    return this.andThen(() => {
      message = message || `element with selector: '${this.bridge.defaultSelector(rawSelector)}' ${bool ? 'is' : 'is not'} present`;
      this.assert.equal(!!this.find(rawSelector).length, bool, message);
    });
  }

  _assertHasClass(rawSelector, className, bool, message = '') {
    return this.andThen(() => {
      message = message || `element with selector: '${this.bridge.defaultSelector(rawSelector)}' ${bool ? 'has' : 'does not have'} class: '${className}'`;
      this.assert.equal(this.find(rawSelector).hasClass(className), bool, message);
    });
  }

  _assertHasText(rawSelector, text, bool, message = '') {
    return this.andThen(() => {
      message = message || `element with selector: '${this.bridge.defaultSelector(rawSelector)}' containing text: '${text}' ${bool ? 'was found' : 'was not found'}`;
      this.assert.equal(!!this.find(rawSelector, `:contains(${text})`).length, bool, message);
    });
  }

  assertURL(url = '', message = '') {
    return this.andThen(() => {
      message = message || `current url is: '${url}'`;
      this.assert.equal(currentURL(), url, message);
    });
  }

  assertPresent(rawSelector = '', message = '') {
    return this._assertPresent(rawSelector, true, message);
  }

  assertNotPresent(rawSelector = '', message = '') {
    return this._assertPresent(rawSelector, false, message);
  }

  assertHasClass(rawSelector = '', className = '', message = '') {
    return this._assertHasClass(rawSelector, className, true, message);
  }

  assertNotHasClass(rawSelector = '', className = '', message = '') {
    return this._assertHasClass(rawSelector, className, false, message);
  }

  assertHasText(rawSelector = '', text = '', message = '') {
    return this._assertHasText(rawSelector, text, true, message);
  }

  assertNotHasText(rawSelector = '', text = '', message = '') {
    return this._assertHasText(rawSelector, text, false, message);
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

// Test Helpers
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

  url() {
    return '/';
  }
}
