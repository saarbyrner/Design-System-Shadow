import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import renderWithRedux from '@kitman/common/src/utils/renderWithRedux';
import { trainingVariableAnswerImportData } from '@kitman/services/src/mocks/handlers/searchImportsList';
import useLocationAssign from '@kitman/common/src/hooks/useLocationAssign';
import { IMPORT_TYPES } from '@kitman/modules/src/shared/MassUpload/New/utils/consts';
import {
  useGetImportJobsQuery,
  useLazyDeleteMassUploadQuery,
} from '@kitman/modules/src/shared/MassUpload/redux/massUploadApi';
import {
  useGetPermissionsQuery,
  useGetSquadAthletesQuery,
  useGetTrainingVariablesQuery,
} from '@kitman/common/src/redux/global/services/globalApi';
import useImportConfig from '@kitman/modules/src/shared/MassUpload/New/utils/useImportConfig';
import useEventTracking from '@kitman/common/src/hooks/useEventTracking';
import { onOpenAddAthletesSidePanel } from '@kitman/modules/src/shared/MassUpload/redux/massUploadSlice';
import { data as mockTrainingVariables } from '@kitman/services/src/mocks/handlers/getTrainingVariables';

import TrainingVariablesImporter from '..';

jest.mock('@kitman/common/src/hooks/useLocationAssign');
jest.mock('@kitman/modules/src/shared/MassUpload/redux/massUploadApi');
jest.mock('@kitman/common/src/redux/global/services/globalApi');
jest.mock('@kitman/modules/src/shared/MassUpload/New/utils/useImportConfig');
jest.mock('@kitman/common/src/hooks/useEventTracking');

describe('<TrainingVariablesImporter />', () => {
  beforeEach(() => {
    useGetImportJobsQuery.mockReturnValue({
      data: { data: trainingVariableAnswerImportData },
      isError: false,
      isLoading: false,
      isSuccess: true,
      status: 'fulfilled',
    });
    useGetPermissionsQuery.mockReturnValue({
      data: { settings: { canCreateImports: true } },
      isLoading: false,
      isError: false,
    });
    useGetSquadAthletesQuery.mockReturnValue({
      data: [],
      isError: false,
      isLoading: false,
      isSuccess: true,
    });
    useImportConfig.mockReturnValue({ enabled: true });
    useGetTrainingVariablesQuery.mockReturnValue({
      data: mockTrainingVariables,
    });
    useEventTracking.mockReturnValue({ trackEvent: jest.fn() });
    useLazyDeleteMassUploadQuery.mockReturnValue([
      jest.fn(),
      {
        isLoading: false,
        isSuccess: true,
        isError: false,
      },
    ]);
  });

  afterEach(() => {
    window.featureFlags = {};
  });

  const renderComponent = () =>
    renderWithRedux(<TrainingVariablesImporter />, {
      useGlobalStore: false,
      preloadedState: {
        massUploadSlice: {
          addAthletesSidePanel: { isOpen: false },
          massUploadModal: { isOpen: false },
          deleteImport: {
            isConfirmationModalOpen: false,
            attachmentId: null,
            submissionStatus: null,
          },
        },
      },
    });

  it('renders correctly', async () => {
    const loadingText = 'Loading...';
    const noRowsMessage = 'No measurements submitted yet';

    renderComponent();

    expect(
      screen.getByRole('heading', {
        name: 'Data importer',
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole('columnheader', { name: 'Submission date' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('columnheader', { name: 'Submitted by' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('columnheader', { name: 'Submission status' })
    ).toBeInTheDocument();

    expect(screen.queryByText(loadingText)).not.toBeInTheDocument();
    expect(screen.queryByText(noRowsMessage)).not.toBeInTheDocument();

    trainingVariableAnswerImportData.forEach(({ createdBy: { fullname } }) => {
      expect(screen.getByRole('cell', { name: fullname })).toBeInTheDocument();
    });
  });

  it('redirects to MassUpload flow if ‘Import a CSV file’ button is clicked', async () => {
    const mockLocationAssign = jest.fn();
    useLocationAssign.mockReturnValue(mockLocationAssign);
    const user = userEvent.setup();
    renderComponent();

    const modalTextRegex = /to avoid errors/i;

    expect(screen.queryByText(modalTextRegex)).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Import a CSV file' }));

    expect(mockLocationAssign).toHaveBeenCalledWith(
      `/mass_upload/${IMPORT_TYPES.TrainingVariablesAnswer}`
    );
  });

  it('opens side panel if the URL contains ‘action=open-side-panel’ query param', async () => {
    delete window.location;
    window.location = new URL(
      'http://admin.injuryprofiler.test:3002/growth_and_maturation/assessments?action=open-side-panel'
    );

    const { mockedStore } = renderComponent();
    await waitFor(() => {
      expect(mockedStore.dispatch).toHaveBeenCalledWith(
        onOpenAddAthletesSidePanel()
      );
    });
  });
});
