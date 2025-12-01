import { screen } from '@testing-library/react';
import { useGetPermissionsQuery } from '@kitman/common/src/redux/global/services/globalApi';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { MODES } from '@kitman/modules/src/HumanInput/shared/constants/index';
import { labels as mockLabels } from '@kitman/services/src/mocks/handlers/OrganisationSettings/DynamicCohorts/Labels/getAllLabels';
import { useGetAllLabelsQuery } from '@kitman/modules/src/OrganisationSettings/src/components/DynamicCohorts/ManageLabels/redux/services/labelsApi';
import {
  defaultStore,
  renderTestComponent,
} from '@kitman/modules/src/DynamicCohorts/shared/testUtils';
import {
  useFetchSegmentQuery,
  useCreateSegmentMutation,
  useUpdateSegmentMutation,
  useSearchAthletesQuery,
} from '@kitman/modules/src/DynamicCohorts/Segments/CreateEditSegment/redux/services/segmentsApi';
import { segmentResponse } from '@kitman/services/src/mocks/handlers/dynamicCohorts/Segments/createSegment';
import { getInitialState } from '@kitman/modules/src/DynamicCohorts/Segments/CreateEditSegment/redux/slices/segmentSlice';
import CreateEditSegment from '../App';

jest.mock(
  '@kitman/modules/src/OrganisationSettings/src/components/DynamicCohorts/ManageLabels/redux/services/labelsApi'
);
jest.mock('@kitman/common/src/redux/global/services/globalApi');
jest.mock(
  '@kitman/modules/src/DynamicCohorts/Segments/CreateEditSegment/redux/services/segmentsApi'
);

describe('<CreateEditSegment />', () => {
  const defaultProps = {
    mode: MODES.CREATE,
    t: i18nextTranslateStub(),
  };

  beforeEach(() => {
    useGetPermissionsQuery.mockReturnValue({
      data: { settings: { isSegmentsAdmin: true } },
      isSuccess: true,
    });
    useGetAllLabelsQuery.mockReturnValue({
      data: mockLabels,
      isSuccess: true,
    });
    useFetchSegmentQuery.mockReturnValue({
      data: segmentResponse,
      isSuccess: true,
    });
    useCreateSegmentMutation.mockReturnValue([
      jest.fn(),
      { isError: false, isLoading: false, isSuccess: true },
    ]);
    useUpdateSegmentMutation.mockReturnValue([
      jest.fn(),
      { isError: false, isLoading: false, isSuccess: true },
    ]);
    useSearchAthletesQuery.mockReturnValue({
      data: { athletes: [], nextId: null },
      isError: false,
      isFetching: false,
      isSuccess: true,
    });
  });

  it('renders the form when the user has permissions', async () => {
    renderTestComponent(defaultStore, <CreateEditSegment {...defaultProps} />);
    expect(await screen.findByText('Save')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
    expect(screen.getByText('Apply')).toBeInTheDocument();
  });

  it('does not return the app if they are not a segments admin', async () => {
    useGetPermissionsQuery.mockReturnValue({
      data: { settings: { isSegmentsAdmin: false } },
      isSuccess: true,
    });

    renderTestComponent(defaultStore, <CreateEditSegment {...defaultProps} />);
    expect(screen.queryByText('Save')).not.toBeInTheDocument();
    expect(screen.queryByText('Cancel')).not.toBeInTheDocument();
  });

  describe('edit mode', () => {
    const editProps = {
      mode: MODES.EDIT,
      id: segmentResponse.id,
      t: i18nextTranslateStub(),
    };
    const mockDispatch = jest.fn();
    const store = {
      default: () => {},
      subscribe: () => {},
      dispatch: mockDispatch,
      getState: () => {
        return { segmentSlice: getInitialState() };
      },
    };

    it('fetches the segment to populate the form', async () => {
      renderTestComponent(store, <CreateEditSegment {...editProps} />);
      expect(mockDispatch).toHaveBeenCalled();
      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'segmentSlice/onUpdateForm',
        payload: {
          id: segmentResponse.id,
          name: segmentResponse.name,
          expression: JSON.parse(segmentResponse.expression),
        },
      });
    });
  });
});
