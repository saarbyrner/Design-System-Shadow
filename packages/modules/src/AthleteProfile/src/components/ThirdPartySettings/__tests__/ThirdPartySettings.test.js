import { screen } from '@testing-library/react';

import renderWithRedux from '@kitman/common/src/utils/renderWithRedux';
import userEvent from '@testing-library/user-event';
import {
  toastAddType,
  toastRemoveType,
} from '@kitman/modules/src/Toasts/toastsSlice';
import {
  REDUCER_KEY,
  initialState,
} from '@kitman/modules/src/AthleteProfile/redux/slices/athleteProfileSlice';
import { data } from '@kitman/services/src/services/humanInput/api/mocks/data/athleteProfile/fetchIntegrationSettings';
import {
  useFetchIntegrationSettingsQuery,
  useUpdateAthleteIntegrationSettingsMutation,
} from '@kitman/services/src/services/humanInput/humanInput';

import { ThirdPartySettingsTranslated as ThirdPartySettings } from '../index';

jest.mock('@kitman/services/src/services/humanInput/humanInput', () => ({
  ...jest.requireActual('@kitman/services/src/services/humanInput/humanInput'),
  useFetchIntegrationSettingsQuery: jest.fn(),
  useUpdateAthleteIntegrationSettingsMutation: jest.fn(),
}));

describe('<ThirdPartySettings />', () => {
  const updateAthleteIntegrationSettings = jest.fn();

  const renderComponent = () => {
    const { mockedStore } = renderWithRedux(<ThirdPartySettings />, {
      useGlobalStore: false,
      preloadedState: {
        [REDUCER_KEY]: initialState,
      },
    });

    return mockedStore;
  };

  beforeEach(() => {
    useFetchIntegrationSettingsQuery.mockReturnValue({
      data,
      isSuccess: true,
      isLoading: false,
      isError: false,
    });

    useUpdateAthleteIntegrationSettingsMutation.mockReturnValue([
      updateAthleteIntegrationSettings,
      { isLoading: false },
    ]);

    updateAthleteIntegrationSettings.mockResolvedValue({});
  });

  it('renders', () => {
    renderComponent();

    expect(screen.getByText('Third Party Settings')).toBeInTheDocument();
    expect(
      screen.getByRole('button', {
        name: /save/i,
      })
    ).toBeInTheDocument();

    // inputs
    data.inputs.forEach((input) => {
      expect(
        screen.getByRole('textbox', {
          name: input.name,
        })
      ).toBeInTheDocument();
    });

    data.links.forEach((link) => {
      expect(
        screen.getByRole('link', {
          name: link.name,
        })
      ).toBeInTheDocument();
    });
  });

  it('calls onUpdateSettingField when user type on a setting field', async () => {
    const user = userEvent.setup();
    const mockedStore = renderComponent();

    const input = screen.getByRole('textbox', {
      name: /first beat sharks: first beat/i,
    });

    await user.type(input, 'some value');

    expect(mockedStore.dispatch).toHaveBeenCalledWith({
      payload: {
        'FirstBeat_Sharks__First Beat': 'some value',
      },
      type: `${REDUCER_KEY}/onUpdateSettingField`,
    });
  });

  it('calls success toast when clicking save button', async () => {
    const user = userEvent.setup();
    const mockedStore = renderComponent();
    const input = screen.getByRole('textbox', {
      name: /first beat sharks: first beat/i,
    });

    await user.type(input, 'some value');

    expect(mockedStore.dispatch).toHaveBeenCalledWith({
      payload: {
        'FirstBeat_Sharks__First Beat': 'some value',
      },
      type: `${REDUCER_KEY}/onUpdateSettingField`,
    });

    const saveButton = screen.getByRole('button', {
      name: /save/i,
    });

    await user.click(saveButton);

    expect(mockedStore.dispatch).toHaveBeenCalledWith({
      payload: expect.objectContaining({
        id: 'THIRD_PARTY_SETTINGS_SUCCESS_TOAST_ID',
      }),
      type: toastAddType,
    });
  });

  it('calls error toast when clicking save button if something fails', async () => {
    const user = userEvent.setup();
    const mockedStore = renderComponent();
    updateAthleteIntegrationSettings.mockRejectedValue({});

    const input = screen.getByRole('textbox', {
      name: /first beat sharks: first beat/i,
    });

    await user.type(input, 'some value');

    expect(mockedStore.dispatch).toHaveBeenCalledWith({
      payload: {
        'FirstBeat_Sharks__First Beat': 'some value',
      },
      type: `${REDUCER_KEY}/onUpdateSettingField`,
    });

    const saveButton = screen.getByRole('button', {
      name: /save/i,
    });

    await user.click(saveButton);

    expect(mockedStore.dispatch).toHaveBeenCalledWith({
      payload: expect.objectContaining({
        id: 'THIRD_PARTY_SETTINGS_ERROR_TOAST_ID',
      }),
      type: toastRemoveType,
    });
  });
});
