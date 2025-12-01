import {
  getTableWidgetConditions,
  getChartWidgetConditions,
  getWidgetConditions,
  getTableWidgetRules,
  getChartWidgetRules,
  getWidgetRules,
  isTableWidgetRuleSelectionValid,
  isChartWidgetRuleSelectionValid,
  isRuleSelectionValid,
} from '../utils';

describe('FormattingPanel utils', () => {
  describe('getWidgetRules', () => {
    it('returns rules for table widgets based on widget type', () => {
      const data = getTableWidgetRules();
      const result = getWidgetRules('COMPARISON');

      expect(result).toEqual(data);
    });

    it('returns rules for charts based on widget type', () => {
      const data = getChartWidgetRules();
      const result = getWidgetRules('xy');

      expect(result).toEqual(data);
    });
  });

  describe('getTableWidgetRules', () => {
    beforeEach(() => {
      window.setFlag('table-widget-availability-data-type', true);
    });

    it('returns correct rules when "table-widget-availability-data-type" is turned on', () => {
      const result = getTableWidgetRules();

      expect(result).toEqual([
        {
          value: 'numeric',
          label: 'Numeric',
        },
        {
          value: 'string',
          label: 'Text',
        },
      ]);
    });

    it('returns correct rules when "table-widget-availability-data-type" is turned off', () => {
      window.setFlag('table-widget-availability-data-type', false);
      const result = getTableWidgetRules();

      expect(result).toEqual([
        {
          value: 'numeric',
          label: 'Numeric',
        },
      ]);
    });
  });

  describe('getChartWidgetRules', () => {
    it('returns the correct rules for chart widgets', () => {
      const result = getChartWidgetRules();

      expect(result).toEqual([
        {
          value: 'zone',
          label: 'Zone',
        },
        {
          value: 'reference_line',
          label: 'Reference Line',
        },
      ]);
    });
  });

  describe('getWidgetConditions', () => {
    it('returns numeric conditions for table widgets', () => {
      const data = getTableWidgetConditions('numeric');
      const result = getWidgetConditions('SCORECARD', 'numeric');

      expect(result).toEqual(data);
    });

    it('returns string conditions for table widgets', () => {
      const data = getTableWidgetConditions('string');
      const result = getWidgetConditions('LONGITUDINAL', 'string');

      expect(result).toEqual(data);
    });

    it('returns zone conditions for chart widgets', () => {
      const data = getChartWidgetConditions('zone');
      const result = getWidgetConditions('xy', 'zone');

      expect(result).toEqual(data);
    });

    it('returns reference_line conditions for chart widgets', () => {
      const data = getChartWidgetConditions('reference_line');
      const result = getWidgetConditions('xy', 'reference_line');

      expect(result).toEqual(data);
    });
  });

  describe('isTableWidgetRuleSelectionValid', () => {
    it('should return true for valid table widget format rules', () => {
      const validRules = [
        { type: 'numeric', condition: 'greater', value: 10, color: 'red' },
        { type: 'string', condition: 'equal', value: 'test', color: 'blue' },
      ];

      expect(isTableWidgetRuleSelectionValid(validRules)).toBe(true);
    });

    it('should return false when any field has null value', () => {
      const invalidRules = [
        { type: 'numeric', condition: 'greater', value: 10, color: 'red' },
        { type: 'string', condition: null, value: 'test', color: 'blue' },
      ];

      expect(isTableWidgetRuleSelectionValid(invalidRules)).toBe(false);
    });
  });

  describe('isChartWidgetRuleSelectionValid', () => {
    it('should return true for valid chart widget rules with value field', () => {
      const validRules = [
        {
          type: 'zone',
          condition: 'greater',
          value: 10,
          color: 'red',
          textDisplay: 'High',
        },
        {
          type: 'zone',
          condition: 'between',
          value: 5,
          color: 'blue',
          textDisplay: 'Medium',
        },
      ];

      expect(isChartWidgetRuleSelectionValid(validRules)).toBe(true);
    });

    it('should return true for valid chart widget rules with to/from fields', () => {
      const validRules = [
        {
          type: 'zone',
          condition: 'between',
          color: 'green',
          textDisplay: 'Range',
          to: 20,
          from: 10,
          value: null,
        },
      ];

      expect(isChartWidgetRuleSelectionValid(validRules)).toBe(true);
    });

    it('should return false when required fields are missing', () => {
      const invalidRules = [
        {
          type: null,
          condition: 'greater',
          value: 10,
          color: 'red',
          textDisplay: 'Test',
        },
      ];

      expect(isChartWidgetRuleSelectionValid(invalidRules)).toBe(false);
    });

    it('should return false when value is null and to or from is missing', () => {
      const invalidRules = [
        {
          type: 'zone',
          condition: 'between',
          color: 'green',
          textDisplay: 'Range',
          value: null,
          to: 20,
          from: null,
        },
      ];

      expect(isChartWidgetRuleSelectionValid(invalidRules)).toBe(false);
    });

    it('should return false when value is null and both to and from are missing', () => {
      const invalidRules = [
        {
          type: 'zone',
          condition: 'between',
          color: 'green',
          textDisplay: 'Range',
          value: null,
          to: null,
          from: null,
        },
      ];

      expect(isChartWidgetRuleSelectionValid(invalidRules)).toBe(false);
    });

    it('should handle multiple valid rules', () => {
      const validRules = [
        {
          type: 'zone',
          condition: 'greater',
          value: 10,
          color: 'red',
          textDisplay: 'High',
        },
        {
          type: 'zone',
          condition: 'between',
          color: 'green',
          textDisplay: 'Range',
          value: null,
          to: 20,
          from: 10,
        },
        {
          type: 'zone',
          condition: 'less',
          value: 5,
          color: 'blue',
          textDisplay: 'Low',
        },
      ];

      expect(isChartWidgetRuleSelectionValid(validRules)).toBe(true);
    });

    it('should return false if any rule in multiple rules is invalid', () => {
      const mixedRules = [
        {
          type: 'zone',
          condition: 'greater',
          value: 10,
          color: 'red',
          textDisplay: 'High',
        },
        {
          type: 'zone',
          condition: 'between',
          color: 'green',
          textDisplay: 'Range',
          value: null,
          to: null,
          from: 10,
        },
        {
          type: 'zone',
          condition: 'less',
          value: 5,
          color: 'blue',
          textDisplay: 'Low',
        },
      ];

      expect(isChartWidgetRuleSelectionValid(mixedRules)).toBe(false);
    });
  });

  describe('isRuleSelectionValid', () => {
    it('should call isTableWidgetRuleSelectionValid for COMPARISON widget type', () => {
      const rules = [
        { type: 'numeric', condition: 'greater', value: 10, color: 'red' },
      ];

      expect(isRuleSelectionValid('COMPARISON', rules)).toBe(true);
    });

    it('should call isTableWidgetRuleSelectionValid for LONGITUDINAL widget type', () => {
      const rules = [
        { type: 'numeric', condition: 'greater', value: 10, color: 'red' },
      ];

      expect(isRuleSelectionValid('LONGITUDINAL', rules)).toBe(true);
    });

    it('should call isTableWidgetRuleSelectionValid for SCORECARD widget type', () => {
      const rules = [
        { type: 'numeric', condition: 'greater', value: 10, color: 'red' },
      ];

      expect(isRuleSelectionValid('SCORECARD', rules)).toBe(true);
    });

    it('should call isChartWidgetRuleSelectionValid for xy widget type', () => {
      const rules = [
        {
          type: 'zone',
          condition: 'greater',
          value: 10,
          color: 'red',
          textDisplay: 'Test',
        },
      ];

      expect(isRuleSelectionValid('xy', rules)).toBe(true);
    });

    it('should return false for unknown widget types', () => {
      const rules = [
        { type: 'numeric', condition: 'greater', value: 10, color: 'red' },
      ];

      expect(isRuleSelectionValid('UNKNOWN_TYPE', rules)).toBe(false);
    });

    it('should handle invalid rules for table widget types', () => {
      const invalidRules = [
        { type: null, condition: 'greater', value: 10, color: 'red' },
      ];

      expect(isRuleSelectionValid('COMPARISON', invalidRules)).toBe(false);
    });

    it('should handle invalid rules for chart widget types', () => {
      const invalidRules = [
        {
          type: null,
          condition: 'greater',
          value: 10,
          color: 'red',
          textDisplay: 'Test',
        },
      ];

      expect(isRuleSelectionValid('xy', invalidRules)).toBe(false);
    });
  });
});
