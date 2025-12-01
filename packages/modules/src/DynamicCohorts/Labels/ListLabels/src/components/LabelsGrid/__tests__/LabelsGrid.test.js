import { screen, render } from '@testing-library/react';
import { paginatedLabelResponse } from '@kitman/services/src/mocks/handlers/OrganisationSettings/DynamicCohorts/Labels/searchLabels';
import { Provider } from 'react-redux';
import userEvent from '@testing-library/user-event';
import {
  useCreateLabelMutation,
  useSearchLabelsQuery,
  useUpdateLabelMutation,
  useDeleteLabelMutation,
} from '@kitman/modules/src/OrganisationSettings/src/components/DynamicCohorts/ManageLabels/redux/services/labelsApi';
import { getInitialState } from '@kitman/modules/src/DynamicCohorts/Labels/ListLabels/redux/slices/labelSlice';
import { formatStandard } from '@kitman/common/src/utils/dateFormatter';
import moment from 'moment';
import { storeFake } from '@kitman/modules/src/DynamicCohorts/shared/testUtils';
import { LabelsGridTranslated as LabelsGrid } from '../index';

jest.mock(
  '@kitman/modules/src/OrganisationSettings/src/components/DynamicCohorts/ManageLabels/redux/services/labelsApi'
);

const closedModalState = {
  isLabelModalOpen: false,
  nextId: null,
  filters: {
    searchValue: '',
    createdBy: [],
  },
};

describe('<LabelsGrid />', () => {
  const mockDispatch = jest.fn();
  const onCreateLabel = jest.fn();
  const onUpdateLabel = jest.fn();
  const onDeleteLabel = jest.fn();

  const defaultStore = storeFake(
    {
      labelSlice: getInitialState(),
      manageLabelsSlice: closedModalState,
    },
    mockDispatch
  );

  beforeEach(() => {
    onCreateLabel.mockReturnValue({ unwrap: () => Promise.resolve({}) });
    useCreateLabelMutation.mockReturnValue([
      onCreateLabel,
      { isError: false, isLoading: false, isSuccess: true },
    ]);
    useSearchLabelsQuery.mockReturnValue({
      data: paginatedLabelResponse,
      isSuccess: true,
      isLoading: false,
      isError: false,
      refetch: jest.fn(),
    });

    onUpdateLabel.mockReturnValue({ unwrap: () => Promise.resolve({}) });
    useUpdateLabelMutation.mockReturnValue([
      onUpdateLabel,
      { isError: false, isLoading: false, isSuccess: true },
    ]);
    onDeleteLabel.mockReturnValue({ unwrap: () => Promise.resolve({}) });
    useDeleteLabelMutation.mockReturnValue([
      onDeleteLabel,
      { isSuccess: true },
    ]);
  });
  const renderComponent = (store, isLabelsAdmin) => {
    return render(
      <Provider store={store}>
        <LabelsGrid isLabelsAdmin={isLabelsAdmin} />
      </Provider>
    );
  };

  it('renders the headers', async () => {
    const { container } = renderComponent(defaultStore, false);
    expect(await screen.findByText('Athlete labels')).toBeInTheDocument();
    expect(screen.getByText('Description')).toBeInTheDocument();
    expect(screen.getByText('Created by')).toBeInTheDocument();
    expect(screen.getByText('Created on')).toBeInTheDocument();

    // when permission is false, no row actions should show up
    const iconElement = container.querySelector('.icon-more');
    expect(iconElement).not.toBeInTheDocument();
  });

  it('renders the table data', () => {
    renderComponent(defaultStore, false);
    paginatedLabelResponse.labels.forEach(
      ({ name, description, created_by: creator, created_on: created }) => {
        expect(screen.getByText(name)).toBeInTheDocument();
        expect(screen.getByText(description)).toBeInTheDocument();
        expect(screen.getByText(creator.fullname)).toBeInTheDocument();
        expect(
          screen.getByText(formatStandard({ date: moment(created) }))
        ).toBeInTheDocument();
      }
    );
  });

  it('renders the row actions when the permission is true', async () => {
    const { container } = renderComponent(defaultStore, true);
    expect(await screen.findByText('Athlete labels')).toBeInTheDocument();
    expect(screen.getByText('Description')).toBeInTheDocument();
    expect(screen.getByText('Created by')).toBeInTheDocument();
    expect(screen.getByText('Created on')).toBeInTheDocument();

    const iconElement = container.querySelectorAll('.icon-more');
    expect(iconElement.length).toBe(paginatedLabelResponse.labels.length);
  });

  it('shows the edit option when row actions are clicked, dispatches correct actions', async () => {
    const { container } = renderComponent(defaultStore, true);

    const iconElement = container.querySelector('.icon-more');
    await userEvent.click(iconElement);

    expect(screen.getByText('Edit')).toBeInTheDocument();
    await userEvent.click(screen.getByText('Edit'));
    expect(mockDispatch).toHaveBeenCalledTimes(3);
    expect(mockDispatch).toHaveBeenNthCalledWith(1, {
      payload: {
        color: 'Color',
        description: 'My description',
        id: 10,
        name: 'My Label',
      },
      type: 'labelSlice/onUpdateForm',
    });
    expect(mockDispatch).toHaveBeenNthCalledWith(2, {
      type: 'labelSlice/onStartEditing',
      payload: undefined,
    });
    expect(mockDispatch).toHaveBeenNthCalledWith(3, {
      type: 'manageLabelsSlice/onOpenLabelModal',
      payload: undefined,
    });
  });

  it('shows the delete options when the row actions are clicked, and dispatches correct actions', async () => {
    const { container } = renderComponent(defaultStore, true);

    const iconElement = container.querySelector('.icon-more');
    await userEvent.click(iconElement);

    expect(screen.getByText('Delete')).toBeInTheDocument();
    await userEvent.click(screen.getByText('Delete'));
    expect(onDeleteLabel).toHaveBeenCalled();
    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(mockDispatch).toHaveBeenCalledWith({
      payload: { status: 'SUCCESS', title: 'Label successfully deleted.' },
      type: 'toasts/add',
    });
  });

  it('dispatches error toast if delete fails', async () => {
    onDeleteLabel.mockReturnValue({
      unwrap: () => Promise.reject(),
    });
    const { container } = renderComponent(defaultStore, true);

    const iconElement = container.querySelector('.icon-more');
    await userEvent.click(iconElement);

    expect(screen.getByText('Delete')).toBeInTheDocument();
    await userEvent.click(screen.getByText('Delete'));
    expect(onDeleteLabel).toHaveBeenCalled();
    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(mockDispatch).toHaveBeenCalledWith({
      payload: { status: 'ERROR', title: 'Error deleting label.' },
      type: 'toasts/add',
    });
  });
});
