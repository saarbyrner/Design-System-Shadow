import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';

import useCreateSquad from '@kitman/modules/src/SquadManagement/src/shared/hooks/useCreateSquad';
import { AddSquadSidePanelTranslated as AddSquadSidePanel } from '../index';

jest.mock(
  '@kitman/modules/src/SquadManagement/src/shared/hooks/useCreateSquad',
  () => ({
    __esModule: true,
    default: jest.fn(() => ({
      formState: {},
      createSquad: jest.fn(),
    })),
  })
);

const storeFake = (state) => ({
  default: () => {},
  subscribe: () => {},
  dispatch: () => {},
  getState: () => ({ ...state }),
});

const defaultStore = storeFake({
  global: {},
});

const renderWithProviders = (store = defaultStore, props) => {
  render(
    <Provider store={store}>
      <AddSquadSidePanel
        isOpen
        onClose={jest.fn()}
        onSaveSuccess={jest.fn()}
        {...props}
      />
    </Provider>
  );
};

describe('AddSquadSidePanel', () => {
  beforeEach(() => {
    useCreateSquad.mockReturnValue({
      formState: { name: '', division_id: null },
      createSquad: jest.fn(),
      conferenceDivisionOptions: [],
      divisionOptions: [],
      onSelectDivision: jest.fn(),
      onSelectConferenceDivision: jest.fn(),
      onUpdateFormState: jest.fn(),
      onSave: jest.fn().mockResolvedValue({}),
      isFormCompleted: false,
      teamNameOptions: [],
      selectedDivisionId: null,
      isLoading: false,
      isError: false,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the side panel with the correct title', () => {
    renderWithProviders();
    expect(screen.getByText('New Team')).toBeInTheDocument();
  });

  it('shows loading state when data is being fetched', () => {
    useCreateSquad.mockReturnValue({
      isLoading: true,
    });
    renderWithProviders();
    expect(screen.getByText('Loading')).toBeInTheDocument();
  });
  it('shows error state when there is an error fetching data', () => {
    useCreateSquad.mockReturnValue({
      isError: true,
    });
    renderWithProviders();
    expect(screen.getByTestId('AppStatus-error')).toBeInTheDocument();
  });

  it('renders the division select and allows selection', async () => {
    const user = userEvent.setup();

    useCreateSquad.mockReturnValue({
      formState: { name: '', division_id: null },
      createSquad: jest.fn(),
      conferenceDivisionOptions: [],
      divisionOptions: [
        { label: 'Division 1', value: 1 },
        { label: 'Division 2', value: 2 },
      ],
      onSelectDivision: jest.fn(),
      onSelectConferenceDivision: jest.fn(),
      onUpdateFormState: jest.fn(),
      onSave: jest.fn(),
      isFormCompleted: false,
      teamNameOptions: [],
      selectedDivisionId: null,
      isLoading: false,
      isError: false,
    });

    renderWithProviders();

    const divisionSelect = screen.getByLabelText('Division');
    expect(divisionSelect).toBeInTheDocument();

    await user.click(divisionSelect);
    await user.click(screen.getByText('Division 1'));

    expect(useCreateSquad().onSelectDivision).toHaveBeenCalledWith(1);
  });
  it('renders the sub-division select when a top division is selected', async () => {
    const user = userEvent.setup();

    useCreateSquad.mockReturnValue({
      formState: { name: '', division_id: null },
      createSquad: jest.fn(),
      conferenceDivisionOptions: [
        { label: 'Sub Division 1', value: 1 },
        { label: 'Sub Division 2', value: 2 },
      ],
      divisionOptions: [
        { label: 'Division 1', value: 1 },
        { label: 'Division 2', value: 2 },
      ],
      onSelectDivision: jest.fn(),
      onSelectConferenceDivision: jest.fn(),
      onUpdateFormState: jest.fn(),
      onSave: jest.fn(),
      isFormCompleted: false,
      teamNameOptions: [],
      selectedDivisionId: null,
      isLoading: false,
      isError: false,
    });

    renderWithProviders();

    const divisionSelect = screen.getByLabelText('Division');
    await user.click(divisionSelect);
    await user.click(screen.getByText('Division 1'));

    expect(useCreateSquad().onSelectDivision).toHaveBeenCalledWith(1);

    const subDivisionSelect = screen.getByLabelText('Conference');

    expect(subDivisionSelect).toBeInTheDocument();
    await user.click(subDivisionSelect);
    await user.click(screen.getByText('Sub Division 1'));
    expect(useCreateSquad().onSelectConferenceDivision).toHaveBeenCalledWith(1);
  });

  it('saves the squad when the form is completed', async () => {
    const user = userEvent.setup();
    const mockCreateSquad = jest.fn().mockResolvedValue({});

    useCreateSquad.mockReturnValue({
      formState: {
        name: 'Division 1',
        division_id: 1,
        start_season: '2025-06-30T19:00:00.000-05:00',
        end_season: '2026-06-29T19:00:00.000-05:00',
        in_season: '2025-08-31T19:00:00.000-05:00',
      },
      createSquad: mockCreateSquad,
      conferenceDivisionOptions: [],
      divisionOptions: [
        { label: 'Division 1', value: 1 },
        { label: 'Division 2', value: 2 },
      ],
      onSelectDivision: jest.fn(),
      onSelectConferenceDivision: jest.fn(),
      onUpdateFormState: jest.fn(),
      onSave: jest.fn().mockResolvedValue({}),
      isFormCompleted: true,
      teamNameOptions: [],
      selectedDivisionId: 1,
      isLoading: false,
      isError: false,
    });

    renderWithProviders();

    const saveButton = screen.getByText('Save');
    expect(saveButton).toBeInTheDocument();

    await user.click(saveButton);

    expect(useCreateSquad().onSave).toHaveBeenCalled();
  });
});
