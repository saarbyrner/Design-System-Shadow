import { screen, render } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import i18n from '@kitman/common/src/utils/i18n';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { Provider } from 'react-redux';
import { storeFake } from '@kitman/common/src/utils/renderWithRedux';
import { mockState } from '@kitman/modules/src/ElectronicFiles/shared/services/mocks/data/mockData.mock';
import ViewElectronicFileApp from '@kitman/modules/src/ElectronicFiles/ViewElectronicFile/src/App';

const props = {
  id: '123',
  t: i18nextTranslateStub(),
};

const store = storeFake({
  globalApi: {
    useGetPermissionsQuery: jest.fn(),
  },
  electronicFilesApi: {
    useGetUnreadCountQuery: jest.fn(),
  },
  ...mockState,
});

const renderComponent = () =>
  render(
    <I18nextProvider i18n={i18n}>
      <Provider store={store}>
        <ViewElectronicFileApp {...props} />
      </Provider>
    </I18nextProvider>
  );

describe('<App />', () => {
  it('renders correctly', async () => {
    renderComponent();

    expect(
      screen.getByRole('heading', { name: 'eFile', level: 5 })
    ).toBeInTheDocument();
  });
});
