import _cloneDeep from 'lodash/cloneDeep';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import useEventTracking from '@kitman/common/src/hooks/useEventTracking';
import { emptySquadAthletes } from '../../utils';
import AddWidgetDropdown from '../index';

jest.mock('@kitman/common/src/hooks/useEventTracking');

describe('<AddWidgetDropdown />', () => {
  const props = {
    containerType: 'AnalyticalDashboard',
    dashboard: {},
    onClickOpenHeaderWidgetModal: jest.fn(),
    onClickOpenProfileWidgetModal: jest.fn(),
    onClickOpenNotesWidgetSettingsModal: jest.fn(),
    onClickOpenTableWidgetModal: jest.fn(),
    onClickAddActionsWidget: jest.fn(),
    onClickAddDevelopmentGoalWidget: jest.fn(),
    onAddChart: jest.fn(),
    pivotedAthletes: _cloneDeep(emptySquadAthletes),
    pivotedDateRange: {},
    pivotedTimePeriod: '',
    pivotedTimePeriodLength: null,
    canViewNotes: true,
    hasDevelopmentGoalsModule: true,
    annotationTypes: [
      {
        id: 1,
        name: 'General note',
        type: 'OrganisationAnnotationTypes::General',
      },
      {
        id: 2,
        name: 'Evaluation note',
        type: 'OrganisationAnnotationTypes::Evaluation',
      },
      {
        id: 3,
        name: 'Evaluation note 2',
        type: 'OrganisationAnnotationTypes::Evaluation',
      },
    ],
  };

  const trackEventMock = jest.fn();

  beforeEach(() => {
    useEventTracking.mockReturnValue({ trackEvent: trackEventMock });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('shows a text button with Add widget text', () => {
    render(<AddWidgetDropdown {...props} />);

    expect(
      screen.queryByRole('button', {
        name: 'Add widget',
      })
    ).toBeInTheDocument();
  });

  it('shows a TooltipMenu with the correct menu items', async () => {
    render(<AddWidgetDropdown {...props} isGraphBuilder />);

    await userEvent.click(
      screen.queryByRole('button', {
        name: 'Add widget',
      })
    );

    ['Graph', 'Profile', 'Header', 'Development goals'].forEach((item) => {
      expect(screen.queryByText(item)).toBeInTheDocument();
    });
  });

  describe('the graph widget', () => {
    describe('when on the home_dashboard', () => {
      const newProps = {
        ...props,
        containerType: 'HomeDashboard',
        dashboard: { id: 9 },
      };

      describe('and the rep-enable-graphs-on-homepage feature flag is enabled', () => {
        beforeEach(() => {
          window.setFlag('rep-enable-graphs-on-homepage', true);
        });

        afterEach(() => {
          window.setFlag('rep-enable-graphs-on-homepage', false);
        });

        it('should render the graph when feature flag is on', async () => {
          render(<AddWidgetDropdown {...newProps} isGraphBuilder />);

          await userEvent.click(
            screen.queryByRole('button', {
              name: 'Add widget',
            })
          );

          expect(screen.queryByText('Graph')).toBeInTheDocument();
        });

        it('should generate the correct href value for the graph item', async () => {
          render(<AddWidgetDropdown {...newProps} isGraphBuilder />);

          await userEvent.click(
            screen.queryByRole('button', {
              name: 'Add widget',
            })
          );

          expect(
            screen.queryByRole('link', { name: 'Graph' })
          ).toBeInTheDocument();

          expect(screen.queryByRole('link', { name: 'Graph' })).toHaveAttribute(
            'href',
            '/analysis/graph/builder?home_dashboard_id=9#create'
          );
        });
      });

      describe('and the rep-enable-graphs-on-homepage feature flag is disabled', () => {
        beforeEach(() => {
          window.setFlag('rep-enable-graphs-on-homepage', false);
        });

        it('should not render the graph widget when feature flag if off', async () => {
          render(<AddWidgetDropdown {...newProps} isGraphBuilder />);

          await userEvent.click(
            screen.queryByRole('button', {
              name: 'Add widget',
            })
          );

          expect(
            screen.queryByRole('link', { name: 'Graph' })
          ).not.toBeInTheDocument();
        });
      });
    });

    describe('when on the analytical_dashboard', () => {
      it('generates the correct href value for the Graph item', async () => {
        props.dashboard = {
          id: 9,
        };

        render(<AddWidgetDropdown {...props} isGraphBuilder />);

        await userEvent.click(
          screen.queryByRole('button', {
            name: 'Add widget',
          })
        );

        expect(
          screen.queryByRole('link', { name: 'Graph' })
        ).toBeInTheDocument();

        expect(screen.queryByRole('link', { name: 'Graph' })).toHaveAttribute(
          'href',
          '/analysis/graph/builder?analytical_dashboard_id=9#create'
        );
      });
    });
  });

  describe('the profile widget', () => {
    afterEach(() => {
      props.pivotedAthletes = _cloneDeep(emptySquadAthletes);
    });

    it('calls onClickOpenProfileWidgetModal with the correct params when clicking Profile item', async () => {
      render(<AddWidgetDropdown {...props} isGraphBuilder />);

      await userEvent.click(
        screen.queryByRole('button', {
          name: 'Add widget',
        })
      );

      await userEvent.click(screen.getByRole('button', { name: 'Profile' }));

      expect(props.onClickOpenProfileWidgetModal).toHaveBeenCalled();
      expect(props.onClickOpenProfileWidgetModal).toHaveBeenCalledWith(
        null,
        null,
        false,
        false,
        [
          { name: 'name' },
          { name: 'availability' },
          { name: 'date_of_birth' },
          { name: 'position' },
        ]
      );
    });

    it('calls onClickOpenProfileWidgetModal with the correct params when clicking Profile item and pivoted by 1 athlete', async () => {
      render(
        <AddWidgetDropdown
          {...props}
          pivotedAthletes={{ ...props.pivotedAthletes, athletes: [123] }}
          isGraphBuilder
        />
      );

      await userEvent.click(
        screen.queryByRole('button', {
          name: 'Add widget',
        })
      );

      await userEvent.click(screen.getByRole('button', { name: 'Profile' }));

      expect(props.onClickOpenProfileWidgetModal).toHaveBeenCalled();
      expect(props.onClickOpenProfileWidgetModal).toHaveBeenCalledWith(
        null,
        '123',
        false,
        false,
        [
          { name: 'name' },
          { name: 'availability' },
          { name: 'date_of_birth' },
          { name: 'position' },
        ]
      );
    });

    it('calls onClickOpenProfileWidgetModal with the correct params when clicking Profile item and pivoted by 2 athletes', async () => {
      render(
        <AddWidgetDropdown
          {...props}
          pivotedAthletes={{ ...props.pivotedAthletes, athletes: [123, 456] }}
          isGraphBuilder
        />
      );

      await userEvent.click(
        screen.queryByRole('button', {
          name: 'Add widget',
        })
      );

      await userEvent.click(screen.getByRole('button', { name: 'Profile' }));

      expect(props.onClickOpenProfileWidgetModal).toHaveBeenCalled();
      expect(props.onClickOpenProfileWidgetModal).toHaveBeenCalledWith(
        null,
        null,
        false,
        false,
        [
          { name: 'name' },
          { name: 'availability' },
          { name: 'date_of_birth' },
          { name: 'position' },
        ]
      );
    });
  });

  describe('the header widget', () => {
    afterEach(() => {
      props.pivotedAthletes = _cloneDeep(emptySquadAthletes);
    });

    it('calls onClickOpenHeaderWidgetModal with the correct params when clicking Header item', async () => {
      render(
        <AddWidgetDropdown
          {...props}
          dashboard={{ ...props.dashboard, name: 'test dashboard' }}
          isGraphBuilder
        />
      );

      await userEvent.click(
        screen.queryByRole('button', {
          name: 'Add widget',
        })
      );

      await userEvent.click(screen.getByRole('button', { name: 'Header' }));

      expect(props.onClickOpenHeaderWidgetModal).toHaveBeenCalled();
      expect(props.onClickOpenHeaderWidgetModal).toHaveBeenCalledWith(
        null,
        'test dashboard',
        _cloneDeep(emptySquadAthletes),
        '#ffffff',
        true,
        true,
        false
      );
    });

    it('calls onClickOpenHeaderWidgetModal with the correct params when clicking Header item when pivoted', async () => {
      const name = 'test dashboard';
      const pivotedAthletes = {
        applies_to_squad: true,
        position_groups: [1],
        positions: [99],
        athletes: [123, 456],
        all_squads: false,
        squads: [27],
      };

      render(
        <AddWidgetDropdown
          {...props}
          dashboard={{ ...props.dashboard, name: 'test dashboard' }}
          pivotedAthletes={pivotedAthletes}
          isGraphBuilder
        />
      );

      await userEvent.click(
        screen.queryByRole('button', {
          name: 'Add widget',
        })
      );

      await userEvent.click(screen.getByRole('button', { name: 'Header' }));

      expect(props.onClickOpenHeaderWidgetModal).toHaveBeenCalled();
      expect(props.onClickOpenHeaderWidgetModal).toHaveBeenCalledWith(
        null,
        name,
        pivotedAthletes,
        '#ffffff',
        true,
        true,
        false
      );
    });
  });

  describe('the table widget', () => {
    it('shows the right tooltip links', async () => {
      render(<AddWidgetDropdown {...props} isGraphBuilder />);

      await userEvent.click(
        screen.queryByRole('button', {
          name: 'Add widget',
        })
      );

      ['Graph', 'Profile', 'Header', 'Table', 'Development goals'].forEach(
        (item) => {
          expect(screen.queryByText(item)).toBeInTheDocument();
        }
      );
    });

    it('calls onClickOpenTableWidgetModal when clicking Table item', async () => {
      render(<AddWidgetDropdown {...props} isGraphBuilder />);

      await userEvent.click(
        screen.queryByRole('button', {
          name: 'Add widget',
        })
      );

      await userEvent.click(screen.getByRole('button', { name: 'Table' }));

      expect(props.onClickOpenTableWidgetModal).toHaveBeenCalled();
    });
  });

  // ---------------------

  describe('when the "evaluation-note" feature flag is enabled', () => {
    beforeEach(() => {
      window.setFlag('evaluation-note', true);
    });

    afterEach(() => {
      window.setFlag('evaluation-note', false);
      props.pivotedAthletes = _cloneDeep(emptySquadAthletes);
      props.pivotedDateRange = {};
      props.pivotedTimePeriod = '';
      props.pivotedTimePeriodLength = null;
    });

    it('calls onClickOpenNotesWidgetSettingsModal with the correct params when clicking the Note item', async () => {
      render(<AddWidgetDropdown {...props} isGraphBuilder />);

      await userEvent.click(
        screen.queryByRole('button', {
          name: 'Add widget',
        })
      );

      await userEvent.click(screen.getByRole('button', { name: 'Notes' }));

      expect(props.onClickOpenNotesWidgetSettingsModal).toHaveBeenCalled();
      expect(props.onClickOpenNotesWidgetSettingsModal).toHaveBeenCalledWith(
        null,
        '',
        [],
        {
          applies_to_squad: true,
          position_groups: [],
          positions: [],
          athletes: [],
          all_squads: false,
          squads: [],
        },
        {
          time_period: 'this_season',
          start_time: undefined,
          end_time: undefined,
          time_period_length: null,
        }
      );
    });

    it('calls onClickOpenNotesWidgetSettingsModal with the correct params when clicking the Note item when pivoted by athletes and a custom date range', async () => {
      props.dashboard.name = 'test dashboard';
      props.pivotedAthletes = {
        applies_to_squad: true,
        position_groups: [2],
        positions: [],
        athletes: [123],
        all_squads: false,
        squads: [2],
      };
      props.pivotedDateRange = {
        start_date: '2019-11-01T00:00:00Z',
        end_date: '2019-11-12T23:59:59Z',
      };
      props.pivotedTimePeriod = 'last_x_days';

      render(<AddWidgetDropdown {...props} isGraphBuilder />);

      await userEvent.click(
        screen.queryByRole('button', {
          name: 'Add widget',
        })
      );

      await userEvent.click(screen.getByRole('button', { name: 'Notes' }));

      expect(props.onClickOpenNotesWidgetSettingsModal).toHaveBeenCalled();
      expect(props.onClickOpenNotesWidgetSettingsModal).toHaveBeenCalledWith(
        null,
        '',
        [],
        props.pivotedAthletes,
        {
          time_period: props.pivotedTimePeriod,
          start_time: props.pivotedDateRange.start_date,
          end_time: props.pivotedDateRange.end_date,
          time_period_length: props.pivotedTimePeriodLength,
        }
      );
    });

    it('calls onClickOpenNotesWidgetSettingsModal with the correct params when clicking the Note item when pivoted by athletes and last x days', async () => {
      props.dashboard.name = 'test dashboard';
      props.pivotedAthletes = {
        applies_to_squad: true,
        position_groups: [2],
        positions: [],
        athletes: [123],
        all_squads: false,
        squads: [2],
      };
      props.pivotedTimePeriod = 'last_x_days';
      props.pivotedTimePeriodLength = 30;

      render(<AddWidgetDropdown {...props} isGraphBuilder />);

      await userEvent.click(
        screen.queryByRole('button', {
          name: 'Add widget',
        })
      );

      await userEvent.click(screen.getByRole('button', { name: 'Notes' }));

      expect(props.onClickOpenNotesWidgetSettingsModal).toHaveBeenCalled();
      expect(props.onClickOpenNotesWidgetSettingsModal).toHaveBeenCalledWith(
        null,
        '',
        [],
        props.pivotedAthletes,
        {
          time_period: props.pivotedTimePeriod,
          start_time: props.pivotedDateRange.start_date,
          end_time: props.pivotedDateRange.end_date,
          time_period_length: props.pivotedTimePeriodLength,
        }
      );
    });
  });

  it('shows the correct terminology when developmentGoalTerminology exists', async () => {
    render(
      <AddWidgetDropdown
        {...props}
        developmentGoalTerminology="Custom terminology"
        isGraphBuilder
      />
    );

    await userEvent.click(
      screen.queryByRole('button', {
        name: 'Add widget',
      })
    );

    expect(screen.queryByText('Custom terminology')).toBeInTheDocument();
  });

  it('calls onClickAddDevelopmentGoalWidget and trackEvent when clicking the Development Goals item', async () => {
    render(<AddWidgetDropdown {...props} isGraphBuilder />);

    await userEvent.click(
      screen.queryByRole('button', {
        name: 'Add widget',
      })
    );

    await userEvent.click(
      screen.getByRole('button', { name: 'Development goals' })
    );

    expect(props.onClickAddDevelopmentGoalWidget).toHaveBeenCalled();
    expect(trackEventMock).toHaveBeenCalledWith('Add development goal widget');
  });

  it('calls trackEvent with correct Data', async () => {
    render(<AddWidgetDropdown {...props} isGraphBuilder />);

    await userEvent.click(
      screen.queryByRole('button', {
        name: 'Add widget',
      })
    );

    await userEvent.click(screen.getByRole('link', { name: 'Graph' }));

    expect(trackEventMock).toHaveBeenCalledWith('View Graph Builder');
  });

  it('does not show add Developement goals widget when the organisation does not have the development-goals module', async () => {
    render(
      <AddWidgetDropdown
        {...props}
        isGraphBuilder
        hasDevelopmentGoalsModule={false}
      />
    );

    await userEvent.click(
      screen.queryByRole('button', {
        name: 'Add widget',
      })
    );

    expect(
      screen.queryByRole('button', { name: 'Development goals' })
    ).not.toBeInTheDocument();
  });

  describe('when the "web-home-page" feature flag is on', () => {
    beforeEach(() => {
      window.setFlag('web-home-page', true);
      window.setFlag('evaluation-note', true);
    });

    afterEach(() => {
      window.setFlag('web-home-page', false);
      window.setFlag('evaluation-note', false);
    });

    it('shows the right tooltip links when containerType is HomeDashboard', async () => {
      render(
        <AddWidgetDropdown
          {...props}
          containerType="HomeDashboard"
          isGraphBuilder
        />
      );

      await userEvent.click(
        screen.queryByRole('button', {
          name: 'Add widget',
        })
      );

      ['Notes', 'Table', 'Actions'].forEach((item) => {
        expect(screen.queryByText(item)).toBeInTheDocument();
      });
    });

    it('does not show add Notes and add Actions widget when the user does not have the view notes permission', async () => {
      render(
        <AddWidgetDropdown
          {...props}
          containerType="HomeDashboard"
          isGraphBuilder
          canViewNotes={false}
        />
      );

      await userEvent.click(
        screen.queryByRole('button', {
          name: 'Add widget',
        })
      );

      ['Table'].forEach((item) => {
        expect(screen.queryByText(item)).toBeInTheDocument();
      });
      ['Notes', 'Actions'].forEach((item) => {
        expect(screen.queryByText(item)).not.toBeInTheDocument();
      });
    });

    it('calls onClickAddActionsWidget when clicking Actions item', async () => {
      render(
        <AddWidgetDropdown
          {...props}
          containerType="HomeDashboard"
          isGraphBuilder
        />
      );

      await userEvent.click(
        screen.queryByRole('button', {
          name: 'Add widget',
        })
      );

      await userEvent.click(screen.getByRole('button', { name: 'Actions' }));

      expect(props.onClickAddActionsWidget).toHaveBeenCalled();
      expect(props.onClickAddActionsWidget).toHaveBeenCalledWith(
        null,
        [2, 3],
        {
          applies_to_squad: true,
          position_groups: [],
          positions: [],
          athletes: [],
          all_squads: false,
          squads: [],
        },
        []
      );
    });
  });

  describe('when the "rep-charts-v2" feature flag is turned on', () => {
    beforeEach(() => {
      window.setFlag('rep-charts-v2', true);
    });

    afterEach(() => {
      window.setFlag('rep-charts-v2', false);
    });

    it('shows the Chart tooltip link', async () => {
      render(
        <AddWidgetDropdown
          {...props}
          containerType="HomeDashboard"
          isGraphBuilder
        />
      );

      await userEvent.click(
        screen.queryByRole('button', {
          name: 'Add widget',
        })
      );

      expect(screen.queryByText('Chart')).toBeInTheDocument();
    });

    it('calls the onAddChart callback when clicked', async () => {
      render(<AddWidgetDropdown {...props} isGraphBuilder />);

      await userEvent.click(
        screen.queryByRole('button', {
          name: 'Add widget',
        })
      );

      await userEvent.click(screen.getByRole('button', { name: /Chart/ }));

      expect(props.onAddChart).toHaveBeenCalled();
    });
  });
});
