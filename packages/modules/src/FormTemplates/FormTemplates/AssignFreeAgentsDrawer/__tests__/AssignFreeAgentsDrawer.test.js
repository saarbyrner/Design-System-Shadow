import { screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import renderWithRedux from '@kitman/common/src/utils/renderWithRedux';
import {
  REDUCER_KEY as FORM_TEMPLATES_REDUCER_KEY,
  initialState as formTemplatesInitialState,
} from '@kitman/modules/src/FormTemplates/redux/slices/formTemplatesSlice';
import {
  useFetchFormAssignmentsQuery,
  useUpdateFormAssignmentsMutation,
  useGetUnassignedAthletesQuery,
} from '@kitman/services/src/services/formTemplates';

import AssignFreeAgentsDrawer from '..';
import { getDrawerTranslations } from '../utils/helpers';
import { MAX_SEARCH_LENGTH } from '../utils/constants';

jest.mock('@kitman/services/src/services/formTemplates', () => ({
  ...jest.requireActual('@kitman/services/src/services/formTemplates'),
  useFetchFormAssignmentsQuery: jest.fn(),
  useUpdateFormAssignmentsMutation: jest.fn(),
  useGetUnassignedAthletesQuery: jest.fn(),
}));

jest.mock('@kitman/common/src/redux/global/selectors', () => ({
  ...jest.requireActual('@kitman/common/src/redux/global/selectors'),
  getOrganisation: jest.fn(),
}));

const mockUnassignedAthletes = {
  athletes: [
    {
      id: 101,
      fullname: 'Free Agent One',
      position: 'Forward',
      avatarUrl: 'url1',
    },
    {
      id: 102,
      fullname: 'Free Agent Two',
      position: 'Midfielder',
      avatarUrl: 'url2',
    },
  ],
};

const mockAssignedAthletes = {
  athlete_ids: [1, 2],
  athletes: [
    {
      id: 1,
      fullname: 'Assigned Free Agent',
      position: 'Goalie',
      avatarUrl: 'url3',
      organisations: [{ id: 99, name: 'Other Org', free_agent: true }],
    },
    {
      id: 2,
      fullname: 'Assigned Team Player',
      position: 'Defender',
      avatarUrl: 'url4',
      organisations: [{ id: 123, name: 'Current Org', free_agent: false }],
    },
  ],
};

describe('<AssignFreeAgentsDrawer />', () => {
  const updateFormAssignments = jest.fn();

  beforeEach(() => {
    useGetUnassignedAthletesQuery.mockReturnValue({
      data: undefined,
      isFetching: false,
    });

    useFetchFormAssignmentsQuery.mockReturnValue({
      data: mockAssignedAthletes,
      error: false,
      isLoading: false,
    });

    useUpdateFormAssignmentsMutation.mockReturnValue([
      updateFormAssignments,
      { isLoading: false },
    ]);

    updateFormAssignments.mockResolvedValue({});
  });

  const renderComponent = () => {
    const { mockedStore } = renderWithRedux(<AssignFreeAgentsDrawer />, {
      preloadedState: {
        [FORM_TEMPLATES_REDUCER_KEY]: {
          ...formTemplatesInitialState,
          isCreateFormDrawerOpen: false,
          isScheduleDrawerOpen: false,
          isAssignFreeAgentsDrawerOpen: true,
          selectedFormId: 1,
        },
      },
      useGlobalStore: false,
    });
    return mockedStore;
  };

  it('should display the side panel properly', () => {
    renderComponent();
    const translations = getDrawerTranslations();

    expect(screen.getByText(translations.title)).toBeInTheDocument();
    expect(screen.getByLabelText(translations.athletes)).toBeInTheDocument();

    const saveButton = screen.getByRole('button', {
      name: translations.saveButton,
    });
    expect(saveButton).toBeInTheDocument();
    expect(saveButton).toBeEnabled();

    // Check if initially assigned free agent is shown as a chip
    expect(screen.getByText('Assigned Free Agent')).toBeInTheDocument();
    expect(screen.queryByText('Assigned Team Player')).not.toBeInTheDocument();
  });

  it('should search and select an athlete', async () => {
    const translations = getDrawerTranslations();
    const user = userEvent.setup();
    const mockedStore = renderComponent();
    useGetUnassignedAthletesQuery.mockReturnValue({
      data: mockUnassignedAthletes,
      isFetching: false,
    });

    const searchInput = screen.getByLabelText(translations.athletes);
    fireEvent.change(searchInput, { target: { value: 'Free' } });

    await waitFor(() =>
      expect(screen.getByText('Free Agent One')).toBeInTheDocument()
    );
    expect(screen.getByText('Free Agent Two')).toBeInTheDocument();

    const checkbox = screen.getAllByRole('checkbox')[1]; // First checkbox is for the already selected user
    await user.click(checkbox);

    await waitFor(() => {
      expect(mockedStore.dispatch).toHaveBeenCalledWith({
        type: 'formTemplatesSlice/setFormAssignments',
        payload: {
          athleteIdsToAdd: [1, 102],
          athleteIdsToRemove: [],
          freeAgentIds: [],
        },
      });
    });
  });

  it('should show success toast after clicking save button', async () => {
    const translations = getDrawerTranslations();
    const user = userEvent.setup();
    const mockedStore = renderComponent();
    useGetUnassignedAthletesQuery.mockReturnValue({
      data: mockUnassignedAthletes,
      isFetching: false,
    });

    const searchInput = screen.getByLabelText(translations.athletes);
    fireEvent.change(searchInput, { target: { value: 'Free' } });

    await waitFor(() =>
      expect(screen.getByText('Free Agent One')).toBeInTheDocument()
    );

    const checkbox = screen.getAllByRole('checkbox')[1];
    await user.click(checkbox);

    const saveButton = screen.getByRole('button', {
      name: translations.saveButton,
    });

    await user.click(saveButton);

    expect(updateFormAssignments).toHaveBeenCalled();

    await waitFor(() => {
      expect(mockedStore.dispatch).toHaveBeenCalledWith({
        type: 'toasts/add',
        payload: expect.objectContaining({
          id: 'SAVE_FORM_ASSIGNMENTS_SUCCESS_TOAST_ID',
          title: expect.any(String),
        }),
      });
    });
  });

  it('should show error toast after clicking save button if api fails', async () => {
    updateFormAssignments.mockRejectedValue({});

    const translations = getDrawerTranslations();
    const user = userEvent.setup();
    const mockedStore = renderComponent();
    useGetUnassignedAthletesQuery.mockReturnValue({
      data: mockUnassignedAthletes,
      isFetching: false,
    });

    const saveButton = screen.getByRole('button', {
      name: translations.saveButton,
    });

    await user.click(saveButton);

    expect(updateFormAssignments).toHaveBeenCalled();

    await waitFor(() => {
      expect(mockedStore.dispatch).toHaveBeenCalledWith({
        type: 'toasts/add',
        payload: expect.objectContaining({
          id: 'SAVE_FORM_ASSIGNMENTS_ERROR_TOAST_ID',
          title: expect.any(String),
          style: { zIndex: 1400 },
        }),
      });
    });
  });

  it('should enforce a 50 character limit on the search input', () => {
    const translations = getDrawerTranslations();
    renderComponent();

    const searchInput = screen.getByLabelText(translations.athletes);

    // Verify the maxLength attribute is set to MAX_SEARCH_LENGTH
    expect(searchInput).toHaveAttribute('maxLength', String(MAX_SEARCH_LENGTH));
  });
});
