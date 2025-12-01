import { screen } from '@testing-library/react';
import structuredClone from 'core-js/stable/structured-clone';
import userEvent from '@testing-library/user-event';
import sinon from 'sinon';
import colors from '@kitman/common/src/variables/colors';
import { renderWithStore } from '@kitman/modules/src/analysis/Dashboard/utils/testUitils';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';

import {
  useGetPermittedSquadsQuery,
  useGetSquadAthletesQuery,
} from '@kitman/modules/src/analysis/Dashboard/redux/services/dashboard';
import { REDUCER_KEY as COLUMN_FORMULA_PANEL_REDUCER_KEY } from '@kitman/modules/src/analysis/Dashboard/redux/slices/columnFormulaPanelSlice';
// eslint-disable-next-line jest/no-mocks-import
import { COLUMN_FORMULA_PANEL_STATE } from '@kitman/modules/src/analysis/Dashboard/redux/__mocks__/tableWidget';
import { emptySquadAthletes } from '../../utils';
import App from '../../App';

jest.mock(
  '@kitman/modules/src/analysis/Dashboard/redux/services/dashboard',
  () => ({
    ...jest.requireActual(
      '@kitman/modules/src/analysis/Dashboard/redux/services/dashboard'
    ),
    useGetPermittedSquadsQuery: jest.fn(),
    useGetSquadAthletesQuery: jest.fn(),
  })
);

describe('Analytical Dashboard <App /> component', () => {
  const store = {
    dashboard: {
      activeDashboard: { id: 123 },
      widgets: [],
      isReorderModalOpen: false,
      isSlidingPanelOpen: false,
      isTableFormattingPanelOpen: false,
      isTableColumnPanelOpen: false,
      isTableRowPanelOpen: false,
      isTableColumnFormulaPanelOpen: true,
      toast: [],
    },
    dashboardApi: {
      queries: {},
      mutations: {},
      provided: {},
      subscriptions: {},
      config: {
        online: true,
        focused: true,
        middlewareRegistered: true,
        refetchOnFocus: false,
        refetchOnReconnect: false,
        refetchOnMountOrArgChange: false,
        keepUnusedDataFor: 60,
        reducerPath: 'dashboardApi',
      },
    },
    duplicateDashboardModal: {
      dashboardName: '',
      isOpen: false,
      selectedSquad: {
        id: null,
      },
    },
    duplicateWidgetModal: {
      isOpen: false,
      activeSquad: { id: 123 },
      activeDashboard: { id: 123 },
      selectedDashboard: {},
      selectedSquad: {},
      widgetType: '',
    },
    graphLinksModal: {
      graphLinks: [],
    },
    headerWidgetModal: {
      open: false,
    },
    profileWidgetModal: {
      open: false,
      athlete: null,
      avatar_availability: false,
      avatar_squad_number: false,
      fields: [
        { name: 'name' },
        { name: 'availability' },
        { name: 'date_of_birth' },
        { name: 'position' },
      ],
      preview: {},
    },
    notesWidget: {
      availableAthletes: [],
      notesModal: {
        isNotesModalOpen: false,
      },
      toast: {
        fileOrder: [],
        fileMap: {},
      },
      widget_annotation_types: [
        {
          organisation_annotation_type_id: 1,
        },
      ],
    },
    notesWidgetSettingsModal: {
      isOpen: false,
      population: {},
      time_scope: {
        time_period: '',
        start_time: '',
        end_time: '',
        time_period_length: null,
      },
      widget_annotation_types: [],
    },
    printBuilder: {
      isOpen: false,
    },
    tableWidget: {
      appliedColumns: [],
      columnPanel: {
        isEditMode: false,
        metrics: [],
        time_scope: {},
      },
      rowPanel: {
        calculation: '',
        metrics: [],
        time_scope: {},
        population: {
          all_squads: false,
          applies_to_squad: false,
          athletes: [],
          squads: [],
          positions: [],
          position_groups: [],
        },
      },
      formattingPanel: {
        appliedFormat: [],
        formattableId: null,
        panelName: null,
        ruleUnit: null,
      },
      tableType: null,
    },
    noteDetailModal: {
      isOpen: false,
    },
    tableWidgetModal: {
      isOpen: false,
    },
    actionsWidgetModal: {
      isOpen: false,
      population: {},
      organisation_annotation_type_ids: [],
      hidden_columns: [],
    },
    annotation: {
      annotationable: {},
    },
    staticData: {
      containerType: 'AnalyticalDashboard',
    },
    dashboardList: [],
    injuryRiskMetrics: {
      isLoading: false,
      hasErrored: false,
      metrics: [],
    },
    developmentGoalForm: {
      isOpen: false,
      initialFormData: {
        id: null,
        athlete_id: null,
        description: '',
        development_goal_type_ids: [],
        principle_ids: [],
        start_time: null,
        close_time: null,
        copy_to_athlete_ids: [],
      },
      next_id: null,
    },
    coachingPrinciples: {
      isEnabled: true,
    },
    chartBuilderApi: {
      queries: {},
      mutations: {},
      provided: {},
      subscriptions: {},
      config: {
        online: true,
        focused: true,
        middlewareRegistered: true,
        refetchOnFocus: false,
        refetchOnReconnect: false,
        refetchOnMountOrArgChange: false,
        keepUnusedDataFor: 60,
        reducerPath: 'chartBuilderApi',
      },
    },
    [COLUMN_FORMULA_PANEL_REDUCER_KEY]: structuredClone(
      COLUMN_FORMULA_PANEL_STATE
    ),
  };

  const props = {
    containerType: 'AnalyticalDashboard',
    annotationTypes: [
      {
        organisation_annotation_type_id: 1,
      },
    ],
    athletes: [],
    availableVariables: [],
    dashboard: {
      id: '4',
      name: 'Dashboard Name',
    },
    dashboardList: [
      {
        id: '4',
        name: 'Dashboard Name',
      },
      {
        id: '5',
        name: 'Other Dashboard Name',
      },
    ],
    dashboardName: 'Dashboard Name',
    orgName: 'Org Name',
    squadName: 'Squad Name',
    currentUser: {
      id: 1,
      fullname: 'John Doh',
      firstname: 'John',
      lastname: 'Doh',
    },
    isGraphBuilder: true,
    widgets: [],
    status: null,
    appStatusText: '',
    fetchAllWidgets: jest.fn(),
    fetchSingleWidget: jest.fn(),
    getAreCoachingPrinciplesEnabled: jest.fn(),
    setCoachingPrinciplesEnabled: jest.fn(),
    onClickOpenGraphLinksModal: jest.fn(),
    onClickOpenDuplicateDashboardModal: jest.fn(),
    onClickOpenDuplicateWidgetModal: jest.fn(),
    onClickOpenHeaderWidgetModal: jest.fn(),
    onClickOpenReorderModal: jest.fn(),
    onClickOpenProfileWidgetModal: jest.fn(),
    onCloseReorderModal: jest.fn(),
    onDeleteWidget: jest.fn(),
    onUpdateDashboard: jest.fn(),
    updateDashboardLayout: jest.fn(),
    onClickOpenPrintBuilder: jest.fn(),
    isReorderModalOpen: false,
    isSlidingPanelOpen: false,
    toggleSlidingPanel: jest.fn(),
    appliedSquadAthletes: emptySquadAthletes,
    appliedDateRange: {},
    appliedTimePeriod: '',
    appliedTimePeriodLength: null,
    canManageDashboard: true,
    dashboardLayout: [
      {
        i: '1',
        x: 0,
        y: 0,
        h: 5,
        w: 6,
        maxH: 7,
        minH: 2,
        maxW: 6,
        minW: 1,
      },
      {
        i: '2',
        x: 0,
        y: 0,
        h: 5,
        w: 6,
        maxH: 7,
        minH: 2,
        maxW: 6,
        minW: 1,
      },
    ],
    t: i18nextTranslateStub(),
    users: [
      {
        id: 1,
        name: 'Jon Doe',
      },
      {
        id: 2,
        name: 'John Appleseed',
      },
      {
        id: 27280,
        name: 'Gustavo Lazaro Amendola',
      },
    ],
  };

  beforeEach(() => {
    useGetSquadAthletesQuery.mockReturnValue({
      data: { position_groups: [] },
      isFetching: false,
      isSuccess: true,
    });
    useGetPermittedSquadsQuery.mockReturnValue({
      data: [
        { id: 1, name: 'First Squad' },
        { id: 2, name: 'Second Squad' },
      ],
      isFetching: false,
      isSuccess: true,
    });
  });

  describe('FF [rep-table-formula-columns] is off', () => {
    beforeEach(() => {
      window.setFlag('rep-table-formula-columns', false);
    });

    it('does not render the TableColumnFormulaPanel', async () => {
      renderWithStore(<App {...props} />, {}, store);

      const dashboardName = await screen.findAllByText('Dashboard Name');
      expect(dashboardName.length).toEqual(3);

      expect(
        screen.queryByText('Add % baseline change formula')
      ).not.toBeInTheDocument();
    });
  });

  describe('FF [rep-table-formula-columns] is on', () => {
    beforeEach(() => {
      window.setFlag('rep-table-formula-columns', true);
    });

    afterEach(() => {
      window.setFlag('rep-table-formula-columns', false);
    });

    it('renders the TableColumnFormulaPanel', async () => {
      renderWithStore(<App {...props} />, {}, store);

      const formulaPanelTitle = await screen.findByText(
        'Add % baseline change formula'
      );
      expect(formulaPanelTitle).toBeInTheDocument();
    });
  });

  it('renders the component', () => {
    renderWithStore(<App {...props} />, {}, store);

    const dashboardNames = screen.queryAllByText('Dashboard Name');
    expect(dashboardNames.length).toBe(3);
  });

  it('renders DashboardHeader', async () => {
    renderWithStore(<App {...props} />, {}, store);

    const header = screen.getByRole('heading', { name: 'Dashboard Name' });
    expect(header).toBeInTheDocument();
    expect(header).toHaveClass('analyticalDashboard__title');
  });

  describe('Dashboard permissions', () => {
    it('does not show dashboard action buttons without analytical-dashboard-manager permission', async () => {
      const propsWithoutPermission = {
        ...props,
        canManageDashboard: false,
      };

      renderWithStore(<App {...propsWithoutPermission} />, {}, store);

      expect(screen.queryByText('Add Widget')).not.toBeInTheDocument();
    });
  });

  describe('Print header with date formatting', () => {
    describe('when the standard-date-formatting flag is off', () => {
      it('renders the print header with default date format', async () => {
        renderWithStore(<App {...props} />, {}, store);

        expect(screen.getByText('Print')).toBeInTheDocument();
        expect(screen.getByText('Squad Name')).toBeInTheDocument();
        expect(screen.getByText('John Doh')).toBeInTheDocument();
      });
    });

    describe('when the standard-date-formatting flag is on', () => {
      beforeEach(() => {
        window.setFlag('standard-date-formatting', true);
      });

      afterEach(() => {
        window.setFlag('standard-date-formatting', false);
      });

      it('renders the print header', () => {
        renderWithStore(<App {...props} />, {}, store);

        expect(screen.getByText('Report date')).toBeInTheDocument();
      });
    });
  });

  describe('Empty dashboard scenarios', () => {
    describe('when user lacks graph builder and dashboard manager permissions', () => {
      it('shows EmptyDashboard without add widget buttons', () => {
        const restrictedProps = {
          ...props,
          widgets: [],
          canManageDashboard: false,
          isGraphBuilder: false,
        };

        renderWithStore(<App {...restrictedProps} />, {}, store);

        screen.queryAllByText('Dashboard Name');
        expect(screen.queryByText('Add Widget')).not.toBeInTheDocument();
      });
    });
  });

  describe('Widget with disabled feature flag', () => {
    it('renders blank div when widget feature flag is turned off', async () => {
      const propsWithAnnotationWidget = {
        ...props,
        widgets: [
          {
            cols: 6,
            horizontal_position: 0,
            id: 200,
            rows: 1,
            vertical_position: 0,
            widget: {},
            widget_render: {},
            widget_type: 'annotation',
          },
        ],
      };

      renderWithStore(<App {...propsWithAnnotationWidget} />, {}, store);

      expect(screen.queryByTestId('notes-widget')).not.toBeInTheDocument();
      expect(screen.queryByText('Add Widget')).not.toBeInTheDocument();
    });
  });

  describe('Reorder modal functionality', () => {
    const widgetProps = {
      ...props,
      widgets: [
        {
          cols: 6,
          horizontal_position: 0,
          id: 200,
          rows: 1,
          vertical_position: 0,
          widget: {
            athlete_id: 1,
            avatar_availability: false,
            avatar_squad_number: false,
            fields: [
              { name: 'name', displayName: 'Name' },
              { name: 'availability', displayName: 'Availability' },
              { name: 'date_of_birth', displayName: 'Date of Birth' },
              { name: 'position', displayName: 'Position' },
            ],
            background_colour: colors.white,
          },
          widget_render: {
            availability_status: 'available',
            field_values: [],
            avatar_url: 'test-url.jpg',
          },
          widget_type: 'athlete_profile',
        },
      ],
    };

    it('calls correct callback on opening reorder modal', async () => {
      const user = userEvent.setup();
      const openReorderModalSpy = jest.fn();

      const { container } = renderWithStore(
        <App
          {...widgetProps}
          onClickOpenReorderModal={openReorderModalSpy}
          isPrinting={false}
          isDashboardManager
        />,
        {},
        store
      );

      const menuButton = container
        .querySelector('.textButton__icon--after.icon-more')
        .closest('button');

      await user.click(menuButton);
      const reorderButton = screen.getByText('Customise Layout');
      await user.click(reorderButton);

      expect(openReorderModalSpy).toHaveBeenCalledTimes(1);
    });

    it('calls correct callback on opening duplicate dashboard modal', async () => {
      const user = userEvent.setup();
      const openDuplicateModalSpy = jest.fn();
      const { container } = renderWithStore(
        <App
          {...widgetProps}
          onClickOpenDuplicateDashboardModal={openDuplicateModalSpy}
        />,
        {},
        store
      );

      const menuButton = container
        .querySelector('.textButton__icon--after.icon-more')
        .closest('button');

      await user.click(menuButton);
      const duplicateButton = screen.getByText('Duplicate Dashboard');
      await user.click(duplicateButton);

      expect(openDuplicateModalSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('Widget management', () => {
    describe('when dashboard contains widgets', () => {
      const widgetProps = {
        ...props,
        widgets: [
          {
            cols: 6,
            horizontal_position: 0,
            id: 200,
            rows: 1,
            vertical_position: 0,
            widget: {
              athlete_id: 1,
              avatar_availability: false,
              avatar_squad_number: false,
              fields: [
                { name: 'name', displayName: 'Name' },
                { name: 'availability', displayName: 'Availability' },
                { name: 'date_of_birth', displayName: 'Date of Birth' },
                { name: 'position', displayName: 'Position' },
              ],
              background_colour: colors.white,
            },
            widget_render: {
              availability_status: 'available',
              field_values: [],
              avatar_url: 'test-url.jpg',
            },
            widget_type: 'athlete_profile',
          },
        ],
      };

      it('shows AddWidgetDropdown component', () => {
        renderWithStore(<App {...widgetProps} />, {}, store);

        expect(screen.getAllByText('Add widget')).toHaveLength(2);
      });
    });
  });

  describe('Pivot Dashboard functionality', () => {
    describe('when dashboard is empty', () => {
      it('handles pivot operations on empty dashboard', () => {
        const emptyPivotProps = {
          ...props,
          widgets: [],
          isSlidingPanelOpen: false,
        };

        renderWithStore(<App {...emptyPivotProps} />, {}, store);

        expect(
          screen.getByRole('button', { name: 'Pivot' })
        ).toBeInTheDocument();
      });
    });

    describe('Greeting messages by time of day', () => {
      describe('when it is morning', () => {
        let timer;

        beforeEach(() => {
          const morningTime = new Date('October 15, 2025 9:00:00');
          timer = sinon.useFakeTimers(morningTime.getTime());
        });

        afterEach(() => {
          timer.restore();
        });

        it('shows morning greeting when user is on homepage', async () => {
          const homeDashboardProps = {
            ...props,
            containerType: 'HomeDashboard',
          };

          renderWithStore(<App {...homeDashboardProps} />, {}, store);

          const message = screen.getByText('Good morning John');
          expect(message).toBeInTheDocument();
          expect(message).toHaveClass('analyticalDashboard__welcomeMessage');
        });
      });

      describe('when it is afternoon', () => {
        let timer;

        beforeEach(() => {
          const morningTime = new Date('October 15, 2025 13:00:00');
          timer = sinon.useFakeTimers(morningTime.getTime());
        });

        afterEach(() => {
          timer.restore();
        });

        it('shows afternoon greeting when user is on homepage', async () => {
          const homeDashboardProps = {
            ...props,
            containerType: 'HomeDashboard',
          };

          renderWithStore(<App {...homeDashboardProps} />, {}, store);

          const message = screen.getByText('Good afternoon John');
          expect(message).toBeInTheDocument();
          expect(message).toHaveClass('analyticalDashboard__welcomeMessage');
        });
      });

      describe('when it is evening', () => {
        let timer;

        beforeEach(() => {
          const morningTime = new Date('October 15, 2020 19:00:00');
          timer = sinon.useFakeTimers(morningTime.getTime());
        });

        afterEach(() => {
          timer.restore();
        });
        it('shows evening greeting when user is on homepage', async () => {
          const homeDashboardProps = {
            ...props,
            containerType: 'HomeDashboard',
          };

          renderWithStore(<App {...homeDashboardProps} />, {}, store);

          const message = screen.getByText('Good evening John');
          expect(message).toBeInTheDocument();
          expect(message).toHaveClass('analyticalDashboard__welcomeMessage');
        });
      });
    });
  });
});
