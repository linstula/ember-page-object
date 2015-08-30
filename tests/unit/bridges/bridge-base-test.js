import { module, test } from 'qunit';
import BridgeBase from 'ember-page-object/bridges/bridge-base';

let defaultProperties, requiredFunctions;

module('Unit | Bridge | bridge-base', {
  beforeEach() {
    requiredFunctions = [ 'defaultSelector', 'buttonSelector', 'linkSelector', 'inputSelector' ];
    defaultProperties = {};

    requiredFunctions.forEach((functionName) => {
      defaultProperties[functionName] = function() {};
    });
  },

  afterEach() {
    defaultProperties = null;
    requiredFunctions = null;
  }
});

test('throws an error if one of the required functions is not implemented', function(assert) {
  assert.expect(requiredFunctions.length);

  requiredFunctions.forEach((functionName, index) => {
    const functions = requiredFunctions.slice(0);
    functions.splice(index, 1);
    const properties = {};

    functions.forEach((func) => {
      properties[func] = function() {};
    });

    assert.throws(() => {
      new BridgeBase(properties);
    },
    Error(`Assertion Failed: You must implement a ${functionName} function on your interaction bridge.`),
    `throws if a ${functionName} function is not implemented`);
  });
});

test('sets properties on itself based on the options passed in', function(assert) {
  assert.expect(2);

  defaultProperties.foo = 'bar';
  defaultProperties.baz = 'qux';

  const bridge = new BridgeBase(defaultProperties);

  assert.equal(bridge.foo, 'bar', 'foo property is set from options passed in');
  assert.equal(bridge.baz, 'qux', 'baz property is set from options passed in');
});
