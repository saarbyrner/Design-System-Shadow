import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';

import { isUniqueName, buildSummaryData, buildValueData } from '../utils';
import injuryVariablesDummyData from '../../resources/injuryVariablesDummyData';
import {
  summaryBarDummyData,
  valueVisualisationDummyData,
} from '../../resources/graphDummyData';

i18nextTranslateStub();

describe('utils', () => {
  describe('isUniqueName', () => {
    const variables = [...injuryVariablesDummyData];

    describe('when the variable name is unique', () => {
      it('should return a validation object with isValid true', () => {
        const value = 'a unique variable name';

        const expected = {
          isValid: true,
          errorType: 'unique',
          message: 'Name already in use',
        };

        expect(isUniqueName(value, variables)).toEqual(expected);
      });
    });

    describe('when the variable name is not unique', () => {
      it('should return a validation object with isValid false', () => {
        const value = variables[1].name;

        const expected = {
          isValid: false,
          errorType: 'unique',
          message: 'Name already in use',
        };

        expect(isUniqueName(value, variables)).toEqual(expected);
      });
    });

    describe('when the variable name already exists in another font case', () => {
      it('should return a validation object with isValid false', () => {
        const value = variables[1].name.toUpperCase();

        const expected = {
          isValid: false,
          errorType: 'unique',
          message: 'Name already in use',
        };

        expect(isUniqueName(value, variables)).toEqual(expected);
      });
    });
  });

  describe('buildSummaryData', () => {
    it('should return an object with summary bar graph data', () => {
      const responseData = {
        date_range: {
          end_date: '2020-12-17T23:59:59Z',
          start_date: '2020-11-05T00:00:00Z',
        },
        graph_group: 'summary_bar',
        metrics: [
          {
            series: [
              {
                datapoints: [
                  { name: 'Nov', y: 0 },
                  { name: 'Dec', y: 0 },
                ],
                name: 'Total number of filtered injuries',
              },
            ],
            type: 'metric',
          },
        ],
      };
      const expected = { ...summaryBarDummyData };

      expect(buildSummaryData(responseData)).toEqual(expected);
    });
  });

  describe('buildValueData', () => {
    it('should return an object with value visualisation graph data', () => {
      const responseData = {
        date_range: {
          end_date: '2020-12-15T23:59:59Z',
          start_date: '2020-01-31T00:00:00Z',
        },
        graphGroup: 'value_visualisation',
        metrics: [
          {
            series: [
              {
                name: 'Total number of filtered injuries',
                population_id: null,
                population_type: null,
                value: 0,
              },
            ],
            type: 'metric',
          },
        ],
      };
      const expected = { ...valueVisualisationDummyData };

      expect(buildValueData(responseData)).toEqual(expected);
    });
  });
});
