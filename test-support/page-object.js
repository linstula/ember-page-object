import replaceURLSegments from './ember-page-object/replace-url-segments';

export default class PageObject {
  constructor({ assert, application } = {}) {
    this.assert = assert;
    this.application = application;
  }

  toSelector(selector = '') {
    return selector;
  }

// Interactions
  /**
   * Visits a url. Accepts a url string or an object of url segment values that will be matched against the Page Object's `url()` function
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

  fillIn(rawSelector, contextOrText, text, callback) {
    return this.andThen(() => {
      let context;
      const selector = this.toSelector(rawSelector);

      if (typeof text === 'undefined') {
        text = contextOrText;
      } else if (typeof text === 'function') {
        callback = text;
        text = contextOrText;
      } else {
        context = contextOrText;
      }

      fillIn(selector, context, text);

      if (callback) {
        callback(find(selector, context));
      }
    });
  }

  click(rawSelector, context) {
    return this.andThen(() => {
      const selector = this.toSelector(rawSelector);

      click(selector, context);
    });
  }

  clickByText(rawSelector, context, text) {
    if (typeof text === 'undefined') {
      text = context;
      context = undefined;
    }

    click(`${this.toSelector(rawSelector)}:contains("${text}")`, context);
    return this;
  }

  find(rawSelector, context) {
    const selector = this.toSelector(rawSelector);
    return find(selector, context);
  }

  findByText(rawSelector, context, text) {
    if (typeof text === 'undefined') {
      text = context;
      context = undefined;
    }

    return find(`${this.toSelector(rawSelector)}:contains("${text}")`, context);
  }

// Assertions
  _assertPresent(rawSelector, bool, message = '') {
    return this.andThen(() => {
      message = message || `element with selector: '${this.toSelector(rawSelector)}' ${bool ? 'is' : 'is not'} present`;
      this.assert.equal(!!this.find(rawSelector).length, bool, message);
    });
  }

  _assertHasClass(rawSelector, className, bool, message = '') {
    return this.andThen(() => {
      message = message || `element with selector: '${this.toSelector(rawSelector)}' ${bool ? 'has' : 'does not have'} class: '${className}'`;
      this.assert.equal(this.find(rawSelector).hasClass(className), bool, message);
    });
  }

  _assertHasText(rawSelector, text, bool, message = '') {
    return this.andThen(() => {
      message = message || `element with selector: '${this.toSelector(rawSelector)}' containing text: '${text}' ${bool ? 'was found' : 'was not found'}`;
      const elementText = this.find(rawSelector).text();
      const hasText = elementText.indexOf(text) > -1;

      this.assert.equal(hasText, bool, message);
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

  andThen(callback) {
    const { assert } = this;

    andThen(() => {
      callback.call(this, assert);
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
