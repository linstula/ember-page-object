# Ember-page-object [![npm version](https://badge.fury.io/js/ember-page-object.svg)](http://badge.fury.io/js/ember-page-object) [![Build Status](https://travis-ci.org/linstula/ember-page-object.svg?branch=master)](https://travis-ci.org/linstula/ember-page-object)

A base Page Object class with helper functions and generators to help implement the Page Object pattern for your tests.
Option to run assertions in your Page Objects.

* [Usage](#usage)
* [Helpers](#helpers)

## Usage
```sh
ember install ember-page-object
ember generate page-object signup
```

Generated Page Object:

```js
// tests/page-objects/signup.js

import PageObject from 'ember-page-object';

export default class SignupPage extends PageObject {
}
```

### Customizing your Page Object
The base Page Object wraps several of Ember's [acceptance test helpers](http://guides.emberjs.com/v2.1.0/testing/acceptance/#toc_test-helpers), allowing for function chaining.
It also provides some of it's own helper functions which are documented [here](#helpers).
To flesh out your page object, extend the base Page Object and use the built in helpers.

```js
// tests/page-objects/signup.js

import PageObject from 'ember-page-object';

export default class SignupPage extends PageObject {
  fillInEmail(text) {
    return this.fillIn('#email', text);
  }

  fillInPassword(text) {
    return this.fillIn('#password', text);
  }

  clickSignUp() {
    return this.click('#sign-up');
  }
}
```

```js
// tests/acceptance/signup-test.js
import SignupPage from '../page-objects/signup';

// other test code

test('user can sign up', function(assert) {
  assert.expect(1);

  new SignupPage({ assert })
    .visit('/signup')
    .fillInEmail('email@example.com')
    .fillInPassword('password')
    .clickSignUp()
    .assertURL('/profile', 'user is redirected to their profile after signup');
});
```

## Helpers
Page Objects extending from the base PageObject have access to a number of helper functions.
All functions return the page object instance to allow function chaining.

[Wrapped Test Helpers](#wrapped-test-helpers)
* [andThen()](#andthen)
* [click()](#click)
* [fillIn()](#fillin)

[Assertions](#assertions)
* [assertURL()](#asserturl)
* [assertHasClass()](#asserthasclass)
* [assertNotHasClass()](#assertnothasclass)
* [assertHasText()](#asserthastext)
* [assertNotHasText()](#assertnothastext)
* [assertPresent()](#assertpresent)
* [assertNotPresent()](#assertnotpresent)

[Debugging](#debugging)
* [embiggen()](#embiggen)
* [debug()](#debug)
* [pause()](#pause)


## Wrapped Test Helpers
### andThen()
`andThen(callback)`

Wraps Ember's [andThen()](http://guides.emberjs.com/v2.1.0/testing/acceptance/#toc_wait-helpers) test helper.

```js
export default class SignupPage extends PageObject {
  assertSignupFailure(errorMessage) {
    return this.andThen(() => {
      this.assertHasText('.flash-warning', errorMessage);
      this.assertURL('/signup');
    });
  }
}
```

### click()
`click(selector = '')`

Wraps Ember's [click()](http://emberjs.com/api/classes/Ember.Test.html#method_click) test helper.

```js
export default class SignupPage extends PageObject {
  clickSignUp() {
    return this.click('#sign-up');
  }
}
```

### fillIn()
`fillIn(selector = '', text = '')`

Wraps Ember's [fillIn()](http://emberjs.com/api/classes/Ember.Test.html#method_fillIn) test helper.

```js
export default class SignupPage extends PageObject {
  fillInEmail(text) {
    return this.fillIn('#email', text);
  }
}
```

## Assertions
### assertURL()
`assertURL(url = '', message = '')`

Asserts that the passed in url is the current url. Accepts an optional assertion message.

```js
test('"/profile" redirects to "/sign-in" when user is not signed in', function(assert) {
  assert.expect(1);

  new ProfilePage({ assert })
    .visit('/profile')
    .assertURL('/sign-in', 'user is redirected to "/sign-in"');
});
```

### assertHasClass()
`assertHasClass(selector = '', class = '', message = '')`

Asserts the element matching the selector has the passed in class. Accepts an optional assertion message.

```js
export default class SignupPage extends PageObject {
  assertInvalidEmail() {
    return this.assertHasClass('#email', '.is-invalid');
  }
}
```

### assertNotHasClass()
`assertNotHasClass(selector = '', class = '', message = '')`

Asserts the element matching the selector does not have the passed in class. Accepts an optional assertion message.

```js
export default class SignupPage extends PageObject {
  assertSubmitEnabled() {
    return this.assertNotHasClass('#submit-button', '.disabled');
  }
}
```

### assertHasText()
`assertHasText(selector = '', text = '', message = '')`

Asserts the element matching the selector contains the passed in text. Accepts an optional assertion message.

```js
export default class SignupPage extends PageObject {
  assertFlashMessage(text) {
    return this.assertHasText('.flash', text, `flash message with text: ${text} is displayed`);
  }
}
```

### assertNotHasText()
`assertNotHasText(selector = '', text = '', message = '')`

Asserts the element matching the selector does not contain the passed in text. Accepts an optional assertion message.

```js
export default class SignupPage extends PageObject {
  assertNotAdminUI() {
    return this.assertNotHasText('.banner', 'Admin', 'admin UI is not visible');
  }
}
```

### assertPresent()
`assertPresent(selector = '', message = '')`

Asserts an element matching the selector can be found. Accepts an optional assertion message.

```js
export default class SignupPage extends PageObject {
  assertSignedOutNav() {
    return this.assertPresent('.nav .sign-in-button', 'nav bar displays sign in button');
  }
}
```

### assertNotPresent()
`assertNotPresent(selector = '', message = '')`

Asserts an element matching the selector is not found. Accepts an optional assertion message.

```js
export default class SignupPage extends PageObject {
  assertSignedInNav() {
    return this.assertNotPresent('.nav .sign-in-button', 'nav bar does not display sign in button');
  }
}
```

## Debugging
### embiggen()
`embiggen()`

Embiggens the testing container for easier inspection.

```js
test('a test that is being debugged', function(assert) {
  assert.expect(1);

  new PageObject({ assert })
    .visit('/')
    .doStuff()
    .embiggen()
    .pause()
    .breakingCode()
});
```

### debugger()
`debugger()`

Throws a breakpoint via debugger within a PageObject chain.

```js
test('a test that is being debugged', function(assert) {
  assert.expect(1);

  new PageObject({ assert })
    .visit('/')
    .doStuff()
    .debugger()
    .breakingCode()
});
```

### pause()
`pause()`

Pauses a test so you can look around within a PageObject chain.

```js
test('a test that is being debugged', function(assert) {
  assert.expect(1);

  new PageObject({ assert })
    .visit('/')
    .doStuff()
    .embiggen()
    .pause()
    .breakingCode()
});
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
