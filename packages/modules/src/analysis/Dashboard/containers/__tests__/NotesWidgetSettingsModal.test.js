import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as reactRedux from 'react-redux';
import { renderWithStore } from '@kitman/modules/src/analysis/Dashboard/utils/testUitils';
import { emptySquadAthletes } from '../../components/utils';
import NotesWidgetSettingsModalContainer from '../NotesWidgetSettingsModal';

const mockDispatch = jest.fn();

describe('NotesWidgetSettingsModal Container', () => {
  const containerProps = {
    squadAthletes: emptySquadAthletes,
    squads: [
      {
        id: 1,
        name: 'Squad 1',
      },
    ],
    turnaroundList: [],
    annotationTypes: [],
  };

  const defaultState = {
    dashboard: {},
    dashboardApi: {},
    globalApi: {
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
        reducerPath: 'globalApi',
      },
    },
    notesWidgetSettingsModal: {
      isOpen: true,
      population: {
        applies_to_squad: true,
        position_groups: [],
        positions: [],
        athletes: [],
        all_squads: false,
        squads: [],
      },
      time_scope: {
        time_period: 'this_season',
        start_time: '',
        end_time: '',
        time_period_length: null,
      },
      widget_annotation_types: [],
      widgetId: null,
    },
    staticData: {},
  };

  beforeEach(() => {
    jest.spyOn(reactRedux, 'useDispatch').mockReturnValue(mockDispatch);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('sets props correctly', () => {
    renderWithStore(
      <NotesWidgetSettingsModalContainer {...containerProps} />,
      {},
      defaultState
    );

    expect(screen.getByText('Notes Widget Settings')).toBeInTheDocument();
  });

  it('dispatches the correct action when onClickCloseModal is called', async () => {
    const user = userEvent.setup();

    renderWithStore(
      <NotesWidgetSettingsModalContainer {...containerProps} />,
      {},
      defaultState
    );

    const closeButton = screen.getByRole('button', { name: '' });
    await user.click(closeButton);

    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'CLOSE_NOTES_WIDGET_SETTINGS_MODAL',
    });
  });

  it('renders AthleteSelector component correctly', () => {
    renderWithStore(
      <NotesWidgetSettingsModalContainer {...containerProps} />,
      {},
      defaultState
    );

    expect(screen.getByText('#sport_specific__Athletes')).toBeInTheDocument();
    expect(
      screen.getByText('#sport_specific__Entire_Squad')
    ).toBeInTheDocument();
  });

  it('dispatches the correct action when Save button is clicked', async () => {
    const user = userEvent.setup();

    const stateWithAnnotationTypes = {
      ...defaultState,
      notesWidgetSettingsModal: {
        ...defaultState.notesWidgetSettingsModal,
        widget_annotation_types: [
          { organisation_annotation_type_id: 1, name: 'Test Annotation' },
        ],
      },
    };

    renderWithStore(
      <NotesWidgetSettingsModalContainer {...containerProps} />,
      {},
      stateWithAnnotationTypes
    );

    const saveButton = screen.getByRole('button', { name: 'Save' });
    await user.click(saveButton);

    expect(mockDispatch).toHaveBeenCalledTimes(1);
  });
});
