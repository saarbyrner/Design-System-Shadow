import { screen, render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { data as mockStaffUsers } from '@kitman/services/src/mocks/handlers/medical/getStaffUsers';
import { useGetStaffUsersQuery } from '@kitman/common/src/redux/global/services/globalApi';
import { configureStore } from '@reduxjs/toolkit';
import labels from '@kitman/modules/src/OrganisationSettings/src/components/DynamicCohorts/ManageLabels/redux/reducers';
import userEvent from '@testing-library/user-event';
import { setFilter } from '@kitman/modules/src/DynamicCohorts/Labels/ListLabels/redux/slices/manageLabelsSlice';
import { getInitialState } from '@kitman/modules/src/DynamicCohorts/Labels/ListLabels/redux/slices/labelSlice';
import { FiltersTranslated as Filters } from '../Filters';
import { manageLabelsStateKey, getInitialFilters } from '../../utils/consts';

jest.mock('@kitman/common/src/redux/global/services/globalApi');

const defaultStore = {
  labelSlice: getInitialState(),
  manageLabelsSlice: {
    isLabelModalOpen: false,
    filters: {
      ...getInitialFilters(),
    },
  },
  globalApi: {
    useGetStaffUsersQuery: jest.fn(),
  },
};
describe('<Filters />', () => {
  beforeEach(() => {
    useGetStaffUsersQuery.mockReturnValue({
      data: mockStaffUsers,
    });
  });

  const renderComponent = () => {
    render(
      <Provider store={configureStore({ reducer: labels, defaultStore })}>
        <Filters stateKey={manageLabelsStateKey} setFilter={setFilter} />
      </Provider>
    );
  };

  const searchPlaceHolderText = 'Search';
  it('renders the search filter', () => {
    renderComponent();
    expect(
      screen.getByPlaceholderText(searchPlaceHolderText)
    ).toBeInTheDocument();
  });

  it('when typing a search value, the state is updated properly', async () => {
    const searchValue = 'My Search Value';
    renderComponent();
    expect(
      screen.getByPlaceholderText(searchPlaceHolderText)
    ).toBeInTheDocument();
    await userEvent.type(
      screen.getByPlaceholderText(searchPlaceHolderText),
      searchValue
    );

    expect(screen.getByPlaceholderText(searchPlaceHolderText)).toHaveValue(
      searchValue
    );
  });

  it('renders the created by filter', () => {
    renderComponent();
    expect(screen.getByText('Created by')).toBeInTheDocument();
  });

  it('renders the created on filter', () => {
    renderComponent();
    expect(screen.getByText('Created on')).toBeInTheDocument();
  });
});
