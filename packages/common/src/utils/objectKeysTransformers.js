// @flow
import { forEach, isPlainObject, snakeCase, camelCase } from 'lodash';

// getObjectKeysTransformer is a binary curried function which takes an object
// keys transformer as the argument and returns a function which expects an
// input object the keys of which need to be transformed. It returns a new
// object with all its and nested objects’ keys modified with the transformer.
//
// Flow doesn’t allow to type the function as a generic so everything is Object.
//
// Examples:
//
// const titleCase: (string) => string = ...
//
// const titleCased = getObjectKeysTransformer(titleCase)({...})
//
// const titleCasify = getObjectKeysTransformer(titleCase)
// const titleCased = titleCasify({...})
export const getObjectKeysTransformer = (
  transformer: (string) => string
): ((Object) => Object) => {
  const transform = (input: Object): Object => {
    const isArray = Array.isArray(input);
    let transformed: Object;
    if (isPlainObject(input)) {
      transformed = {};
    } else if (isArray) {
      transformed = [];
    } else {
      return input;
    }

    forEach(input, (v, k) => {
      let newV = v;
      if (isPlainObject(newV) || Array.isArray(newV)) {
        newV = transform(newV);
      }
      if (isArray) {
        transformed.push(newV);
      } else {
        // The check above guarantees it’s not an array so it’s fine to use
        // return values of transformer as keys.
        // $FlowIssue[incompatible-use]
        transformed[transformer(k)] = newV;
      }
    });
    return transformed;
  };
  return transform;
};

// camelCase doesn’t have tests because it’s a part of Lodash’s string case
// converter kit, each function of which is tested in the
// getObjectKeysTransformer’s tests.
export const getObjectWithKeysInCamelCase = getObjectKeysTransformer(camelCase);

// snakeCase doesn’t have tests because it’s a part of Lodash’s string case
// converter kit, each function of which is tested in the
// getObjectKeysTransformer’s tests.
export const getObjectWithKeysInSnakeCase = getObjectKeysTransformer(snakeCase);
