// @flow
import type { Predicate } from '@kitman/modules/src/ConditionalFields/shared/types/index';

export const mapExpressionToLabels = (
  expressionInput: ?Predicate
): ?Array<string> => {
  return expressionInput?.operands.map((operand) => operand.value);
};

export const createLabelExpression = (
  labelSelections: Array<string>
): Predicate => {
  return {
    operator: 'and',
    operands: labelSelections.map((selectedLabelName) => ({
      operator: 'contains',
      path: 'athlete/labels',
      value: selectedLabelName,
    })),
  };
};
