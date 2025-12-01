import userEvent from '@testing-library/user-event';
import { screen, within } from '@testing-library/react';
import {
  useGetPermissionsQuery,
  useGetStaffUsersQuery,
} from '@kitman/common/src/redux/global/services/globalApi';
import { paginatedLabelResponse } from '@kitman/services/src/mocks/handlers/OrganisationSettings/DynamicCohorts/Labels/searchLabels';
import {
  useSearchLabelsQuery,
  useCreateLabelMutation,
  useUpdateLabelMutation,
  useDeleteLabelMutation,
} from '@kitman/modules/src/OrganisationSettings/src/components/DynamicCohorts/ManageLabels/redux/services/labelsApi';
import {
  storeFake,
  renderTestComponent,
} from '@kitman/modules/src/DynamicCohorts/shared/testUtils';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { ListLabelsAppTranslated as ListLabelsApp } from '../App';

jest.mock('@kitman/common/src/redux/global/services/globalApi');
jest.mock(
  '@kitman/modules/src/OrganisationSettings/src/components/DynamicCohorts/ManageLabels/redux/services/labelsApi'
);

describe('<ListLabelsApp />', () => {
  const mockDispatch = jest.fn();
  const defaultStore = storeFake(
    {
      labelSlice: {
        formState: {
          name: '',
          description: '',
          color: '',
        },
      },
      manageLabelsSlice: {
        isLabelModalOpen: false,
        filters: {
          searchValue: '',
          createdBy: [],
        },
      },
      globalApi: {
        useGetStaffUsersQuery: jest.fn(),
        useGetPermissionsQuery: jest.fn(),
      },
    },
    mockDispatch
  );

  const props = {
    t: i18nextTranslateStub(),
  };

  const onCreateLabel = jest.fn();
  const onUpdateLabel = jest.fn();
  const onDeleteLabel = jest.fn();

  beforeEach(() => {
    useGetStaffUsersQuery.mockReturnValue({ data: [] });
    useGetPermissionsQuery.mockReturnValue({
      data: { settings: { isLabelsAdmin: false, canViewLabels: true } },
      isSuccess: true,
    });
    useSearchLabelsQuery.mockReturnValue({
      data: paginatedLabelResponse,
      isSuccess: true,
      isLoading: false,
      isError: false,
      refetch: jest.fn(),
    });

    onCreateLabel.mockReturnValue({ unwrap: () => Promise.resolve({}) });
    useCreateLabelMutation.mockReturnValue([
      onCreateLabel,
      { isError: false, isLoading: false, isSuccess: true },
    ]);
    useUpdateLabelMutation.mockReturnValue([
      onUpdateLabel,
      { isError: false, isLoading: false, isSuccess: true },
    ]);
    onDeleteLabel.mockReturnValue({ unwrap: () => Promise.resolve({}) });
    useDeleteLabelMutation.mockReturnValue([
      onDeleteLabel,
      { isError: false, isLoading: false, isSuccess: true },
    ]);
  });

  it('does not render app if view labels if false', () => {
    useGetPermissionsQuery.mockReturnValue({
      data: { settings: { canViewLabels: false } },
      isSuccess: true,
    });
    renderTestComponent(defaultStore, <ListLabelsApp {...props} />);
    expect(screen.queryByText('Labels')).not.toBeInTheDocument();
    expect(screen.queryByText('Created by')).not.toBeInTheDocument();
    expect(screen.queryByText('Created on')).not.toBeInTheDocument();
  });
  it('renders the title', () => {
    renderTestComponent(defaultStore, <ListLabelsApp {...props} />);
    const header = screen.getByTestId('Header');
    expect(within(header).getByText('Athlete Labels')).toBeInTheDocument();
  });

  it('does not render the create button when the labels admin permission is false', () => {
    renderTestComponent(defaultStore, <ListLabelsApp {...props} />);
    expect(screen.queryByText('Create athlete label')).not.toBeInTheDocument();
  });

  it('renders the create button when the permission is true, and calls dispatch when clicking', async () => {
    useGetPermissionsQuery.mockReturnValue({
      data: { settings: { isLabelsAdmin: true, canViewLabels: true } },
      isSuccess: true,
    });
    renderTestComponent(defaultStore, <ListLabelsApp {...props} />);
    expect(screen.getByText('Create athlete label')).toBeInTheDocument();
    await userEvent.click(screen.getByText('Create athlete label'));
    expect(mockDispatch).toHaveBeenCalledWith({
      payload: undefined,
      type: 'manageLabelsSlice/onOpenLabelModal',
    });
  });

  it('renders the search filter', () => {
    renderTestComponent(defaultStore, <ListLabelsApp {...props} />);
    expect(screen.getByPlaceholderText('Search')).toBeInTheDocument();
  });

  it('renders the created by filter', () => {
    renderTestComponent(defaultStore, <ListLabelsApp {...props} />);
    const filtersArea = screen.getByTestId('Filters');
    expect(within(filtersArea).getByText('Created by')).toBeInTheDocument();
  });

  it('does not render page if permissions fail', () => {
    useGetPermissionsQuery.mockReturnValue({
      data: {},
      isSuccess: false,
    });
    renderTestComponent(defaultStore, <ListLabelsApp {...props} />);
    expect(screen.queryByText('Labels')).not.toBeInTheDocument();
    expect(screen.queryByText('Create label')).not.toBeInTheDocument();
  });
});
