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
