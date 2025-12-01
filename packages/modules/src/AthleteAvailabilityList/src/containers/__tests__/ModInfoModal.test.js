import { Provider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';
import { render, screen } from '@testing-library/react';
import i18n from '@kitman/common/src/utils/i18n';
import ModInfoModal from '../ModInfoModal';

const storeFake = (state) => ({
  subscribe: jest.fn(),
  dispatch: jest.fn(),
  getState: () => ({ ...state }),
});

jest.mock('../../containers/AppStatus', () => ({
  __esModule: true,
  default: () => <div data-testid="mock-app-status" />,
}));

describe('ModInfoModal', () => {
  const athletes = [
    {
      id: 1,
      name: 'Athlete One',
    },
  ];

  it('renders', () => {
    const store = storeFake({
      modInfoModal: {
        athlete: athletes[0],
        modInfoData: {
          text: '',
          rtp: '',
        },
        isModalOpen: true,
      },
    });

    render(
      <Provider store={store}>
        <I18nextProvider i18n={i18n}>
          <ModInfoModal />
        </I18nextProvider>
      </Provider>
    );

    expect(screen.getByText('Change Modification/Info')).toBeInTheDocument();
    expect(screen.getByTestId('mock-app-status')).toBeInTheDocument();
  });
});
