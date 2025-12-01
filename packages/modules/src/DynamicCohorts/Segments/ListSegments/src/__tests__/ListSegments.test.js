import { screen, within } from '@testing-library/react';
import {
  useGetPermissionsQuery,
  useGetStaffUsersQuery,
} from '@kitman/common/src/redux/global/services/globalApi';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import {
  storeFake,
  renderTestComponent,
} from '@kitman/modules/src/DynamicCohorts/shared/testUtils';
import { paginatedSegmentsResponse } from '@kitman/services/src/mocks/handlers/dynamicCohorts/Segments/searchSegments';
import {
  useSearchSegmentsQuery,
  useDeleteSegmentMutation,
} from '@kitman/modules/src/DynamicCohorts/Segments/CreateEditSegment/redux/services/segmentsApi';
import { useGetAllLabelsQuery } from '@kitman/modules/src/OrganisationSettings/src/components/DynamicCohorts/ManageLabels/redux/services/labelsApi';
import ListSegmentsApp from '../App';
import { getInitialState } from '../../redux/slices/manageSegmentsSlice';

jest.mock('@kitman/common/src/redux/global/services/globalApi');
jest.mock(
  '@kitman/modules/src/DynamicCohorts/Segments/CreateEditSegment/redux/services/segmentsApi'
);
jest.mock(
  '@kitman/modules/src/OrganisationSettings/src/components/DynamicCohorts/ManageLabels/redux/services/labelsApi'
);
describe('<ListSegments />', () => {
  const deleteSegment = jest.fn();
  const props = {
    t: i18nextTranslateStub(),
  };

  const defaultStore = storeFake({
    manageSegmentsSlice: getInitialState(),
  });

  beforeEach(() => {
    useGetPermissionsQuery.mockReturnValue({
      data: {
        settings: {
          isSegmentsAdmin: true,
          canViewSegments: true,
          canViewLabels: true,
        },
      },
      isSuccess: true,
    });
    useSearchSegmentsQuery.mockReturnValue({
      data: paginatedSegmentsResponse,
      isSuccess: true,
      isFetching: false,
      isError: false,
    });
    useGetStaffUsersQuery.mockReturnValue({ data: [] });
    useGetAllLabelsQuery.mockReturnValue({
      data: [],
      isSuccess: true,
    });
    deleteSegment.mockReturnValue({ unwrap: () => Promise.resolve({}) });
    useDeleteSegmentMutation.mockReturnValue([
      deleteSegment,
      { isSuccess: true },
    ]);
  });
  it('renders the title', async () => {
    renderTestComponent(defaultStore, <ListSegmentsApp {...props} />);
    const groupText = await screen.findAllByText('Athlete Groups');
    // the heading of the page, and the heading in the table
    expect(groupText.length).toEqual(1);
    expect(await screen.findByText('Create athlete group')).toBeInTheDocument();
  });

  it('does not render the create button if they are not an admin', async () => {
    useGetPermissionsQuery.mockReturnValue({
      data: { settings: { canViewSegments: true, isSegmentsAdmin: false } },
      isSuccess: true,
    });

    renderTestComponent(defaultStore, <ListSegmentsApp {...props} />);
    const groupText = await screen.findAllByText('Athlete Groups');
    // the heading of the page, and the heading in the table
    expect(groupText.length).toEqual(1);
    expect(
      screen.getByRole('columnheader', { name: 'Athlete groups' })
    ).toBeInTheDocument();
    expect(screen.queryByText('Create athlete group')).not.toBeInTheDocument();
  });

  it('does not return the app if they cannot view segments', async () => {
    useGetPermissionsQuery.mockReturnValue({
      data: { settings: { canViewSegments: false } },
      isSuccess: true,
    });

    renderTestComponent(defaultStore, <ListSegmentsApp {...props} />);
    expect(screen.queryByText('Athlete groups')).not.toBeInTheDocument();
    expect(screen.queryByText('Create athlete group')).not.toBeInTheDocument();
  });

  it('renders the table headers', () => {
    renderTestComponent(defaultStore, <ListSegmentsApp {...props} />);
    expect(
      screen.getByRole('columnheader', { name: 'Athlete groups' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('columnheader', { name: 'Created by' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('columnheader', { name: 'Created on' })
    ).toBeInTheDocument();
  });

  it('renders the common filters', () => {
    renderTestComponent(defaultStore, <ListSegmentsApp {...props} />);
    const sharedFiltersArea = screen.getByTestId('Filters');
    // input text box
    expect(
      within(sharedFiltersArea).getByPlaceholderText('Search')
    ).toBeInTheDocument();

    // Select component, does not use native placeholder prop so can't use getByPlaceholderText
    expect(
      within(sharedFiltersArea).getByText('Created by')
    ).toBeInTheDocument();

    // Date range picker
    expect(
      within(sharedFiltersArea).getByText('Created on')
    ).toBeInTheDocument();
  });

  it('renders the label filter when the permission is true', () => {
    renderTestComponent(defaultStore, <ListSegmentsApp {...props} />);

    const additionalFiltersArea = screen.getByTestId('AllFilters');
    // Label Select
    expect(
      within(additionalFiltersArea).getByText('Athlete labels')
    ).toBeInTheDocument();
  });

  it('does not render the label filter when the permission is false', () => {
    useGetPermissionsQuery.mockReturnValue({
      data: {
        settings: {
          isSegmentsAdmin: true,
          canViewSegments: true,
          canViewLabels: false,
        },
      },
      isSuccess: true,
    });
    renderTestComponent(defaultStore, <ListSegmentsApp {...props} />);

    const additionalFiltersArea = screen.getByTestId('AllFilters');
    // Label Select
    expect(
      within(additionalFiltersArea).queryByText('Labels')
    ).not.toBeInTheDocument();
  });
});
