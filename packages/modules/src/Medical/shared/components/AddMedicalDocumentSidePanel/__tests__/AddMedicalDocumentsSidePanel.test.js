import $ from 'jquery';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import LocalizationProvider from '@kitman/playbook/providers/wrappers/LocalizationProvider';
import {
  i18nextTranslateStub,
  TestProviders,
} from '@kitman/common/src/utils/test_utils';
import { mockedPastAthlete } from '@kitman/modules/src/Medical/shared/utils/testUtils';
import {
  useGetAthleteDataQuery,
  useGetAncillaryEligibleRangesQuery,
} from '@kitman/modules/src/Medical/shared/redux/services/medicalShared';
import {
  mockedPlayerOptions,
  mockDocumentCategoryOptions,
} from './mocks/sidePanelMocks';
import AddMedicalDocumentSidePanel from '..';

// Uses the mocked version of component (in __mocks__ dir at component level)
jest.mock('@kitman/components/src/DatePicker');

const storeFake = (state) => ({
  default: () => {},
  subscribe: () => {},
  dispatch: () => {},
  getState: () => ({ ...state }),
});

const store = storeFake({
  medicalHistory: {},
  medicalApi: {
    useGetAthleteDataQuery: jest.fn(),
    useGetAncillaryEligibleRangesQuery: jest.fn(),
  },
});

jest.mock(
  '@kitman/modules/src/Medical/shared/redux/services/medicalShared',
  () => ({
    useGetAthleteDataQuery: jest.fn(),
    useGetAncillaryEligibleRangesQuery: jest.fn(),
  })
);

describe('<AddMedicalDocumentSidePanel />', () => {
  let renderTestComponent;

  const props = {
    isPanelOpen: true,
    setIsPanelOpen: jest.fn(),
    playerOptions: mockedPlayerOptions,
    categoryOptions: mockDocumentCategoryOptions,
    athleteId: null,
    issueId: null,
    onFileUploadStart: jest.fn(),
    onFileUploadSuccess: jest.fn(),
    onFileUploadFailure: jest.fn(),
    getDocuments: jest.fn(),
    organisationAnnotationTypeId: null,
    athleteIssues: [],
    fetchAthleteIssues: jest.fn(),
    defaultAthleteSquadId: 0,
    squads: [],
    t: i18nextTranslateStub(),
  };

  beforeEach(() => {
    useGetAthleteDataQuery.mockReturnValue({ data: mockedPastAthlete });
    useGetAncillaryEligibleRangesQuery.mockReturnValue({
      data: {
        eligible_ranges: [],
      },
    });

    renderTestComponent = (additionalProps = {}) => {
      render(
        <TestProviders store={store}>
          <AddMedicalDocumentSidePanel {...props} {...additionalProps} />
        </TestProviders>
      );
    };
  });

  it('renders the default form', () => {
    renderTestComponent();
    expect(
      screen.getByTestId('AddMedicalDocumentSidePanel|Parent')
    ).toBeInTheDocument();
    expect(
      screen.getByTestId('AddMedicalDocumentSidePanel|TopRow')
    ).toBeInTheDocument();
    expect(
      screen.getByTestId('AddMedicalDocumentSidePanel|Categories')
    ).toBeInTheDocument();
    expect(
      screen.getByTestId('AddMedicalDocumentSidePanel|FileAttachment')
    ).toBeInTheDocument();
    expect(
      screen.getByTestId('AddMedicalDocumentSidePanel|Injuries')
    ).toBeInTheDocument();
    expect(
      screen.getByTestId('AddMedicalDocumentSidePanel|Visibility')
    ).toBeInTheDocument();

    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(3);

    const closeIcon = buttons[0];
    expect(closeIcon).toBeInTheDocument();

    expect(screen.getByText('Add note')).toBeInTheDocument();
    const addNoteButton = buttons[1];
    expect(addNoteButton).toHaveTextContent('Add note');

    const saveButton = buttons[2];
    expect(saveButton).toHaveTextContent('Save');

    const formTitle = screen.getByTestId('sliding-panel|title');
    expect(formTitle).toHaveTextContent('Add documents');

    const textboxes = screen.getAllByRole('textbox');
    expect(textboxes).toHaveLength(5);
  });

  describe('button interactions', () => {
    let buttons;

    beforeEach(() => {
      renderTestComponent();
      buttons = screen.getAllByRole('button');
    });

    it('calls setIsPanelOpen when userEvent clicks the close icon', async () => {
      await userEvent.click(buttons[0]);
      expect(props.setIsPanelOpen).toHaveBeenCalled();
    });

    it('validate note fields are missing, click add note and validate they are there', async () => {
      const titleField = screen.queryByText('Title');
      expect(titleField).not.toBeInTheDocument();

      await userEvent.click(buttons[1]);

      const titleFieldAfterClick = screen.queryByText('Title');
      expect(titleFieldAfterClick).toBeInTheDocument();
      expect(
        screen.getByTestId('AddMedicalDocumentSidePanel|NoteTitle')
      ).toBeInTheDocument();
      expect(
        screen.getByTestId('AddMedicalDocumentSidePanel|NoteInput')
      ).toBeInTheDocument();
    });

    it('does not make a call to saveDocumentRequest when userEvent clicks the save button without selecting required fields', async () => {
      const deferred = $.Deferred();
      const saveDocumentRequest = jest
        .spyOn($, 'ajax')
        .mockImplementation(() => deferred.resolve({}));

      await userEvent.click(buttons[2]);
      expect(saveDocumentRequest).not.toHaveBeenCalled();
    });
  });

  describe('[player-movement-entity-medical-documents] FF on athleteId prop passed to component', () => {
    beforeEach(() => {
      window.featureFlags['player-movement-entity-medical-documents'] = true;
    });

    afterEach(() => {
      window.featureFlags['player-movement-entity-medical-documents'] = false;
    });

    it('has the correct name for the athlete id and get athletes called from useEffect', async () => {
      renderTestComponent({ athleteId: 1 });

      expect(screen.getByText('Athlete 1 Name')).toBeInTheDocument();
    });

    it('renders the passed values for the date field', async () => {
      renderTestComponent({
        athleteId: 1,
      });

      expect(screen.getByText('Date of document')).toBeInTheDocument();
      expect(screen.getByTestId('maximum-date')).toHaveTextContent(
        '2023-01-28T23:59:59'
      );
      expect(screen.getByTestId('minimum-date')).toHaveTextContent(
        '2022-12-16T05:04:33'
      );
    });
  });

  describe('[player-movement-entity-medical-documents] FF off athleteId prop passed to component', () => {
    beforeEach(() => {
      window.featureFlags['player-movement-entity-medical-documents'] = false;
    });

    it('has the correct name for the athlete id and get athletes called from useEffect', async () => {
      renderTestComponent({ athleteId: 1 });

      expect(screen.getByText('Athlete 1 Name')).toBeInTheDocument();
    });

    it('renders the passed values for the date field', async () => {
      renderTestComponent({
        athleteId: 1,
      });

      expect(screen.getByText('Date of document')).toBeInTheDocument();
      expect(screen.getByTestId('maximum-date')).toHaveTextContent(
        '2023-01-28T23:59:59'
      );
      // Mocked DatePicker component does not render the field if val is null
      expect(screen.queryByTestId('minimum-date')).not.toBeInTheDocument();
    });
  });

  describe('document date selector tests with Movement flags off', () => {
    beforeEach(() => {
      window.featureFlags['player-movement-entity-medical-documents'] = false;
      window.featureFlags['player-movement-aware-datepicker'] = false;
    });

    it('does not render new movement datepicker', async () => {
      render(
        <Provider store={store}>
          <AddMedicalDocumentSidePanel {...props} />
        </Provider>
      );

      // Placeholder text on the new MovementAwareDatepicker
      const newDatePickerInputField =
        screen.queryByPlaceholderText('MM/DD/YYYY');

      expect(newDatePickerInputField).not.toBeInTheDocument();
    });

    it('renders new old datepicker', async () => {
      render(
        <Provider store={store}>
          <AddMedicalDocumentSidePanel {...props} />
        </Provider>
      );

      // Label element value on old datepicker
      const oldDatePickerLabel = screen.queryByLabelText('Date of document');

      expect(oldDatePickerLabel).toBeInTheDocument();
    });

    it('document date selector is disabled', async () => {
      render(
        <Provider store={store}>
          <AddMedicalDocumentSidePanel {...props} />
        </Provider>
      );

      const disabledDatePicker = screen.getByLabelText('Date of document');

      expect(disabledDatePicker).toBeDisabled();
    });

    it('document date selector is enabled when athlete id is provided', async () => {
      render(
        <Provider store={store}>
          <LocalizationProvider>
            <AddMedicalDocumentSidePanel {...props} athleteId={1} />
          </LocalizationProvider>
        </Provider>
      );

      const disabledDatePicker = screen.getByText('Date of document');
      await waitFor(() => {
        expect(disabledDatePicker).toBeEnabled();
      });
    });

    it('document date selector is enabled after athlete is selected', async () => {
      render(
        <Provider store={store}>
          <AddMedicalDocumentSidePanel {...props} />
        </Provider>
      );

      const athleteSelector = await waitFor(() =>
        screen.getByLabelText('Athlete')
      );

      const disabledDatePicker = screen.getByLabelText('Date of document');

      expect(disabledDatePicker).toBeDisabled();

      await userEvent.click(athleteSelector);

      expect(screen.queryByText('Athlete 1 Name')).toBeInTheDocument();
      expect(screen.queryByText('Athlete 2 Name')).toBeInTheDocument();
      expect(screen.queryByText('Athlete 3 Name')).toBeInTheDocument();
      expect(screen.queryByText('Athlete 4 Name')).toBeInTheDocument();

      await userEvent.click(screen.queryByText('Athlete 2 Name'));

      await waitFor(() => {
        expect(disabledDatePicker).toBeEnabled();
      });
    });
  });

  describe('document date selector tests with Movement flags on', () => {
    beforeEach(() => {
      window.featureFlags['player-movement-entity-medical-documents'] = true;
      window.featureFlags['player-movement-aware-datepicker'] = true;
    });
    afterEach(() => {
      window.featureFlags['player-movement-entity-medical-documents'] = false;
      window.featureFlags['player-movement-aware-datepicker'] = false;
    });

    it('does not render old datepicker', async () => {
      render(
        <Provider store={store}>
          <LocalizationProvider>
            <AddMedicalDocumentSidePanel {...props} />
          </LocalizationProvider>
        </Provider>
      );

      // Label element value on old datepicker
      const oldDatePickerLabel = screen.queryByLabelText('Date of document');

      expect(oldDatePickerLabel).not.toBeInTheDocument();
    });

    it('renders new movement datepicker', async () => {
      render(
        <Provider store={store}>
          <LocalizationProvider>
            <AddMedicalDocumentSidePanel {...props} />
          </LocalizationProvider>
        </Provider>
      );

      // Placeholder on the new MovementAwareDatepicker
      const newDatePickerInputField = screen.getByPlaceholderText('MM/DD/YYYY');

      expect(newDatePickerInputField).toBeInTheDocument();
    });

    it('document date selector is initially disabled', async () => {
      render(
        <Provider store={store}>
          <LocalizationProvider>
            <AddMedicalDocumentSidePanel {...props} />
          </LocalizationProvider>
        </Provider>
      );

      const datePickerLabel = screen.getByText('Date of document');
      const datePickerInputField = screen.getByPlaceholderText('MM/DD/YYYY');

      expect(datePickerLabel).toBeInTheDocument();
      expect(datePickerInputField).toBeDisabled();
    });

    it('document date selector is enabled when athlete id is passed via props', async () => {
      render(
        <Provider store={store}>
          <LocalizationProvider>
            <AddMedicalDocumentSidePanel {...props} athleteId={1} />
          </LocalizationProvider>
        </Provider>
      );

      const datePickerInputField = screen.getByPlaceholderText('MM/DD/YYYY');
      await waitFor(() => {
        expect(datePickerInputField).toBeEnabled();
      });
    });

    it('document date selector is enabled after athlete is selected', async () => {
      render(
        <Provider store={store}>
          <LocalizationProvider>
            <AddMedicalDocumentSidePanel {...props} />
          </LocalizationProvider>
        </Provider>
      );

      const athleteSelector = await waitFor(() =>
        screen.getByLabelText('Athlete')
      );

      const datePickerInputField = screen.getByPlaceholderText('MM/DD/YYYY');

      expect(datePickerInputField).toBeDisabled();

      // Open dropdown menu
      await userEvent.click(athleteSelector);

      // Select an athlete
      await userEvent.click(screen.getByText('Athlete 2 Name'));

      // Expect the datepicker to now be enabled
      await waitFor(() => {
        expect(datePickerInputField).toBeEnabled();
      });
    });
  });
});
