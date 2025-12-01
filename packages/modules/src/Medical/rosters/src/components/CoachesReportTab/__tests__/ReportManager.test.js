import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { Provider } from 'react-redux';
import ReportManager from '../components/ReportManager';

describe('<ReportManager />', () => {
  const i18nT = i18nextTranslateStub();
  const props = {
    t: i18nT,
    squads: [1],
  };

  const storeFake = (state) => ({
    default: () => {},
    subscribe: () => {},
    dispatch: () => {},
    getState: () => ({ ...state }),
  });

  const store = storeFake({
    medicalApi: {},
  });

  it('renders the component', () => {
    render(
      <Provider store={store}>
        <ReportManager {...props} />
      </Provider>
    );

    expect(screen.getByText('Export')).toBeInTheDocument();
  });

  it('renders side panel on clicking export', async () => {
    render(
      <Provider store={store}>
        <ReportManager {...props} />
      </Provider>
    );
    expect(screen.getByText('Export')).toBeInTheDocument();

    const title = screen.getByTestId('sliding-panel|title');
    expect(title).toHaveTextContent('Coaches Report');
  });

  it('renders Kitman Export button when "coaches-report-v2" FF OFF', async () => {
    window.featureFlags['coaches-report-v2'] = false;
    render(
      <Provider store={store}>
        <ReportManager {...props} />
      </Provider>
    );

    const exportButton = screen.getByRole('button', { name: 'Export' });
    await userEvent.click(exportButton);

    await waitFor(() => {
      expect(screen.queryByText('Coaches Report')).toBeInTheDocument();
      expect(exportButton).not.toHaveClass('MuiButton-root');
    });
  });

  it('renders MUI Export button when "coaches-report-v2" FF ON', async () => {
    window.featureFlags['coaches-report-v2'] = true;
    render(
      <Provider store={store}>
        <ReportManager {...props} />
      </Provider>
    );

    const exportButton = screen.getByRole('button', { name: 'Export' });
    await userEvent.click(exportButton);

    await waitFor(() => {
      expect(screen.getByText('Coaches Report')).toBeInTheDocument();
    });
    expect(exportButton).toHaveClass('MuiButton-root');
  });
});
