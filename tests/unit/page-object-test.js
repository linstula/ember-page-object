import { module, test } from 'qunit';
import PageObject from 'ember-page-object';
import sinon from 'sinon';

let sandbox;

module('Unit | PageObject', {
  beforeEach(assert) {
    sandbox = sinon.sandbox.create();

    // sinon doesn't let you stub functions that are not pre-existing
    // so we're creating placeholder functions so they can be stubbed in tests.
    window.andThen = () => {};
    window.fillIn = () => {};
    window.click = () => {};
    window.find = () => {};

    sandbox.stub(window, 'andThen', (callback) => {
      assert.ok(true, 'andThen was called');
      callback();
    });
  },

  afterEach() {
    window.andThen = undefined;
    window.fillIn = undefined;
    window.click = undefined;
    window.find = undefined;
    sandbox.restore();
  }
});

test('fillInInput gets a selector via bridge.inputSelector and delegates to the fillIn testHelper', function(assert) {
  assert.expect(4);

  sandbox.stub(window, 'fillIn', (selector, value) => {
    assert.equal(selector, 'processed-selector', 'fillIn was called with the selector returned from bridge.inputSelector');
    assert.equal(value, 'foobar', 'fillIn was called with the correct value');
  });

  const bridge = {
    inputSelector(rawSelector) {
      assert.equal(rawSelector, 'raw-selector', 'bridge.inputSelector was called with the raw selector');
      return 'processed-selector';
    }
  };

  const pageObject = new PageObject({ bridge });

  pageObject.fillInInput('raw-selector', 'foobar');
});

test('click gets a selector via bridge.defaultSelector and delegates to the click testHelper', function(assert) {
  assert.expect(3);

  const passedArgs = ['foo', 'bar', 'baz'];

  const bridge = {
    defaultSelector(...args) {
      assert.deepEqual(args, passedArgs, 'bridge.defaultSelector was called, with the arguments passed to click');
      return 'processed-selector';
    }
  };

  const pageObject = new PageObject({ bridge });

  sandbox.stub(window, 'click', (selector) => {
    assert.equal(selector, 'processed-selector', 'click was called with the selector returned from bridge.defaultSelector');
  });

  pageObject.click(...passedArgs);
});

test('clickButton gets a selector via bridge.buttonSelector and delegates to the click testHelper', function(assert) {
  assert.expect(3);

  const passedArgs = ['foo', 'bar', 'baz'];

  const bridge = {
    buttonSelector(...args) {
      assert.deepEqual(args, passedArgs, 'bridge.buttonSelector was called, with the arguments passed to clickButton');
      return 'processed-selector';
    }
  };

  const pageObject = new PageObject({ bridge });

  sandbox.stub(window, 'click', (selector) => {
    assert.equal(selector, 'processed-selector', 'click was called with the selector returned from bridge.buttonSelector');
  });

  pageObject.clickButton(...passedArgs);
});

test('clickLink gets a selector via bridge.linkSelector and delegates to the click testHelper', function(assert) {
  assert.expect(3);

  const passedArgs = ['foo', 'bar', 'baz'];

  const bridge = {
    linkSelector(...args) {
      assert.deepEqual(args, passedArgs, 'bridge.linkSelector was called, with the arguments passed to clickLink');
      return 'processed-selector';
    }
  };

  const pageObject = new PageObject({ bridge });

  sandbox.stub(window, 'click', (selector) => {
    assert.equal(selector, 'processed-selector', 'click was called with the selector returned from bridge.linkSelector');
  });

  pageObject.clickLink(...passedArgs);
});

test('find gets a selector via bridge.defaultSelector and delegates delegates to the click testHelper', function(assert) {
  assert.expect(2);

  const passedArgs = ['foo', 'bar', 'baz'];

  const bridge = {
    defaultSelector(...args) {
      assert.deepEqual(args, passedArgs, 'bridge.defaultSelector was called, with the arguments passed to find');
      return 'processed-selector';
    }
  };

  const pageObject = new PageObject({ bridge });

  sandbox.stub(window, 'find', (selector) => {
    assert.equal(selector, 'processed-selector', 'find was called with the selector returned from bridge.defaultSelector');
  });

  pageObject.find(...passedArgs);
});

test('prepareResponse creates a response stub on the server object', function(assert) {
  assert.expect(3);

  const responseOptions = {
    method: 'POST',
    response: { data: {} },
    status: 404,
    headers: { 'Content-Type': 'foobar' }
  };

  const server = {
    post(path, responseCallback) {
      assert.equal(path, '/some-path', 'server response constructor was called with the correct path');

      const expectedResponse = [responseOptions.status, responseOptions.headers, JSON.stringify(responseOptions.response)];
      assert.deepEqual(responseCallback(), expectedResponse, 'response callback returns the correctly formatted response');
    }
  };

  const pageObject = new PageObject({ server });

  pageObject.prepareResponse('/some-path', responseOptions);
});

test('prepareResponse sets defaults for method, status, and headers', function(assert) {
  assert.expect(4);

  const responseOptions = {
    response: { data: {} }
  };

  const server = {
    get(path, responseCallback) {
      assert.ok(true, 'default request method is set to `get`');
      assert.equal(path, '/some-path', 'server response constructor was called with the correct path');
      const expectedResponse = [200, { 'Content-Type': 'application/vnd.api+json' }, JSON.stringify(responseOptions.response)];
      assert.deepEqual(responseCallback(), expectedResponse, 'response callback returns the default response');
    }
  };

  const pageObject = new PageObject({ server });

  pageObject.prepareResponse('/some-path', responseOptions);
});
