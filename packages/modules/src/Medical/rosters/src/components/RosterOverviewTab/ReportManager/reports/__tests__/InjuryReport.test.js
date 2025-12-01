import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { Provider } from 'react-redux';
import { getInjuryReport } from '@kitman/services/src/services/medical';
import codingSystemKeys from '@kitman/common/src/variables/codingSystemKeys';
import {
  useGetOrganisationQuery,
  useGetSquadAthletesQuery,
} from '@kitman/common/src/redux/global/services/globalApi';
import InjuryReport from '../InjuryReport';

jest.mock('@kitman/services/src/services/medical');
jest.mock('@kitman/common/src/redux/global/services/globalApi', () => ({
  ...jest.requireActual('@kitman/common/src/redux/global/services/globalApi'),
  useGetOrganisationQuery: jest.fn(),
  useGetSquadAthletesQuery: jest.fn(),
}));

describe('InjuryReport', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useGetOrganisationQuery.mockReturnValue({
      data: {
        logo_full_path: 'logo.png',
        name: 'Kitman Labs',
      },
    });
    useGetSquadAthletesQuery.mockReturnValue({ data: [], isFetching: false });
  });

  const closeSettingsSpy = jest.fn();
  const printReportSpy = jest.fn();
  const props = {
    isReportActive: false,
    isSettingsOpen: true,
    closeSettings: closeSettingsSpy,
    printReport: printReportSpy,
    squadId: 100,
    t: i18nextTranslateStub(),
  };

  const storeFake = (state) => ({
    default: () => {},
    subscribe: () => {},
    dispatch: () => {},
    getState: () => ({ ...state }),
  });

  const store = storeFake({
    globalApi: {
      queries: {},
      mutations: {},
      provided: {},
      subscriptions: {},
      config: {},
    },
    medicalApi: {
      queries: {},
      mutations: {},
      provided: {},
      subscriptions: {},
      config: {},
    },
  });

  it('handles V2 coding system pathology correctly', async () => {
    window.featureFlags['emr-multiple-coding-systems'] = true;

    getInjuryReport.mockResolvedValue({
      'Test Squad': [
        {
          athlete: {
            id: 1,
            name: 'John Doe',
          },
          injury: 'Test Injury',
          occurrence_date: '2025-09-29',
          pathology: 'V2 Pathology',
          coding: {
            [codingSystemKeys.OSIICS_15]: { id: 1 },
            pathologies: [{ id: 1, pathology: 'V2 Pathology' }],
          },
        },
      ],
    });

    render(
      <Provider store={store}>
        <InjuryReport {...props} isReportActive />
      </Provider>
    );

    const title = await screen.findByTestId('sliding-panel|title');
    expect(title).toHaveTextContent('Injury Report');

    const pathologyCheckbox = screen.getByRole('checkbox', {
      name: 'Pathology',
    });
    await userEvent.click(pathologyCheckbox);
    expect(pathologyCheckbox).toBeChecked();

    const downloadButton = screen.getByRole('button', { name: 'Download' });
    await userEvent.click(downloadButton);

    await waitFor(() => {
      expect(getInjuryReport).toHaveBeenCalled();
    });

    expect(printReportSpy).toHaveBeenCalled();
  });
});
