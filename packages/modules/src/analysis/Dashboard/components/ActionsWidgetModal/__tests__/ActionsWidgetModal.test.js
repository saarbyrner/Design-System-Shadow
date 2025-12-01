import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithStore } from '@kitman/modules/src/analysis/Dashboard/utils/testUitils';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import * as useEventTrackingModule from '@kitman/common/src/hooks/useEventTracking';
import ActionsWidgetModal from '..';

const annotationTypes = [
  {
    id: 548,
    name: 'Evaluation note',
    type: 'OrganisationAnnotationTypes::Evaluation',
  },
  {
    id: 81,
    name: 'General note',
    type: 'OrganisationAnnotationTypes::General',
  },
];

jest.mock('@kitman/common/src/hooks/useEventTracking');

describe('<ActionsWidgetModal />', () => {
  const mockTrackEvent = jest.fn();
  const mockProps = {
    isOpen: false,
    onClickCloseModal: jest.fn(),
    selectedAnnotationTypes: [],
    selectedPopulation: {
      applies_to_squad: true,
      position_groups: [],
      positions: [],
      athletes: [],
      all_squads: false,
      squads: [],
    },
    selectedHiddenColumns: [],
    annotationTypes: [],
    squadAthletes: [],
    squads: [],
    status: null,
    onSelectAnnotationType: jest.fn(),
    onUnselectAnnotationType: jest.fn(),
    onSetPopulation: jest.fn(),
    onHiddenColumnsChange: jest.fn(),
    onClickCloseAppStatus: jest.fn(),
    onClickSaveActionsWidget: jest.fn(),
    t: i18nextTranslateStub(),
  };

  beforeEach(() => {
    useEventTrackingModule.default.mockReturnValue({
      trackEvent: mockTrackEvent,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('does not show the modal when isOpen = false', () => {
    renderWithStore(<ActionsWidgetModal {...mockProps} />);

    const modalContent = screen.queryByText('Actions Widget Settings');
    expect(modalContent).not.toBeInTheDocument();
  });

  it('shows the modal when isOpen = true', () => {
    renderWithStore(<ActionsWidgetModal {...mockProps} isOpen />);

    const modalContent = screen.queryByText('Actions Widget Settings');
    expect(modalContent).toBeInTheDocument();
  });

  it('shows the correct tabs', () => {
    renderWithStore(<ActionsWidgetModal {...mockProps} isOpen />);

    expect(screen.getByText('Action settings')).toBeInTheDocument();
    expect(screen.getByText('Table settings')).toBeInTheDocument();
  });

  it('calls the correct props when closing the modal', async () => {
    const user = userEvent.setup();
    renderWithStore(<ActionsWidgetModal {...mockProps} isOpen />);

    const closeButton = screen.getByRole('button', { name: '' });
    await user.click(closeButton);

    expect(mockProps.onClickCloseModal).toHaveBeenCalledTimes(1);
  });

  it('contains a note type MultiSelectDropdown', () => {
    renderWithStore(<ActionsWidgetModal {...mockProps} isOpen />);

    expect(screen.getByText('Note type')).toBeInTheDocument();
  });

  it('shows only evaluation notes in the note type dropdown', async () => {
    const user = userEvent.setup();

    renderWithStore(
      <ActionsWidgetModal
        {...mockProps}
        isOpen
        annotationTypes={annotationTypes}
      />
    );

    const dropdownWrapper = screen
      .getByText('Note type')
      .closest('[data-testid="DropdownWrapper"]');
    const dropdownHeader = dropdownWrapper.querySelector(
      '.dropdownWrapper__header'
    );
    await user.click(dropdownHeader);

    expect(screen.getByText('Evaluation note')).toBeInTheDocument();
    expect(screen.queryByText('General note')).not.toBeInTheDocument();
  });

  it('calls the correct prop callback when a note type is selected', async () => {
    const user = userEvent.setup();
    renderWithStore(
      <ActionsWidgetModal
        {...mockProps}
        isOpen
        annotationTypes={annotationTypes}
      />
    );

    const dropdownWrapper = screen
      .getByText('Note type')
      .closest('[data-testid="DropdownWrapper"]');
    const dropdownHeader = dropdownWrapper.querySelector(
      '.dropdownWrapper__header'
    );
    await user.click(dropdownHeader);
    await user.click(screen.getByText('Evaluation note'));

    expect(mockProps.onSelectAnnotationType).toHaveBeenCalledTimes(1);
  });

  it('contains an AthleteSelector', () => {
    renderWithStore(<ActionsWidgetModal {...mockProps} isOpen />);

    expect(screen.getByText('#sport_specific__Athletes')).toBeInTheDocument();
  });

  it('calls the correct prop callback when the user selects an hidden column', async () => {
    const user = userEvent.setup();
    renderWithStore(<ActionsWidgetModal {...mockProps} isOpen />);

    const tableSettingsTab = screen.getByText('Table settings');
    await user.click(tableSettingsTab);

    expect(screen.getByText('View on table')).toBeInTheDocument();
    expect(screen.getByText('Due date')).toBeInTheDocument();
    expect(screen.getByText('Time remaining')).toBeInTheDocument();
    expect(screen.getByText('Also assigned')).toBeInTheDocument();

    const switches = screen.getAllByRole('switch');
    await user.click(switches[0]);

    expect(mockProps.onHiddenColumnsChange).toHaveBeenCalledWith(
      expect.arrayContaining(['due_date'])
    );
  });

  it('calls the correct callback when clicking save', async () => {
    const user = userEvent.setup();
    renderWithStore(
      <ActionsWidgetModal
        {...mockProps}
        isOpen
        selectedAnnotationTypes={[548]}
      />
    );

    const saveButton = screen.getByRole('button', { name: 'Save' });
    await user.click(saveButton);

    expect(mockProps.onClickSaveActionsWidget).toHaveBeenCalledTimes(1);
  });

  it('renders the app status', () => {
    renderWithStore(
      <ActionsWidgetModal {...mockProps} isOpen status="loading" />
    );

    expect(screen.getByText('Saving...')).toBeInTheDocument();
  });

  it('calls trackEvent when user click Save', async () => {
    const user = userEvent.setup();
    renderWithStore(
      <ActionsWidgetModal
        {...mockProps}
        isOpen
        selectedAnnotationTypes={[548]}
      />
    );

    const saveButton = screen.getByText('Save');
    await user.click(saveButton);

    expect(mockTrackEvent).toHaveBeenCalledTimes(1);
  });
});
