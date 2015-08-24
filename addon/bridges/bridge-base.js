import Ember from 'ember';

const { assert: emberAssert, typeOf } = Ember;

export default class Bridge {
  constructor(...args) {
    const methodsToEnforce = [ 'defaultSelectorFor', 'buttonSelector', 'linkSelector', 'inputSelector' ];

    for (let argName in args) {
      this[argName] = args[argName];
    }

    methodsToEnforce.forEach(this._enforce);
  }

  _enforce(methodName) {
    const hasMethod = typeOf(this[methodName]) === 'function';

    emberAssert(hasMethod, `You must implement a ${methodName} function on your interaction bridge.`);
  }
}
