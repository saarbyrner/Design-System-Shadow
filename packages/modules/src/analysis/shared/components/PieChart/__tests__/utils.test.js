import { getChartValue } from '@kitman/modules/src/analysis/Dashboard/components/Chart/utils';
import { getOtherSegementLabel } from '../constants';
import {
  getQuadrant,
  fromLeaveTransition,
  enterUpdateTransition,
  getLabelDisplacementCoordinates,
  getPercentageValueFromArc,
  handlePieSort,
  getPercentageValueFromData,
} from '../utils';

describe('PieChart | utils', () => {
  describe('getQuadrant', () => {
    const arc = {
      data: {
        label: 'International Squad',
        value: '173.94',
      },
      index: 0,
      value: 173.94,
      startAngle: 0,
      endAngle: 3.7385165311101796,
      padAngle: 0.015,
    };

    it('returns 1 when midAngle is below Math.PI * 0.5', () => {
      expect(
        getQuadrant({
          ...arc,
          startAngle: Math.PI * 0.25,
          endAngle: Math.PI * 0.5,
        })
      ).toBe(1);
    });

    it('returns 2 when midAngle is below Math.PI', () => {
      expect(
        getQuadrant({
          ...arc,
          startAngle: Math.PI * 0.5,
          endAngle: Math.PI * 0.75,
        })
      ).toBe(2);
    });

    it('returns 3 when midAngle is below Math.PI * 1.5', () => {
      expect(
        getQuadrant({
          ...arc,
          startAngle: Math.PI,
          endAngle: Math.PI * 1.25,
        })
      ).toBe(3);
    });

    it('returns 4 when midAngle is below Math.PI * 2', () => {
      expect(
        getQuadrant({
          ...arc,
          startAngle: Math.PI * 1.75,
          endAngle: Math.PI * 2,
        })
      ).toBe(4);
    });

    it('returns 0 as default', () => {
      expect(getQuadrant({})).toBe(0);
    });
  });

  describe('fromLeaveTransition', () => {
    it('should return 2 * Math.PI (360°) for startAngle and endAngle if endAngle is greater than Math.PI (180°)', () => {
      const endAngle = Math.PI + 0.1;

      expect(fromLeaveTransition({ endAngle })).toEqual({
        startAngle: 2 * Math.PI,
        endAngle: 2 * Math.PI,
        opacity: 0,
      });
    });

    it('should return 0 for startAngle and endAngle if endAngle is less than Math.PI (180°)', () => {
      const endAngle = Math.PI - 0.1;

      expect(fromLeaveTransition({ endAngle })).toEqual({
        startAngle: 0,
        endAngle: 0,
        opacity: 0,
      });
    });
  });

  describe('enterUpdateTransition', () => {
    it('should return startAngle, endAngle and opacity: 1', () => {
      const startAngle = Math.PI;
      const endAngle = Math.PI + 0.1;

      expect(enterUpdateTransition({ startAngle, endAngle })).toEqual({
        startAngle,
        endAngle,
        opacity: 1,
      });
    });
  });

  describe('getLabelDisplacementCoordinates', () => {
    it('returns the correct config when type === "pie"', () => {
      const horizontalPosition = 1;
      const verticalPosition = 1;
      const type = 'pie';

      const expectedResult = {
        dx: 75 * horizontalPosition,
        dy: -85 * verticalPosition,
      };

      expect(
        getLabelDisplacementCoordinates(
          horizontalPosition,
          verticalPosition,
          type
        )
      ).toEqual(expectedResult);
    });

    it('returns the correct config when type === "donut"', () => {
      const horizontalPosition = 1;
      const verticalPosition = 1;
      const type = 'donut';

      const expectedResult = {
        dx: 60 * horizontalPosition,
        dy: -50 * verticalPosition,
      };

      expect(
        getLabelDisplacementCoordinates(
          horizontalPosition,
          verticalPosition,
          type
        )
      ).toEqual(expectedResult);
    });
  });

  describe('getPercentageValueFromArc', () => {
    it('returns the correct percentage for the provided arc', () => {
      const ARC_ONE_VALUE = 100;
      const ARC_TWO_VALUE = 200;
      const arc = {
        data: {
          label: 'International Squad',
          value: `${ARC_ONE_VALUE}`,
        },
        index: 0,
        value: ARC_ONE_VALUE,
        startAngle: 0,
        endAngle: 3.7385165311101796,
        padAngle: 0.015,
      };

      const arcs = [
        { ...arc },
        {
          data: {
            label: 'Academy Squad',
            value: `${ARC_TWO_VALUE}`,
          },
          index: 0,
          value: ARC_TWO_VALUE,
          startAngle: 0,
          endAngle: 3.7385165311101796,
          padAngle: 0.015,
        },
      ];

      const expectedResult = (
        (ARC_ONE_VALUE / (ARC_ONE_VALUE + ARC_TWO_VALUE)) *
        100
      ).toFixed(0);

      expect(getPercentageValueFromArc(arc, arcs)).toBe(expectedResult);
    });

    it('handles 0 values correctly', () => {
      // note:  no need to test for nulls, as visx handles nulls as 0 values
      const ARC_ONE_VALUE = 0;
      const ARC_TWO_VALUE = 200;
      const arc = {
        data: {
          label: 'International Squad',
          value: `${ARC_ONE_VALUE}`,
        },
        index: 0,
        value: ARC_ONE_VALUE,
        startAngle: 0,
        endAngle: 3.7385165311101796,
        padAngle: 0.015,
      };

      const arcs = [
        { ...arc },
        {
          data: {
            label: 'Academy Squad',
            value: `${ARC_TWO_VALUE}`,
          },
          index: 0,
          value: ARC_TWO_VALUE,
          startAngle: 0,
          endAngle: 3.7385165311101796,
          padAngle: 0.015,
        },
      ];

      const expectedResult = (
        (ARC_ONE_VALUE / (ARC_ONE_VALUE + ARC_TWO_VALUE)) *
        100
      ).toFixed(0);

      expect(getPercentageValueFromArc(arc, arcs)).toBe(expectedResult);
    });
  });

  describe('handlePieSort', () => {
    const otherLabel = getOtherSegementLabel();

    it('returns data sorted high to low', () => {
      const data = [
        { label: 'Segment C', value: '30' },
        { label: 'Segment A', value: '100' },
        { label: 'Segment B', value: '50' },
      ];

      data.sort(handlePieSort);

      expect(data).toEqual([
        { label: 'Segment A', value: '100' },
        { label: 'Segment B', value: '50' },
        { label: 'Segment C', value: '30' },
      ]);
    });

    it('returns data sorted high to low, with Other Categories rendered last, regardless of the value', () => {
      const data = [
        { label: 'Segment B', value: '50' },
        { label: otherLabel, value: '1000' },
        { label: 'Segment A', value: '100' },
        { label: 'Segment C', value: '30' },
      ];

      data.sort(handlePieSort);

      expect(data).toEqual([
        { label: 'Segment A', value: '100' },
        { label: 'Segment B', value: '50' },
        { label: 'Segment C', value: '30' },
        { label: otherLabel, value: '1000' },
      ]);
    });
  });

  describe('getPercentageValueFromData', () => {
    it('returns the correct percentage for the provided data item', () => {
      const DATA_ONE_VALUE = 1000;
      const DATA_TWO_VALUE = 500;
      const DATA_THREE_VALUE = 750;

      const dataItem = {
        label: 'Blindside Flanker',
        value: `${DATA_ONE_VALUE}`,
      };

      const data = [
        { label: 'Openside Flanker', value: `${DATA_TWO_VALUE}` },
        { label: 'Blindside Flanker', value: `${DATA_ONE_VALUE}` },
        { label: 'Wing', value: `${DATA_THREE_VALUE}` },
      ];

      const valueAccessor = ({ value }) => getChartValue(value, 'sum');

      const expectedResult = (
        (DATA_ONE_VALUE /
          (DATA_ONE_VALUE + DATA_TWO_VALUE + DATA_THREE_VALUE)) *
        100
      ).toFixed(0);

      expect(getPercentageValueFromData(dataItem, valueAccessor, data)).toBe(
        expectedResult
      );
    });

    it('returns the correct percentage when data contains numerator / denominator', () => {
      const dataItem = {
        label: 'Blindside Flanker',
        value: {
          numerator: 1500,
          denominator: 1500,
        },
      };

      const data = [
        {
          label: 'Openside Flanker',
          value: {
            numerator: 1500,
            denominator: 1500,
          },
        },
        {
          label: 'Blindside Flanker',
          value: {
            numerator: 1538,
            denominator: 2100,
          },
        },
        { label: 'Wing', value: { numerator: 640, denominator: 900 } },
      ];

      const valueAccessor = ({ value }) => getChartValue(value, 'percentage');

      expect(getPercentageValueFromData(dataItem, valueAccessor, data)).toBe(
        '41'
      );
    });
  });
});
