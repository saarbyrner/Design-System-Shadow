import { getDummyData } from '../../../../resources/graph/DummyData';
import formatGraphData from '../utils';

describe('formatGraphData', () => {
  beforeEach(() => {
    window.featureFlags = {};
  });

  it('formats the data correctly', () => {
    const expected = {
      dates: [
        1512640002000, 1512640003000, 1512900000000, 1513288802000,
        1514292802000, 1516268802000, 1519292802000, 1519897602000,
      ],
      datapoints: [
        {
          1512640002000: 1,
          1512640003000: 1,
          1512900000000: 0,
          1519897602000: 0,
        },
        {
          1512640002000: 1,
          1516268802000: 0,
          1519292802000: 0,
          1519897602000: 1,
        },
        {
          1512640002000: 275,
          1519897602000: 475,
        },
        {
          1512640002000: 345,
          1513288802000: 400,
          1514292802000: 375,
          1519897602000: 278,
        },
      ],
      categories: [],
      lines: [
        {
          metricIndex: 0,
          seriesIndex: 0,
        },
        {
          metricIndex: 0,
          seriesIndex: 1,
        },
        {
          metricIndex: 1,
          seriesIndex: 0,
        },
        {
          metricIndex: 1,
          seriesIndex: 1,
        },
      ],
    };

    const formattedData = formatGraphData(getDummyData('longitudinal'));
    expect(formattedData).toEqual(expected);
  });

  describe('when there are categories', () => {
    it('adds the correct category names', () => {
      const expected = {
        dates: [
          1512640002000, 1512640003000, 1512900000000, 1513288802000,
          1514292802000, 1516268802000, 1519292802000, 1519897602000,
        ],
        datapoints: [
          {
            1512640002000: 1,
            1512640003000: 1,
            1512900000000: 0,
            1519897602000: 0,
          },
          {
            1512640002000: 1,
            1516268802000: 0,
            1519292802000: 0,
            1519897602000: 1,
          },
          {
            1512640002000: 275,
            1519897602000: 475,
          },
          {
            1512640002000: 345,
            1513288802000: 400,
            1514292802000: 375,
            1519897602000: 278,
          },
        ],
        categories: ['Training 1', 'Training 2'],
        lines: [
          {
            metricIndex: 0,
            seriesIndex: 0,
          },
          {
            metricIndex: 0,
            seriesIndex: 1,
          },
          {
            metricIndex: 1,
            seriesIndex: 0,
          },
          {
            metricIndex: 1,
            seriesIndex: 1,
          },
        ],
      };

      const dummyData = getDummyData('longitudinal');
      dummyData.categories = ['Training 1', 'Training 2'];
      const formattedData = formatGraphData(dummyData);
      expect(formattedData).toEqual(expected);
    });
  });
});
