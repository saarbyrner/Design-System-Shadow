import { render, screen, within, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { Provider } from 'react-redux';
import LongitudinalAnkleProphylacticFormReport from '../LongitudinalAnkleProphylacticFormReport';

describe('LongitudinalAnkleProphylacticFormReport', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const closeSettingsSpy = jest.fn();
  const onDownloadCSVSuccessSpy = jest.fn();
  const props = {
    isSettingsOpen: true,
    closeSettings: closeSettingsSpy,
    onDownloadCSVSuccess: onDownloadCSVSuccessSpy,
    squadId: 100,
    reportTitle: 'Longitudinal Ankle Prophylactic Form',
    reportSettingsKey: 'longitudinal_ankle_prophylactic_form',
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
        <LongitudinalAnkleProphylacticFormReport {...props} />
      </Provider>
    );

    await waitFor(() => {
      expect(
        screen.queryByText('Longitudinal Ankle Prophylactic Form')
      ).toBeInTheDocument();
    });
    const title = screen.getByTestId('sliding-panel|title');
    expect(title).toHaveTextContent('Longitudinal Ankle Prophylactic Form');

    expect(screen.getByLabelText('Squads')).toBeInTheDocument();

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

  it('displays squad selector when no squadId', async () => {
    render(
      <Provider store={store}>
        <LongitudinalAnkleProphylacticFormReport {...props} squadId={null} />
      </Provider>
    );

    await waitFor(() => {
      expect(
        screen.queryByText('Longitudinal Ankle Prophylactic Form')
      ).toBeInTheDocument();
    });

    expect(screen.getByLabelText('Squads')).toBeInTheDocument();
  });

  it('calls the closeSettings callback on cancel button', async () => {
    render(
      <Provider store={store}>
        <LongitudinalAnkleProphylacticFormReport {...props} />
      </Provider>
    );
    await waitFor(() => {
      expect(
        screen.queryByText('Longitudinal Ankle Prophylactic Form')
      ).toBeInTheDocument();
    });

    const closeButton = screen.getAllByRole('button')[0];
    await userEvent.click(closeButton);

    expect(closeSettingsSpy).toHaveBeenCalledTimes(1);
  });

  it('calls the closeSettings callback on close sidepanel', async () => {
    render(
      <Provider store={store}>
        <LongitudinalAnkleProphylacticFormReport {...props} />
      </Provider>
    );
    await waitFor(() => {
      expect(
        screen.queryByText('Longitudinal Ankle Prophylactic Form')
      ).toBeInTheDocument();
    });

    const cancelButton = screen.getByRole('button', { name: 'Cancel' });
    await userEvent.click(cancelButton);

    expect(closeSettingsSpy).toHaveBeenCalledTimes(1);
  });

  it('calls the closeSettings and onDownloadCSVSuccess callback on download', async () => {
    render(
      <Provider store={store}>
        <LongitudinalAnkleProphylacticFormReport {...props} />
      </Provider>
    );
    await waitFor(() => {
      expect(
        screen.queryByText('Longitudinal Ankle Prophylactic Form')
      ).toBeInTheDocument();
    });

    const downloadButton = screen.getByRole('button', { name: 'Download' });
    await userEvent.click(downloadButton);

    expect(closeSettingsSpy).toHaveBeenCalledTimes(1);
    expect(onDownloadCSVSuccessSpy).toHaveBeenCalledTimes(1);
  });
});
