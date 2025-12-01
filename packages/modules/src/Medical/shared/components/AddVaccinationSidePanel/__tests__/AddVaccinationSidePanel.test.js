import { screen, waitFor, fireEvent, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import selectEvent from 'react-select-event';
import renderWithRedux from '@kitman/common/src/utils/renderWithRedux';
import moment from 'moment-timezone';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import {
  i18nextTranslateStub,
  storeFake,
} from '@kitman/common/src/utils/test_utils';
import {
  mockedPastAthlete,
  mockedSquadAthletes,
  mockedDefaultPermissionsContextValue,
} from '@kitman/modules/src/Medical/shared/utils/testUtils';
import * as medicalSharedApi from '@kitman/modules/src/Medical/shared/redux/services/medicalShared';
import { data as mockedIssues } from '@kitman/modules/src/Medical/shared/components/AddVaccinationSidePanel/__tests__/getAthleteIssues';
import AddVaccinationSidePanel from '@kitman/modules/src/Medical/shared/components/AddVaccinationSidePanel';
import { MockedPermissionContextProvider } from '@kitman/common/src/contexts/PermissionsContext/__tests__/testUtils';
import { saveNote, saveAttachmentLegacy } from '@kitman/services';
import useEnrichedAthletesIssues from '@kitman/modules/src/Medical/shared/hooks/useEnrichedAthletesIssues';
import useMedicalHistory from '@kitman/modules/src/Medical/shared/hooks/useMedicalHistory';

jest.mock('@kitman/components/src/FileUploadField');
jest.mock('@kitman/components/src/DatePicker');
jest.mock('@kitman/modules/src/Medical/shared/hooks/useEnrichedAthletesIssues');
jest.mock(
  '@kitman/modules/src/Medical/shared/redux/services/medicalShared',
  () => ({
    ...jest.requireActual(
      '@kitman/modules/src/Medical/shared/redux/services/medicalShared'
    ),
    useGetAthleteDataQuery: jest.fn(),
  })
);

jest.mock('@kitman/services', () => ({
  saveNote: jest.fn(),
  saveAttachmentLegacy: jest.fn(),
}));

jest.mock('@kitman/modules/src/Medical/shared/hooks/useMedicalHistory');
const mockUseMedicalHistory = jest.mocked(useMedicalHistory);

describe('<AddVaccinationSidePanel />', () => {
  const props = {
    athleteId: null,
    isOpen: true,
    isAthleteSelectable: true,
    squadAthletes: mockedSquadAthletes,
    onClose: jest.fn(),
    onFileUploadStart: jest.fn(),
    onFileUploadSuccess: jest.fn(),
    onFileUploadFailure: jest.fn(),
    initialDataRequestStatus: 'SUCCESS',
    t: i18nextTranslateStub(),
  };

  let fetchAthleteIssues;
  beforeEach(() => {
    moment.tz.setDefault('UTC');
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2025-06-15T18:00:00Z')); // Set a fixed date for consistent testing

    medicalSharedApi.useGetAthleteDataQuery.mockReturnValue({
      data: mockedPastAthlete,
      isLoading: false,
    });

    fetchAthleteIssues = jest.fn().mockResolvedValue();
    useEnrichedAthletesIssues.mockReturnValue({
      enrichedAthleteIssues: [],
      fetchAthleteIssues,
    });
    mockUseMedicalHistory.mockReturnValue({
      isLoading: false,
      data: {
        tue: [],
        vaccinations: [],
      },
      fetchMedicalHistory: jest.fn(),
    });
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
    jest.clearAllMocks();
    moment.tz.setDefault();
  });

  const renderComponent = (additionalProps = {}) => {
    return renderWithRedux(
      <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale="en-gb">
        <MockedPermissionContextProvider
          permissionsContext={mockedDefaultPermissionsContextValue}
        >
          <AddVaccinationSidePanel {...props} {...additionalProps} />
        </MockedPermissionContextProvider>
      </LocalizationProvider>,
      {
        preloadedState: storeFake({ medicalHistory: {} }), // Provide an empty medicalHistory object
        useGlobalStore: false,
      }
    );
  };

  it('renders the panel with the proper title', () => {
    renderComponent();
    expect(screen.getByText('Add vaccination')).toBeInTheDocument();
  });

  it('renders the correct content', async () => {
    renderComponent();
    await screen.findByText('Add vaccination');

    expect(screen.getByLabelText('Athlete')).toBeInTheDocument();
    expect(screen.getByLabelText('Name of vaccination')).toBeInTheDocument();
    expect(screen.getByLabelText('Issue date')).toBeInTheDocument();
    expect(screen.getByLabelText('Renewal date')).toBeInTheDocument();
    expect(screen.getByLabelText('Batch number')).toBeInTheDocument();
    expect(screen.getByLabelText('Expiration date')).toBeInTheDocument();
    expect(
      screen.getByLabelText('Associated injury/ illness')
    ).toBeInTheDocument();
    expect(screen.getByLabelText('Associated injury/ illness')).toBeDisabled();
    expect(screen.getByLabelText('Visibility')).toBeInTheDocument();
    expect(screen.getByText('Add attachment')).toBeInTheDocument();

    const visibilitySelect = screen.getByLabelText('Visibility');
    await selectEvent.openMenu(visibilitySelect);
    expect(screen.getAllByText('Default visibility')).toHaveLength(2);
    expect(screen.getByText('Doctors')).toBeInTheDocument();
  });

  it('enables the athlete issues selector when there is an associated athlete', async () => {
    useEnrichedAthletesIssues.mockReturnValue({
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
      fetchAthleteIssues: jest.fn().mockResolvedValue(),
    });
    renderComponent({ athleteId: 1 });
    await screen.findByText('Add vaccination');
    const athleteSelect = screen.getByLabelText('Athlete');
    await selectEvent.select(athleteSelect, 'Macho Man Randy Savage'); // Select an athlete to enable the associated injuries select

    const associatedInjuriesSelect = screen.getByLabelText(
      'Associated injury/ illness'
    );
    expect(associatedInjuriesSelect).toBeEnabled();

    await selectEvent.openMenu(associatedInjuriesSelect);
    expect(screen.getByText('Open injury/ illness')).toBeInTheDocument();
    expect(screen.getByText('30 Oct 2023 - test')).toBeInTheDocument();
  });

  it('calls the correct function when clicking the close button', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    renderComponent();
    await screen.findByText('Add vaccination');
    const closeButton = screen.getByTestId('sliding-panel|close-button');
    await user.click(closeButton);
    expect(props.onClose).toHaveBeenCalledTimes(1);
  });

  it('shows an error message when the initial request fails', async () => {
    renderComponent({ initialDataRequestStatus: 'FAILURE' });
    await waitFor(() => {
      expect(screen.getByText('Something went wrong!')).toBeInTheDocument();
    });
  });

  describe('when selecting a player and the request fails', () => {
    it('shows an error message when the request fails', async () => {
      useEnrichedAthletesIssues.mockReturnValue({
        enrichedAthleteIssues: [],
        fetchAthleteIssues: jest.fn().mockRejectedValue(),
      });

      renderComponent();
      await screen.findByText('Add vaccination');

      const athleteSelect = screen.getByLabelText('Athlete');
      await selectEvent.select(athleteSelect, 'Macho Man Randy Savage'); // Select an athlete

      await waitFor(() => {
        expect(screen.getByText('Something went wrong!')).toBeInTheDocument();
      });
    });
  });

  describe('when saving without setting the required fields', () => {
    it('sets the required fields as invalid', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
      renderComponent();
      await screen.findByText('Add vaccination');

      const saveButton = screen.getByRole('button', { name: 'Save' });
      await user.click(saveButton);

      expect(
        screen.getByLabelText('Name of vaccination').parentNode.parentNode
      ).toHaveClass('inputText--invalid');

      expect(
        screen.getByLabelText('Batch number').parentNode.parentNode
      ).toHaveClass('inputText--invalid');

      // Date picker has been mocked so won't see invalid date class in the test
    });
  });

  describe('saving a new vaccination record', () => {
    beforeEach(() => {
      window.setFlag('files-titles', true);
      saveNote.mockResolvedValue({});
      saveAttachmentLegacy.mockResolvedValue({
        attachment_id: 'mock-attachment-id',
      });

      useEnrichedAthletesIssues.mockReturnValue({
        enrichedAthleteIssues: mockedIssues.groupedIssues,
        fetchAthleteIssues: jest.fn().mockRejectedValue(),
      });
    });

    it('saves the form data when clicking the save button', async () => {
      useEnrichedAthletesIssues.mockReturnValue({
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
        fetchAthleteIssues: jest.fn().mockResolvedValue(),
      });

      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
      renderComponent({ athleteId: 1 });
      await screen.findByText('Add vaccination');

      const vaccinationNameInput = screen.getByLabelText('Name of vaccination');
      fireEvent.change(vaccinationNameInput, {
        target: { value: 'Vaccination name test' },
      });

      expect(screen.getByText('Issue date')).toBeInTheDocument();
      const issueDateBlock = screen.getByTestId(
        'AddVaccinationSidePanel|IssueDate'
      );
      const issueDateInput = within(issueDateBlock).getByRole('textbox');
      fireEvent.change(issueDateInput, {
        target: { value: '2025-06-04T18:00:00Z' }, // OLD date picker, so just set the value
      });

      expect(screen.getByText('Renewal date')).toBeInTheDocument();
      const renewalDateBlock = screen.getByTestId(
        'AddVaccinationSidePanel|RenewalDate'
      );
      const renewalDateInput = within(renewalDateBlock).getByRole('textbox');
      fireEvent.change(renewalDateInput, {
        target: { value: '2025-06-04T18:00:00Z' }, // OLD date picker
      });

      const batchNumberInput = screen.getByLabelText('Batch number');
      fireEvent.change(batchNumberInput, { target: { value: '1' } });

      expect(screen.getByText('Expiration date')).toBeInTheDocument();
      const expirationDateBlock = screen.getByTestId(
        'AddVaccinationSidePanel|ExpirationDate'
      );
      const expirationDateInput =
        within(expirationDateBlock).getByRole('textbox');
      fireEvent.change(expirationDateInput, {
        target: { value: '2025-06-04T18:00:00Z' }, // OLD date picker
      });

      const associatedInjuriesSelect = screen.getByLabelText(
        'Associated injury/ illness'
      );
      expect(associatedInjuriesSelect).toBeEnabled();

      await selectEvent.openMenu(associatedInjuriesSelect);
      await selectEvent.select(associatedInjuriesSelect, [
        '30 Oct 2023 - test',
      ]);

      const saveButton = screen.getByRole('button', { name: 'Save' });
      await user.click(saveButton);

      await waitFor(() => {
        expect(saveNote).toHaveBeenCalledTimes(1);
        expect(saveNote).toHaveBeenCalledWith(
          1,
          expect.objectContaining({
            attachment_ids: [],
            note_date: '2025-06-04T18:00:00+00:00', // Based on fake date and selection
            note_type: 3,
            medical_type: 'Vaccination',
            medical_name: 'Vaccination name test',
            injury_ids: [1], // From 'Injury_1'
            illness_ids: [],
            chronic_issue_ids: [],
            note: 'Vaccination',
            restricted: false,
            psych_only: false,
            expiration_date: '2025-06-04T18:00:00+00:00', // Based on fake date and selection
            batch_number: '1',
            renewal_date: '2025-06-04T18:00:00+00:00', // Based on fake date and selection
          })
        );
      });
    });

    it('saves the attachments when clicking the save button', async () => {
      useEnrichedAthletesIssues.mockReturnValue({
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
        fetchAthleteIssues: jest.fn().mockResolvedValue(),
      });

      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
      renderComponent({ athleteId: 1 });
      await screen.findByText('Add vaccination');

      const vaccinationNameInput = screen.getByLabelText('Name of vaccination');
      fireEvent.change(vaccinationNameInput, {
        target: { value: 'Vaccination name test' },
      });

      expect(screen.getByText('Issue date')).toBeInTheDocument();
      const issueDateBlock = screen.getByTestId(
        'AddVaccinationSidePanel|IssueDate'
      );
      const issueDateInput = within(issueDateBlock).getByRole('textbox');
      fireEvent.change(issueDateInput, {
        target: { value: '2025-06-04T18:00:00Z' }, // OLD date picker, so just set the value
      });

      expect(screen.getByText('Renewal date')).toBeInTheDocument();
      const renewalDateBlock = screen.getByTestId(
        'AddVaccinationSidePanel|RenewalDate'
      );
      const renewalDateInput = within(renewalDateBlock).getByRole('textbox');
      fireEvent.change(renewalDateInput, {
        target: { value: '2025-06-04T18:00:00Z' }, // OLD date picker
      });

      const batchNumberInput = screen.getByLabelText('Batch number');
      fireEvent.change(batchNumberInput, { target: { value: '1' } });

      expect(screen.getByText('Expiration date')).toBeInTheDocument();
      const expirationDateBlock = screen.getByTestId(
        'AddVaccinationSidePanel|ExpirationDate'
      );
      const expirationDateInput =
        within(expirationDateBlock).getByRole('textbox');
      fireEvent.change(expirationDateInput, {
        target: { value: '2025-06-04T18:00:00Z' }, // OLD date picker
      });

      const associatedInjuriesSelect = screen.getByLabelText(
        'Associated injury/ illness'
      );
      expect(associatedInjuriesSelect).toBeEnabled();

      await selectEvent.openMenu(associatedInjuriesSelect);
      await selectEvent.select(associatedInjuriesSelect, [
        '30 Oct 2023 - test',
      ]);

      const addAttachmentButton = screen.getByRole('button', {
        name: 'Add attachment',
      });
      await user.click(addAttachmentButton);
      await user.click(screen.getByText('File'));

      // File upload has been mocked
      const uploadField = screen.getByTestId('file-input-mock');
      const file = new File(['logo'], 'logo.png', { type: 'image/png' });
      await user.upload(uploadField, file);

      const saveButton = screen.getByRole('button', { name: 'Save' });
      await user.click(saveButton);

      await waitFor(() => {
        expect(saveAttachmentLegacy).toHaveBeenCalledTimes(1);
        expect(saveAttachmentLegacy).toHaveBeenCalledWith(file, 'logo');

        expect(saveNote).toHaveBeenCalledTimes(1);
        expect(saveNote).toHaveBeenCalledWith(
          1,
          expect.objectContaining({
            attachment_ids: ['mock-attachment-id'],
            note_date: '2025-06-04T18:00:00+00:00', // Based on fake date and selection
            note_type: 3,
            medical_type: 'Vaccination',
            medical_name: 'Vaccination name test',
            injury_ids: [1], // From 'Injury_1'
            illness_ids: [],
            chronic_issue_ids: [],
            note: 'Vaccination',
            restricted: false,
            psych_only: false,
            expiration_date: '2025-06-04T18:00:00+00:00', // Based on fake date and selection
            batch_number: '1',
            renewal_date: '2025-06-04T18:00:00+00:00', // Based on fake date and selection
          })
        );
      });
    });
  });

  describe('[FEATURE FLAG] player-movement-aware-datepicker is on', () => {
    beforeEach(() => {
      window.setFlag('player-movement-aware-datepicker', true);
    });

    it('renders the MovementAwareDatePickers', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

      renderComponent();
      await screen.findByText('Add vaccination');

      expect(screen.getAllByTestId('MovementAwareDatePicker')).toHaveLength(3);

      const renewal = screen.getByTestId(
        'AddVaccinationSidePanel|RenewalDateNew'
      );

      // Renewal date picker allows future dates to picked
      const renewalInputField = within(renewal).getByLabelText('Choose date');
      await user.click(renewalInputField);
      const calendar = screen.getByRole('grid');
      const allDatesInMonth = calendar.querySelectorAll(
        'button[role="gridcell"]'
      );

      // SystemTime was set to '2025-06-15T18:00:00Z'
      expect(allDatesInMonth[19]).toHaveTextContent('14'); // 14th June
      expect(allDatesInMonth[19]).toBeEnabled();

      expect(allDatesInMonth[20]).toHaveTextContent('15');
      expect(allDatesInMonth[20]).toBeEnabled();

      // Future dates for renewal are not disabled
      expect(allDatesInMonth[21]).toHaveTextContent('16');
      expect(allDatesInMonth[21]).toBeEnabled();
      expect(allDatesInMonth[22]).toHaveTextContent('17');
      expect(allDatesInMonth[22]).toBeEnabled();
    });
  });

  describe('[FEATURE FLAG] player-movement-aware-datepicker is off', () => {
    beforeEach(() => {
      window.setFlag('player-movement-aware-datepicker', false);
    });

    it('does not renders the MovementAwareDatePickers', async () => {
      renderComponent({ athleteId: 6, organisation_ids: [22] });
      await screen.findByText('Add vaccination');

      expect(
        screen.queryByTestId('MovementAwareDatePicker')
      ).not.toBeInTheDocument();
    });
  });

  it('calls fetchAthleteIssues with the correct parameters when the athlete is changed', async () => {
    renderComponent({ athleteId: 5 });
    await screen.findByText('Add vaccination');

    const athleteSelect = screen.getByLabelText('Athlete');
    await selectEvent.select(athleteSelect, 'Macho Man Randy Savage');

    await waitFor(() => {
      expect(fetchAthleteIssues).toHaveBeenCalledWith({
        selectedAthleteId: 5,
        useOccurrenceIdValue: false,
        includeDetailedIssue: false,
        issueFilter: null,
        includeIssue: true,
        includeGrouped: true,
      });
    });
  });
});
