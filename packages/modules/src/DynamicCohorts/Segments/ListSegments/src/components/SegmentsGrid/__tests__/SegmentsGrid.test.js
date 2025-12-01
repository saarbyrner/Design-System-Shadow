import { screen } from '@testing-library/react';
import { paginatedSegmentsResponse } from '@kitman/services/src/mocks/handlers/dynamicCohorts/Segments/searchSegments';
import userEvent from '@testing-library/user-event';
import {
  useSearchSegmentsQuery,
  useDeleteSegmentMutation,
} from '@kitman/modules/src/DynamicCohorts/Segments/CreateEditSegment/redux/services/segmentsApi';
import { getInitialState } from '@kitman/modules/src/DynamicCohorts/Segments/ListSegments/redux/slices/manageSegmentsSlice';
import { formatStandard } from '@kitman/common/src/utils/dateFormatter';
import moment from 'moment';
import {
  storeFake,
  renderTestComponent,
} from '@kitman/modules/src/DynamicCohorts/shared/testUtils';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { SegmentsGridTranslated as SegmentsGrid } from '../SegmentsGrid';

jest.mock(
  '@kitman/modules/src/DynamicCohorts/Segments/CreateEditSegment/redux/services/segmentsApi'
);

describe('<SegmentsGrid />', () => {
  const mockDispatch = jest.fn();
  const mockRefetch = jest.fn();
  const onDeleteSegment = jest.fn();

  const defaultStore = storeFake(
    {
      manageSegmentsSlice: getInitialState(),
    },
    mockDispatch
  );
  const defaultProps = {
    canEditSegment: false,
    t: i18nextTranslateStub(),
  };

  beforeEach(() => {
    useSearchSegmentsQuery.mockReturnValue({
      data: paginatedSegmentsResponse,
      isSuccess: true,
      isFetching: false,
      isError: false,
      refetch: mockRefetch,
    });
    onDeleteSegment.mockReturnValue({ unwrap: () => Promise.resolve({}) });
    useDeleteSegmentMutation.mockReturnValue([
      onDeleteSegment,
      { isSuccess: true },
    ]);
  });

  it('renders the headers', async () => {
    const { container } = renderTestComponent(
      defaultStore,
      <SegmentsGrid {...defaultProps} />
    );
    expect(await screen.findByText('Athlete groups')).toBeInTheDocument();
    expect(screen.getByText('Created by')).toBeInTheDocument();
    expect(screen.getByText('Created on')).toBeInTheDocument();

    // when permission is false, no row actions should show up
    const iconElement = container.querySelector('.icon-more');
    expect(iconElement).not.toBeInTheDocument();
  });

  it('renders the table data', () => {
    renderTestComponent(defaultStore, <SegmentsGrid {...defaultProps} />);
    paginatedSegmentsResponse.segments.forEach(
      ({ name, created_by: creator, created_on: created }) => {
        expect(screen.getByText(name)).toBeInTheDocument();
        expect(screen.getByText(creator.fullname)).toBeInTheDocument();
        expect(
          screen.getByText(formatStandard({ date: moment(created) }))
        ).toBeInTheDocument();
      }
    );
  });

  it('renders the row actions when the permission is true', async () => {
    const { container } = renderTestComponent(
      defaultStore,
      <SegmentsGrid {...defaultProps} canEditSegment />
    );
    expect(await screen.findByText('Athlete groups')).toBeInTheDocument();
    expect(screen.getByText('Created by')).toBeInTheDocument();
    expect(screen.getByText('Created on')).toBeInTheDocument();

    const iconElement = container.querySelectorAll('.icon-more');
    expect(iconElement.length).toBe(paginatedSegmentsResponse.segments.length);
  });

  it('shows the edit option when row actions are clicked', async () => {
    const { container } = renderTestComponent(
      defaultStore,
      <SegmentsGrid {...defaultProps} canEditSegment />
    );
    const iconElement = container.querySelector('.icon-more');
    await userEvent.click(iconElement);

    expect(screen.getByText('Edit')).toBeInTheDocument();
  });

  it('shows the delete option when row actions are clicked, and dispatches correct actions', async () => {
    const { container } = renderTestComponent(
      defaultStore,
      <SegmentsGrid {...defaultProps} canEditSegment />
    );
    const iconElement = container.querySelector('.icon-more');
    await userEvent.click(iconElement);

    await userEvent.click(screen.getByText('Delete'));
    expect(onDeleteSegment).toHaveBeenCalled();
    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(mockDispatch).toHaveBeenCalledWith({
      payload: { status: 'SUCCESS', title: 'Group successfully deleted.' },
      type: 'toasts/add',
    });
    expect(mockRefetch).toHaveBeenCalled();
  });

  it('dispatches error toast when delete fails', async () => {
    onDeleteSegment.mockReturnValue({
      unwrap: () => Promise.reject(),
    });
    const { container } = renderTestComponent(
      defaultStore,
      <SegmentsGrid {...defaultProps} canEditSegment />
    );
    const iconElement = container.querySelector('.icon-more');
    await userEvent.click(iconElement);

    await userEvent.click(screen.getByText('Delete'));
    expect(onDeleteSegment).toHaveBeenCalled();
    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(mockDispatch).toHaveBeenCalledWith({
      payload: { status: 'ERROR', title: 'Error deleting group.' },
      type: 'toasts/add',
    });
    expect(mockRefetch).not.toHaveBeenCalled();
  });

  it('shows error text when the query fails', () => {
    useSearchSegmentsQuery.mockReturnValue({
      data: paginatedSegmentsResponse,
      isSuccess: false,
      isFetching: false,
      isError: true,
    });

    renderTestComponent(
      defaultStore,
      <SegmentsGrid {...defaultProps} canEditSegment />
    );
    expect(screen.getByText('Error fetching groups.')).toBeInTheDocument();
  });
});
