import moment from 'moment-timezone';
import { Provider } from 'react-redux';
import {
  render,
  screen,
  fireEvent,
  within,
  waitFor,
} from '@testing-library/react';
import { VirtuosoMockContext } from 'react-virtuoso';
import selectEvent from 'react-select-event';
import userEvent from '@testing-library/user-event';
import { server, rest } from '@kitman/services/src/mocks/server';
import {
  i18nextTranslateStub,
  storeFake,
} from '@kitman/common/src/utils/test_utils';
import { MockedPermissionContextProvider } from '@kitman/common/src/contexts/PermissionsContext/__tests__/testUtils';
import {
  defaultMedicalPermissions,
  mockedDefaultPermissionsContextValue,
} from '@kitman/modules/src/Medical/shared/utils/testUtils';
import {
  data as medicationData,
  taperedMedData,
} from '@kitman/services/src/mocks/handlers/medical/updateMedication';
import { drugTypesEnum } from '@kitman/modules/src/Medical/shared/types/medical/Medications';
import { useGetCountriesQuery } from '@kitman/common/src/redux/global/services/globalApi';
import { countriesData } from '@kitman/services/src/mocks/handlers/general/getCountries';
import {
  useGetAthleteDataQuery,
  useGetDrugFormsQuery,
  useGetMedStrengthUnitsQuery,
} from '@kitman/modules/src/Medical/shared/redux/services/medicalShared';
import {
  imageFileTypes,
  pdfFileType,
} from '@kitman/common/src/utils/mediaHelper';
import {
  drugFormsMock,
  medStrengthUnitsMock,
} from '@kitman/services/src/mocks/handlers/medical/medications/data.mock';
import MedicationTUE from '@kitman/modules/src/Medical/shared/components/AddMedicationSidePanel/components/MedicationTUE';
import AddMedicationSidePanel from '..';
import {
  mockIssues,
  mockSquadAthletes,
  mockStaffUsers,
  mockMedications,
} from '../mocks/mockData';

jest.mock('@kitman/components/src/DatePicker');
jest.mock(
  '@kitman/modules/src/Medical/shared/components/AddMedicationSidePanel/components/MedicationTUE',
  () => ({
    __esModule: true,
    default: jest
      .fn()
      .mockImplementation(
        jest.requireActual(
          '@kitman/modules/src/Medical/shared/components/AddMedicationSidePanel/components/MedicationTUE'
        )
      ),
  })
);
jest.mock('@kitman/modules/src/Medical/shared/redux/services/medicalShared');
jest.mock('@kitman/common/src/redux/global/services/globalApi', () => ({
  ...jest.requireActual('@kitman/common/src/redux/global/services/globalApi'),
  useGetCountriesQuery: jest.fn(),
}));

const store = storeFake({
  medicalApi: {},
  medicalSharedApi: {
    useGetAthleteDataQuery: jest.fn(),
    useGetDrugFormsQuery: jest.fn(),
    useGetMedStrengthUnitsQuery: jest.fn(),
  },
});

const getById = (id) => {
  return screen.getByTestId(`AddMedicationSidePanel|${id}`);
};

const locationProviders = mockStaffUsers.map(({ fullname, sgid }) => ({
  label: fullname,
  value: sgid,
}));

const fillRequiredTaperedMedFields = async (user) => {
  const dispensingDatePicker = within(getById('PrescriptionDate')).getByRole(
    'textbox'
  );

  fireEvent.click(dispensingDatePicker);
  fireEvent.change(dispensingDatePicker, {
    target: { value: '28 Oct, 2020' },
  });

  const dispenserSelect = screen.getByLabelText('Dispenser');
  selectEvent.openMenu(dispenserSelect);
  await selectEvent.select(dispenserSelect, ['Wade Wilson'], {
    container: document.body,
  });

  const taperedCheckbox = screen.getByRole('checkbox', {
    name: 'As directed',
  });
  expect(taperedCheckbox).not.toBeChecked();
  await user.click(taperedCheckbox);
  expect(taperedCheckbox).toBeChecked();

  const routeSelect = screen.getByLabelText('Route');
  selectEvent.openMenu(routeSelect);
  await selectEvent.select(routeSelect, 'Oral');

  const startDatePicker = within(getById('StartDate')).getByRole('textbox');
  fireEvent.click(startDatePicker);
  fireEvent.change(startDatePicker, { target: { value: '29 Oct, 2020' } });

  const endDatePicker = within(getById('EndDate')).getByRole('textbox');
  fireEvent.click(endDatePicker);
  fireEvent.change(endDatePicker, { target: { value: '29 Oct, 2020' } });

  expect(
    within(getById('Duration')).getByText('Duration (days)')
  ).toBeInTheDocument();
  expect(within(getById('Duration')).getByText('1')).toBeInTheDocument();
};

const fillRequiredUnlistedMedFields = async (user) => {
  const unlistedMedButton = screen.getByRole('button', {
    name: 'Unlisted Medication',
  });
  await user.click(unlistedMedButton);

  const drugNameInput = screen.getByRole('textbox', {
    name: 'Drug/Generic name',
  });

  fireEvent.change(drugNameInput, { target: { value: 'X' } });

  const brandNameInput = screen.getByRole('textbox', {
    name: 'Brand name',
  });

  fireEvent.change(brandNameInput, { target: { value: 'Y' } });

  const strengthInput = screen.getByRole('textbox', {
    name: 'Strength',
  });

  fireEvent.change(strengthInput, { target: { value: '100' } });

  const drugFormInput = screen.getByRole('combobox', { name: 'Drug form' });
  await user.click(drugFormInput);
  const creamDrugForm = screen.getByRole('option', { name: 'Cream' });
  await user.click(creamDrugForm);

  const unitInput = screen.getByRole('combobox', { name: 'unit' });
  await user.click(unitInput);
  const mlUnit = screen.getByRole('option', { name: 'ml (millilitre)' });
  await user.click(mlUnit);
};

describe('<AddMedicationSidePanel />', () => {
  const props = {
    isOpen: true,
    isAthleteSelectable: false,
    initialDataRequestStatus: null,
    squadAthletes: mockSquadAthletes,
    medicationProviders: {
      staffProviders: [],
      locationProviders,
      otherProviders: [{ label: 'Other', requiresText: true, value: 'other' }],
    },
    stockMedications: mockMedications,
    athleteId: null,
    onClose: jest.fn(),
    resetDrFirstMedications: jest.fn(),
    isEditing: false,
    selectedMedication: null,
    clearSelectedMedication: jest.fn(),
    actionType: 'Dispense',
    setActionType: jest.fn(),
    onSaveMedicationStart: jest.fn(),
    onSaveMedicationSuccess: jest.fn(),
    t: i18nextTranslateStub(),
  };

  const minimumAthleteData = { id: 1 };

  beforeAll(() => {
    i18nextTranslateStub();
  });

  beforeEach(() => {
    moment.tz.setDefault('UTC');
    useGetCountriesQuery.mockReturnValue({
      data: countriesData,
      isSuccess: true,
      isError: false,
      isLoading: false,
    });
    useGetAthleteDataQuery.mockReturnValue({
      data: null,
      error: false,
      isLoading: false,
    });
    useGetDrugFormsQuery.mockReturnValue({
      data: drugFormsMock.drug_forms,
      error: false,
      isLoading: false,
    });
    useGetMedStrengthUnitsQuery.mockReturnValue({
      data: medStrengthUnitsMock.med_strength_units,
      error: false,
      isLoading: false,
    });
  });

  afterEach(() => {
    moment.tz.setDefault();
    jest.resetAllMocks();
  });

  it('renders the default form', async () => {
    render(
      <Provider store={store}>
        <AddMedicationSidePanel {...props} />
      </Provider>
    );

    await screen.findByText('Add medication');

    expect(getById('Root')).toBeInTheDocument();
    expect(getById('AthleteSelect')).toBeInTheDocument();
    expect(getById('PrescriptionDate')).toBeInTheDocument();
    expect(getById('Prescriber')).toBeInTheDocument();
    expect(getById('Injury/Illness')).toBeInTheDocument();
    expect(getById('MedicationSelect')).toBeInTheDocument();
    expect(getById('Directions')).toBeInTheDocument();
    expect(getById('Frequency')).toBeInTheDocument();
    expect(getById('Route')).toBeInTheDocument();
    expect(getById('StartDate')).toBeInTheDocument();
    expect(getById('EndDate')).toBeInTheDocument();

    const taperedCheckbox = screen.queryByRole('checkbox', {
      name: 'As directed',
    });
    expect(taperedCheckbox).not.toBeInTheDocument();

    const buttons = screen.getAllByRole('button');

    // buttons[2...7] are the richtext input
    expect(buttons).toHaveLength(9);

    const closeIcon = buttons[0];
    expect(closeIcon).toBeInTheDocument();

    const saveButton = screen.getByRole('button', {
      name: /Dispense/i,
    });
    expect(saveButton).toBeInTheDocument();

    const formTitle = screen.getByTestId('sliding-panel|title');
    expect(formTitle).toHaveTextContent('Add medication');

    const availableInputs = screen.getAllByRole('textbox');
    expect(availableInputs).toHaveLength(11);
  });

  it('correctly calculates the duration when the start and end date are the same', async () => {
    render(
      <Provider store={store}>
        <AddMedicationSidePanel {...props} />
      </Provider>
    );
    await screen.findByText('Add medication');

    const startDatePicker = within(getById('StartDate')).getByRole('textbox');
    const endDatePicker = within(getById('EndDate')).getByRole('textbox');

    fireEvent.click(startDatePicker);
    fireEvent.change(startDatePicker, { target: { value: '29 Oct, 2020' } });
    const startDateValue = startDatePicker.value;
    expect(startDateValue).toEqual(expect.stringMatching('Oct 29 2020'));

    fireEvent.click(endDatePicker);
    fireEvent.change(endDatePicker, { target: { value: '29 Oct, 2020' } });
    const endDateValue = endDatePicker.value;
    expect(endDateValue).toEqual(expect.stringMatching('Oct 29 2020'));

    expect(
      within(getById('Duration')).getByText('Duration (days)')
    ).toBeInTheDocument();
    expect(within(getById('Duration')).getByText('1')).toBeInTheDocument();
  });

  it('correctly calculates the duration when the start and end date are different', async () => {
    render(
      <Provider store={store}>
        <AddMedicationSidePanel {...props} />
      </Provider>
    );
    await screen.findByText('Add medication');

    const startDatePicker = within(getById('StartDate')).getByRole('textbox');
    const endDatePicker = within(getById('EndDate')).getByRole('textbox');

    fireEvent.click(startDatePicker);
    fireEvent.change(startDatePicker, { target: { value: '29 Oct, 2020' } });
    const startDateValue = startDatePicker.value;
    expect(startDateValue).toEqual(expect.stringMatching('Oct 29 2020'));

    fireEvent.click(endDatePicker);
    fireEvent.change(endDatePicker, { target: { value: '31 Oct, 2020' } });
    const endDateValue = endDatePicker.value;
    expect(endDateValue).toEqual(expect.stringMatching('Oct 31 2020'));
    expect(
      within(getById('Duration')).getByText('Duration (days)')
    ).toBeInTheDocument();
    expect(within(getById('Duration')).getByText('3')).toBeInTheDocument();
  });

  it('clears start and end date when dispensing date is after start date', async () => {
    render(
      <Provider store={store}>
        <AddMedicationSidePanel {...props} />
      </Provider>
    );
    await screen.findByText('Add medication');

    // first selects dispense date, start, and end date, change dispense date to date after start date, then clear start and end dates
    const dispensingDatePicker = within(getById('PrescriptionDate')).getByRole(
      'textbox'
    );
    const startDatePicker = within(getById('StartDate')).getByRole('textbox');
    const endDatePicker = within(getById('EndDate')).getByRole('textbox');

    fireEvent.click(dispensingDatePicker);
    fireEvent.change(dispensingDatePicker, {
      target: { value: '28 Oct, 2020' },
    });
    let dispenseDateValue = dispensingDatePicker.value;
    expect(dispenseDateValue).toEqual(expect.stringMatching('Oct 28 2020'));

    fireEvent.click(startDatePicker);
    fireEvent.change(startDatePicker, { target: { value: '29 Oct, 2020' } });
    let startDateValue = startDatePicker.value;
    expect(startDateValue).toEqual(expect.stringMatching('Oct 29 2020'));

    fireEvent.click(endDatePicker);
    fireEvent.change(endDatePicker, { target: { value: '31 Oct, 2020' } });
    let endDateValue = endDatePicker.value;
    expect(endDateValue).toEqual(expect.stringMatching('Oct 31 2020'));

    await fireEvent.click(dispensingDatePicker);
    fireEvent.change(dispensingDatePicker, {
      target: { value: '1 Nov, 2020' },
    });
    dispenseDateValue = dispensingDatePicker.value;
    startDateValue = startDatePicker.value;
    endDateValue = endDatePicker.value;
    expect(startDateValue).toEqual('');
    expect(endDateValue).toEqual('');
  });

  it('changes button to save when isEditing is true', async () => {
    render(
      <Provider store={store}>
        <AddMedicationSidePanel {...props} isEditing athleteId={99} />
      </Provider>
    );
    await screen.findByText('Edit medication');

    const saveButton = screen.getByRole('button', {
      name: /Save/i,
    });
    expect(saveButton).toBeInTheDocument();
  });

  describe('button interactions', () => {
    it('calls onClose when userEvent clicks the close icon', async () => {
      const user = userEvent.setup();
      render(
        <Provider store={store}>
          <AddMedicationSidePanel {...props} />
        </Provider>
      );

      await screen.findByText('Add medication');
      const buttons = screen.getAllByRole('button');

      await user.click(buttons[0]);
      expect(props.onClose).toHaveBeenCalled();
    });
  });

  describe('an athleteId is present', () => {
    const athleteId = 1;
    beforeEach(() => {
      moment.tz.setDefault('UTC');

      server.use(
        rest.get(
          `/ui/medical/athletes/${athleteId}/issue_occurrences`,
          (req, res, ctx) => res(ctx.json(mockIssues))
        )
      );
    });
    afterEach(() => {
      moment.tz.setDefault();
    });

    it('has the correct name for the athlete id', async () => {
      render(
        <Provider store={store}>
          <AddMedicationSidePanel {...props} athleteId={athleteId} />
        </Provider>
      );
      await screen.findByText('Add medication');
      await expect(screen.getByText('Athlete 1 Name')).toBeInTheDocument();
    });
  });

  describe('when viewing a past athlete', () => {
    beforeEach(() => {
      moment.tz.setDefault('UTC');
    });
    afterEach(() => {
      moment.tz.setDefault();
    });

    it('has the correct name for the athlete id', async () => {
      render(
        <Provider store={store}>
          <AddMedicationSidePanel {...props} athleteId={1} />
        </Provider>
      );
      await screen.findByText('Add medication');
      await expect(screen.getByText('Athlete 1 Name')).toBeInTheDocument();
    });

    it('only shows the log button when the user only has the log permission', async () => {
      render(
        <MockedPermissionContextProvider
          permissionsContext={{
            permissions: {
              medical: {
                ...defaultMedicalPermissions,
                medications: {
                  ...defaultMedicalPermissions.medications,
                  canLog: true,
                },
              },
            },
          }}
        >
          <Provider store={store}>
            <AddMedicationSidePanel {...props} athleteId={99} />
          </Provider>
        </MockedPermissionContextProvider>
      );

      await screen.findByText('Add medication');
      const segmentedControlButtons = within(
        screen.getByTestId('LogDispenseSegmentedControl')
      ).getAllByRole('button');
      expect(segmentedControlButtons.length).toEqual(1);
      const logButton = segmentedControlButtons[0];
      expect(logButton).toBeInTheDocument();
    });

    it('when the initial action is Dispense, and the user clicks the Log button, the setter is called', async () => {
      const user = userEvent.setup();
      const setActionType = jest.fn();
      render(
        <MockedPermissionContextProvider
          permissionsContext={{
            permissions: {
              medical: {
                ...defaultMedicalPermissions,
                stockManagement: {
                  ...defaultMedicalPermissions.stockManagement,
                  canDispense: true,
                },
                medications: {
                  ...defaultMedicalPermissions.medications,
                  canLog: true,
                },
              },
            },
          }}
        >
          <Provider store={store}>
            <AddMedicationSidePanel
              {...props}
              actionType="Dispense"
              setActionType={setActionType}
              athleteId={99}
            />
          </Provider>
        </MockedPermissionContextProvider>
      );
      await screen.findByText('Add medication');

      const segmentedControlButtons = within(
        screen.getByTestId('LogDispenseSegmentedControl')
      ).getAllByRole('button');
      expect(segmentedControlButtons.length).toEqual(2);
      const logButton = segmentedControlButtons[0];
      await user.click(logButton);
      await waitFor(() => expect(setActionType).toHaveBeenCalledTimes(1));
    });
  });

  describe('checks feature flags hides allergies/alerts section', () => {
    beforeEach(() => {
      window.setFlag('medical-alerts-side-panel', true);
    });

    afterEach(() => {
      window.setFlag('medical-alerts-side-panel', false);
    });
    it('has allergies/alerts section if permissions true', async () => {
      render(
        <MockedPermissionContextProvider
          permissionsContext={{
            ...mockedDefaultPermissionsContextValue,
            permissions: {
              ...mockedDefaultPermissionsContextValue.permissions,
              medical: {
                ...defaultMedicalPermissions,
                allergies: {
                  canViewNewAllergy: true,
                },
                alerts: {
                  canView: true,
                },
              },
            },
          }}
        >
          <Provider store={store}>
            <AddMedicationSidePanel {...props} athleteId={99} />
          </Provider>
        </MockedPermissionContextProvider>
      );
      await screen.findByText('Add medication');
      expect(screen.getByText('Allergies')).toBeInTheDocument();
      expect(screen.getByText('Medical Alerts')).toBeInTheDocument();
    });

    it('does not have allergies/alerts section if permissions false', async () => {
      render(
        <MockedPermissionContextProvider
          permissionsContext={{
            ...mockedDefaultPermissionsContextValue,
            permissions: {
              ...mockedDefaultPermissionsContextValue.permissions,
              medical: {
                ...defaultMedicalPermissions,
                allergies: {
                  canViewNewAllergy: false,
                },
                alerts: {
                  canView: false,
                },
              },
            },
          }}
        >
          <Provider store={store}>
            <AddMedicationSidePanel {...props} athleteId={99} />
          </Provider>
        </MockedPermissionContextProvider>
      );
      await screen.findByText('Add medication');
      const allergiesAlertsSection = screen.queryByText('Allergies and Alerts');
      expect(allergiesAlertsSection).not.toBeInTheDocument();
    });
  });

  describe('check that if medication is selected, fields auto-populate', () => {
    it('auto-populates each field', async () => {
      render(
        <Provider store={store}>
          <AddMedicationSidePanel
            {...props}
            selectedMedication={medicationData}
            isEditing
            athleteId={1}
          />
        </Provider>
      );
      await screen.findByText('Edit medication');
      const prescriberElement = getById('Prescriber');
      expect(prescriberElement).toBeInTheDocument();

      const frequencyElement = getById('Frequency');
      expect(frequencyElement).toBeInTheDocument();
      expect(within(frequencyElement).getByRole('spinbutton').value).toEqual(
        '200'
      );

      const doseElement = getById('Dose');
      expect(doseElement).toBeInTheDocument();
      expect(within(doseElement).getByRole('spinbutton').value).toEqual('202');

      const routeElement = getById('Route');
      expect(routeElement).toBeInTheDocument();
      expect(screen.getByText('G-Tube')).toBeInTheDocument();

      const lotQuantityElement = getById('LotQuantity');
      expect(lotQuantityElement).toBeInTheDocument();
      expect(within(lotQuantityElement).getByRole('spinbutton').value).toEqual(
        '5'
      );
      await expect(screen.getByText('Athlete 1 Name')).toBeInTheDocument();
      await expect(screen.getByText('Matt Murdock')).toBeInTheDocument();
      await expect(screen.getByText('Apply')).toBeInTheDocument();
      await expect(screen.getByText('G-Tube')).toBeInTheDocument();
      await expect(screen.getByText('advil')).toBeInTheDocument();
    });
  });

  describe('autofill select', () => {
    it('shows error when no dispense date has been selected in dispense', async () => {
      const user = userEvent.setup();
      render(
        <Provider store={store}>
          <AddMedicationSidePanel
            {...props}
            selectedMedication={{
              drug: { id: 2, name: 'ibuprofen' },
              prescriber: { sgid: '1' },
            }}
            athleteId={1}
          />
        </Provider>
      );
      await screen.findByText('Add medication');

      expect(
        screen.getByTestId('AddMedicationSidePanel|MedicationSelect')
      ).toBeInTheDocument();
      await user.click(
        screen.getByTestId('AddMedicationSidePanel|MedicationSelect')
      );
      expect(await screen.findByText('ibuprofen')).toBeInTheDocument();

      const autofill = await screen.findByTestId('AutofillSelect');
      await user.click(autofill);

      expect(
        screen.getByText('Please select a dispense date.')
      ).toBeInTheDocument();
    });

    it('shows error when no dispense date has been selected in log', async () => {
      const user = userEvent.setup();
      render(
        <Provider store={store}>
          <AddMedicationSidePanel
            {...props}
            actionType="Log"
            selectedMedication={{
              drug: { id: 2, name: 'ibuprofen' },
              prescriber: { sgid: '1' },
            }}
            athleteId={1}
          />
        </Provider>
      );
      await screen.findByText('Add medication');
      expect(
        screen.getByTestId('AddMedicationSidePanel|MedicationAsyncSelect')
      ).toBeInTheDocument();
      await user.click(
        screen.getByTestId('AddMedicationSidePanel|MedicationAsyncSelect')
      );
      expect(await screen.findByText('ibuprofen')).toBeInTheDocument();

      const autofill = await screen.findByTestId('AutofillSelect');
      await user.click(autofill);

      expect(
        screen.getByText('Please select a dispense date.')
      ).toBeInTheDocument();
    });

    it('autofills correctly when option is selected for dispense', async () => {
      const user = userEvent.setup();
      render(
        <Provider store={store}>
          <AddMedicationSidePanel
            {...props}
            selectedMedication={{
              drug: { id: 2, name: 'ibuprofen' },
              prescriber: { sgid: '1' },
            }}
            athleteId={1}
          />
        </Provider>
      );
      await screen.findByText('Add medication');

      // we need a dispense date for autofill to work
      const dispenseDatePicker = within(getById('PrescriptionDate')).getByRole(
        'textbox'
      );
      fireEvent.click(dispenseDatePicker);
      fireEvent.change(dispenseDatePicker, {
        target: { value: '2023-03-31T05:00:00.000Z' },
      });
      const dispenseDateValue = dispenseDatePicker.value;
      expect(dispenseDateValue).toEqual(expect.stringMatching('Mar 31 2023'));

      const autofill = await screen.findByTestId('AutofillSelect');
      await user.click(within(autofill).getByRole('textbox'));

      expect(
        screen.getByText('take 4 by mouth 1 time(s), for 2 day(s)')
      ).toBeInTheDocument();

      expect(
        screen.getByText('apply 1 by mouth 3 time(s), for 1 day(s)')
      ).toBeInTheDocument();

      expect(screen.getByText('as directed, for 3 day(s)')).toBeInTheDocument();

      await user.click(
        screen.getByText('take 4 by mouth 1 time(s), for 2 day(s)')
      );

      const directionElement = getById('Directions');
      expect(directionElement).toBeInTheDocument();
      expect(within(directionElement).getByText('Take')).toBeInTheDocument();

      const frequencyElement = getById('Frequency');
      expect(frequencyElement).toBeInTheDocument();
      expect(within(frequencyElement).getByRole('spinbutton').value).toEqual(
        '1'
      );

      const doseElement = getById('Dose');
      expect(doseElement).toBeInTheDocument();
      expect(within(doseElement).getByRole('spinbutton').value).toEqual('4');

      const routeElement = getById('Route');
      expect(routeElement).toBeInTheDocument();
      expect(screen.getByText('Oral')).toBeInTheDocument();

      expect(within(getById('Duration')).getByText('2')).toBeInTheDocument();

      const startDatePicker = within(getById('StartDate')).getByRole('textbox');
      const startDateValue = startDatePicker.value;
      expect(startDateValue).toEqual(expect.stringMatching('Mar 31 2023'));
    });

    it('autofills correctly when option is selected for log', async () => {
      const user = userEvent.setup();
      render(
        <Provider store={store}>
          <AddMedicationSidePanel
            {...props}
            actionType="Log"
            selectedMedication={{
              drug: { id: 2, name: 'ibuprofen' },
              prescriber: { sgid: '1' },
            }}
            athleteId={1}
          />
        </Provider>
      );
      await screen.findByText('Add medication');
      // we need a dispense date for autofill to work
      const dispenseDatePicker = within(getById('PrescriptionDate')).getByRole(
        'textbox'
      );
      fireEvent.click(dispenseDatePicker);
      fireEvent.change(dispenseDatePicker, {
        target: { value: '2023-03-31T05:00:00.000Z' },
      });
      const dispenseDateValue = dispenseDatePicker.value;
      expect(dispenseDateValue).toEqual(expect.stringMatching('Mar 31 2023'));

      const autofill = await screen.findByTestId('AutofillSelect');
      await user.click(within(autofill).getByRole('textbox'));

      expect(
        screen.getByText('take 4 by mouth 1 time(s), for 2 day(s)')
      ).toBeInTheDocument();
      expect(
        screen.getByText('apply 1 by mouth 3 time(s), for 1 day(s)')
      ).toBeInTheDocument();

      await user.click(
        screen.getByText('take 4 by mouth 1 time(s), for 2 day(s)')
      );

      const directionElement = getById('Directions');
      expect(directionElement).toBeInTheDocument();
      expect(within(directionElement).getByText('Take')).toBeInTheDocument();

      const frequencyElement = getById('Frequency');
      expect(frequencyElement).toBeInTheDocument();
      expect(within(frequencyElement).getByRole('spinbutton').value).toEqual(
        '1'
      );

      const doseElement = getById('Dose');
      expect(doseElement).toBeInTheDocument();
      expect(within(doseElement).getByRole('spinbutton').value).toEqual('4');

      const routeElement = getById('Route');
      expect(routeElement).toBeInTheDocument();
      expect(screen.getByText('Oral')).toBeInTheDocument();

      expect(within(getById('Duration')).getByText('2')).toBeInTheDocument();

      const startDatePicker = within(getById('StartDate')).getByRole('textbox');
      const startDateValue = startDatePicker.value;
      expect(startDateValue).toEqual(expect.stringMatching('Mar 31 2023'));
    });
  });

  describe('default start date to today', () => {
    beforeEach(() => {
      moment.tz.setDefault('UTC');
    });

    afterEach(() => {
      moment.tz.setDefault();
    });

    it("default start date to today's date when isEditing = false", async () => {
      render(
        <Provider store={store}>
          <AddMedicationSidePanel
            {...props}
            isOpen
            athleteConstraints={{ organisationStatus: 'CURRENT_ATHLETE' }}
          />
        </Provider>
      );
      await screen.findByText('Add medication');

      const startDatePicker = within(getById('StartDate')).getByRole('textbox');
      const startDateValue = startDatePicker.value;
      expect(moment(startDateValue).format()).toEqual(
        moment().startOf('day').format()
      );
    });

    it("doesn't default start date to today's date when isEditing = true", async () => {
      render(
        <Provider store={store}>
          <AddMedicationSidePanel
            {...props}
            isOpen
            isEditing
            athleteConstraints={{ organisationStatus: 'CURRENT_ATHLETE' }}
            selectedMedication={medicationData}
          />
        </Provider>
      );

      await screen.findByText('Edit medication');
      const startDatePicker = within(getById('StartDate')).getByRole('textbox');
      const startDateValue = startDatePicker.value;
      expect(moment(startDateValue).format()).toEqual('2023-05-09T00:00:00Z');
    });
  });

  describe('[feature-flag] tapered-meds ON', () => {
    beforeEach(() => {
      window.setFlag('tapered-meds', true);
    });

    afterEach(() => {
      window.setFlag('tapered-meds', false);
    });

    it('populates each field correctly for a tapered medication', async () => {
      render(
        <Provider store={store}>
          <AddMedicationSidePanel
            {...props}
            selectedMedication={taperedMedData}
            isEditing
            athleteId={1}
          />
        </Provider>
      );
      await screen.findByText('Edit medication');
      const taperedCheckbox = screen.getByRole('checkbox', {
        name: 'As directed',
      });
      expect(taperedCheckbox).toBeChecked();

      const frequencyElement = getById('Frequency');
      expect(frequencyElement).toBeInTheDocument();
      const frequencyInput = within(frequencyElement).getByRole('spinbutton');
      expect(frequencyInput.value).toEqual(''); // Empty
      expect(frequencyInput).toBeDisabled();

      const doseElement = getById('Dose');
      expect(doseElement).toBeInTheDocument();
      const doseInput = within(doseElement).getByRole('spinbutton');
      expect(doseInput.value).toEqual(''); // Empty
      expect(doseInput).toBeDisabled();

      const saveButton = screen.getByRole('button', {
        name: /Save/i,
      });
      expect(saveButton).toBeInTheDocument();
    });

    it('calls onSaveMedicationSuccess correctly when editing a tapered medication', async () => {
      const user = userEvent.setup();

      // Mock in no drug or allergy interactions
      // NOTE: we automatically remove these Runtime request handlers added with server.use after each test in setupTests.js
      server.use(
        rest.get(`/ui/medical/athletes/1/issue_occurrences`, (req, res, ctx) =>
          res(ctx.json(mockIssues))
        ),
        rest.post('/ui/medical/medications/allergy_screen', (req, res, ctx) => {
          return res(ctx.json([]));
        }),
        rest.post(
          '/ui/medical/medications/drug_interaction_screen',
          (req, res, ctx) => {
            return res(ctx.json([]));
          }
        )
      );

      render(
        <Provider store={store}>
          <AddMedicationSidePanel
            {...props}
            athleteData={minimumAthleteData}
            selectedMedication={taperedMedData}
            isEditing
            athleteId={1}
          />
        </Provider>
      );
      await screen.findByText('Edit medication');
      const injuryInput = screen.getByLabelText('Injury / illness');

      expect(injuryInput).toBeInTheDocument();
      expect(injuryInput).toBeEnabled();

      expect(
        within(getById('Injury/Illness')).getByText(
          'Jul 4, 2022 - Abcess Ankle (excl. Joint) [Left]'
        )
      ).toBeInTheDocument();

      const taperedCheckbox = screen.getByRole('checkbox', {
        name: 'As directed',
      });
      expect(taperedCheckbox).toBeChecked();

      const saveButton = screen.getByRole('button', {
        name: /Save/i,
      });
      expect(saveButton).toBeInTheDocument();
      expect(saveButton).toBeEnabled();

      const requestSpy = jest.fn();
      server.events.on('request:start', requestSpy);

      await user.click(saveButton);
      expect(props.onSaveMedicationStart).toHaveBeenCalled();
      expect(props.onSaveMedicationSuccess).toHaveBeenCalledWith(3, [
        {
          id: 1,
          link: '/medical/athletes/1/illnesses/13899#medications',
          text: 'Illness',
          withHashParam: true,
        },
      ]);

      const expectedData = {
        athlete_id: 1,
        prescriber_sgid: 'DAREDEVIL',
        external_prescriber_name: '',
        prescription_date: '2023-04-01',
        stock_lots: [{ id: 2, dispensed_quantity: 5 }],
        directions: 'apply',
        tapered: true,
        dose: null,
        quantity: '5',
        frequency: null,
        route: 'via g-tube',
        start_date: '2023-05-09',
        end_date: '2023-05-10',
        duration: 2,
        note: '<p>test</p>',
        lot_number: undefined,
        issues: [{ type: 'IllnessOccurrence', id: 13899 }],
        type: 'InternalStock',
        drug_type: 'FdbDispensableDrug',
        attachments: [],
      };

      expect(requestSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'PATCH',
          url: new URL('http://localhost/ui/medical/medications/1'),
          body: expectedData,
        })
      );
    });
  });

  describe('[feature-flag] tapered-meds OFF', () => {
    beforeEach(() => {
      window.setFlag('tapered-meds', false);
    });

    it('does not render the As directed checkbox', async () => {
      render(
        <Provider store={store}>
          <AddMedicationSidePanel {...props} />
        </Provider>
      );
      await screen.findByText('Add medication');
      const taperedCheckbox = screen.queryByRole('checkbox', {
        name: 'As directed',
      });

      expect(taperedCheckbox).not.toBeInTheDocument();
    });
  });

  describe('[FEATURE FLAG] medications-general-availability', () => {
    beforeEach(() => {
      window.setFlag('medications-general-availability', true);
      window.setFlag('tapered-meds', true);
    });
    afterEach(() => {
      window.setFlag('medications-general-availability', false);
      window.setFlag('tapered-meds', false);
    });

    it('saves with correct medication data', async () => {
      const user = userEvent.setup();

      server.use(
        rest.post('/ui/medical/medications/allergy_screen', (req, res, ctx) => {
          return res(ctx.json([]));
        }),
        rest.post(
          '/ui/medical/medications/drug_interaction_screen',
          (req, res, ctx) => {
            return res(ctx.json([]));
          }
        )
      );

      render(
        <Provider store={store}>
          <VirtuosoMockContext.Provider
            value={{ viewportHeight: 2000, itemHeight: 50 }}
          >
            <AddMedicationSidePanel
              {...props}
              actionType="Log"
              athleteId={1}
              athleteData={minimumAthleteData}
            />
          </VirtuosoMockContext.Provider>
        </Provider>
      );
      await screen.findByText('Add medication');

      const requestSpy = jest.fn();
      server.events.on('request:start', requestSpy);

      // Entering drug text
      const drugSelect = screen.getByLabelText('Brand name / drug');
      selectEvent.openMenu(drugSelect);

      fireEvent.change(drugSelect, { target: { value: 'FDB_Test1' } });

      await selectEvent.select(drugSelect, ['FDB_Test1'], {
        container: document.body,
      });

      await fillRequiredTaperedMedFields(user);

      const saveButton = screen.getByRole('button', {
        name: 'Log',
      });
      expect(saveButton).toBeInTheDocument();
      expect(saveButton).toBeEnabled();

      await user.click(saveButton);
      expect(props.onSaveMedicationStart).toHaveBeenCalled();
      expect(props.onSaveMedicationSuccess).toHaveBeenCalledWith(1, []);

      const expectedData = {
        athlete_id: 1,
        prescriber_sgid: 'DEADPOOL',
        external_prescriber_name: '',
        prescription_date: '2020-10-28T00:00:00.000Z',
        stock_lots: [],
        directions: null,
        tapered: true,
        dose: null,
        quantity: null,
        frequency: null,
        route: 'by mouth',
        start_date: '2020-10-29T00:00:00.000Z',
        end_date: '2020-10-29T00:00:00.000Z',
        duration: 1,
        note: '',
        lot_number: '',
        issues: [],
        type: 'InternallyLogged',
        drug_type: 'Emr::Private::Models::FdbDispensableDrug',
        drug_id: 1,
        attachments: [],
      };

      expect(requestSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'POST',
          url: new URL('http://localhost/ui/medical/medications'),
          body: expectedData,
        })
      );
    });
  });

  describe('[FEATURE FLAG] medical-medication-attachments ON', () => {
    beforeEach(() => {
      window.setFlag('medical-medication-attachments', true);
      window.setFlag('medications-general-availability', true);
      window.setFlag('tapered-meds', true);
    });
    afterEach(() => {
      window.setFlag('medical-medication-attachments', false);
      window.setFlag('medications-general-availability', false);
      window.setFlag('tapered-meds', false);
    });

    it('displays the attachment area', async () => {
      render(
        <Provider store={store}>
          <VirtuosoMockContext.Provider
            value={{ viewportHeight: 2000, itemHeight: 50 }}
          >
            <AddMedicationSidePanel
              {...props}
              actionType="Log"
              athleteId={1}
              athleteData={minimumAthleteData}
            />
          </VirtuosoMockContext.Provider>
        </Provider>
      );
      await screen.findByText('Add medication');
      const uploadField = document.querySelector('.filepond--wrapper input');

      expect(uploadField).toBeInTheDocument();
      expect(uploadField.accept).toEqual(
        [...imageFileTypes, pdfFileType].join(',')
      );
      expect(uploadField.type).toEqual('file');
      expect(uploadField.multiple).toEqual(true);
    });
  });

  describe('[FEATURE FLAG] medical-medication-attachments OFF', () => {
    beforeEach(() => {
      window.setFlag('medical-medication-attachments', false);
      window.setFlag('medications-general-availability', true);
      window.setFlag('tapered-meds', true);
    });
    afterEach(() => {
      window.setFlag('medications-general-availability', false);
      window.setFlag('tapered-meds', false);
    });

    it('does not display the attachment area', async () => {
      render(
        <Provider store={store}>
          <VirtuosoMockContext.Provider
            value={{ viewportHeight: 2000, itemHeight: 50 }}
          >
            <AddMedicationSidePanel
              {...props}
              actionType="Log"
              athleteId={1}
              athleteData={minimumAthleteData}
            />
          </VirtuosoMockContext.Provider>
        </Provider>
      );
      await screen.findByText('Add medication');
      const uploadField = document.querySelector('.filepond--wrapper input');

      expect(uploadField).not.toBeInTheDocument();
    });
  });

  describe('[FEATURE FLAG] medical-unlisted-meds', () => {
    const adminPermissionOn = {
      permissions: {
        medical: {
          ...defaultMedicalPermissions,
          medications: {
            ...defaultMedicalPermissions.medications,
            canAdmin: true,
          },
        },
      },
    };

    const adminPermissionOff = {
      permissions: {
        medical: {
          ...defaultMedicalPermissions,
          medications: {
            ...defaultMedicalPermissions.medications,
            canAdmin: false,
          },
        },
      },
    };

    beforeEach(() => {
      window.setFlag('medical-unlisted-meds', true);
      window.setFlag('medications-general-availability', true);
      window.setFlag('tapered-meds', true);
    });
    afterEach(() => {
      window.setFlag('medical-unlisted-meds', false);
      window.setFlag('medications-general-availability', false);
      window.setFlag('tapered-meds', false);
    });

    it('does not display Unlisted medication inputs without permission', async () => {
      render(
        <MockedPermissionContextProvider
          permissionsContext={adminPermissionOff}
        >
          <Provider store={store}>
            <VirtuosoMockContext.Provider
              value={{ viewportHeight: 2000, itemHeight: 50 }}
            >
              <AddMedicationSidePanel
                {...props}
                actionType="Log"
                athleteId={1}
                athleteData={minimumAthleteData}
              />
            </VirtuosoMockContext.Provider>
          </Provider>
        </MockedPermissionContextProvider>
      );
      await screen.findByText('Add medication');

      expect(
        screen.queryByRole('button', {
          name: 'Unlisted Medication',
        })
      ).not.toBeInTheDocument();
    });

    it('saves with correct medication data', async () => {
      const user = userEvent.setup();

      render(
        <MockedPermissionContextProvider permissionsContext={adminPermissionOn}>
          <Provider store={store}>
            <VirtuosoMockContext.Provider
              value={{ viewportHeight: 2000, itemHeight: 50 }}
            >
              <AddMedicationSidePanel
                {...props}
                actionType="Log"
                athleteId={1}
                athleteData={minimumAthleteData}
              />
            </VirtuosoMockContext.Provider>
          </Provider>
        </MockedPermissionContextProvider>
      );
      await screen.findByText('Add medication');

      expect(
        screen.getByRole('button', {
          name: 'Unlisted Medication',
        })
      ).toBeInTheDocument();

      const requestSpy = jest.fn();
      server.events.on('request:start', requestSpy);
      await fillRequiredTaperedMedFields(user);
      await fillRequiredUnlistedMedFields(user);

      const saveButton = screen.getByRole('button', {
        name: 'Log',
      });
      expect(saveButton).toBeInTheDocument();
      expect(saveButton).toBeEnabled();

      await user.click(saveButton);

      expect(
        screen.getByText('Unlisted Medication Warning')
      ).toBeInTheDocument();
      const acceptButton = screen.getByRole('button', { name: 'Accept' });
      await user.click(acceptButton);

      expect(props.onSaveMedicationStart).toHaveBeenCalled();
      expect(props.onSaveMedicationSuccess).toHaveBeenCalledWith(1, []);

      const expectedData = {
        athlete_id: 1,
        prescriber_sgid: 'DEADPOOL',
        external_prescriber_name: '',
        prescription_date: '2020-10-28T00:00:00.000Z',
        stock_lots: [],
        directions: null,
        tapered: true,
        dose: null,
        quantity: null,
        frequency: null,
        route: 'by mouth',
        start_date: '2020-10-29T00:00:00.000Z',
        end_date: '2020-10-29T00:00:00.000Z',
        duration: 1,
        note: '',
        lot_number: '',
        issues: [],
        type: 'InternallyLogged',
        drug_type: drugTypesEnum.CustomDrug,
        drug_id: 1,
        attachments: [],
      };

      expect(requestSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'POST',
          url: new URL('http://localhost/ui/medical/medications'),
          body: expectedData,
        })
      );
      expect(
        screen.queryByText('Something went wrong!')
      ).not.toBeInTheDocument();
    });

    it('displays an app status error on custom drug creation error', async () => {
      server.use(
        rest.post('/medical/drugs/custom_drugs', (req, res, ctx) =>
          res(ctx.status(500))
        )
      );

      const user = userEvent.setup();

      render(
        <MockedPermissionContextProvider permissionsContext={adminPermissionOn}>
          <Provider store={store}>
            <VirtuosoMockContext.Provider
              value={{ viewportHeight: 2000, itemHeight: 50 }}
            >
              <AddMedicationSidePanel
                {...props}
                actionType="Log"
                athleteId={1}
                athleteData={minimumAthleteData}
              />
            </VirtuosoMockContext.Provider>
          </Provider>
        </MockedPermissionContextProvider>
      );
      await screen.findByText('Add medication');

      const requestSpy = jest.fn();
      server.events.on('request:start', requestSpy);
      await fillRequiredTaperedMedFields(user);
      await fillRequiredUnlistedMedFields(user);

      const saveButton = screen.getByRole('button', {
        name: 'Log',
      });
      expect(saveButton).toBeInTheDocument();
      expect(saveButton).toBeEnabled();

      await user.click(saveButton);

      expect(
        screen.getByText('Unlisted Medication Warning')
      ).toBeInTheDocument();
      const acceptButton = screen.getByRole('button', { name: 'Accept' });
      await user.click(acceptButton);

      expect(props.onSaveMedicationStart).not.toHaveBeenCalled();
      expect(props.onSaveMedicationSuccess).not.toHaveBeenCalled();
      expect(screen.getByText('Something went wrong!')).toBeInTheDocument();
    });

    it('displays an app status error on custom drug logging error', async () => {
      server.use(
        rest.post('/ui/medical/medications', (req, res, ctx) =>
          res(ctx.status(500))
        )
      );

      const user = userEvent.setup();

      render(
        <MockedPermissionContextProvider permissionsContext={adminPermissionOn}>
          <Provider store={store}>
            <VirtuosoMockContext.Provider
              value={{ viewportHeight: 2000, itemHeight: 50 }}
            >
              <AddMedicationSidePanel
                {...props}
                actionType="Log"
                athleteId={1}
                athleteData={minimumAthleteData}
              />
            </VirtuosoMockContext.Provider>
          </Provider>
        </MockedPermissionContextProvider>
      );
      await screen.findByText('Add medication');

      const requestSpy = jest.fn();
      server.events.on('request:start', requestSpy);
      await fillRequiredTaperedMedFields(user);
      await fillRequiredUnlistedMedFields(user);

      const saveButton = screen.getByRole('button', {
        name: 'Log',
      });
      expect(saveButton).toBeInTheDocument();
      expect(saveButton).toBeEnabled();

      await user.click(saveButton);

      expect(
        screen.getByText('Unlisted Medication Warning')
      ).toBeInTheDocument();
      const acceptButton = screen.getByRole('button', { name: 'Accept' });
      await user.click(acceptButton);

      expect(props.onSaveMedicationStart).toHaveBeenCalled();
      expect(props.onSaveMedicationSuccess).not.toHaveBeenCalled();
      expect(screen.getByText('Something went wrong!')).toBeInTheDocument();
    });
  });
  describe('[FEATURE FLAG] pm-mls-emr-demo-tue false: MedicationTUE conditional rendering', () => {
    it('does not render MedicationTUE when canAddTue is true and athleteId is present', async () => {
      render(
        <MockedPermissionContextProvider
          permissionsContext={{
            ...mockedDefaultPermissionsContextValue,
            permissions: {
              ...mockedDefaultPermissionsContextValue.permissions,
              medical: {
                ...defaultMedicalPermissions,
                tue: {
                  canCreate: true,
                },
              },
            },
          }}
        >
          <Provider store={store}>
            <AddMedicationSidePanel {...props} athleteId={1} />
          </Provider>
        </MockedPermissionContextProvider>
      );

      await screen.findByText('Add medication');
      // Check if the mocked MedicationTUE component is not rendered
      expect(screen.queryByText('MedicationTUE Mock')).not.toBeInTheDocument();
    });
  });

  describe('[FEATURE FLAG] pm-mls-emr-demo-tue true: MedicationTUE conditional rendering', () => {
    beforeEach(() => {
      window.setFlag('pm-mls-emr-demo-tue', true);
    });

    afterEach(() => {
      window.setFlag('pm-mls-emr-demo-tue', false);
    });

    it('does not render MedicationTUE when canCreate permission is false', async () => {
      render(
        <MockedPermissionContextProvider
          permissionsContext={{
            ...mockedDefaultPermissionsContextValue,
            permissions: {
              ...mockedDefaultPermissionsContextValue.permissions,
              medical: {
                ...defaultMedicalPermissions,
                tue: {
                  canCreate: false,
                },
              },
            },
          }}
        >
          <Provider store={store}>
            <AddMedicationSidePanel {...props} athleteId={1} />
          </Provider>
        </MockedPermissionContextProvider>
      );

      await screen.findByText('Add medication');
      // Check that the mocked MedicationTUE component is not rendered
      expect(screen.queryByText('MedicationTUE Mock')).not.toBeInTheDocument();
    });

    it('does not render MedicationTUE when athleteId is not present', async () => {
      render(
        <MockedPermissionContextProvider
          permissionsContext={{
            ...mockedDefaultPermissionsContextValue,
            permissions: {
              ...mockedDefaultPermissionsContextValue.permissions,
              medical: {
                ...defaultMedicalPermissions,
                tue: {
                  canCreate: true,
                },
              },
            },
          }}
        >
          <Provider store={store}>
            <AddMedicationSidePanel {...props} athleteId={null} />
          </Provider>
        </MockedPermissionContextProvider>
      );

      await screen.findByText('Add medication');
      // Check that the mocked MedicationTUE component is not rendered
      expect(screen.queryByText('MedicationTUE Mock')).not.toBeInTheDocument();
    });
  });

  describe('[FEATURE FLAG] pm-show-tue: MedicationTUE conditional rendering', () => {
    beforeEach(() => {
      window.setFlag('pm-mls-emr-demo-tue', true);
      MedicationTUE.mockImplementation(() => <div>MedicationTUE Mock</div>);
    });

    afterEach(() => {
      window.setFlag('pm-show-tue', false);
      window.setFlag('pm-mls-emr-demo-tue', false);
    });

    it('renders MedicationTUE when pm-show-tue is true, canCreate is true, and athleteId is present', async () => {
      window.setFlag('pm-show-tue', true);
      render(
        <MockedPermissionContextProvider
          permissionsContext={{
            ...mockedDefaultPermissionsContextValue,
            permissions: {
              ...mockedDefaultPermissionsContextValue.permissions,
              medical: {
                ...defaultMedicalPermissions,
                tue: {
                  canCreate: true,
                },
              },
            },
          }}
        >
          <Provider store={store}>
            <AddMedicationSidePanel {...props} athleteId={1} />
          </Provider>
        </MockedPermissionContextProvider>
      );

      await screen.findByText('Add medication');
      // Check if the mocked MedicationTUE component is rendered
      expect(screen.getByText('MedicationTUE Mock')).toBeInTheDocument();
    });

    it('does not render MedicationTUE when pm-show-tue is false', async () => {
      window.setFlag('pm-show-tue', false);
      render(
        <MockedPermissionContextProvider
          permissionsContext={{
            ...mockedDefaultPermissionsContextValue,
            permissions: {
              ...mockedDefaultPermissionsContextValue.permissions,
              medical: {
                ...defaultMedicalPermissions,
                tue: {
                  canCreate: true,
                },
              },
            },
          }}
        >
          <Provider store={store}>
            <AddMedicationSidePanel {...props} athleteId={1} />
          </Provider>
        </MockedPermissionContextProvider>
      );

      await screen.findByText('Add medication');
      // Check that the mocked MedicationTUE component is not rendered
      expect(screen.queryByText('MedicationTUE Mock')).not.toBeInTheDocument();
    });
  });

  describe('Injury/Illness optional text', () => {
    const originalOrganisationSport = window.organisationSport;

    afterEach(() => {
      window.organisationSport = originalOrganisationSport;
    });

    it('displays "Optional" text when organisationSport is not "nfl"', async () => {
      window.organisationSport = 'otherSport';
      render(
        <Provider store={store}>
          <AddMedicationSidePanel {...props} />
        </Provider>
      );
      await screen.findByText('Add medication');
      const injuryIllnessDiv = getById('Injury/Illness');
      expect(
        within(injuryIllnessDiv).getByText('Optional')
      ).toBeInTheDocument();
    });

    it('does not display "Optional" text when organisationSport is "nfl"', async () => {
      window.organisationSport = 'nfl';
      render(
        <Provider store={store}>
          <AddMedicationSidePanel {...props} />
        </Provider>
      );
      await screen.findByText('Add medication');
      const injuryIllnessDiv = getById('Injury/Illness');
      expect(
        within(injuryIllnessDiv).queryByText('Optional')
      ).not.toBeInTheDocument();
    });
  });

  describe('data-tooltip-target properties on Select components', () => {
    it('renders all expected labels', async () => {
      render(
        <Provider store={store}>
          <AddMedicationSidePanel {...props} />
        </Provider>
      );
      await screen.findByText('Add medication');

      // renders the data-tooltip-target on the Injury / illness label
      const injuryIllnessLabel = screen.getByText('Injury / illness');
      expect(injuryIllnessLabel).toHaveAttribute(
        'data-tooltip-target',
        'AddMedicationSidePanel|Injury / illness label'
      );

      // renders the data-tooltip-target on the Athlete label
      const athleteLabel = screen.getByText('Athlete');
      expect(athleteLabel).toHaveAttribute(
        'data-tooltip-target',
        'AddMedicationSidePanel|Athlete label'
      );

      // renders the data-tooltip-target on the Directions label
      const directionsLabel = screen.getByText('Directions');
      expect(directionsLabel).toHaveAttribute(
        'data-tooltip-target',
        'AddMedicationSidePanel|Directions label'
      );

      // renders the data-tooltip-target on the Route label
      const routeLabel = screen.getByText('Route');
      expect(routeLabel).toHaveAttribute(
        'data-tooltip-target',
        'AddMedicationSidePanel|Route label'
      );
    });
  });
});
