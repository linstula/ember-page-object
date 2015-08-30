import Ember from 'ember';

const { keys } = Object;
const { assert: emberAssert, typeOf } = Ember;

export default class Bridge {
  constructor(properties = {}) {
    const methodsToEnforce = [ 'defaultSelector', 'buttonSelector', 'linkSelector', 'inputSelector' ];
    const propertyNames = keys(properties);

    propertyNames.forEach((propertyName) => {
      this[propertyName] = properties[propertyName];
    });

    methodsToEnforce.forEach((methodName) => {
      this._enforce(methodName);
    });
  }

  _enforce(methodName) {
    const hasMethod = typeOf(this[methodName]) === 'function';

    emberAssert(`You must implement a ${methodName} function on your interaction bridge.`, hasMethod);
  }
}
