import { screen } from '@testing-library/react';
import renderWithRedux from '@kitman/common/src/utils/renderWithRedux';
import {
  data,
  paginationData,
} from '@kitman/services/src/services/humanInput/api/mocks/data/assignedForms/assignedForms.mock';
import {
  useFetchAssignedFormsQuery,
  useDeleteFormAnswersSetMutation,
} from '@kitman/services/src/services/humanInput/humanInput';

import { AssignedFormsTranslated as AssignedForms } from '..';

jest.mock('@kitman/services/src/services/humanInput/humanInput');

const renderComponent = () => {
  const { mockedStore } = renderWithRedux(<AssignedForms />, {
    useGlobalStore: false,
    preloadedState: {},
  });
  return mockedStore;
};

describe('<AssignedForms />', () => {
  const deleteFormAnswersMutation = jest.fn();

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

  it('should display the tabs properly', () => {
    renderComponent();

    expect(screen.getByText('Assigned Forms')).toBeInTheDocument();
    expect(
      screen.getByRole('tab', {
        name: /forms/i,
      })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('tab', {
        name: /completed/i,
      })
    ).toBeInTheDocument();
  });
});
