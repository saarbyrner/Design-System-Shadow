import { render, screen, waitFor, within } from '@testing-library/react';
import selectEvent from 'react-select-event';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import moment from 'moment-timezone';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { MockedOrganisationContextProvider } from '@kitman/common/src/contexts/OrganisationContext/__tests__/testUtils';
import { MockedPermissionContextProvider } from '@kitman/common/src/contexts/PermissionsContext/__tests__/testUtils';
import {
  defaultMedicalPermissions,
  mockedDefaultPermissionsContextValue,
  mockedSquadAthletes,
} from '@kitman/modules/src/Medical/shared/utils/testUtils';
import { VirtuosoMockContext } from 'react-virtuoso';
import { data as getAthleteIssuesData } from '@kitman/services/src/mocks/handlers/medical/getAthleteIssues';
import { data as getAthleteData } from '@kitman/services/src/mocks/handlers/getAthleteData';

import * as medicalSharedApi from '@kitman/modules/src/Medical/shared/redux/services/medicalShared';
import * as useEnrichedAthletesIssues from '@kitman/modules/src/Medical/shared/hooks/useEnrichedAthletesIssues';
import AddDiagnosticSidePanel from '..';

const storeFake = (state) => ({
  default: () => {},
  subscribe: () => {},
  dispatch: () => {},
  getState: () => ({ ...state }),
});

const store = storeFake({
  medicalApi: {},
});

const mockedDiagnosticTypes = [
  { value: 19, label: '3D Analysis', optional: false },
  { value: 30, label: 'Blood Tests', optional: true },
  { value: 75, label: 'Concussion', optional: true },
  { value: 70, label: 'COVID-19 Antibody Test', optional: true },
  { value: 67, label: 'COVID-19 Test', optional: true },
  {
    value: 76,
    label: 'Cardiac Data',
    optional: true,
    cardiacScreening: true,
    diagnostic_type_questions: [],
  },
  { value: 24, label: 'Medication', optional: true },
  { value: 4, label: 'Intra-articular injection ', optional: false },
  { value: 47, label: 'Isokinetic Testing', optional: false },
  { value: 57, label: 'Manual', optional: false },
  { value: 21, label: 'Medical Scope ', optional: false },
];

const mockedDiagnosticReasons = [
  {
    value: 1,
    isInjuryIllness: true,
    label: 'Injury/ Illness',
  },
  {
    value: 2,
    isInjuryIllness: false,
    label: 'COVID exposure',
  },
  {
    value: 3,
    isInjuryIllness: false,
    label: 'Trade',
  },
  {
    value: 4,
    isInjuryIllness: false,
    label: 'Preseason screen',
  },
];
const medicalLocations = [
  {
    label: 'Bellin',
    redoxOrderable: false,
    value: 22,
  },
  {
    label: 'Mellwood',
    redoxOrderable: true,
    value: 25,
  },
];

const props = {
  athleteId: null,
  staffUsers: [],
  covidResultTypes: [],
  covidAntibodyResultTypes: [],
  diagnosticTypes: mockedDiagnosticTypes,
  medicalLocations,
  diagnosticReasons: mockedDiagnosticReasons,
  initialDataRequestStatus: jest.fn(),
  isAthleteSelectable: false,
  isOpen: true,
  onClose: jest.fn(),
  squadAthletes: mockedSquadAthletes,
  isPastAthlete: false,
  athleteData: {},
  t: i18nextTranslateStub(),
};

const renderTestComponent = (passedProps = {}) => {
  return (
    <Provider store={store}>
      <MockedOrganisationContextProvider
        organisationContext={{
          organisation: { id: 37, redox_orderable: true },
        }}
      >
        <VirtuosoMockContext.Provider
          value={{ viewportHeight: 10000, itemHeight: 50 }}
        >
          <LocalizationProvider
            dateAdapter={AdapterMoment}
            adapterLocale="en-gb"
          >
            <AddDiagnosticSidePanel {...props} {...passedProps} />
          </LocalizationProvider>
        </VirtuosoMockContext.Provider>
      </MockedOrganisationContextProvider>
    </Provider>
  );
};

describe('<AddDiagnosticSidePanel />', () => {
  beforeEach(() => {
    moment.tz.setDefault('UTC');
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2025-06-15T18:00:00Z'));
    jest
      .spyOn(medicalSharedApi, 'useGetAthleteDataQuery')
      .mockReturnValue({ data: getAthleteData });
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
    jest.restoreAllMocks();
    moment.tz.setDefault();
    window.setFlag('redox', false);
    window.setFlag('redox-iteration-1', false);
    window.setFlag('referring-physician-treatments-diagnostics', false);
    window.setFlag('covid-19-medical-diagnostic', false);
    window.setFlag('medical-diagnostics-iteration-3-billing-cpt', false);
    window.setFlag('diagnostics-billing-extra-fields', false);
    window.setFlag('diagnostics-multiple-cpt', false);
    window.setFlag('chronic-injury-illness', false);
  });

  it('renders the panel with the proper title', async () => {
    render(renderTestComponent());
    await screen.findByText('Add diagnostic');
    expect(screen.getByText('Add diagnostic')).toBeInTheDocument();
  });

  it('renders the location dropdown', async () => {
    render(
      renderTestComponent({
        medicalLocations: [
          {
            name: 'Jonnys apartment',
            id: 3,
            type_of: { name: 'diagnostic', value: 0 },
          },
        ],
      })
    );
    await screen.findByText('Add diagnostic');

    expect(screen.getByLabelText('Location')).toBeInTheDocument();
  });

  it('renders the correct content', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(renderTestComponent({ athleteId: 1 }));
    await screen.findByText('Add diagnostic');

    expect(screen.getByLabelText('Diagnostic type')).toBeInTheDocument();
    expect(screen.getByLabelText('Athlete')).toBeInTheDocument();
    expect(screen.getByLabelText('Date of diagnostic')).toBeInTheDocument();

    const diagnosticTypeSelectField = screen.getByLabelText('Diagnostic type');
    selectEvent.openMenu(diagnosticTypeSelectField);
    await selectEvent.select(diagnosticTypeSelectField, '3D Analysis');

    expect(screen.getByLabelText('Reason')).toBeInTheDocument();
    expect(
      screen.getByLabelText('Associated injury/ illness')
    ).toBeInTheDocument();

    const attachmentsMenuOpenButton = screen.getByRole('button', {
      name: 'Add',
    });
    await user.click(attachmentsMenuOpenButton);

    const attachmentsMenu = screen.getByRole('tooltip');
    expect(
      within(attachmentsMenu).getByRole('button', {
        name: 'File',
      })
    ).toBeInTheDocument();
    expect(
      within(attachmentsMenu).getByRole('button', {
        name: 'Link',
      })
    ).toBeInTheDocument();
  });

  describe('[feature-flag] referring-physician-treatments-diagnostics', () => {
    beforeEach(() => {
      window.setFlag('referring-physician-treatments-diagnostics', true);
    });

    it('renders the referring physician field', async () => {
      render(renderTestComponent({ athleteId: 1 }));
      await screen.findByText('Add diagnostic');

      expect(screen.getByLabelText('Referring physician')).toBeInTheDocument();
    });
  });

  describe('when the diagnostic type is medication', () => {
    it('requires additional info fields to be entered', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
      render(renderTestComponent({ diagnosticTypes: mockedDiagnosticTypes }));

      const diagnosticTypeSelectField =
        screen.getByLabelText('Diagnostic type');
      selectEvent.openMenu(diagnosticTypeSelectField);
      await selectEvent.select(diagnosticTypeSelectField, 'Medication');

      const saveButton = screen.getByRole('button', { name: 'Save' });
      await user.click(saveButton);

      // Medication values need to be filled in so will show as invalid
      expect(screen.getByLabelText('Type').parentNode.parentNode).toHaveClass(
        'inputText--invalid'
      );

      expect(screen.getByLabelText('Dosage').parentNode.parentNode).toHaveClass(
        'inputText--invalid'
      );
      expect(
        screen.getByLabelText('Frequency').parentNode.parentNode
      ).toHaveClass('inputText--invalid');
    });
  });

  describe('when the diagnostic type is covid test', () => {
    beforeEach(() => {
      window.setFlag('covid-19-medical-diagnostic', true);
    });

    it('requires additional info fields to be entered', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
      render(renderTestComponent({ diagnosticTypes: mockedDiagnosticTypes }));

      const diagnosticTypeSelectField =
        screen.getByLabelText('Diagnostic type');
      selectEvent.openMenu(diagnosticTypeSelectField);
      await selectEvent.select(diagnosticTypeSelectField, 'COVID-19 Test');

      const saveButton = screen.getByRole('button', { name: 'Save' });
      await user.click(saveButton);

      expect(
        screen.getByLabelText('Date of test').parentNode.parentNode
      ).toHaveClass('inputText--invalid');

      expect(
        screen.getByLabelText('Result').parentNode.parentNode.parentNode
      ).toHaveClass('kitmanReactSelect--invalid');
    });
  });

  describe('when the diagnostic type is covid antibody test', () => {
    beforeEach(() => {
      window.setFlag('covid-19-medical-diagnostic', true);
    });

    it('requires additional info fields to be entered', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
      render(
        renderTestComponent({
          athleteId: 1,
          diagnosticTypes: mockedDiagnosticTypes,
        })
      );

      const diagnosticTypeSelectField =
        screen.getByLabelText('Diagnostic type');
      selectEvent.openMenu(diagnosticTypeSelectField);
      await selectEvent.select(
        diagnosticTypeSelectField,
        'COVID-19 Antibody Test'
      );

      const saveButton = screen.getByRole('button', { name: 'Save' });
      await user.click(saveButton);

      expect(
        screen.getByLabelText('Date of test').parentNode.parentNode
      ).toHaveClass('inputText--invalid');

      expect(
        screen.getByLabelText('Result').parentNode.parentNode.parentNode
      ).toHaveClass('kitmanReactSelect--invalid');
    });
  });

  it('calls the correct function when clicking the close button', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

    const onCloseMock = jest.fn();
    render(renderTestComponent({ onClose: onCloseMock }));
    await screen.findByText('Add diagnostic');
    const closeButton = screen.getByTestId('sliding-panel|close-button');
    await user.click(closeButton);

    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });

  describe('when saving without setting the required fields', () => {
    it('requires a diagnosticType to be selected', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
      render(renderTestComponent());

      const saveButton = screen.getByRole('button', { name: 'Save' });
      await user.click(saveButton);

      expect(
        screen.getByLabelText('Diagnostic type').parentNode.parentNode
          .parentNode
      ).toHaveClass('kitmanReactSelect--invalid');
    });

    it('requires an athlete and date to be selected', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
      render(renderTestComponent());

      const saveButton = screen.getByRole('button', { name: 'Save' });
      await user.click(saveButton);

      expect(
        screen.getByLabelText('Athlete').parentNode.parentNode.parentNode
      ).toHaveClass('kitmanReactSelect--invalid');

      expect(
        screen.getByLabelText('Date of diagnostic').parentNode.parentNode
      ).toHaveClass('inputText--invalid');
    });

    it('requires an issue to be selected if diagnosticType is not optional', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
      render(renderTestComponent({ athleteId: 1 }));

      const diagnosticTypeSelectField =
        screen.getByLabelText('Diagnostic type');
      selectEvent.openMenu(diagnosticTypeSelectField);
      await selectEvent.select(diagnosticTypeSelectField, '3D Analysis');

      const saveButton = screen.getByRole('button', { name: 'Save' });
      await user.click(saveButton);

      expect(
        screen.getByLabelText('Associated injury/ illness').parentNode
          .parentNode.parentNode
      ).toHaveClass('kitmanReactSelect--invalid');
    });
  });

  describe('Notes', () => {
    it('renders the correct content', async () => {
      render(
        <MockedPermissionContextProvider
          permissionsContext={{
            ...mockedDefaultPermissionsContextValue,
            permissions: {
              ...mockedDefaultPermissionsContextValue.permissions,
              medical: {
                ...defaultMedicalPermissions,
                notes: {
                  canCreate: true,
                },
              },
            },
          }}
        >
          {renderTestComponent({ athleteId: 1 })}
        </MockedPermissionContextProvider>
      );
      await screen.findByText('Add diagnostic');
      // Set the diagnosticType
      const diagnosticTypeSelectField =
        screen.getByLabelText('Diagnostic type');
      selectEvent.openMenu(diagnosticTypeSelectField);
      await selectEvent.select(diagnosticTypeSelectField, '3D Analysis');

      expect(screen.getByText('Note')).toBeInTheDocument();
      expect(screen.getByText('optional')).toBeInTheDocument();
    });
  });

  describe('when medical-diagnostics-iteration-3-billing-cpt FF is on', () => {
    beforeEach(() => {
      window.setFlag('medical-diagnostics-iteration-3-billing-cpt', true);
    });

    it('renders the correct content', async () => {
      render(renderTestComponent({ athleteId: 1 }));
      await screen.findByText('Add diagnostic');
      expect(screen.getByLabelText('CPT code')).toBeInTheDocument();
      expect(screen.getByText('Bill diagnostic')).toBeInTheDocument();
    });

    it('renders the billable fields when toggle is clicked', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
      render(renderTestComponent({ athleteId: 1 }));
      await screen.findByText('Add diagnostic');

      expect(screen.getByText('Bill diagnostic')).toBeInTheDocument();
      const billTreatmentToggle = screen.getByRole('switch');
      await user.click(billTreatmentToggle);

      expect(
        screen.getByLabelText('Amount paid by insurance')
      ).toBeInTheDocument();
      expect(
        screen.getByLabelText('Amount paid by athlete')
      ).toBeInTheDocument();
    });

    describe('when diagnostics-billing-extra-fields FF is on', () => {
      beforeEach(() => {
        window.setFlag('diagnostics-billing-extra-fields', true);
      });

      it('renders the billable fields when toggle is clicked', async () => {
        const user = userEvent.setup({
          advanceTimers: jest.advanceTimersByTime,
        });
        render(renderTestComponent({ athleteId: 1 }));
        await screen.findByText('Add diagnostic');

        expect(screen.getByText('Bill diagnostic')).toBeInTheDocument();
        const billTreatmentToggle = screen.getByRole('switch');
        await user.click(billTreatmentToggle);

        expect(screen.getByLabelText('Amount charged')).toBeInTheDocument();
        expect(
          screen.getByLabelText('Discount/ reduction')
        ).toBeInTheDocument();
        expect(
          screen.getByLabelText('Amount insurance paid')
        ).toBeInTheDocument();
        expect(screen.getByLabelText('Amount due')).toBeInTheDocument();
        expect(
          screen.getByLabelText('Amount athlete paid')
        ).toBeInTheDocument();
        expect(screen.getByLabelText('Date paid')).toBeInTheDocument();
      });
    });
  });

  describe('diagnostics-multiple-cpt FF is on', () => {
    beforeEach(() => {
      window.setFlag('medical-diagnostics-iteration-3-billing-cpt', true);
      window.setFlag('diagnostics-multiple-cpt', true);
    });

    it('renders the correct content', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
      render(renderTestComponent({ athleteId: 1 }));

      expect(screen.getByLabelText('CPT code')).toBeInTheDocument();
      expect(screen.getByText('Bill diagnostic')).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'Add another' })
      ).toBeInTheDocument();
      expect(
        screen.getByTestId('DiagnosticBilling|MultiBillingContainer')
      ).toBeInTheDocument(); // Initial render has one container

      await user.click(screen.getByRole('button', { name: 'Add another' }));
      expect(
        screen.getAllByTestId('DiagnosticBilling|MultiBillingContainer')
      ).toHaveLength(2); // After clicking, should have two
    });

    it('renders the billable fields when toggle is clicked', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
      render(renderTestComponent({ athleteId: 1 }));

      expect(screen.getByText('Bill diagnostic')).toBeInTheDocument();
      const billTreatmentToggle = screen.getByRole('switch');
      await user.click(billTreatmentToggle);

      expect(
        screen.getByLabelText('Amount paid by insurance')
      ).toBeInTheDocument();
      expect(
        screen.getByLabelText('Amount paid by athlete')
      ).toBeInTheDocument();
    });

    describe('when diagnostics-billing-extra-fields FF is on', () => {
      beforeEach(() => {
        window.setFlag('diagnostics-billing-extra-fields', true);
      });

      it('renders the billable fields when toggle is clicked', async () => {
        const user = userEvent.setup({
          advanceTimers: jest.advanceTimersByTime,
        });
        render(renderTestComponent({ athleteId: 1 }));

        expect(screen.getByText('Bill diagnostic')).toBeInTheDocument();
        const billTreatmentToggle = screen.getByRole('switch');
        await user.click(billTreatmentToggle);

        expect(screen.getByLabelText('Amount charged')).toBeInTheDocument();
        expect(
          screen.getByLabelText('Discount/ reduction')
        ).toBeInTheDocument();
        expect(
          screen.getByLabelText('Amount insurance paid')
        ).toBeInTheDocument();
        expect(screen.getByLabelText('Amount due')).toBeInTheDocument();
        expect(
          screen.getByLabelText('Amount athlete paid')
        ).toBeInTheDocument();
        expect(screen.getByLabelText('Date paid')).toBeInTheDocument();
      });
    });
  });

  describe('when redox FF is on', () => {
    beforeEach(() => {
      window.setFlag('redox', true);
      window.setFlag('redox-iteration-1', true);
    });

    it('renders the correct content', async () => {
      render(
        renderTestComponent({
          athleteId: 1,
          medicalLocations: [
            {
              name: 'Jonnys apartment',
              id: 3,
              type_of: { name: 'diagnostic', value: 0 },
            },
          ],
        })
      );
      await screen.findByText('Add diagnostic');

      expect(screen.getByLabelText('Player')).toBeInTheDocument();
      expect(
        screen.getByLabelText('Diagnostic order date')
      ).toBeInTheDocument();
      expect(screen.getByLabelText('Provider')).toBeInTheDocument();
      expect(screen.getByLabelText('Company')).toBeInTheDocument();
      expect(screen.getByLabelText('Reason')).toBeInTheDocument();
      expect(
        screen.getByLabelText('Related injury / illness')
      ).toBeInTheDocument();
      expect(screen.getByLabelText('Diagnostic type')).toBeInTheDocument();
      expect(screen.getByLabelText('Body area')).toBeInTheDocument();
      expect(screen.getByText('Optional')).toBeInTheDocument();
    });
  });

  describe('[PLAYER MOVEMENT]', () => {
    describe('[PAST ATHLETE] when viewing a past athlete for a non redox flow', () => {
      it('renders the correct content', async () => {
        jest.spyOn(medicalSharedApi, 'useGetAthleteDataQuery').mockReturnValue({
          data: {
            ...getAthleteData,
            isPastAthlete: true,
            dateOfLastActivity: '2023-01-28T23:59:59Z',
          },
        });
        render(renderTestComponent({ athleteId: 5 }));
        await screen.findByText('Add diagnostic');

        expect(screen.getByLabelText('Diagnostic type')).toBeInTheDocument();
        expect(screen.getByLabelText('Athlete')).toBeInTheDocument();
        expect(screen.getByLabelText('Date of diagnostic')).toBeInTheDocument();
      });
    });

    describe('[PAST ATHLETE] when viewing a past athlete for the redox flow', () => {
      beforeEach(() => {
        window.setFlag('redox', true);
        window.setFlag('redox-iteration-1', true);
      });

      it('renders the correct content', async () => {
        jest.spyOn(medicalSharedApi, 'useGetAthleteDataQuery').mockReturnValue({
          data: {
            ...getAthleteData,
            isPastAthlete: true,
            dateOfLastActivity: '2023-01-28T23:59:59Z',
          },
        });
        render(renderTestComponent({ athleteId: 5 }));
        await screen.findByText('Add diagnostic');

        expect(screen.getByLabelText('Player')).toBeInTheDocument();
        expect(
          screen.getByLabelText('Diagnostic order date')
        ).toBeInTheDocument();
        expect(
          screen.getByLabelText('Diagnostic appt. date')
        ).toBeInTheDocument();
      });
    });

    describe('[NEW ATHLETE] when viewing a recently transferred athlete for a non redox flow', () => {
      it('renders the correct content', async () => {
        jest.spyOn(medicalSharedApi, 'useGetAthleteDataQuery').mockReturnValue({
          data: {
            ...getAthleteData,
            isPastAthlete: false,
            dateOfFirstActivity: '2022-12-16T05:04:33Z',
          },
        });
        render(renderTestComponent({ athleteId: 555 }));
        await screen.findByText('Add diagnostic');

        expect(screen.getByLabelText('Diagnostic type')).toBeInTheDocument();
        expect(screen.getByLabelText('Date of diagnostic')).toBeInTheDocument();
      });
    });

    describe('[NEW ATHLETE] when viewing a recently transferred athlete for the redox flow', () => {
      beforeEach(() => {
        window.setFlag('redox', true);
        window.setFlag('redox-iteration-1', true);
      });

      it('renders the correct content', async () => {
        jest.spyOn(medicalSharedApi, 'useGetAthleteDataQuery').mockReturnValue({
          data: {
            ...getAthleteData,
            isPastAthlete: false,
            dateOfFirstActivity: '2022-12-16T05:04:33Z',
          },
        });
        render(renderTestComponent({ athleteId: 555 }));
        await screen.findByText('Add diagnostic');

        expect(
          screen.getByLabelText('Diagnostic order date')
        ).toBeInTheDocument();
      });
    });
  });

  describe('when chronic-injury-illness FF is on', () => {
    const mockUseEnrichedAthletesIssues = {
      ...jest.requireActual('../../../hooks/useEnrichedAthletesIssues'),
      enrichedAthleteIssues: [],
    };
    beforeEach(() => {
      window.setFlag('chronic-injury-illness', true);

      jest.spyOn(useEnrichedAthletesIssues, 'default').mockReturnValue({
        ...mockUseEnrichedAthletesIssues,
        enrichedAthleteIssues: getAthleteIssuesData.chronicIssues,
      });
    });

    describe('when redox FF is on', () => {
      beforeEach(() => {
        window.setFlag('redox', true);
        window.setFlag('redox-iteration-1', true);
        jest.spyOn(useEnrichedAthletesIssues, 'default').mockReturnValue({
          ...mockUseEnrichedAthletesIssues,
          enrichedAthleteIssues: [
            {
              label: 'Open injury/ illness',
              options: [
                {
                  value: 'Injury_1',
                  label: '30 Oct 2023 - test',
                },
              ],
            },
          ],
        });
      });

      it('renders related injury/ illness even if chronic injuries are available.', async () => {
        render(renderTestComponent({ athleteId: 1 }));
        await screen.findByText('Add diagnostic');
        expect(
          screen.getByLabelText('Related injury / illness')
        ).toBeInTheDocument();
      });
    });
  });

  describe('[feature-flag] pm-diagnostic-add-flow-annotation-date', () => {
    it('renders the note without date field when the feature flag is OFF', async () => {
      window.setFlag('pm-diagnostic-add-flow-annotation-date', false);
      render(
        <MockedPermissionContextProvider
          permissionsContext={{
            ...mockedDefaultPermissionsContextValue,
            permissions: {
              ...mockedDefaultPermissionsContextValue.permissions,
              medical: {
                ...defaultMedicalPermissions,
                notes: {
                  canCreate: true,
                },
              },
            },
          }}
        >
          {renderTestComponent({ athleteId: 1 })}
        </MockedPermissionContextProvider>
      );
      await screen.findByText('Add diagnostic');
      
      const diagnosticTypeSelectField =
        screen.getByLabelText('Diagnostic type');
      selectEvent.openMenu(diagnosticTypeSelectField);
      await selectEvent.select(diagnosticTypeSelectField, '3D Analysis');
      await screen.findByText('Note');

      expect(screen.queryByText('Note date')).not.toBeInTheDocument();
    });

    it('does not render the annotation(note) date field when the feature flag is off', async () => {
      window.setFlag('pm-diagnostic-add-flow-annotation-date', false);
      render(renderTestComponent({ athleteId: 1 }));
      await screen.findByText('Add diagnostic');

      expect(
        screen.queryByLabelText('Note date')
      ).not.toBeInTheDocument();
    });
  });

  describe('button interactions', () => {
    const mockUseEnrichedAthletesIssues = {
      ...jest.requireActual('../../../hooks/useEnrichedAthletesIssues'),
      enrichedAthleteIssues: [],
    };

    beforeEach(() => {
      window.setFlag('redox', true);
      window.setFlag('redox-iteration-1', true);
      jest
        .spyOn(useEnrichedAthletesIssues, 'default')
        .mockReturnValue(mockUseEnrichedAthletesIssues);
    });

    it('filters out the medicalLocations if order is selected', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
      render(renderTestComponent());

      expect(
        screen.getByRole('button', {
          name: 'Log',
        })
      ).toBeInTheDocument();

      const orderButton = screen.getByRole('button', {
        name: 'Order',
      });
      expect(orderButton).toBeInTheDocument();

      const companySelectField = await waitFor(() =>
        screen.getByLabelText('Company')
      );

      selectEvent.openMenu(companySelectField);

      expect(screen.queryByText('Bellin')).toBeInTheDocument();
      expect(screen.queryByText('Mellwood')).toBeInTheDocument();

      await user.click(orderButton);
      selectEvent.openMenu(companySelectField);
      expect(screen.queryByText('Bellin')).not.toBeInTheDocument();
      expect(screen.queryByText('Mellwood')).toBeInTheDocument();
    });

    it('displays the associated injury/ illness dropdown when a cardiac screening diagnostic type is selected', async () => {
      window.setFlag('redox', false);
      window.setFlag('redox-iteration-1', false);

      jest.spyOn(useEnrichedAthletesIssues, 'default').mockReturnValue({
        ...mockUseEnrichedAthletesIssues,
        enrichedAthleteIssues: [
          {
            label: 'Open injury/ illness',
            options: [
              {
                value: 'Injury_1',
                label: '30 Oct 2023 - test',
              },
            ],
          },
        ],
      });

      render(renderTestComponent());

      expect(screen.getByText('Diagnostic type')).toBeInTheDocument();
      const diagnosticTypeSelectField =
        screen.getByLabelText('Diagnostic type');
      selectEvent.openMenu(diagnosticTypeSelectField);
      expect(screen.getByText('Cardiac Data')).toBeInTheDocument();
      await selectEvent.select(diagnosticTypeSelectField, 'Cardiac Data');

      expect(
        screen.getByText('Associated injury/ illness')
      ).toBeInTheDocument();
    });
  });

  describe('Add Tooltip Menu', () => {
    const mockUseEnrichedAthletesIssues = {
      ...jest.requireActual('../../../hooks/useEnrichedAthletesIssues'),
      enrichedAthleteIssues: [],
    };

    beforeEach(() => {
      jest
        .spyOn(useEnrichedAthletesIssues, 'default')
        .mockReturnValue(mockUseEnrichedAthletesIssues);
    });

    it('should render Note RichTextEditor and Note date DatePicker when Note is clicked in Add tooltip menu when flag is ON', async () => {
      window.setFlag('pm-diagnostic-add-flow-annotation-date', true);
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

      render(
        <MockedPermissionContextProvider
          permissionsContext={{
            ...mockedDefaultPermissionsContextValue,
            permissions: {
              ...defaultMedicalPermissions,
              medical: {
                notes: {
                  canCreate: true,
                },
              },
            },
          }}
        >
          {renderTestComponent({ athleteId: 1 })}
        </MockedPermissionContextProvider>
      );
      await screen.findByText('Add diagnostic');

      const diagnosticTypeSelectField =
        screen.getByLabelText('Diagnostic type');
      selectEvent.openMenu(diagnosticTypeSelectField);
      await selectEvent.select(diagnosticTypeSelectField, '3D Analysis');

      const attachmentsMenuOpenButton = screen.getByRole('button', {
        name: 'Add',
      });
      await user.click(attachmentsMenuOpenButton);

      const attachmentsMenu = screen.getByRole('tooltip');
      expect(
        within(attachmentsMenu).getByRole('button', {
          name: 'Note',
        })
      ).toBeInTheDocument();

      const noteButton = within(attachmentsMenu).getByRole('button', {
        name: 'Note',
      });
      await user.click(noteButton);

      const noteSection = await waitFor(() => screen.getAllByText('Note')[1]);

      expect(noteSection).toBeInTheDocument();
      expect(screen.getByText('Note date')).toBeInTheDocument();
    });

    it('should render the Note RichTextEditor but NOT the Note date DatePicker when flag is OFF', async () => {
      window.setFlag('pm-diagnostic-add-flow-annotation-date', false);
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

      render(
        <MockedPermissionContextProvider
          permissionsContext={{
            ...mockedDefaultPermissionsContextValue,
            permissions: {
              ...defaultMedicalPermissions,
              medical: {
                notes: {
                  canCreate: true,
                },
              },
            },
          }}
        >
          {renderTestComponent({ athleteId: 1 })}
        </MockedPermissionContextProvider>
      );
      await screen.findByText('Add diagnostic');

      const diagnosticTypeSelectField =
        screen.getByLabelText('Diagnostic type');
      selectEvent.openMenu(diagnosticTypeSelectField);
      await selectEvent.select(diagnosticTypeSelectField, '3D Analysis');

      const attachmentsMenuOpenButton = screen.getByRole('button', {
        name: 'Add',
      });
      await user.click(attachmentsMenuOpenButton);

      // Should not render the option in the MENU for this flow
      const attachmentsMenu = screen.getByRole('tooltip');
      expect(
        within(attachmentsMenu).queryByRole('button', {
          name: 'Note',
        })
      ).not.toBeInTheDocument();

      const noteSection = screen.getByText('Note');
      expect(noteSection).toBeInTheDocument();
      expect(screen.queryByText('Note date')).not.toBeInTheDocument();
    });
  });
});
