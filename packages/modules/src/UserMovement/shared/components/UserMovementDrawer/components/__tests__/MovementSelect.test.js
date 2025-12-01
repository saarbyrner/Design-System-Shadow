import { screen, fireEvent } from '@testing-library/react';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import useLeagueOperations from '@kitman/common/src/hooks/useLeagueOperations';
import renderWithProviders from '@kitman/common/src/utils/renderWithProviders';
import MovementSelect from '../MovementSelect';

jest.mock('@kitman/common/src/hooks/useLeagueOperations');

const defaultStore = {
  globalApi: {
    queries: {
      'getPermissions(undefined)': {
        data: {
          userMovement: {
            player: {
              medicalTrial: false,
              trade: false,
            },
          },
        },
      },
      'fetchOrganisationPreference("enable_activity_type_category")': {
        data: {
          value: false,
        },
      },
    },
  },
};

const i18nT = i18nextTranslateStub();

const props = {
  value: '',
  mode: 'VIEW',
  onUpdate: jest.fn(),
  t: i18nT,
};
beforeEach(() => {
  useLeagueOperations.mockReturnValue({
    isAssociationAdmin: false,
  });
});

describe('MovementSelect Component', () => {
  it('renders the <MovementSelect/>', async () => {
    renderWithProviders(<MovementSelect {...props} />, {
      preloadedState: defaultStore,
    });

    expect(screen.getByText('Type of movement')).toBeInTheDocument();
    expect(screen.getByText('-')).toBeInTheDocument();
  });
});

describe('<MovementSelect/> VIEW mode and a value', () => {
  const updatedStore = {
    globalApi: {
      queries: {
        'getPermissions(undefined)': {
          data: {
            userMovement: {
              player: {
                medicalTrial: true,
                trade: false,
              },
            },
          },
        },
        'fetchOrganisationPreference("enable_activity_type_category")': {
          data: {
            value: false,
          },
        },
      },
    },
  };

  it('renders the <MovementSelect/>', async () => {
    window.featureFlags['league-ops-player-movement-medical-trial'] = true;
    renderWithProviders(<MovementSelect {...props} value="medical_trial" />, {
      preloadedState: updatedStore,
    });

    expect(screen.getByText('Type of movement')).toBeInTheDocument();
    expect(screen.getByText('Medical Trial')).toBeInTheDocument();
  });

  it('does not render medical trial without feature flag', async () => {
    window.featureFlags['league-ops-player-movement-medical-trial'] = false;
    renderWithProviders(<MovementSelect {...props} value="medical_trial" />, {
      preloadedState: updatedStore,
    });

    expect(screen.getByText('Type of movement')).toBeInTheDocument();
    expect(screen.queryByText('Medical Trial')).not.toBeInTheDocument();
  });

  it('does not render v2 medical trial without feature flag', async () => {
    window.featureFlags['league-ops-player-movement-medical-trial'] = false;
    window.featureFlags['past-athletes-medical-trial'] = false;
    renderWithProviders(
      <MovementSelect {...props} value="medical_trial_v2" />,
      {
        preloadedState: updatedStore,
      }
    );

    expect(screen.getByText('Type of movement')).toBeInTheDocument();
    expect(screen.queryByText('Medical Trial')).not.toBeInTheDocument();
  });

  it('does not render v2 medical trial without isPastPlayer boolean', async () => {
    window.featureFlags['past-athletes-medical-trial'] = true;
    renderWithProviders(
      <MovementSelect {...props} value="medical_trial_v2" />,
      {
        preloadedState: updatedStore,
      }
    );

    expect(screen.getByText('Type of movement')).toBeInTheDocument();
    expect(screen.queryByText('Medical Trial')).not.toBeInTheDocument();
  });

  it('Renders v2 medical trial with feature flag for past players', async () => {
    window.featureFlags['league-ops-player-movement-medical-trial'] = false;
    window.featureFlags['past-athletes-medical-trial'] = true;
    renderWithProviders(
      <MovementSelect {...props} value="medical_trial_v2" isPastPlayer />,
      {
        preloadedState: updatedStore,
      }
    );

    expect(screen.getByText('Type of movement')).toBeInTheDocument();
    expect(screen.getByText('Medical Trial')).toBeInTheDocument();
  });
});

describe('<MovementSelect/> EDIT mode', () => {
  it('renders the <MovementSelect/>', async () => {
    renderWithProviders(<MovementSelect {...props} mode="EDIT" />, {
      preloadedState: defaultStore,
    });
    expect(screen.getAllByText('Type of movement').at(0)).toBeInTheDocument();
    expect(
      screen.getByRole('button', {
        id: 'movement-type-select',
      })
    ).toBeInTheDocument();
  });
});

describe('<MovementSelect/> selecting an option', () => {
  const updatedStore = {
    globalApi: {
      queries: {
        'getPermissions(undefined)': {
          data: {
            userMovement: {
              player: {
                medicalTrial: true,
                trade: false,
              },
            },
          },
        },
        'fetchOrganisationPreference("enable_activity_type_category")': {
          data: {
            value: false,
          },
        },
      },
    },
  };

  beforeEach(() => {
    window.featureFlags['league-ops-player-movement-medical-trial'] = true;
  });

  it('selects the correct option', async () => {
    renderWithProviders(<MovementSelect {...props} mode="EDIT" />, {
      preloadedState: updatedStore,
    });

    const button = screen.getByRole('button');
    fireEvent.mouseDown(button);
    const medicalTrialOption = screen.getByRole('option');
    fireEvent.click(medicalTrialOption);

    expect(props.onUpdate).toHaveBeenCalledTimes(1);
    expect(props.onUpdate).toHaveBeenCalledWith('medical_trial');
  });
});
