import { Provider } from 'react-redux';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import {
  useFetchRulesetQuery,
  useFetchAssigneesQuery,
  useUpdateAssigneesMutation,
} from '@kitman/modules/src/ConditionalFields/shared/services/conditionalFields';
import { data as mockVersionsList } from '@kitman/modules/src/ConditionalFields/shared/services/mocks/data/mock_versions_list';
import { data as mockAssignmentsList } from '@kitman/modules/src/ConditionalFields/shared/services/mocks/data/assignees.mock';
import ClubAssigneesTab from '..';

jest.mock(
  '@kitman/modules/src/ConditionalFields/shared/services/conditionalFields'
);

const currentVersion = 2;
useFetchRulesetQuery.mockReturnValue({
  data: { ...mockVersionsList, current_version: currentVersion },
});

useFetchAssigneesQuery.mockReturnValue({
  data: mockAssignmentsList,
});

const mockUpdateAssignees = jest.fn(() =>
  Promise.resolve({ data: mockAssignmentsList })
);

useUpdateAssigneesMutation.mockReturnValue([
  mockUpdateAssignees,
  { isLoading: false, isSuccess: false },
]);

const mockDispatch = jest.fn();

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
}));

const storeFake = (state) => ({
  default: () => {},
  subscribe: () => {},
  dispatch: () => {},
  getState: () => ({ ...state }),
});

const mockAssignments = mockAssignmentsList.assignments.map((assignment) => ({
  squad_id: assignment.assignee.id,
  active: 'active' in assignment ? assignment.active : false,
}));

const mockStore = storeFake({
  assigneesSlice: {
    editMode: false,
    fetchedAssignments: mockAssignments,
    assignments: mockAssignments,
  },
});

describe('ClubAssigneesTab', () => {
  const props = {
    rulesetId: 1,
    t: i18nextTranslateStub(),
  };
  it('renders correctly', () => {
    render(
      <Provider store={mockStore}>
        <ClubAssigneesTab {...props} />
      </Provider>
    );

    expect(screen.getByText('Assignees')).toBeInTheDocument();
    expect(screen.getByText('Squad')).toBeInTheDocument();
    expect(screen.getByText('Active players')).toBeInTheDocument();
    expect(screen.getByText('Assigned')).toBeInTheDocument();
    expect(screen.getByText('Assigned date')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Edit' })).toBeInTheDocument();
  });

  it('disables Edit button if no assignments', () => {
    useFetchAssigneesQuery.mockReturnValue({
      data: {
        assignments: [],
      },
    });

    const { getByText, getByRole } = render(
      <Provider
        store={storeFake({
          assigneesSlice: {
            fetchedAssignments: [],
            assignments: [],
          },
        })}
      >
        <ClubAssigneesTab {...props} />
      </Provider>
    );

    expect(getByRole('button', { name: 'Edit' })).toBeInTheDocument();
    expect(getByRole('button', { name: 'Edit' })).toBeDisabled();
    expect(getByText('No assignments')).toBeInTheDocument();
  });

  it('displays No assignments if no assignments', () => {
    useFetchAssigneesQuery.mockReturnValue({
      data: {
        assignments: [],
      },
    });

    const { getByText } = render(
      <Provider store={mockStore}>
        <ClubAssigneesTab {...props} />
      </Provider>
    );

    expect(getByText('No assignments')).toBeInTheDocument();
  });

  it('displays Save and Discard changes buttons when the Edit button is clicked', () => {
    render(
      <Provider
        store={storeFake({
          assigneesSlice: {
            editMode: true,
            fetchedAssignments: mockAssignments,
            assignments: mockAssignments,
          },
        })}
      >
        <ClubAssigneesTab {...props} />
      </Provider>
    );

    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Discard changes' })
    ).toBeInTheDocument();
  });

  it('disables the Save and Discard changes buttons if no changes made', () => {
    useFetchAssigneesQuery.mockReturnValue({
      data: {
        assignments: [],
      },
    });

    const { getByRole } = render(
      <Provider
        store={storeFake({
          assigneesSlice: {
            editMode: true,
            fetchedAssignments: mockAssignments,
            assignments: mockAssignments,
          },
        })}
      >
        <ClubAssigneesTab {...props} />
      </Provider>
    );

    expect(getByRole('button', { name: 'Save' })).toBeInTheDocument();
    expect(getByRole('button', { name: 'Save' })).toBeDisabled();
    expect(
      getByRole('button', { name: 'Discard changes' })
    ).toBeInTheDocument();
    expect(getByRole('button', { name: 'Discard changes' })).toBeDisabled();
  });

  it('enables the Save and Discard changes buttons if changes are made', () => {
    useFetchAssigneesQuery.mockReturnValue({
      data: {
        assignments: [],
      },
    });

    const { getByRole } = render(
      <Provider
        store={storeFake({
          assigneesSlice: {
            editMode: true,
            fetchedAssignments: mockAssignments,
            assignments: [
              ...mockAssignments.filter(
                (assignment) => assignment.squad_id !== 8
              ),
              {
                squad_id: 8,
                active: true,
              },
            ],
          },
        })}
      >
        <ClubAssigneesTab {...props} />
      </Provider>
    );

    expect(getByRole('button', { name: 'Save' })).toBeInTheDocument();
    expect(getByRole('button', { name: 'Save' })).toBeEnabled();
    expect(
      getByRole('button', { name: 'Discard changes' })
    ).toBeInTheDocument();
    expect(getByRole('button', { name: 'Discard changes' })).toBeEnabled();
  });

  it('calls updateAssignees when the Save button is clicked', async () => {
    const changedAssignee = {
      squad_id: 8,
      active: true,
    };

    render(
      <Provider
        store={storeFake({
          assigneesSlice: {
            editMode: true,
            fetchedAssignments: mockAssignments,
            assignments: [
              ...mockAssignments.filter(
                (assignment) => assignment.squad_id !== 8
              ),
              changedAssignee,
            ],
          },
        })}
      >
        <ClubAssigneesTab {...props} />
      </Provider>
    );

    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Save' }));
    expect(mockUpdateAssignees).toHaveBeenCalledWith({
      assignments: [changedAssignee],
      rulesetCurrentVersionId: mockVersionsList.versions.filter(
        (rulesetVersion) => rulesetVersion.version === currentVersion
      )[0]?.id,
    });
  });
});
