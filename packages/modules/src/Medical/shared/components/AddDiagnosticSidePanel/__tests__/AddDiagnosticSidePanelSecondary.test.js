import {
  fireEvent,
  render,
  screen,
  within,
  waitFor,
} from '@testing-library/react';
import selectEvent from 'react-select-event';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import PermissionsContext, {
  DEFAULT_CONTEXT_VALUE,
} from '@kitman/common/src/contexts/PermissionsContext';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import moment from 'moment-timezone';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { MockedOrganisationContextProvider } from '@kitman/common/src/contexts/OrganisationContext/__tests__/testUtils';
import { mockedSquadAthletes } from '@kitman/modules/src/Medical/shared/utils/testUtils';
import { VirtuosoMockContext } from 'react-virtuoso';
import { data as getAthleteData } from '@kitman/services/src/mocks/handlers/getAthleteData';

import * as services from '@kitman/services';
import * as medicalSharedApi from '@kitman/modules/src/Medical/shared/redux/services/medicalShared';
import AddDiagnosticSidePanel from '..';

jest.mock('@kitman/components/src/DatePicker');

jest.mock('@kitman/components/src/richTextEditorAlt/index.js', () => {
  const RichTextEditorAlt = ({ onChange, value, isDisabled }) => (
    <div data-testid="RichTextEditorAlt|editor">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        data-testid="RichTextEditorAlt|input"
        disabled={isDisabled}
      />
    </div>
  );
  return {
    __esModule: true,
    default: RichTextEditorAlt,
    RichTextEditorAltTranslated: RichTextEditorAlt,
  };
});

jest.mock('@kitman/services', () => ({
  ...jest.requireActual('@kitman/services'),
  saveDiagnostic: jest.fn(),
}));

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
  athleteId: 1,
  staffUsers: [{ value: 1, label: 'David Kelly' }],
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
    <PermissionsContext.Provider
      value={{
        permissions: {
          ...DEFAULT_CONTEXT_VALUE.permissions,
          medical: {
            notes: { canCreate: true, canUpdate: true, canDelete: true },
          },
          concussion: {
            ...DEFAULT_CONTEXT_VALUE.permissions.concussion,
          },
        },
        permissionsRequestStatus: 'SUCCESS',
      }}
    >
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
    </PermissionsContext.Provider>
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
    services.saveDiagnostic.mockResolvedValue({});
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

  describe('[feature-flag] pm-diagnostic-add-flow-annotation-date true', () => {
    beforeEach(() => {
      window.setFlag('pm-diagnostic-add-flow-annotation-date', true);
    });

    it('does not save when annotationDate is required but not provided', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
      const onCloseMock = jest.fn();
      render(
        renderTestComponent({
          athleteId: 1,
          onClose: onCloseMock,
          diagnosticReasons: [
            { value: 1, label: 'Injury/ Illness', isInjuryIllness: true },
          ],
          userId: 1,
        })
      );
      await screen.findByText('Add diagnostic');

      expect(screen.queryByLabelText('Note date')).not.toBeInTheDocument();

      const datePicker = screen.getByLabelText('Date of diagnostic');
      fireEvent.change(datePicker, {
        target: { value: '29 Oct, 2020' },
      });

      const userSelectField = screen.getByLabelText('Practitioner');
      selectEvent.openMenu(userSelectField);
      await selectEvent.select(userSelectField, 'David Kelly');

      // Select a diagnostic type that makes the form otherwise valid
      const diagnosticTypeSelectField =
        screen.getByLabelText('Diagnostic type');
      selectEvent.openMenu(diagnosticTypeSelectField);
      await selectEvent.select(diagnosticTypeSelectField, '3D Analysis');

      await waitFor(
        () => {
          expect(
            screen.getByLabelText('Associated injury/ illness')
          ).toBeInTheDocument();
        },
        {
          timeout: 6000,
        }
      );
      // Select an associated injury/illness
      const associatedInjuryIllnessField = screen.getByLabelText(
        'Associated injury/ illness'
      );
      selectEvent.openMenu(associatedInjuryIllnessField);
      await selectEvent.select(
        associatedInjuryIllnessField,
        'Nov 11, 2020 - Ankle Fracture (Left)'
      );

      const attachmentsMenuOpenButton = screen.getByRole('button', {
        name: 'Add',
      });

      await user.click(attachmentsMenuOpenButton);
      const attachmentsMenu = screen.getByRole('tooltip');

      expect(
        screen.queryByTestId('RichTextEditorAlt|editor')
      ).not.toBeInTheDocument();

      const noteButton = within(attachmentsMenu).getByRole('button', {
        name: 'Note',
      });
      await user.click(noteButton);

      expect(
        screen.getByTestId('RichTextEditorAlt|editor')
      ).toBeInTheDocument();
      const mockInput = screen.getByTestId('RichTextEditorAlt|input');
      fireEvent.change(mockInput, {
        target: { value: 'This is a test note Hi' },
      });

      expect(screen.getByText('Note date')).toBeInTheDocument();
      const saveButton = screen.getByRole('button', { name: 'Save' });
      await user.click(saveButton);

      expect(services.saveDiagnostic).not.toHaveBeenCalled();
    });

    it('does save when note content not inputted', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
      const onCloseMock = jest.fn();
      render(
        renderTestComponent({
          athleteId: 1,
          onClose: onCloseMock,
          diagnosticReasons: [
            { value: 1, label: 'Injury/ Illness', isInjuryIllness: true },
          ],
          userId: 1,
        })
      );
      await screen.findByText('Add diagnostic');

      expect(screen.queryByLabelText('Note date')).not.toBeInTheDocument();

      const datePicker = screen.getByLabelText('Date of diagnostic');
      fireEvent.change(datePicker, {
        target: { value: '29 Oct, 2020' }, // Just some value to satisfy on null validation
      });

      const userSelectField = screen.getByLabelText('Practitioner');
      selectEvent.openMenu(userSelectField);
      await selectEvent.select(userSelectField, 'David Kelly');

      // Select a diagnostic type that makes the form otherwise valid
      const diagnosticTypeSelectField =
        screen.getByLabelText('Diagnostic type');
      selectEvent.openMenu(diagnosticTypeSelectField);
      await selectEvent.select(diagnosticTypeSelectField, '3D Analysis');

      // Select an associated injury/illness
      await waitFor(
        () => {
          expect(
            screen.getByLabelText('Associated injury/ illness')
          ).toBeInTheDocument();
        },
        {
          timeout: 6000,
        }
      );

      const associatedInjuryIllnessField = screen.getByLabelText(
        'Associated injury/ illness'
      );
      selectEvent.openMenu(associatedInjuryIllnessField);
      await selectEvent.select(
        associatedInjuryIllnessField,
        'Nov 11, 2020 - Ankle Fracture (Left)'
      );

      const attachmentsMenuOpenButton = screen.getByRole('button', {
        name: 'Add',
      });

      await user.click(attachmentsMenuOpenButton);
      const attachmentsMenu = screen.getByRole('tooltip');

      expect(
        screen.queryByTestId('RichTextEditorAlt|editor')
      ).not.toBeInTheDocument();

      const noteButton = within(attachmentsMenu).getByRole('button', {
        name: 'Note',
      });
      await user.click(noteButton);

      expect(
        screen.getByTestId('RichTextEditorAlt|editor')
      ).toBeInTheDocument();

      const elementFoPrettDOM2 = screen.getByTestId('RichTextEditorAlt|editor');
      const theEditableArea = within(elementFoPrettDOM2).getByRole('textbox', {
        contenteditable: 'true',
      });
      await user.click(theEditableArea);

      expect(theEditableArea).toBeInTheDocument();

      const saveButton = screen.getByRole('button', { name: 'Save' });
      await user.click(saveButton);

      // Save should not have been called because the form is now invalid
      expect(services.saveDiagnostic).toHaveBeenCalled();
    });

    it('does require annotationDate when showAnnotationDatePicker is true and other fields are valid', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
      const onCloseMock = jest.fn();

      render(
        renderTestComponent({
          athleteId: 1,
          onClose: onCloseMock,
          diagnosticReasons: [
            { value: 1, label: 'Injury/ Illness', isInjuryIllness: true },
          ],
          userId: 1,
        })
      );

      await screen.findByText('Add diagnostic');

      expect(screen.queryByLabelText('Note date')).not.toBeInTheDocument();

      const datePicker = screen.getByLabelText('Date of diagnostic');
      fireEvent.change(datePicker, {
        target: { value: '29 Oct, 2020' },
      });

      const userSelectField = screen.getByLabelText('Practitioner');
      selectEvent.openMenu(userSelectField);
      await selectEvent.select(userSelectField, 'David Kelly');

      // Select a diagnostic type that makes the form otherwise valid
      const diagnosticTypeSelectField =
        screen.getByLabelText('Diagnostic type');
      selectEvent.openMenu(diagnosticTypeSelectField);
      await selectEvent.select(diagnosticTypeSelectField, '3D Analysis');

      await waitFor(
        () => {
          expect(
            screen.getByLabelText('Associated injury/ illness')
          ).toBeInTheDocument();
        },
        {
          timeout: 6000,
        }
      );

      // Select an associated injury/illness
      const associatedInjuryIllnessField = screen.getByLabelText(
        'Associated injury/ illness'
      );
      selectEvent.openMenu(associatedInjuryIllnessField);
      await selectEvent.select(
        associatedInjuryIllnessField,
        'Nov 11, 2020 - Ankle Fracture (Left)'
      );

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

      // Passed validation
      expect(services.saveDiagnostic).not.toHaveBeenCalled();
    });

    it('does not render the annotation date field when the feature flag is off', async () => {
      window.setFlag('pm-diagnostic-add-flow-annotation-date', false);
      render(renderTestComponent({ athleteId: 1 }));
      await screen.findByText('Add diagnostic');

      expect(screen.queryByLabelText('Note date')).not.toBeInTheDocument();
    });
  });

  describe('[feature-flag] pm-diagnostic-add-flow-annotation-date false', () => {
    beforeEach(() => {
      window.setFlag('pm-diagnostic-add-flow-annotation-date', false);
    });

    it('does not require annotationDate when showAnnotationDatePicker is false and other fields are valid', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
      const onCloseMock = jest.fn();
      render(
        renderTestComponent({
          athleteId: 1,
          onClose: onCloseMock,
          diagnosticReasons: [
            { value: 1, label: 'Injury/ Illness', isInjuryIllness: true },
          ],
        })
      );
      await screen.findByText('Add diagnostic');

      expect(screen.queryByLabelText('Note date')).not.toBeInTheDocument();

      const datePicker = screen.getByLabelText('Date of diagnostic');
      fireEvent.change(datePicker, {
        target: { value: '29 Oct, 2020' }, // Just some value to satisfy on null validation
      });

      const userSelectField = screen.getByLabelText('Practitioner');
      selectEvent.openMenu(userSelectField);
      await selectEvent.select(userSelectField, 'David Kelly');

      // Select a diagnostic type that makes the form otherwise valid
      const diagnosticTypeSelectField =
        screen.getByLabelText('Diagnostic type');
      selectEvent.openMenu(diagnosticTypeSelectField);
      await selectEvent.select(diagnosticTypeSelectField, '3D Analysis');

      // Select an associated injury/illness
      const associatedInjuryIllnessField = screen.getByLabelText(
        'Associated injury/ illness'
      );
      selectEvent.openMenu(associatedInjuryIllnessField);
      await selectEvent.select(
        associatedInjuryIllnessField,
        'Nov 11, 2020 - Ankle Fracture (Left)'
      );

      // Click save
      const saveButton = screen.getByRole('button', { name: 'Save' });
      await user.click(saveButton);
      // Passed validation
      expect(services.saveDiagnostic).toHaveBeenCalledTimes(1);
    });
  });
});
