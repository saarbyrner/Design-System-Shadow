import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import renderWithRedux from '@kitman/common/src/utils/renderWithRedux';
import {
  openMassUploadModal,
  onOpenAddAthletesSidePanel,
} from '@kitman/modules/src/shared/MassUpload/redux/massUploadSlice';
import useLocationAssign from '@kitman/common/src/hooks/useLocationAssign';
import {
  IMPORT_TYPES,
  IMPORT_TYPES_WITH_BACK_BUTTON,
} from '@kitman/modules/src/shared/MassUpload/New/utils/consts';
import { getTitleLabels } from '@kitman/modules/src/shared/MassUpload/New/utils';
import { useGetPermissionsQuery } from '@kitman/common/src/redux/global/services/globalApi';
import useImportConfig from '@kitman/modules/src/shared/MassUpload/New/utils/useImportConfig';
import useEventTracking from '@kitman/common/src/hooks/useEventTracking';

import Header from '..';

jest.mock('@kitman/common/src/hooks/useLocationAssign');
jest.mock('@kitman/common/src/redux/global/services/globalApi');
jest.mock('@kitman/modules/src/shared/MassUpload/New/utils/useImportConfig');
jest.mock('@kitman/common/src/hooks/useEventTracking');

describe('<Header />', () => {
  beforeEach(() => {
    useEventTracking.mockReturnValue({ trackEvent: jest.fn() });
  });

  afterEach(() => {
    window.featureFlags = {};
    jest.restoreAllMocks();
  });

  const mockDownloadCSV = jest.fn();

  const renderWithPermissionsQuery = (
    importType = IMPORT_TYPES.TrainingVariablesAnswer,
    canCreateImports = true,
    isLoading = false,
    isError = false
  ) => {
    useGetPermissionsQuery.mockReturnValue({
      data: { settings: { canCreateImports } },
      isLoading,
      isError,
    });
    return renderWithRedux(
      <Header importType={importType} downloadCSV={mockDownloadCSV} />,
      {
        useGlobalStore: false,
      }
    );
  };

  it('renders the correct title based on importType', () => {
    Object.values(IMPORT_TYPES).forEach((importType) => {
      renderWithPermissionsQuery(importType);
      expect(
        screen.getByRole('heading', {
          name: getTitleLabels()[importType],
        })
      ).toBeInTheDocument();
    });
  });

  it('should not render import button if permission is false', () => {
    renderWithPermissionsQuery(IMPORT_TYPES.TrainingVariablesAnswer, false);
    expect(
      screen.queryByRole('button', { name: 'Import a CSV file' })
    ).not.toBeInTheDocument();
  });

  it('should render back button if import is part of IMPORT_TYPES_WITH_BACK_BUTTON', () => {
    renderWithPermissionsQuery(IMPORT_TYPES_WITH_BACK_BUTTON[0]);
    expect(screen.getByRole('button', { name: 'Back' })).toBeInTheDocument();
  });

  it('should not render back button if import is not part of IMPORT_TYPES_WITH_BACK_BUTTON', () => {
    renderWithPermissionsQuery();
    expect(
      screen.queryByRole('button', { name: 'Back' })
    ).not.toBeInTheDocument();
  });

  it('call useLocationAssign with url if ‘Import a CSV file’ button is clicked', async () => {
    useImportConfig.mockReturnValue({ enabled: true });
    const mockLocationAssign = jest.fn();
    useLocationAssign.mockReturnValue(mockLocationAssign);
    const user = userEvent.setup();
    renderWithPermissionsQuery();

    await user.click(screen.getByRole('button', { name: 'Import a CSV file' }));

    expect(mockLocationAssign).toHaveBeenCalledWith(
      `/mass_upload/${IMPORT_TYPES.TrainingVariablesAnswer}`
    );
  });

  it('dispatches `openMassUploadModal` if ‘Import a CSV file’ button is clicked', async () => {
    useImportConfig.mockReturnValue({ enabled: false });
    const user = userEvent.setup();
    const { mockedStore } = renderWithPermissionsQuery();

    await user.click(screen.getByRole('button', { name: 'Import a CSV file' }));

    expect(mockedStore.dispatch).toHaveBeenCalledWith(openMassUploadModal());
  });

  it('dispatches `onOpenAddAthletesSidePanel` if ‘Create a CSV file template’ button is clicked', async () => {
    const user = userEvent.setup();
    const { mockedStore } = renderWithPermissionsQuery();

    await user.click(
      screen.getByRole('button', { name: 'Create a CSV file template' })
    );

    expect(mockedStore.dispatch).toHaveBeenCalledWith(
      onOpenAddAthletesSidePanel()
    );
  });

  it('should render Export variable list button if importType === training_variable_answer', async () => {
    const user = userEvent.setup();
    renderWithPermissionsQuery();

    const exportVariableListButton = screen.getByRole('button', {
      name: 'Export variable list',
    });

    expect(exportVariableListButton).toBeInTheDocument();
    await user.click(exportVariableListButton);

    expect(mockDownloadCSV).toHaveBeenCalled();
  });

  it('should NOT render Export variable list button if importType !== training_variable_answer', async () => {
    renderWithPermissionsQuery(IMPORT_TYPES.GrowthAndMaturation);

    expect(
      screen.queryByRole('button', {
        name: 'Export variable list',
      })
    ).not.toBeInTheDocument();
  });
});
