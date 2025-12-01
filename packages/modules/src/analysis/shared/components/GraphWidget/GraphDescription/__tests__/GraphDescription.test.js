import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { setI18n } from 'react-i18next';
import i18n from '@kitman/common/src/utils/i18n';
import moment from 'moment-timezone';
import _cloneDeep from 'lodash/cloneDeep';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { getGraphTitles, formatGraphTitlesToString } from '../../../../utils';
import { getDummyData } from '../../../../resources/graph/DummyData';
import GraphDescription from '..';

// Setup i18n for tests
setI18n(i18n);

describe('Graph Composer <GraphDescription /> component', () => {
  window.featureFlags = {};
  const i18nT = i18nextTranslateStub();
  let props;

  beforeEach(() => {
    moment.tz.setDefault('UTC');
    props = {
      canBuildGraph: true,
      graphGroup: 'longitudinal',
      graphData: getDummyData('longitudinal'),
      canSaveGraph: true,
      t: i18nT,
    };
  });

  afterEach(() => {
    moment.tz.setDefault();
  });

  it('renders a condensed graph description when props.condensed is true', () => {
    render(<GraphDescription {...props} condensed />);

    const condensedElement = document.querySelector(
      '.graphDescription--condensed'
    );
    expect(condensedElement).toBeInTheDocument();
  });

  describe('when showTitle is false', () => {
    it('doesnt show a title', () => {
      render(<GraphDescription {...props} />);

      const titleElement = document.querySelector(
        '.graphDescription__statusName'
      );
      expect(titleElement).not.toBeInTheDocument();
    });
  });

  describe('when the time period is not custom_date_range', () => {
    beforeEach(() => {
      props.graphData.time_period = 'this_in_season';
    });

    afterEach(() => {
      props.graphData.time_period = 'custom_date_range';
    });

    it('shows the time period', () => {
      render(<GraphDescription {...props} />);

      const graphDescriptionElement =
        document.querySelector('.graphDescription');
      expect(graphDescriptionElement).toHaveTextContent('This In-season');
    });
  });

  describe('when the standard-date-formatting flag is off and the time period is custom_date_range', () => {
    beforeEach(() => {
      window.featureFlags['standard-date-formatting'] = false;
    });

    it('shows the date range', () => {
      render(<GraphDescription {...props} />);

      const graphDescriptionElement =
        document.querySelector('.graphDescription');
      expect(graphDescriptionElement).toHaveTextContent(
        '15 Oct 2017 - 8 Dec 2017'
      );
    });
  });

  describe('when the standard-date-formatting flag is on and the time period is custom_date_range', () => {
    beforeEach(() => {
      window.featureFlags['standard-date-formatting'] = true;
    });

    afterEach(() => {
      window.featureFlags['standard-date-formatting'] = false;
    });

    it('shows the date range', () => {
      render(<GraphDescription {...props} />);

      const graphDescriptionElement =
        document.querySelector('.graphDescription');
      expect(graphDescriptionElement).toHaveTextContent(
        'Oct 15, 2017 - Dec 8, 2017'
      );
    });
  });

  describe('when the time period is last_x_days', () => {
    beforeEach(() => {
      props.graphData.time_period = 'last_x_days';
      props.graphData.metrics[0].status.time_period_length = 3;
      props.graphData.metrics[0].status.time_period_length_offset = 5;
    });

    afterEach(() => {
      props.graphData.time_period = 'custom_date_range';
      props.graphData.metrics[0].status.time_period_length = null;
      props.graphData.metrics[0].status.time_period_length_offset = null;
    });

    it('shows the correct legend', () => {
      render(<GraphDescription {...props} />);

      const graphDescriptionElement =
        document.querySelector('.graphDescription');
      expect(graphDescriptionElement).toHaveTextContent('Last 5 - 8 days');
      expect(graphDescriptionElement).not.toHaveTextContent(
        'Selected Date Range'
      );
    });

    describe('when the graph is summary graph', () => {
      beforeEach(() => {
        props.graphGroup = 'summary';
        const graphData = _cloneDeep(getDummyData('summary'));
        graphData.series[0].timePeriod = 'last_x_days';
        graphData.series[0].event_type_time_period = 'last_x_days';
        graphData.series[0].time_period_length = 3;
        graphData.series[0].time_period_length_offset = 5;
        props.graphData = graphData;
      });

      afterEach(() => {
        props.graphGroup = 'longitudinal';
        props.graphData = _cloneDeep(getDummyData('longitudinal'));
      });

      it('shows the correct legend', () => {
        render(<GraphDescription {...props} />);

        const graphDescriptionElement =
          document.querySelector('.graphDescription');
        expect(graphDescriptionElement).toHaveTextContent('Last 5 - 8 days');
        expect(graphDescriptionElement).not.toHaveTextContent(
          'Selected Date Range'
        );
      });
    });
  });

  describe('longitudinal graphs', () => {
    describe('when the standard-date-formatting flag is off and game event type is selected', () => {
      beforeEach(() => {
        window.featureFlags['standard-date-formatting'] = false;
        props.graphData.metrics[0].status.selected_games = [
          {
            date: '2019-04-24T23:00:00Z',
            id: 1234,
            opponent_score: '2',
            opponent_team_name: 'Opponent Team',
            score: '0',
            team_name: 'Kitman',
            venue_type_name: 'Home',
          },
        ];
        props.graphData.metrics[0].status.event_type_time_period = 'game';
        props.graphData.time_period = 'game';
      });

      afterEach(() => {
        props.graphData.metrics[0].status.event_type_time_period =
          'custom_date_range';
        props.graphData.time_period = 'custom_date_range';
      });

      it('shows the event type', () => {
        render(<GraphDescription {...props} />);

        const graphDescriptionElement =
          document.querySelector('.graphDescription');
        expect(graphDescriptionElement).toHaveTextContent(
          '24 Apr 2019 - Opponent Team (H) 0 - 2'
        );
      });
    });

    describe('when the standard-date-formatting flag is on and game event type is selected', () => {
      beforeEach(() => {
        window.featureFlags['standard-date-formatting'] = true;
        props.graphData.metrics[0].status.selected_games = [
          {
            date: '2019-04-24T23:00:00Z',
            id: 1234,
            opponent_score: '2',
            opponent_team_name: 'Opponent Team',
            score: '0',
            team_name: 'Kitman',
            venue_type_name: 'Home',
          },
        ];
        props.graphData.metrics[0].status.event_type_time_period = 'game';
        props.graphData.time_period = 'game';
      });

      afterEach(() => {
        window.featureFlags['standard-date-formatting'] = false;
        props.graphData.metrics[0].status.event_type_time_period =
          'custom_date_range';
        props.graphData.time_period = 'custom_date_range';
      });

      it('shows the event type', () => {
        render(<GraphDescription {...props} />);

        const graphDescriptionElement =
          document.querySelector('.graphDescription');
        expect(graphDescriptionElement).toHaveTextContent(
          'Apr 24, 2019 - Opponent Team (H) 0 - 2'
        );
      });
    });

    describe('when the standard-date-formatting flag is off and training_session event type is selected', () => {
      beforeEach(() => {
        window.featureFlags['standard-date-formatting'] = false;
        props.graphData.metrics[0].status.selected_training_sessions = [
          {
            date: '2019-04-24T23:00:00Z',
            duration: 100,
            id: 1234,
            session_type_name: 'Training',
          },
        ];
        props.graphData.metrics[0].status.event_type_time_period =
          'training_session';
        props.graphData.time_period = 'training_session';
      });

      afterEach(() => {
        props.graphData.metrics[0].status.event_type_time_period =
          'custom_date_range';
        props.graphData.time_period = 'custom_date_range';
      });

      it('shows the event type', () => {
        render(<GraphDescription {...props} />);

        const graphDescriptionElement =
          document.querySelector('.graphDescription');
        expect(graphDescriptionElement).toHaveTextContent(
          'Wed, 24 Apr 2019 (11:00 pm) - Training (100 mins)'
        );
      });
    });

    describe('when the standard-date-formatting flag is on and training_session event type is selected', () => {
      beforeEach(() => {
        window.featureFlags['standard-date-formatting'] = true;
        props.graphData.metrics[0].status.selected_training_sessions = [
          {
            date: '2019-04-24T23:00:00Z',
            duration: 100,
            id: 1234,
            session_type_name: 'Training',
          },
        ];
        props.graphData.metrics[0].status.event_type_time_period =
          'training_session';
        props.graphData.time_period = 'training_session';
      });

      afterEach(() => {
        window.featureFlags['standard-date-formatting'] = false;
        props.graphData.metrics[0].status.event_type_time_period =
          'custom_date_range';
        props.graphData.time_period = 'custom_date_range';
      });

      it('shows the event type', () => {
        render(<GraphDescription {...props} />);

        const graphDescriptionElement =
          document.querySelector('.graphDescription');
        expect(graphDescriptionElement).toHaveTextContent(
          'Apr 24, 2019 11:00 PM - Training (100 mins)'
        );
      });
    });
  });

  describe('when the graph group is summary_donut and the standard-date-formatting flag is off', () => {
    beforeEach(() => {
      window.featureFlags['standard-date-formatting'] = false;
    });

    it('shows the population', () => {
      const customProps = {
        ...props,
        graphGroup: 'summary_donut',
        graphData: {
          ...props.graphData,
          time_period: 'custom_date_range',
          metrics: [
            {
              type: 'medical',
              category: 'all_illnesses',
              series: [
                {
                  name: 'Entire squad',
                },
              ],
            },
          ],
        },
      };
      render(<GraphDescription showTitle {...customProps} />);

      const graphDescriptionElement =
        document.querySelector('.graphDescription');
      expect(graphDescriptionElement).toHaveTextContent('Entire squad');
    });

    it('shows the filters', () => {
      const customProps = {
        ...props,
        graphGroup: 'summary_donut',
        graphData: {
          ...props.graphData,
          time_period: 'custom_date_range',
          metrics: [
            {
              type: 'medical',
              category: 'all_illnesses',
              series: [
                {
                  name: 'Entire squad',
                },
              ],
              filters: {
                time_loss: ['non_time_loss'],
                session_type: [],
                competitions: [],
                event_types: [],
                training_session_types: [],
              },
              filter_names: {
                time_loss: ['Non Time-loss'],
                session_type: [],
                competitions: [],
                event_types: [],
                training_session_types: [],
              },
            },
          ],
        },
      };

      render(<GraphDescription showTitle {...customProps} />);

      const graphDescriptionElement =
        document.querySelector('.graphDescription');
      expect(graphDescriptionElement).toHaveTextContent(
        '15 Oct 2017 - 8 Dec 2017 #sport_specific__Athletes: Entire squad (Non Time-loss)'
      );
    });
  });

  describe('when the graph group is summary_donut and the standard-date-formatting flag is on', () => {
    beforeEach(() => {
      window.featureFlags['standard-date-formatting'] = true;
    });

    afterEach(() => {
      window.featureFlags['standard-date-formatting'] = false;
    });

    it('shows the filters', () => {
      const customProps = {
        ...props,
        graphGroup: 'summary_donut',
        graphData: {
          ...props.graphData,
          time_period: 'custom_date_range',
          metrics: [
            {
              type: 'medical',
              category: 'all_illnesses',
              series: [
                {
                  name: 'Entire squad',
                },
              ],
              filters: {
                time_loss: ['non_time_loss'],
                session_type: [],
                competitions: [],
                event_types: [],
                training_session_types: [],
              },
              filter_names: {
                time_loss: ['Non Time-loss'],
                session_type: [],
                competitions: [],
                event_types: [],
                training_session_types: [],
              },
            },
          ],
        },
      };

      render(<GraphDescription showTitle {...customProps} />);

      const graphDescriptionElement =
        document.querySelector('.graphDescription');
      expect(graphDescriptionElement).toHaveTextContent(
        'Oct 15, 2017 - Dec 8, 2017 #sport_specific__Athletes: Entire squad (Non Time-loss)'
      );
    });
  });

  describe('when the graph group is value_visualisation and the standard-date-formatting flag is off', () => {
    beforeEach(() => {
      window.featureFlags['standard-date-formatting'] = false;
    });

    it('shows the population', () => {
      const customProps = {
        ...props,
        graphGroup: 'value_visualisation',
        graphData: {
          ...props.graphData,
          time_period: 'custom_date_range',
          metrics: [
            {
              type: 'medical',
              category: 'all_illnesses',
              series: [
                {
                  value: '12',
                  name: 'Forwards',
                },
              ],
            },
          ],
        },
      };
      render(<GraphDescription showTitle {...customProps} />);

      const graphDescriptionElement =
        document.querySelector('.graphDescription');
      expect(graphDescriptionElement).toHaveTextContent('Forwards');
    });

    it('shows the filters', () => {
      const customProps = {
        ...props,
        graphGroup: 'value_visualisation',
        graphData: {
          ...props.graphData,
          time_period: 'custom_date_range',
          metrics: [
            {
              type: 'medical',
              category: 'all_illnesses',
              series: [
                {
                  value: '12',
                  name: 'Forwards',
                },
              ],
              filters: {
                time_loss: ['non_time_loss'],
                session_type: [],
                competitions: [],
                event_types: [],
                training_session_types: [],
              },
              filter_names: {
                time_loss: ['Non Time-loss'],
                session_type: [],
                competitions: [],
                event_types: [],
                training_session_types: [],
              },
            },
          ],
        },
      };
      render(<GraphDescription showTitle {...customProps} />);

      const graphDescriptionElement =
        document.querySelector('.graphDescription');
      expect(graphDescriptionElement).toHaveTextContent(
        '15 Oct 2017 - 8 Dec 2017 #sport_specific__Athletes: Forwards (Non Time-loss)'
      );
    });
  });

  describe('when the graph group is value_visualisation and the standard-date-formatting flag is on', () => {
    beforeEach(() => {
      window.featureFlags['standard-date-formatting'] = true;
    });

    afterEach(() => {
      window.featureFlags['standard-date-formatting'] = false;
    });

    it('shows the filters', () => {
      const customProps = {
        ...props,
        graphGroup: 'value_visualisation',
        graphData: {
          ...props.graphData,
          time_period: 'custom_date_range',
          metrics: [
            {
              type: 'medical',
              category: 'all_illnesses',
              series: [
                {
                  value: '12',
                  name: 'Forwards',
                },
              ],
              filters: {
                time_loss: ['non_time_loss'],
                session_type: [],
                competitions: [],
                event_types: [],
                training_session_types: [],
              },
              filter_names: {
                time_loss: ['Non Time-loss'],
                session_type: [],
                competitions: [],
                event_types: [],
                training_session_types: [],
              },
            },
          ],
        },
      };
      render(<GraphDescription showTitle {...customProps} />);

      const graphDescriptionElement =
        document.querySelector('.graphDescription');
      expect(graphDescriptionElement).toHaveTextContent(
        'Oct 15, 2017 - Dec 8, 2017 #sport_specific__Athletes: Forwards (Non Time-loss)'
      );
    });
  });

  describe('when the graph is summary', () => {
    beforeEach(() => {
      props.graphGroup = 'summary';
      props.graphData = _cloneDeep(getDummyData('summary'));
    });

    afterEach(() => {
      props.graphGroup = 'longitudinal';
      props.graphData = _cloneDeep(getDummyData('longitudinal'));
    });

    it('renders the correct title', () => {
      render(<GraphDescription showTitle {...props} />);

      const titleElement = screen.getByText('3 Metrics');
      expect(titleElement).toBeInTheDocument();
    });
  });

  it('renders a rename button', () => {
    render(<GraphDescription showTitle {...props} />);

    const renameButton = screen.getByRole('button');
    expect(renameButton).toBeInTheDocument();
  });

  it("hides the rename button when the user doesn't have the manage dashboard permission", () => {
    render(<GraphDescription showTitle {...props} canSaveGraph={false} />);

    const renameButton = screen.queryByRole('button');
    expect(renameButton).not.toBeInTheDocument();
  });

  it('calls the correct callback when rename button is clicked', async () => {
    const user = userEvent.setup();
    const mockOpenRenameModal = jest.fn();

    render(
      <GraphDescription
        showTitle
        openRenameGraphModal={mockOpenRenameModal}
        {...props}
      />
    );

    const renameButton = screen.getByRole('button');
    await user.click(renameButton);

    expect(mockOpenRenameModal).toHaveBeenCalledTimes(1);
  });

  describe('when the graph does not have a custom title', () => {
    it('renders the correct title', () => {
      render(<GraphDescription showTitle {...props} />);

      const titleElement = document.querySelector(
        '.graphDescription__statusName'
      );
      const expectedTitle = formatGraphTitlesToString(
        getGraphTitles(props.graphData)
      );
      expect(titleElement).toHaveTextContent(expectedTitle);
    });
  });

  describe('when there is a custom title for the graph', () => {
    beforeEach(() => {
      props.graphData.name = 'Custom name';
    });

    it('renders the correct title', () => {
      render(<GraphDescription showTitle {...props} />);

      const titleElement = screen.getByText('Custom name');
      expect(titleElement).toBeInTheDocument();
    });
  });
});
