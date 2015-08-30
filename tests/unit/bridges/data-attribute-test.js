import { module, test } from 'qunit';
import DataAttributeBridge from 'ember-page-object/bridges/data-attribute';

module('Unit | Bridge | data-attribute');

test('sets a default `attributeName` attribute of `data-test-selector`', function(assert) {
  assert.expect(1);

  const bridge = new DataAttributeBridge();

  assert.equal(bridge.attributeName, 'data-test-selector', 'attributeName is defaulted to `data-test-selector`');
});

test('a custom `attributeName` can be specified in an options hash passed to the DataAttributeBridge contructor', function(assert) {
  assert.expect(1);

  const bridge = new DataAttributeBridge({ attributeName: 'foo-bar' });

  assert.equal(bridge.attributeName, 'foo-bar', 'attributeName can be customized');
});

test('defaultSelector returns a selector for the value passed in', function(assert) {
  assert.expect(1);

  const bridge = new DataAttributeBridge();

  assert.equal(bridge.defaultSelector('foo-bar'), '[data-test-selector="foo-bar"]');
});

test('buttonSelector returns a selector for the value passed in', function(assert) {
  assert.expect(1);

  const bridge = new DataAttributeBridge();

  assert.equal(bridge.buttonSelector('foo-bar'), 'button[data-test-selector="foo-bar"]');
});

test('linkSelector returns a selector for the value passed in', function(assert) {
  assert.expect(1);

  const bridge = new DataAttributeBridge();

  assert.equal(bridge.linkSelector('foo-bar'), 'a[data-test-selector="foo-bar"]');
});

test('inputSelector returns a selector for the value passed in', function(assert) {
  assert.expect(1);

  const bridge = new DataAttributeBridge();

  assert.equal(bridge.inputSelector('foo-bar'), 'input[data-test-selector="foo-bar"]');
});
