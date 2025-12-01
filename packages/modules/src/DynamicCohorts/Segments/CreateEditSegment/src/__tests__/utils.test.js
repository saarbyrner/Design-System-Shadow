import { labels as mockLabels } from '@kitman/services/src/mocks/handlers/OrganisationSettings/DynamicCohorts/Labels/getAllLabels';
import { mapExpressionToLabels, createLabelExpression } from '../utils';

describe('utils', () => {
  const exampleExpression = {
    operator: 'and',
    operands: mockLabels.map(({ name }) => ({
      operator: 'contains',
      path: 'athlete/labels',
      value: name,
    })),
  };

  const labelNames = mockLabels.map(({ name }) => name);
  describe('mapExpressionToLabels', () => {
    it('maps a list of expressions correctly to the label names', () => {
      const result = mapExpressionToLabels(exampleExpression);
      expect(result).toEqual(labelNames);
    });
  });

  describe('createLabelExpression', () => {
    it('correctly builds the expression from the label names', () => {
      const result = createLabelExpression(labelNames);
      expect(result).toEqual(exampleExpression);
    });
  });
});
