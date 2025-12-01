import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithStore } from '@kitman/modules/src/analysis/Dashboard/utils/testUitils';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import useEventTracking from '@kitman/common/src/hooks/useEventTracking';

import NotesWidgetSettingsModal from '..';

jest.mock('@kitman/common/src/hooks/useEventTracking');

describe('<NotesWidgetSettingsModal />', () => {
  const mockTrackEvent = jest.fn();
  const mockProps = {
    annotationTypes: [],
    isOpen: false,
    onClickCloseModal: jest.fn(),
    onClickSaveNotesWidgetSettings: jest.fn(),
    onSetNotesWidgetSettingsPopulation: jest.fn(),
    onSetNotesWidgetSettingsTimePeriod: jest.fn(),
    onSelectAnnotationType: jest.fn(),
    onUnselectAnnotationType: jest.fn(),
    onUpdateNotesWidgetSettingsDateRange: jest.fn(),
    onUpdateNotesWidgetSettingsTimePeriodLength: jest.fn(),
    selectedAnnotationTypes: [],
    selectedDateRange: {},
    selectedPopulation: {
      applies_to_squad: false,
      position_groups: [],
      positions: [],
      athletes: [],
      all_squads: false,
      squads: [],
    },
    selectedTimePeriod: 'today',
    selectedTimePeriodLength: 1,
    turnaroundList: [],
    widgetId: 1,
    t: i18nextTranslateStub(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    useEventTracking.mockReturnValue({
      trackEvent: mockTrackEvent,
    });
  });

  it('contains a closed modal', () => {
    renderWithStore(<NotesWidgetSettingsModal {...mockProps} isOpen={false} />);

    expect(screen.queryByText('Notes Widget Settings')).not.toBeInTheDocument();
  });

  it('contains an open modal', () => {
    renderWithStore(<NotesWidgetSettingsModal {...mockProps} isOpen />);

    expect(screen.queryByText('Notes Widget Settings')).toBeInTheDocument();
  });

  it('calls the correct props when closing the modal', async () => {
    const user = userEvent.setup();
    const onClickCloseModal = jest.fn();

    renderWithStore(
      <NotesWidgetSettingsModal
        {...mockProps}
        isOpen
        onClickCloseModal={onClickCloseModal}
      />
    );

    const closeButton = screen.getByRole('button', { name: '' });
    await user.click(closeButton);

    expect(onClickCloseModal).toHaveBeenCalledTimes(1);
  });

  it('contains a note type MultiSelectDropdown', () => {
    renderWithStore(<NotesWidgetSettingsModal {...mockProps} isOpen />);

    expect(screen.getByText('Note Type')).toBeInTheDocument();
  });

  it('contains an AthleteSelector', () => {
    renderWithStore(<NotesWidgetSettingsModal {...mockProps} isOpen />);

    expect(screen.getByText('#sport_specific__Athletes')).toBeInTheDocument();
  });

  it('contains a TimePeriod component', () => {
    renderWithStore(
      <NotesWidgetSettingsModal
        {...mockProps}
        isOpen
        selectedTimePeriod="this_season"
      />
    );

    expect(screen.getByText('Date Range')).toBeInTheDocument();
    expect(screen.getByText('Today')).toBeInTheDocument();
  });

  it('calls the correct prop callback when a period item is selected', async () => {
    const user = userEvent.setup();
    const onSetNotesWidgetSettingsTimePeriod = jest.fn();

    renderWithStore(
      <NotesWidgetSettingsModal
        {...mockProps}
        isOpen
        selectedTimePeriod="this_season"
        onSetNotesWidgetSettingsTimePeriod={onSetNotesWidgetSettingsTimePeriod}
      />
    );

    const todayButton = screen.getByText('Today');
    await user.click(todayButton);
    expect(onSetNotesWidgetSettingsTimePeriod).toHaveBeenCalledWith('today');
  });

  it('calls the correct prop callback when the This Season So Far is selected', async () => {
    const user = userEvent.setup();
    const onSetNotesWidgetSettingsTimePeriod = jest.fn();

    renderWithStore(
      <NotesWidgetSettingsModal
        {...mockProps}
        isOpen
        onSetNotesWidgetSettingsTimePeriod={onSetNotesWidgetSettingsTimePeriod}
      />
    );

    const todayButton = screen.getByText('This Season So Far');
    await user.click(todayButton);
    expect(onSetNotesWidgetSettingsTimePeriod).toHaveBeenCalledWith(
      'this_season_so_far'
    );
  });

  it('calls the correct prop callback when Last Week is selected', async () => {
    const user = userEvent.setup();
    const onSetNotesWidgetSettingsTimePeriod = jest.fn();

    renderWithStore(
      <NotesWidgetSettingsModal
        {...mockProps}
        isOpen
        onSetNotesWidgetSettingsTimePeriod={onSetNotesWidgetSettingsTimePeriod}
      />
    );

    const todayButton = screen.getByText('Last Week');
    await user.click(todayButton);
    expect(onSetNotesWidgetSettingsTimePeriod).toHaveBeenCalledWith(
      'last_week'
    );
  });

  it('contains a footer with a save button', () => {
    renderWithStore(<NotesWidgetSettingsModal {...mockProps} isOpen />);

    expect(screen.getByText('Save')).toBeInTheDocument();
  });

  it('calls the correct callback when clicking save and selectedAnnotationTypes is not empty', async () => {
    const user = userEvent.setup();
    const onClickSaveNotesWidgetSettings = jest.fn();

    renderWithStore(
      <NotesWidgetSettingsModal
        {...mockProps}
        isOpen
        selectedAnnotationTypes={[{ organisation_annotation_type_id: 9 }]}
        onClickSaveNotesWidgetSettings={onClickSaveNotesWidgetSettings}
      />
    );

    const saveButton = screen.getByText('Save');
    await user.click(saveButton);

    expect(onClickSaveNotesWidgetSettings).toHaveBeenCalledTimes(1);
  });

  it('calls trackEvent with correct Data', async () => {
    const user = userEvent.setup();

    renderWithStore(<NotesWidgetSettingsModal {...mockProps} isOpen />);

    const saveButton = screen.getByText('Save');
    await user.click(saveButton);

    expect(mockTrackEvent).toHaveBeenCalledWith('Add Notes Widget');
  });
});
