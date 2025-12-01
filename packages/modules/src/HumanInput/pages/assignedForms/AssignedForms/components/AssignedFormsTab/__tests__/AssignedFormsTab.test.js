import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import renderWithRedux from '@kitman/common/src/utils/renderWithRedux';
import {
  data,
  paginationData,
} from '@kitman/services/src/services/humanInput/api/mocks/data/assignedForms/assignedForms.mock';
import {
  useFetchAssignedFormsQuery,
  useDeleteFormAnswersSetMutation,
} from '@kitman/services/src/services/humanInput/humanInput';
import { AssignedFormsTabTranslated as AssignedFormsTab } from '../index';

jest.mock('@kitman/services/src/services/humanInput/humanInput');

describe('<AssignedFormsTab />', () => {
  const deleteFormAnswersMutation = jest.fn();

  const renderComponent = () => {
    const { mockedStore, container } = renderWithRedux(<AssignedFormsTab />, {
      useGlobalStore: false,
      preloadedState: {},
    });
    return { mockedStore, container };
  };

  beforeEach(() => {
    useFetchAssignedFormsQuery.mockReturnValue({
      isLoading: false,
      isError: false,
      isSuccess: true,
      data: {
        data,
        pagination: paginationData,
      },
    });

    useDeleteFormAnswersSetMutation.mockReturnValue([
      deleteFormAnswersMutation,
      { isLoading: false },
    ]);
  });

  it('should display the table data properly', () => {
    renderComponent();

    expect(screen.getByRole('grid')).toBeInTheDocument();

    expect(screen.getAllByRole('button', { name: /start/i })).toHaveLength(3);

    expect(
      screen.getByRole('columnheader', { name: 'Forms' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('columnheader', { name: 'Date' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('columnheader', { name: 'Status' })
    ).toBeInTheDocument();

    expect(
      screen.getByRole('columnheader', { name: 'Organisation' })
    ).toBeInTheDocument();

    expect(
      screen.getByRole('cell', { name: 'Form Name 1' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('cell', { name: 'Form Name 2' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('cell', { name: 'Form Name 3' })
    ).toBeInTheDocument();
  });

  it('should render an expanded row by default for draft forms', () => {
    renderComponent();

    expect(screen.getByRole('grid')).toBeInTheDocument();
    expect(screen.getAllByText('Draft')).toHaveLength(6);
    expect(
      screen.getAllByText('Thursday, February 20, 2025 12:19 PM')
    ).toHaveLength(6);
    expect(screen.getAllByRole('button', { name: /continue/i })).toHaveLength(
      6
    );
    expect(screen.getAllByRole('button', { name: /delete/i })).toHaveLength(6);
  });

  it('should call delete mutation when clicking delete button', async () => {
    const user = userEvent.setup();

    renderComponent();

    const deleteButtons = screen.getAllByRole('button', {
      name: /delete/i,
    });

    await user.click(deleteButtons[0]);

    expect(
      screen.getByText(/deleting this draft will erase all associated data\./i)
    ).toBeInTheDocument();

    expect(
      screen.getByRole('button', {
        name: /cancel/i,
      })
    ).toBeInTheDocument();

    const deleteDraftModalButton = screen.getByRole('button', {
      name: /delete/i,
    });

    expect(deleteDraftModalButton).toBeInTheDocument();

    await user.click(deleteDraftModalButton);

    expect(deleteFormAnswersMutation).toHaveBeenCalledWith(1);
  });

  it('should not call delete mutation when clicking cancel button', async () => {
    const user = userEvent.setup();

    renderComponent();

    const deleteButtons = screen.getAllByRole('button', {
      name: /delete/i,
    });

    await user.click(deleteButtons[0]);

    expect(
      screen.getByText(/deleting this draft will erase all associated data\./i)
    ).toBeInTheDocument();

    const cancelModalButton = screen.getByRole('button', {
      name: /cancel/i,
    });

    expect(cancelModalButton).toBeInTheDocument();

    expect(
      screen.getByRole('button', {
        name: /delete/i,
      })
    ).toBeInTheDocument();

    await user.click(cancelModalButton);

    expect(deleteFormAnswersMutation).not.toHaveBeenCalled();
  });
  it('should show error message if api call fails', () => {
    useFetchAssignedFormsQuery.mockReturnValue({
      isLoading: false,
      isError: true,
      isSuccess: false,
      data: {},
    });
    renderComponent();

    expect(screen.queryByRole('grid')).not.toBeInTheDocument();
    expect(
      screen.getByText('Error fetching form assignments. Please try again')
    ).toBeInTheDocument();
  });

  it('should render skeleton on load', async () => {
    useFetchAssignedFormsQuery.mockReturnValue({
      isLoading: true,
      isError: false,
      isSuccess: false,
      rows: [],
      meta: {
        currentPage: 1,
        totalCount: 0,
      },
    });

    const { container } = renderComponent();

    /**
     * 25 rows times 4 columns
     */
    expect(container.querySelectorAll('.MuiSkeleton-rectangular')).toHaveLength(
      100
    );
  });
});
