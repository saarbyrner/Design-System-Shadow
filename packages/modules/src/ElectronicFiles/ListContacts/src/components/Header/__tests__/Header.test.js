import { render, screen } from '@testing-library/react';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { Provider } from 'react-redux';
import { storeFake } from '@kitman/common/src/utils/renderWithRedux';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MENU_ITEM } from '@kitman/modules/src/ElectronicFiles/shared/redux/slices/sidebarSlice';
import Header from '@kitman/modules/src/ElectronicFiles/ListContacts/src/components/Header';
import { mockState } from '@kitman/modules/src/ElectronicFiles/shared/services/mocks/data/mockData.mock';

const props = {
  t: i18nextTranslateStub(),
};

const initialState = {
  ...mockState,
  sidebarSlice: {
    ...mockState.sidebarSlice,
    selectedMenuItem: MENU_ITEM.contacts,
  },
};

const renderComponent = (state = initialState) =>
  render(
    <Provider store={storeFake(state)}>
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <Header {...props} />
      </LocalizationProvider>
    </Provider>
  );

describe('<Header />', () => {
  it('renders title correctly', () => {
    renderComponent();

    expect(
      screen.getByRole('heading', { level: 5, name: /contacts/i })
    ).toBeInTheDocument();
  });
});
