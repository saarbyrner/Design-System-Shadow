import { render, screen, waitFor } from '@testing-library/react';
import selectEvent from 'react-select-event';
import { VirtuosoMockContext } from 'react-virtuoso';
import userEvent from '@testing-library/user-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import {
  defaultMedicalPermissions,
  MockedPermissionContextProvider,
} from '@kitman/common/src/contexts/PermissionsContext/__tests__/testUtils';
import { mockedDefaultPermissionsContextValue } from '@kitman/modules/src/Medical/shared/utils/testUtils';
import { Provider } from 'react-redux';
import AddMedicalAlertSidePanel from '..';
import {
  mockedSquadAthletes,
  mockSelectedMedicalAlert,
} from './mocks/alertSidePanelMocks';
import { data as fetchedMedicalAlerts } from '../../../../../../../services/src/mocks/handlers/medical/getMedicalAlerts';

const storeFake = (state) => ({
  default: () => {},
  subscribe: () => {},
  dispatch: () => {},
  getState: () => ({ ...state }),
});

const store = storeFake({
  medicalApi: {},
});

describe('<AddMedicalAlertSidePanel />', () => {
  const props = {
    isOpen: true,
    isPastAthlete: false,
    athleteData: {},
    isAthleteSelectable: true,
    initialDataRequestStatus: null,
    squadAthletes: mockedSquadAthletes,
    medicalAlerts: fetchedMedicalAlerts.map((fetchedMedicalAlert) => {
      return { value: fetchedMedicalAlert.id, label: fetchedMedicalAlert.name };
    }),
    athleteId: null,
    onSaveMedicalAlert: jest.fn(),
    onSaveMedicalAlertStart: jest.fn(),
    onSaveMedicalAlertSuccess: jest.fn(),
    onClose: jest.fn(),
    t: i18nextTranslateStub(),
  };

  beforeEach(() => {
    i18nextTranslateStub();
  });

  it('renders the default form', async () => {
    render(
      <MockedPermissionContextProvider
        permissionsContext={{
          ...mockedDefaultPermissionsContextValue,
          permissions: {
            ...mockedDefaultPermissionsContextValue.permissions,
            medical: {
              ...defaultMedicalPermissions,
              alerts: {
                canCreate: true,
                canView: true,
              },
            },
          },
        }}
      >
        <Provider store={store}>
          <AddMedicalAlertSidePanel {...props} />
        </Provider>
      </MockedPermissionContextProvider>
    );

    await screen.findByText('Add medical alert');

    expect(
      screen.getByTestId('AddMedicalAlertSidePanel|AthleteSelect')
    ).toBeInTheDocument();

    expect(screen.getByText('Medical alert details')).toBeInTheDocument();

    expect(
      screen.getByTestId('AddMedicalAlertSidePanel|Severity')
    ).toBeInTheDocument();

    expect(
      screen.getByTestId('AddMedicalAlertSidePanel|CustomAlertName')
    ).toBeInTheDocument();

    const buttons = screen.getAllByRole('button');

    // buttons[1...4] are <SegmentedControl /> buttons
    // TODO: add not specified button back in once backend supports it
    expect(buttons).toHaveLength(7);

    const severeButton = buttons[1];
    const moderateButton = buttons[2];
    const mildButton = buttons[3];
    const notSpecifiedButton = buttons[4];

    expect(severeButton).toHaveTextContent('Severe');
    expect(moderateButton).toHaveTextContent('Moderate');
    expect(mildButton).toHaveTextContent('Mild');
    expect(notSpecifiedButton).toHaveTextContent('Not Specified');

    const addMoreDetailButton = buttons[5];
    expect(addMoreDetailButton).toHaveTextContent('Add more detail');

    const saveMedicalAlertButton = buttons[6];
    expect(saveMedicalAlertButton).toHaveTextContent('Save');
  });

  it('renders all the medical alert options', async () => {
    render(
      <MockedPermissionContextProvider
        permissionsContext={{
          ...mockedDefaultPermissionsContextValue,
          permissions: {
            ...mockedDefaultPermissionsContextValue.permissions,
            medical: {
              ...defaultMedicalPermissions,
              alerts: {
                canCreate: true,
                canView: true,
              },
            },
          },
        }}
      >
        <Provider store={store}>
          <VirtuosoMockContext.Provider
            value={{ viewportHeight: 2000, itemHeight: 50 }}
          >
            <AddMedicalAlertSidePanel {...props} athleteId={21} />
          </VirtuosoMockContext.Provider>
        </Provider>
      </MockedPermissionContextProvider>
    );

    await screen.findByText('Add medical alert');

    selectEvent.openMenu(
      screen
        .getByTestId('AddMedicalAlertSidePanel|AlertSelect')
        .querySelector('.kitmanReactSelect input')
    );

    expect(screen.getByText('Sickle Cell')).toBeInTheDocument();
    expect(screen.getByText('Asthma')).toBeInTheDocument();
    expect(screen.getByText('High BP')).toBeInTheDocument();
    expect(screen.getByText('Low BP')).toBeInTheDocument();
    expect(screen.getByText('MRSA')).toBeInTheDocument();
    expect(
      screen.getAllByText('Seizure disorder/epilepsy')[0]
    ).toBeInTheDocument();
    expect(screen.getByText('Cancer hx')).toBeInTheDocument();
    expect(screen.getByText('Diabetes')).toBeInTheDocument();
    expect(screen.getByText('IBS')).toBeInTheDocument();
    expect(screen.getByText('IBD')).toBeInTheDocument();
    expect(screen.getByText(/Chron[^']s/)).toBeInTheDocument();
    expect(screen.getByText('Abnormal liver function')).toBeInTheDocument();
    expect(screen.getByText('Gall bladder disease')).toBeInTheDocument();
    expect(screen.getByText('Pancreatitis')).toBeInTheDocument();
    expect(screen.getByText('Kidney injury')).toBeInTheDocument();
    expect(screen.getByText('Single paired organ')).toBeInTheDocument();
    expect(screen.getByText('Frequent migraines')).toBeInTheDocument();
    expect(screen.getByText('Solitary testicle')).toBeInTheDocument();
    expect(screen.getByText('Solitary kidney')).toBeInTheDocument();
    expect(screen.getByText('Hearing loss')).toBeInTheDocument();
    expect(screen.getByText('Contact lenses')).toBeInTheDocument();
    expect(screen.getByText('Staph hx')).toBeInTheDocument();
    expect(screen.getByText('Chronic Splenomegaly')).toBeInTheDocument();
    expect(screen.getByText('Cardia')).toBeInTheDocument();
    expect(screen.getByText('Chronic Dehydration')).toBeInTheDocument();
  });

  describe('button interactions', () => {
    beforeEach(() => {
      render(
        <MockedPermissionContextProvider
          permissionsContext={{
            ...mockedDefaultPermissionsContextValue,
            permissions: {
              ...mockedDefaultPermissionsContextValue.permissions,
              medical: {
                ...defaultMedicalPermissions,
                alerts: {
                  canCreate: true,
                },
              },
            },
          }}
        >
          <Provider store={store}>
            <AddMedicalAlertSidePanel {...props} athleteId={21} />
          </Provider>
        </MockedPermissionContextProvider>
      );
    });

    it('finds and opens optional Date of Alerts field', async () => {
      await screen.findByText('Add medical alert');

      await userEvent.click(
        screen.getByRole('button', {
          name: 'Add more detail',
        })
      );

      const toolTip = screen.getByText('Diagnosed on');
      await userEvent.click(toolTip);

      const dateLabel = screen.getByLabelText('Date');
      expect(dateLabel).toBeInTheDocument();
    });

    it('calls onClose when user clicks the close icon', async () => {
      const [closeButton] = screen.getAllByRole('button');
      await userEvent.click(closeButton);

      expect(props.onClose).toHaveBeenCalled();
    });
  });

  describe('when viewing a past athlete', () => {
    it('has the correct name for the athlete id', async () => {
      render(
        <MockedPermissionContextProvider
          permissionsContext={{
            ...mockedDefaultPermissionsContextValue,
            permissions: {
              ...mockedDefaultPermissionsContextValue.permissions,
              medical: {
                ...defaultMedicalPermissions,
                alerts: {
                  canCreate: true,
                  canView: true,
                },
              },
            },
          }}
        >
          <Provider store={store}>
            <AddMedicalAlertSidePanel {...props} athleteId={1} />
          </Provider>
        </MockedPermissionContextProvider>
      );
      await expect(screen.getByText('Athlete 1 Name')).toBeInTheDocument();
    });
  });

  describe('Editing a selected Medical Alert', () => {
    beforeEach(() => {
      window.featureFlags['medical-alerts-side-panel'] = true;
    });

    afterEach(() => {
      window.featureFlags['medical-alerts-side-panel'] = false;
    });

    it('autopopulates the form with the passed in values', async () => {
      render(
        <MockedPermissionContextProvider
          permissionsContext={{
            ...mockedDefaultPermissionsContextValue,
            permissions: {
              ...mockedDefaultPermissionsContextValue.permissions,
              medical: {
                ...defaultMedicalPermissions,
                alerts: {
                  canCreate: true,
                  canView: true,
                },
              },
            },
          }}
        >
          <Provider store={store}>
            <AddMedicalAlertSidePanel
              {...props}
              selectedMedicalAlert={mockSelectedMedicalAlert}
            />
          </Provider>
        </MockedPermissionContextProvider>
      );
      // this first waitFor is needed becuase we need to wait for state to be set
      await waitFor(() => {
        expect(screen.getByText('Athlete 1 Name')).toBeInTheDocument();
      });

      expect(screen.getByText('Medical alert details')).toBeInTheDocument();

      const input = screen.getByLabelText('Alert title');
      expect(input.value).toBe('Diabetes Type 1');

      const selectedSeverity = screen.getAllByRole('button')[2];
      expect(selectedSeverity).toHaveStyle({
        backgroundColor: '#3b4960',
      });
    });
  });
});
