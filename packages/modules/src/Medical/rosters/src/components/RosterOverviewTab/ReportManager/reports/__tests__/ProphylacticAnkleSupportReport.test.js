import { render, screen, within, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { Provider } from 'react-redux';
import ProphylacticAnkleSupportReport from '../ProphylacticAnkleSupportReport';

describe('ProphylacticAnkleSupportReport', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const closeSettingsSpy = jest.fn();
  const onDownloadCSVSuccessSpy = jest.fn();
  const props = {
    isSettingsOpen: true,
    closeSettings: closeSettingsSpy,
    onDownloadCSVSuccess: onDownloadCSVSuccessSpy,
    reportTitle: 'Prophylactic Ankle Support (Athletic Trainer)',
    formKey: 'nba-ankle-at-2334-v1',
    reportSettingsKey: 'prophylactic_ankle_support_at',
    t: i18nextTranslateStub(),
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

  it('displays correct options in sidepanel', async () => {
    render(
      <Provider store={store}>
        <ProphylacticAnkleSupportReport {...props} />
      </Provider>
    );

    await waitFor(() => {
      expect(
        screen.queryByText('Prophylactic Ankle Support (Athletic Trainer)')
      ).toBeInTheDocument();
    });
    const title = screen.getByTestId('sliding-panel|title');
    expect(title).toHaveTextContent(
      'Prophylactic Ankle Support (Athletic Trainer)'
    );

    const lists = screen.getAllByRole('list');
    // eslint-disable-next-line jest-dom/prefer-in-document
    expect(lists).toHaveLength(1);

    // Main checkboxes
    const checkboxes1 = within(lists[0]).getAllByRole('checkbox');
    const expectedCheckboxNames = ['Player Name'];
    expect(checkboxes1).toHaveLength(expectedCheckboxNames.length);
    expectedCheckboxNames.forEach((name) => {
      expect(
        within(lists[0]).getByRole('checkbox', { name })
      ).toBeInTheDocument();
    });
  });

  it('calls the closeSettings callback on cancel button', async () => {
    render(
      <Provider store={store}>
        <ProphylacticAnkleSupportReport {...props} />
      </Provider>
    );
    await waitFor(() => {
      expect(
        screen.queryByText('Prophylactic Ankle Support (Athletic Trainer)')
      ).toBeInTheDocument();
    });

    const closeButton = screen.getAllByRole('button')[0];
    await userEvent.click(closeButton);

    expect(closeSettingsSpy).toHaveBeenCalledTimes(1);
  });

  it('calls the closeSettings callback on close sidepanel', async () => {
    render(
      <Provider store={store}>
        <ProphylacticAnkleSupportReport {...props} />
      </Provider>
    );
    await waitFor(() => {
      expect(
        screen.queryByText('Prophylactic Ankle Support (Athletic Trainer)')
      ).toBeInTheDocument();
    });

    const cancelButton = screen.getByRole('button', { name: 'Cancel' });
    await userEvent.click(cancelButton);

    expect(closeSettingsSpy).toHaveBeenCalledTimes(1);
  });

  it('calls the closeSettings and onDownloadCSVSuccess callback on download', async () => {
    render(
      <Provider store={store}>
        <ProphylacticAnkleSupportReport {...props} />
      </Provider>
    );
    await waitFor(() => {
      expect(
        screen.queryByText('Prophylactic Ankle Support (Athletic Trainer)')
      ).toBeInTheDocument();
    });

    const downloadButton = screen.getByRole('button', { name: 'Download' });
    await userEvent.click(downloadButton);

    expect(closeSettingsSpy).toHaveBeenCalledTimes(1);
    expect(onDownloadCSVSuccessSpy).toHaveBeenCalledTimes(1);
  });
});
