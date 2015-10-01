# Ember-page-object [![npm version](https://badge.fury.io/js/ember-page-object.svg)](http://badge.fury.io/js/ember-page-object) [![Build Status](https://travis-ci.org/linstula/ember-page-object.svg?branch=master)](https://travis-ci.org/linstula/ember-page-object)

A base Page Object class with helper functions and generators to help implement the Page Object pattern for your tests.
Built in support for using data attributes to target elements during tests.
Option to run assertions in your Page Objects.

## Usage
```sh
ember install ember-page-object
ember generate page-object post
```

Generated Page Object:

```js
// tests/page-objects/post.js

import PageObject from 'ember-page-object';

export default class PostPage extends PageObject {
}
```

### Customizing your Page Object
The base Page Object wraps many of Ember's [acceptance test helpers](), allowing for function chaining and customizations via [interaction bridges]().
To flesh out your page object, extend the base Page Object and use the wrapped helper functions.
You can find the fully documented list of helpers [here]().

By default, the base Page Object uses the DataAttribute interaction bridge.
This means that the helper functions will target elements with the specified data attribute (default data attribute is `data-test-selector`).
`PageObject.find('blog-post')` would delegate to Ember's `find` test helper: `find('[data-test-selector="blog-post"]')`.

```js
// tests/page-objects/post.js

import PageObject from 'ember-page-object';

export default class PostPage extends PageObject {
  visit(id) {
    visit(`posts/${id}`)
    return this;
  }

  fillInComment(text) {
    return this.fillIn('post-comment-input', text);
  }

  clickCommentButton() {
    return this.click('post-comment-button');
  }

  assertCommentVisible(text) {
    return this.andThen(() => {
      this.assert.equal(this.find('post-comment', ':contains("great post!")').length, 1, `post with text: ${text} is visible`);
    });
  }
}
```

### Test

```js
import PostPage from '../page-objects/post'; // adjust path based on nested depth of test

// other test code

test('user can comment on a blog post', function(assert) {
  assert.expect(1);

  new PostPage({ assert })
    .visit(1)
    .fillInComment('great post!')
    .clickCommentButton()
    .assertCommentVisible('great post!');
});
```

## Interaction Bridges
Each app has it's own defaults for how it finds elements to interact with during tests.
These defaults are specified in an interaction bridge.
The Page Object will defer to the interaction bridge to build the selector for a given interaction.
The intent behind having an interaction bridge is to decouple a desired action (`find`, `click`, `fillIn`) with the details of how that action is performed.
The arguments for each Page Object interaction helper will be passed to the bridge to be turned into a selector which is passed to the corresponding Ember test helper.

### DataAttribute Interaction Bridge
The default interaction bridge used by the base Page Object is the DataAttribute bridge.
The DataAttribute bridge expects that you have added a [data attrbiute](https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/Using_data_attributes) to elements that will be interacted with during tests.
Using data attributes to target elements during tests allows for more robust acceptance tests.
For a more detailed discussion, see [this post](https://dockyard.com/blog/2015/09/25/ember-best-practices-acceptance-tests).

### Extending Ember Helpers for Data Attributes
Ember's template helpers, like the `{{link-to}}` and `{{input}}` helpers, don't bind to data attributes by default.
If you want to add data attributes to these helpers so they can be targeted with the DataAttribute bridge, you can extend them:

```js
// ext/data-attribute.js

import Ember from 'ember';
const attributeName = 'data-test-selector';

Ember.LinkComponent.reopen({
  attributeBindings: [attributeName]
});

Ember.TextField.reopen({
  attributeBindings: [attributeName]
});

Ember.TextArea.reopen({
  attributeBindings: [attributeName]
});

Ember.Checkbox.reopen({
  attributeBindings: [attributeName]
});
```

Then import your extension file into your app.js
```js
// app/app.js

import Ember from 'ember';
import Resolver from 'ember/resolver';
import loadInitializers from 'ember/load-initializers';
import config from './config/environment';
import './ext/data-attribute'; // add data-test-selector attribute binding to ember components

// code
```

### Custom Bridges
If you don't want to use data attributes to target elements, you can create a custom interaction bridge.
The bridge must implement 4 functions: `defaultSelector` `buttonSelector` `linkSelector` `inputSelector`.
These bridges will receive the arguments passed into the Page Object interaction helpers and should return a jquery selector that will be passed to Ember's test helpers.
See the implementation for the DataAttribute bridge for an example bridge.

```js
// tests/bridges/my-custom-bridge

import BridgeBase from './bridge-base';

export default class MyCustomBridge extends BridgeBase {
  defaultSelector(value = '', filter = '') {
    return `[${this.attributeName}="${value}"]${filter}`;
  }

  buttonSelector(value = '', filter = '') {
    return this._selectorFor('button', value, filter);
  }

  linkSelector(value = '', filter = '') {
    return this._selectorFor('a', value, filter);
  }

  inputSelector(value = '', filter = '') {
    return this._selectorFor('input', value, filter);
  }

  _selectorFor(tagName, value = '', filter = '') {
    return `${tagName}${this.defaultSelector(value, filter)}`;
  }
}
```

## Installation

* `git clone` this repository
* `npm install`
* `bower install`

## Running

* `ember server`
* Visit your app at http://localhost:4200.

## Running Tests

* `ember test`
* `ember test --server`

## Building

* `ember build`

For more information on using ember-cli, visit [http://www.ember-cli.com/](http://www.ember-cli.com/).
