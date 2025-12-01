import { render, screen } from '@testing-library/react';
import {
  useGetPermissionsQuery,
  useGetTrainingVariablesQuery,
} from '@kitman/common/src/redux/global/services/globalApi';
import { data as mockTrainingVariables } from '@kitman/services/src/mocks/handlers/getTrainingVariables';

import { IMPORT_TYPES } from '../../utils/consts';
import { MockMassUploadNew } from '../../utils/test_utils';
import MassUploadRouter from '../index';

jest.mock('@kitman/modules/src/shared/MassUpload/New', () => MockMassUploadNew);
jest.mock('@kitman/common/src/redux/global/services/globalApi');

describe('<MassUploadRouter />', () => {
  const mockAssign = jest.fn();

  beforeEach(() => {
    jest.restoreAllMocks();

    Object.defineProperty(window, 'location', {
      value: {
        pathname: '/something_something',
        assign: mockAssign,
      },
    });

    useGetTrainingVariablesQuery.mockReturnValue({
      data: mockTrainingVariables,
    });
  });

  afterEach(() => {
    window.featureFlags = {};
  });

  const renderComponentWithPermissions = (
    permissions = {},
    requestStatus = 'SUCCESS'
  ) => {
    useGetPermissionsQuery.mockReturnValue({
      data: permissions,
      isLoading: requestStatus === 'LOADING',
      isSuccess: requestStatus === 'SUCCESS',
    });

    return render(<MassUploadRouter />);
  };

  it('should redirect if importConfig is null', () => {
    window.location.pathname = '/mass_upload/something_else';
    renderComponentWithPermissions();
    expect(mockAssign).toHaveBeenCalledWith('/');
  });

  it('should redirect if importConfig.enabled is false', () => {
    window.location.pathname = `/mass_upload/${IMPORT_TYPES.LeagueBenchmarking}`;
    renderComponentWithPermissions();
    expect(mockAssign).toHaveBeenCalledWith('/');
  });

  describe('supported importTypes', () => {
    it(`should not redirect for ${IMPORT_TYPES.LeagueBenchmarking}`, () => {
      window.featureFlags = {
        'benchmark-testing': true,
        'performance-optimisation-imports': true,
      };
      window.location.pathname = `/mass_upload/${IMPORT_TYPES.LeagueBenchmarking}`;

      renderComponentWithPermissions({
        analysis: {
          benchmarkingTestingImportArea: { canView: true },
        },
        settings: {
          canCreateImports: true,
        },
      });

      expect(mockAssign).not.toHaveBeenCalled();
    });
  });

  describe('App status', () => {
    it('should render loading status if requestStatus === PENDING', () => {
      renderComponentWithPermissions({}, 'LOADING');
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('should render error status if requestStatus === ERROR', () => {
      renderComponentWithPermissions({}, 'ERROR');
      expect(screen.getByText('Something went wrong!')).toBeInTheDocument();
    });
  });
});
