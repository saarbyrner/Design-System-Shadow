// @flow
import type { ConditionType } from '@kitman/modules/src/HumanInput/types/forms';

export const operators: { [key: ConditionType]: Function } = {
  '!=': (a, b) => a !== b,
  '==': (a, b) => a === b,
  '<=': (a, b) => a <= b,
  '<': (a, b) => a < b,
  '>': (a, b) => a > b,
  '>=': (a, b) => a >= b,
  and: (a, b) => !!a && !!b,
  or: (a, b) => !!a || !!b,
  not: (a, b) => !(!!a || !!b),
  in: (a, b) => Array.isArray(b) && b.includes(a),
};

export const evaluateCondition = ({
  operator,
  variableA,
  variableB,
}: {
  operator: ConditionType,
  variableA: any,
  variableB: any,
}): boolean => {
  return operator ? operators[operator](variableA, variableB) : true;
};
