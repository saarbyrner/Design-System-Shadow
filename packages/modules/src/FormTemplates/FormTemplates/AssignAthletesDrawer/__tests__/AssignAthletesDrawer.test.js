import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import renderWithRedux from '@kitman/common/src/utils/renderWithRedux';
import {
  REDUCER_KEY as FORM_TEMPLATES_REDUCER_KEY,
  initialState as formTemplatesInitialState,
} from '@kitman/modules/src/FormTemplates/redux/slices/formTemplatesSlice';
import { useGetSquadAthletesQuery } from '@kitman/common/src/redux/global/services/globalApi';
import {
  useFetchFormAssignmentsQuery,
  useUpdateFormAssignmentsMutation,
} from '@kitman/services/src/services/formTemplates';
import { data as squadAthletesData } from '@kitman/services/src/mocks/handlers/getSquadAthletes';

import AssignAthletesDrawer from '..';
import { getDrawerTranslations } from '../utils/helpers';

jest.mock('@kitman/common/src/redux/global/services/globalApi', () => ({
  ...jest.requireActual('@kitman/common/src/redux/global/services/globalApi'),
  useGetSquadAthletesQuery: jest.fn(),
}));

jest.mock('@kitman/services/src/services/formTemplates', () => ({
  ...jest.requireActual('@kitman/services/src/services/formTemplates'),
  useFetchFormAssignmentsQuery: jest.fn(),
  useUpdateFormAssignmentsMutation: jest.fn(),
}));

describe('<AssignAthletesDrawer />', () => {
  const updateFormAssignments = jest.fn();

  beforeEach(() => {
    useGetSquadAthletesQuery.mockReturnValue({
      data: squadAthletesData,
      error: false,
      isLoading: false,
    });

    useFetchFormAssignmentsQuery.mockReturnValue({
      data: { athlete_ids: [] },
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
    const { mockedStore } = renderWithRedux(<AssignAthletesDrawer />, {
      preloadedState: {
        [FORM_TEMPLATES_REDUCER_KEY]: {
          ...formTemplatesInitialState,
          isCreateFormDrawerOpen: false,
          isScheduleDrawerOpen: false,
          isAssignAthletesDrawerOpen: true,
        },
      },
      useGlobalStore: false,
    });
    return mockedStore;
  };

  it('should display the side panel properly', () => {
    const translations = getDrawerTranslations();
    renderComponent();

    expect(screen.getAllByText('Athletes')).toHaveLength(2);
    expect(screen.getByLabelText(translations.athletes)).toBeInTheDocument();

    const saveButton = screen.getByRole('button', {
      name: translations.saveButton,
    });
    expect(saveButton).toBeInTheDocument();
    expect(saveButton).toBeEnabled();
  });

  it('should call setFormAssignments when selecting all athletes', async () => {
    const translations = getDrawerTranslations();
    const user = userEvent.setup();
    const mockedStore = renderComponent();

    const athletesSelector = screen.getByLabelText(translations.athletes);

    await user.click(athletesSelector);

    expect(screen.getByText('International Squad')).toBeInTheDocument();
    expect(screen.getByText('Some Squad')).toBeInTheDocument();

    await user.click(screen.getByText('International Squad'));
    await user.click(screen.getByText('Select all'));

    expect(mockedStore.dispatch).toHaveBeenCalledWith({
      type: 'formTemplatesSlice/setFormAssignments',
      payload: {
        athleteIds: [],
        athleteIdsToAdd: [1, 2],
        athleteIdsToRemove: [],
      },
    });
  });

  it('should show success toast after clicking save button', async () => {
    const translations = getDrawerTranslations();
    const user = userEvent.setup();
    const mockedStore = renderComponent();

    const athletesSelector = screen.getByLabelText(translations.athletes);

    await user.click(athletesSelector);

    expect(screen.getByText('International Squad')).toBeInTheDocument();
    expect(screen.getByText('Some Squad')).toBeInTheDocument();

    await user.click(screen.getByText('International Squad'));
    await user.click(screen.getByText('Select all'));

    expect(mockedStore.dispatch).toHaveBeenCalledWith({
      type: 'formTemplatesSlice/setFormAssignments',
      payload: {
        athleteIds: [],
        athleteIdsToAdd: [1, 2],
        athleteIdsToRemove: [],
      },
    });

    const saveButton = screen.getByRole('button', {
      name: translations.saveButton,
    });

    await user.click(saveButton);

    expect(updateFormAssignments).toHaveBeenCalled();

    expect(mockedStore.dispatch).toHaveBeenCalledWith({
      type: 'toasts/add',
      payload: expect.objectContaining({
        id: 'SAVE_FORM_ASSIGNMENTS_SUCCESS_TOAST_ID',
      }),
    });
  });

  it('should show error toast after clicking save button if api fails', async () => {
    updateFormAssignments.mockRejectedValue({});

    const translations = getDrawerTranslations();
    const user = userEvent.setup();
    const mockedStore = renderComponent();

    const athletesSelector = screen.getByLabelText(translations.athletes);

    await user.click(athletesSelector);

    expect(screen.getByText('International Squad')).toBeInTheDocument();
    expect(screen.getByText('Some Squad')).toBeInTheDocument();

    await user.click(screen.getByText('International Squad'));

    const saveButton = screen.getByRole('button', {
      name: translations.saveButton,
    });

    await user.click(saveButton);

    expect(updateFormAssignments).toHaveBeenCalled();

    expect(mockedStore.dispatch).toHaveBeenCalledWith({
      type: 'toasts/add',
      payload: expect.objectContaining({
        id: 'SAVE_FORM_ASSIGNMENTS_ERROR_TOAST_ID',
      }),
    });
  });
});
