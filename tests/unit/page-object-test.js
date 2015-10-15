import { module, test } from 'qunit';
import PageObject from '../page-object';
import sinon from 'sinon';

let sandbox;

module('Unit | PageObject', {
  beforeEach(assert) {
    sandbox = sinon.sandbox.create();

    // sinon doesn't let you stub functions that are not pre-existing
    // so we're creating placeholder functions so they can be stubbed in tests.
    window.visit = () => {};
    window.andThen = () => {};
    window.fillIn = () => {};
    window.click = () => {};
    window.find = () => {};
    window.currentURL = () => {};

    sandbox.stub(window, 'andThen', (callback) => {
      assert.ok(true, 'andThen was called');
      callback();
    });
  },

  afterEach() {
    window.visit = undefined;
    window.andThen = undefined;
    window.fillIn = undefined;
    window.click = undefined;
    window.find = undefined;
    window.currentURL = undefined;
    sandbox.restore();
  }
});

test('visit delegates to the visit test helper', function(assert) {
  assert.expect(1);

  sandbox.stub(window, 'visit', (url) => {
    assert.equal(url, '/some-url', 'visit was called with the correct url');
  });

  const pageObject = new PageObject();

  pageObject.visit('/some-url');
});

test('toSelector returns the passed in selector by default', function(assert) {
  assert.expect(1);

  const pageObject = new PageObject();

  assert.equal(pageObject.toSelector('raw-selector'), 'raw-selector', 'does not modify the passed in selector by default');
});

test('fillIn returns the pageObject instance', function(assert) {
  assert.expect(2);

  sandbox.stub(window, 'fillIn', () => {});

  const pageObject = new PageObject();

  assert.equal(pageObject.fillIn('raw-selector', 'foobar'), pageObject, 'returns the pageObject instance');
});

test('fillIn gets a selector via toSelector', function(assert) {
  assert.expect(2);

  sandbox.stub(window, 'fillIn', () => {});

  const pageObject = new PageObject();

  pageObject.toSelector = function() {
    assert.ok(true, 'toSelector was called');
  };

  pageObject.fillIn('raw-selector', 'foobar');
});

test('fillIn delegates to the fillIn test helper', function(assert) {
  assert.expect(4);

  sandbox.stub(window, 'fillIn', (selector, context, text) => {
    assert.equal(selector, 'some-selector', 'fillIn was called with correct selector');
    assert.equal(context, undefined, 'no context was passed in');
    assert.equal(text, 'foobar', 'fillIn was called with the correct text');
  });

  const pageObject = new PageObject();

  pageObject.fillIn('some-selector', 'foobar');
});

test('fillIn correctly delegates to the fillIn test helper when a context is passed in', function(assert) {
  assert.expect(4);

  sandbox.stub(window, 'fillIn', (selector, context, text) => {
    assert.equal(selector, 'some-selector', 'fillIn was called with correct selector');
    assert.equal(context, 'some-context', 'fillIn was called with the correct context');
    assert.equal(text, 'foobar', 'fillIn was called with the correct text');
  });

  const pageObject = new PageObject();

  pageObject.fillIn('some-selector', 'some-context', 'foobar');
});

test('fillIn accepts a callback and passes in the targeted element', function(assert) {
  assert.expect(7);

  const fakeJQueryCollection = ['some-element'];

  sandbox.stub(window, 'fillIn', (selector, context, text) => {
    assert.equal(selector, 'some-selector', 'fillIn was called with correct selector');
    assert.equal(context, 'some-context', 'fillIn was called with the correct context');
    assert.equal(text, 'foobar', 'fillIn was called with the correct text');
  });

  sandbox.stub(window, 'find', (selector, context) => {
    assert.equal(selector, 'some-selector', 'find was called passing in the selector');
    assert.equal(context, 'some-context', 'find was called with the correct context');

    return fakeJQueryCollection;
  });

  const pageObject = new PageObject();
  const callback = function($el) {
    assert.equal($el, fakeJQueryCollection, 'callback was called passing in the targeted element');
  };

  pageObject.fillIn('some-selector', 'some-context', 'foobar', callback);
});

test('fillIn accepts a callback without passing in a context', function(assert) {
  assert.expect(7);

  const fakeJQueryCollection = ['some-element'];

  sandbox.stub(window, 'fillIn', (selector, context, text) => {
    assert.equal(selector, 'some-selector', 'fillIn was called with correct selector');
    assert.equal(context, undefined, 'no context is passed in');
    assert.equal(text, 'foobar', 'fillIn was called with the correct text');
  });

  sandbox.stub(window, 'find', (selector, context) => {
    assert.equal(selector, 'some-selector', 'find was called passing in the selector');
    assert.equal(context, undefined, 'no context is passed in');

    return fakeJQueryCollection;
  });

  const pageObject = new PageObject();
  const callback = function($el) {
    assert.equal($el, fakeJQueryCollection, 'callback was called passing in the targeted element');
  };

  pageObject.fillIn('some-selector', 'foobar', callback);
});

test('click returns the pageObject instance', function(assert) {
  assert.expect(2);

  sandbox.stub(window, 'click', () => {});

  const pageObject = new PageObject();

  assert.equal(pageObject.click('some-selector'), pageObject, 'returns the pageObject instance');
});

test('click gets a selector via toSelector', function(assert) {
  assert.expect(2);

  sandbox.stub(window, 'click', () => {});

  const pageObject = new PageObject();

  pageObject.toSelector = function() {
    assert.ok(true, 'toSelector was called');
  };

  pageObject.click('some-selector');
});

test('click delegates to the click test helper', function(assert) {
  assert.expect(2);

  sandbox.stub(window, 'click', (selector) => {
    assert.equal(selector, 'some-selector', 'click was called with correct selector');
  });

  const pageObject = new PageObject();

  pageObject.click('some-selector');
});

test('click correctly delegates to the click test helper when a context is passed in', function(assert) {
  assert.expect(3);

  sandbox.stub(window, 'click', (selector, context) => {
    assert.equal(selector, 'some-selector', 'fillIn was called with correct selector');
    assert.equal(context, 'some-context', 'fillIn was called with the correct context');
  });

  const pageObject = new PageObject();

  pageObject.click('some-selector', 'some-context');
});

test('find gets a selector via toSelector', function(assert) {
  assert.expect(1);

  sandbox.stub(window, 'find', () => {});

  const pageObject = new PageObject();

  pageObject.toSelector = function() {
    assert.ok(true, 'toSelector was called');
  };

  pageObject.find('some-selector');
});

test('find delegates to the find test helper', function(assert) {
  assert.expect(1);

  sandbox.stub(window, 'find', (selector) => {
    assert.equal(selector, 'some-selector', 'find was called with correct selector');
  });

  const pageObject = new PageObject();

  pageObject.find('some-selector');
});

test('find correctly delegates to the find test helper when a context is passed in', function(assert) {
  assert.expect(2);

  sandbox.stub(window, 'find', (selector, context) => {
    assert.equal(selector, 'some-selector', 'find was called with correct selector');
    assert.equal(context, 'some-context', 'find was called with the correct context');
  });

  const pageObject = new PageObject();

  pageObject.find('some-selector', 'some-context');
});

test('clickByText defers to click, passing in the value of toSelector that has a `:contains` modifier', function(assert) {
  assert.expect(1);

  const processedSelector = 'processed-selector';

  sandbox.stub(window, 'click', (selector) => {
    assert.equal(selector, `${processedSelector}:contains("some text")`, 'click was called with selector returned from toSelector with a `:contains` modifier');
  });

  const pageObject = new PageObject();
  pageObject.toSelector = function() {
    return processedSelector;
  };

  pageObject.clickByText('some-selector', 'some text');
});

test('clickByText correctly handles passing in a context', function(assert) {
  assert.expect(2);

  const processedSelector = 'processed-selector';

  sandbox.stub(window, 'click', (selector, context) => {
    assert.equal(selector, `${processedSelector}:contains("some text")`, 'click was called with selector returned from toSelector with a `:contains` modifier');
    assert.equal(context, 'some-context', 'click was called with the correct context');
  });

  const pageObject = new PageObject();
  pageObject.toSelector = function() {
    return processedSelector;
  };

  pageObject.clickByText('some-selector', 'some-context', 'some text');
});

test('findByText defers to find, passing in the value of toSelector that has a `:contains` modifier', function(assert) {
  assert.expect(1);

  const processedSelector = 'processed-selector';

  sandbox.stub(window, 'find', (selector) => {
    assert.equal(selector, `${processedSelector}:contains("some text")`, 'find was called with selector returned from toSelector with a `:contains` modifier');
  });

  const pageObject = new PageObject();
  pageObject.toSelector = function() {
    return processedSelector;
  };

  pageObject.findByText('some-selector', 'some text');
});

test('findByText correctly handles passing in a context', function(assert) {
  assert.expect(2);

  const processedSelector = 'processed-selector';

  sandbox.stub(window, 'find', (selector, context) => {
    assert.equal(selector, `${processedSelector}:contains("some text")`, 'click was called with selector returned from toSelector with a `:contains` modifier');
    assert.equal(context, 'some-context', 'find was called with the correct context');
  });

  const pageObject = new PageObject();
  pageObject.toSelector = function() {
    return processedSelector;
  };

  pageObject.findByText('some-selector', 'some-context', 'some text');
});

test('assertURL calls `assert.equal` passing in currentURL, expectedURL, and an optional message', function(assert) {
  assert.expect(4);

  sandbox.stub(window, 'currentURL', () => {
    return '/current-url';
  });

  const mockAssert = {
    equal(actual, expected, message) {
      assert.equal(actual, '/current-url', 'passes in value of currentURL as the actual value');
      assert.equal(expected, '/expected-url', 'passes in value of expectedURL as the expected value');
      assert.equal(message, 'some message', 'passes in an optional message');
    }
  };

  const pageObject = new PageObject({ assert: mockAssert });

  pageObject.assertURL('/expected-url', 'some message');
});

test('assertPresent calls `assert.equal` passing a boolean representing whether the element was found', function(assert) {
  assert.expect(4);

  sandbox.stub(window, 'find', () => {
    return []; // no elements were found with selector
  });

  const mockAssert = {
    equal(actual, expected, message) {
      assert.equal(actual, false, 'passes in a bool representing whether the selector was present');
      assert.equal(expected, true, 'passes in a bool representing that the selector is expected to be present');
      assert.equal(message, 'some message', 'passes in an optional message');
    }
  };

  const pageObject = new PageObject({ assert: mockAssert });

  pageObject.assertPresent('some-selector', 'some message');
});

test('assertNotPresent calls `assert.equal` passing a boolean representing whether the element was found', function(assert) {
  assert.expect(4);

  sandbox.stub(window, 'find', () => {
    return []; // no elements were found with selector
  });

  const mockAssert = {
    equal(actual, expected, message) {
      assert.equal(actual, false, 'passes in a bool representing whether the selector was present');
      assert.equal(expected, false, 'passes in a bool representing that the selector is not expected to be present');
      assert.equal(message, 'some message', 'passes in an optional message');
    }
  };

  const pageObject = new PageObject({ assert: mockAssert });

  pageObject.assertNotPresent('some-selector', 'some message');
});

test('assertHasClass calls `assert.equal` passing in whether or not the element has the passed in class', function(assert) {
  assert.expect(5);

  sandbox.stub(window, 'find', () => {
    const fakeElement = {
      hasClass(className) {
        assert.equal(className, 'some-class', 'hasClass was called on the return value of find, passing in the correct class name');
        return false;
      }
    };

    return fakeElement;
  });

  const mockAssert = {
    equal(actual, expected, message) {
      assert.equal(actual, false, 'passed in the result of calling hasClass on the return value of find');
      assert.equal(expected, true, 'passes in a bool representing that the element is expected to have the class');
      assert.equal(message, 'some message', 'passes in an optional message');
    }
  };

  const pageObject = new PageObject({ assert: mockAssert });

  pageObject.assertHasClass('some-selector', 'some-class', 'some message');
});

test('assertNotHasClass calls `assert.equal` passing in whether or not the element has the passed in class', function(assert) {
  assert.expect(5);

  sandbox.stub(window, 'find', () => {
    const fakeElement = {
      hasClass(className) {
        assert.equal(className, 'some-class', 'hasClass was called on the return value of find, passing in the correct class name');
        return false;
      }
    };

    return fakeElement;
  });

  const mockAssert = {
    equal(actual, expected, message) {
      assert.equal(actual, false, 'passed in the result of calling hasClass on the return value of find');
      assert.equal(expected, false, 'passes in a bool representing that the element is expected to not have the class');
      assert.equal(message, 'some message', 'passes in an optional message');
    }
  };

  const pageObject = new PageObject({ assert: mockAssert });

  pageObject.assertNotHasClass('some-selector', 'some-class', 'some message');
});

test('assertHasText calls `assert.equal` passing in whether or not the element has the passed in text', function(assert) {
  assert.expect(5);

  sandbox.stub(window, 'find', () => {
    const fakeElement = {
      text() {
        assert.ok(true, 'text was called on the element returned from find');
        return 'This is the element text!';
      }
    };

    return fakeElement;
  });

  const mockAssert = {
    equal(actual, expected, message) {
      assert.equal(actual, true, 'passed in a bool representing whether or not the element contained the passed in text');
      assert.equal(expected, true, 'passes in a bool representing that the element is expected to have the passed in text');
      assert.equal(message, 'some message', 'passes in an optional message');
    }
  };

  const pageObject = new PageObject({ assert: mockAssert });

  pageObject.assertHasText('some-selector', 'This is the element text!', 'some message');
});

test('assertNotHasText calls `assert.equal` passing in whether or not the element has the passed in text', function(assert) {
  assert.expect(5);

  sandbox.stub(window, 'find', () => {
    const fakeElement = {
      text() {
        assert.ok(true, 'text was called on the element returned from find');
        return 'This is the element text!';
      }
    };

    return fakeElement;
  });

  const mockAssert = {
    equal(actual, expected, message) {
      assert.equal(actual, false, 'passed in a bool representing whether or not the element contained the passed in text');
      assert.equal(expected, false, 'passes in a bool representing that the element is expected to not have the passed in text');
      assert.equal(message, 'some message', 'passes in an optional message');
    }
  };

  const pageObject = new PageObject({ assert: mockAssert });

  pageObject.assertNotHasText('some-selector', 'the element doesnt have this text', 'some message');
});
