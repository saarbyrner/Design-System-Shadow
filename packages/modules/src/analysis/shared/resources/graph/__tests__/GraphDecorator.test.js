import { colors } from '@kitman/common/src/variables';
import graphDecorator from '../GraphDecorator';

describe('graphDecorator', () => {
  const dummyData = [
    {
      has_unavailability: false,
      date: 1514700000000,
      events: [
        {
          athlete_name: 'Anderson Lima',
          description: 'Loose body ankle joint',
          caused_unavailability: false,
          status: 'ongoing',
          days: 136,
        },
      ],
    },
  ];

  it('formats the data for Highchart', () => {
    const injuries = [
      {
        has_unavailability: true,
        date: 1511436334000,
        events: [
          {
            athlete_name: 'David Anderson',
            description: 'Knee Post PCL reconstruction (Center)',
            caused_unavailability: true,
            days: 1,
            status: 'resolved',
          },
          {
            athlete_name: 'Anderson Lima',
            description: 'Loose body ankle joint',
            caused_unavailability: false,
            status: 'ongoing',
            days: 136,
          },
        ],
      },
    ];

    const expectedFormattedData = [
      {
        x: injuries[0].date,
        y: 1,
        color: colors.s11,
        events: injuries[0].events,
      },
    ];

    const graphDecoratorData = graphDecorator(injuries, 'INJURY', 'line').data;
    expect(graphDecoratorData).toStrictEqual(expectedFormattedData);
  });

  it('renders the number of injury/illness', () => {
    const mockedThis = {
      point: {
        events: ['injury 1', 'injury 2', 'injury 3'],
      },
    };
    const graphDecoratorIcon = graphDecorator(
      dummyData,
      'INJURY',
      'line'
    ).dataLabels.formatter.call(mockedThis);
    expect(graphDecoratorIcon).toContain(
      '<span class="graphComposerDecoratorLabel__counter">3</span>'
    );
  });

  describe('When the data are injuries', () => {
    it('renders the healthcare icon', () => {
      const mockedThis = {
        point: {
          events: [],
        },
      };
      const graphDecoratorIcon = graphDecorator(
        dummyData,
        'INJURY',
        'line'
      ).dataLabels.formatter.call(mockedThis);
      expect(graphDecoratorIcon).toContain('icon-healthcare');
    });
  });

  describe('When the data are illnesses', () => {
    it('renders the thermometer icon', () => {
      const mockedThis = {
        point: {
          events: [],
        },
      };
      const graphDecoratorIcon = graphDecorator(
        dummyData,
        'ILLNESS',
        'line'
      ).dataLabels.formatter.call(mockedThis);
      expect(graphDecoratorIcon).toContain('icon-thermometer');
    });
  });

  describe('When the data has an unavailability', () => {
    const dataWithUnavailability = [Object.assign({}, dummyData[0])];
    dataWithUnavailability[0].has_unavailability = true;

    it('renders a red tooltip', () => {
      const graphDecoratorData = graphDecorator(
        dataWithUnavailability,
        'INJURY',
        'line'
      ).data;
      expect(graphDecoratorData[0].color).toBe(colors.s11);
    });
  });

  describe("When the data hasn't an unavailability", () => {
    const dataWithoutUnavailability = [Object.assign({}, dummyData[0])];
    dataWithoutUnavailability[0].has_unavailability = false;

    it('renders a grey tooltip', () => {
      const graphDecoratorData = graphDecorator(
        dataWithoutUnavailability,
        'INJURY',
        'line'
      ).data;
      expect(graphDecoratorData[0].color).toBe(colors.s15);
    });
  });

  describe("when the graph type is 'bar'", () => {
    it('builds a bar graph decorator config', () => {
      const decoratorConfig = graphDecorator(dummyData, 'INJURY', 'bar');

      expect(decoratorConfig.dataLabels.y).toBe(15);

      decoratorConfig.dataLabels = {
        ...decoratorConfig.dataLabels,
        point: {
          events: [],
        },
      };

      expect(decoratorConfig.dataLabels.formatter()).toContain(
        'graphComposerDecoratorLabel--barGraph'
      );
    });
  });
});
