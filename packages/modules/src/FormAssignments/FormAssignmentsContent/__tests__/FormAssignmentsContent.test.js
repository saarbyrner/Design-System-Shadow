import { screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import renderWithRedux from '@kitman/common/src/utils/renderWithRedux';
import {
  staffFlowMockData,
  paginationData,
} from '@kitman/services/src/services/humanInput/api/mocks/data/assignedForms/assignedForms.mock';
import {
  useFetchAssignedFormsQuery,
  useDeleteFormAnswersSetMutation,
} from '@kitman/services/src/services/humanInput/humanInput';
import { useFetchFormAssignmentsQuery } from '@kitman/services/src/services/formTemplates';
import useEventTracking from '@kitman/common/src/hooks/useEventTracking';

import { FormAssignmentsContentTranslated as FormAssignmentsContent } from '../index';

jest.mock('@kitman/services/src/services/humanInput/humanInput');
jest.mock('@kitman/services/src/services/formTemplates');
jest.mock('@kitman/common/src/hooks/useEventTracking');

describe('<FormAssignmentsContent />', () => {
  const deleteFormAnswersMutation = jest.fn();

  const renderComponent = () => {
    const { mockedStore, container } = renderWithRedux(
      <FormAssignmentsContent />,
      {
        useGlobalStore: false,
        preloadedState: { formStateSlice: { structure: {} } },
      }
    );
    return { mockedStore, container };
  };

  beforeEach(() => {
    useFetchAssignedFormsQuery.mockReturnValue({
      isLoading: false,
      isError: false,
      isSuccess: true,
      data: {
        data: staffFlowMockData,
        pagination: paginationData,
      },
    });

    useDeleteFormAnswersSetMutation.mockReturnValue([
      deleteFormAnswersMutation,
      { isLoading: false },
    ]);

    useFetchFormAssignmentsQuery.mockReturnValue({
      data: {
        athletes: [
          {
            id: 40211,
            firstname: 'Integration',
            lastname: 'Testing',
            fullname: 'Integration Testing',
            user_id: 40211,
          },
          {
            id: 40212,
            firstname: 'Hugo',
            lastname: 'Beuzeboc',
            fullname: null,
            user_id: 40212,
          },
        ],
      },
      error: false,
      isLoading: false,
    });

    useEventTracking.mockReturnValue({ trackEvent: jest.fn() });
  });

  it('should display the table data properly', () => {
    renderComponent();

    expect(screen.getByRole('grid')).toBeInTheDocument();

    // filters
    expect(
      screen.getByRole('combobox', {
        name: /athlete/i,
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole('combobox', {
        name: /status/i,
      })
    ).toBeInTheDocument();

    // grid action buttons
    expect(screen.getAllByRole('button', { name: /start/i })).toHaveLength(4);

    expect(screen.getByRole('button', { name: /continue/i })).toBeInTheDocument(
      1
    );

    // table headers
    expect(
      screen.getByRole('columnheader', { name: 'Name' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('columnheader', { name: 'Last updated' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('columnheader', { name: 'Status' })
    ).toBeInTheDocument();

    // table data
    expect(
      screen.getByRole('cell', { name: 'Bhuvan Bhatt' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('cell', { name: 'hugo beuzeboc' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('cell', { name: 'Mohamed Ali 2' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('cell', { name: 'Daniel Athlete Athlete' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('cell', { name: 'Integration Testing' })
    ).toBeInTheDocument();

    expect(screen.getByRole('cell', { name: 'Draft' })).toBeInTheDocument();
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

    expect(deleteFormAnswersMutation).toHaveBeenCalledWith(265213);
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
     * 25 rows times 2 columns
     */
    expect(container.querySelectorAll('.MuiSkeleton-rectangular')).toHaveLength(
      50
    );
  });

  it('should display the list of assigned athletes correctly in the filter', () => {
    renderComponent();

    const athleteSelect = screen.getByRole('combobox', {
      name: /athlete/i,
    });

    fireEvent.change(athleteSelect, { target: { value: 'testing' } });

    expect(
      screen.getByRole('option', { name: 'Integration Testing' })
    ).toBeInTheDocument();
  });

  it('should display lastname, firstname if fullname is not available or empty', () => {
    renderComponent();

    const athleteSelect = screen.getByRole('combobox', {
      name: /athlete/i,
    });

    fireEvent.change(athleteSelect, { target: { value: 'hugo' } });

    expect(
      screen.getByRole('option', { name: 'Beuzeboc, Hugo' })
    ).toBeInTheDocument();
  });
});
