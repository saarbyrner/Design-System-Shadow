import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import selectEvent from 'react-select-event';
import { Provider } from 'react-redux';

import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { MockedPermissionContextProvider } from '@kitman/common/src/contexts/PermissionsContext/__tests__/testUtils';
import * as useEventTrackingModule from '@kitman/common/src/hooks/useEventTracking';
import {
  useGetOrganisationQuery,
  useGetCurrentUserQuery,
  useGetPermissionsQuery,
} from '@kitman/common/src/redux/global/services/globalApi';

import LocalizationProvider from '@kitman/playbook/providers/wrappers/LocalizationProvider';

import { useGetAthleteDataQuery } from '@kitman/modules/src/Medical/shared/redux/services/medicalShared';
import {
  defaultMedicalPermissions,
  mockedDefaultPermissionsContextValue,
  mockedPastAthlete,
} from '@kitman/modules/src/Medical/shared/utils/testUtils';

import AddMedicalFileSidePanel from '..';
import {
  mockedPlayerOptions,
  mockDocumentCategoryOptions,
  mockSelectedFile,
} from '../../AddMedicalDocumentSidePanel/__tests__/mocks/sidePanelMocks';

jest.mock('@kitman/common/src/redux/global/services/globalApi', () => ({
  ...jest.requireActual('@kitman/common/src/redux/global/services/globalApi'),
  useGetOrganisationQuery: jest.fn(),
  useGetCurrentUserQuery: jest.fn(),
  useGetPermissionsQuery: jest.fn(),
}));

jest.mock(
  '@kitman/modules/src/Medical/shared/redux/services/medicalShared',
  () => ({
    ...jest.requireActual(
      '@kitman/modules/src/Medical/shared/redux/services/medicalShared'
    ),
    useGetAthleteDataQuery: jest.fn(),
  })
);

const storeFake = (state) => ({
  default: () => {},
  subscribe: () => {},
  dispatch: () => {},
  getState: () => ({ ...state }),
});

const store = storeFake({
  globalApi: {
    useGetOrganisationQuery: jest.fn(),
    useGetCurrentUserQuery: jest.fn(),
    useGetPermissionsQuery: jest.fn(),
  },
  medicalSharedApi: {
    useGetAthleteDataQuery: jest.fn(),
  },
});

describe('<AddMedicalFileSidePanel />', () => {
  const props = {
    isPanelOpen: true,
    setIsPanelOpen: jest.fn(),
    playerOptions: mockedPlayerOptions,
    categoryOptions: mockDocumentCategoryOptions,
    athleteId: null,
    issueId: null,
    getDocuments: jest.fn(),
    organisationAnnotationTypeId: null,
    athleteIssues: [],
    fetchAthleteIssues: jest.fn(),
    toastAction: jest.fn(),
    toasts: [
      {
        id: 1,
        status: 'SUCCESS',
        title: 'Test Title',
        description: 'This is a test description',
        links: [
          {
            id: 1,
            text: 'Try Again',
            link: '#',
            withHashParam: true,
            metadata: {
              action: 'RETRY_REQUEST',
            },
          },
        ],
      },
    ],
    squads: [
      {
        athletes: [{ id: 1, name: 'Athlete 1 Name' }],
      },
    ],
    t: i18nextTranslateStub(),
  };

  beforeEach(() => {
    useGetAthleteDataQuery.mockReturnValue({
      data: mockedPlayerOptions,
      error: false,
      isLoading: false,
    });
    useGetOrganisationQuery.mockReturnValue({
      data: [
        { id: 1, name: 'Club A' },
        { id: 2, name: 'Club B' },
      ],
      error: false,
      isSuccess: true,
    });
    useGetCurrentUserQuery.mockReturnValue({
      data: {},
      error: false,
      isSuccess: true,
    });
    useGetPermissionsQuery.mockReturnValue({
      data: {},
      error: false,
      isLoading: false,
    });
  });

  it('renders the default form', async () => {
    render(
      <Provider store={store}>
        <AddMedicalFileSidePanel {...props} toasts={[]} />
      </Provider>
    );

    await screen.findByText('Add documents');

    expect(
      screen.getByTestId('AddMedicalFileSidePanel|Parent')
    ).toBeInTheDocument();
    expect(
      screen.getByTestId('AddMedicalFileSidePanel|TopRow')
    ).toBeInTheDocument();
    expect(
      screen.getByTestId('AddMedicalFileSidePanel|Categories')
    ).toBeInTheDocument();
    expect(
      screen.getByTestId('AddMedicalFileSidePanel|FileAttachment')
    ).toBeInTheDocument();
    expect(
      screen.getByTestId('AddMedicalFileSidePanel|Injuries')
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

    const textboxes = screen.getAllByRole('textbox');
    expect(textboxes).toHaveLength(4);
  });

  it('renders toast correctly', async () => {
    render(
      <Provider store={store}>
        <AddMedicalFileSidePanel {...props} />
      </Provider>
    );

    await screen.findByText('Add documents');
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('This is a test description')).toBeInTheDocument();
  });

  describe('button interactions', () => {
    it('calls setIsPanelOpen when userEvent clicks the close icon', async () => {
      const user = userEvent.setup();
      render(
        <Provider store={store}>
          <AddMedicalFileSidePanel {...props} />
        </Provider>
      );

      await screen.findByText('Add documents');
      const buttons = screen.getAllByRole('button');
      await user.click(buttons[0]);
      expect(props.setIsPanelOpen).toHaveBeenCalled();
    });

    it('validate note fields are missing, click add note and validate they are there', async () => {
      const user = userEvent.setup();
      render(
        <Provider store={store}>
          <AddMedicalFileSidePanel {...props} />
        </Provider>
      );
      await screen.findByText('Add documents');
      const titleField = screen.queryByText('Title');
      expect(titleField).not.toBeInTheDocument();
      const buttons = screen.getAllByRole('button');
      await user.click(buttons[1]);

      const titleFieldAfterClick = screen.queryByText('Title');
      expect(titleFieldAfterClick).toBeInTheDocument();
      expect(
        screen.getByTestId('AddMedicalFileSidePanel|NoteTitle')
      ).toBeInTheDocument();
      expect(
        screen.getByTestId('AddMedicalFileSidePanel|NoteInput')
      ).toBeInTheDocument();
    });
  });

  describe('athleteId prop passed to component', () => {
    it('has the correct name for the athlete id and get athletes called from useEffect', async () => {
      render(
        <Provider store={store}>
          <AddMedicalFileSidePanel {...props} athleteId={1} />
        </Provider>
      );
      await screen.findByText('Add documents');
      await waitFor(() => {
        expect(screen.getByText('Athlete 1 Name')).toBeInTheDocument();
      });
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
          <AddMedicalFileSidePanel {...props} />
        </Provider>
      );
      await screen.findByText('Add documents');
      // Placeholder on the new MovementAwareDatepicker
      const newDatePickerInputField =
        screen.queryByPlaceholderText('MM/DD/YYYY');

      expect(newDatePickerInputField).not.toBeInTheDocument();
    });

    it('renders old datepicker', async () => {
      render(
        <Provider store={store}>
          <AddMedicalFileSidePanel {...props} />
        </Provider>
      );
      await screen.findByText('Add documents');
      // Label element value on old datepicker
      const oldDatePickerLabel = await screen.findByLabelText(
        'Date of document'
      );

      expect(oldDatePickerLabel).toBeInTheDocument();
    });

    it('document date selector is disabled', async () => {
      render(
        <Provider store={store}>
          <AddMedicalFileSidePanel {...props} />
        </Provider>
      );
      await screen.findByText('Add documents');
      const disabledDatePicker = await screen.findByLabelText(
        'Date of document'
      );
      expect(disabledDatePicker).toBeDisabled();
    });

    it('document date selector is enabled when athlete id is provided', async () => {
      render(
        <Provider store={store}>
          <AddMedicalFileSidePanel {...props} athleteId={1} />
        </Provider>
      );
      await screen.findByText('Add documents');
      const datePicker = await screen.findByLabelText('Date of document');

      await waitFor(() => {
        expect(datePicker).toBeEnabled();
      });
    });

    it('document date selector is enabled after athlete is selected', async () => {
      render(
        <Provider store={store}>
          <LocalizationProvider>
            <AddMedicalFileSidePanel {...props} />
          </LocalizationProvider>
        </Provider>
      );
      await screen.findByText('Add documents');
      const athleteSelector = await waitFor(() =>
        screen.getByLabelText('Athlete')
      );

      const disabledDatePicker = await waitFor(() =>
        screen.getByLabelText('Date of document')
      );

      expect(disabledDatePicker).toBeDisabled();

      selectEvent.openMenu(athleteSelector);

      expect(screen.getByText('Athlete 1 Name')).toBeInTheDocument();
      expect(screen.getByText('Athlete 2 Name')).toBeInTheDocument();
      expect(screen.getByText('Athlete 3 Name')).toBeInTheDocument();
      expect(screen.getByText('Athlete 4 Name')).toBeInTheDocument();

      await selectEvent.select(athleteSelector, 'Athlete 2 Name');

      expect(screen.queryByText('Athlete 1 Name')).not.toBeInTheDocument();
      expect(screen.getByText('Athlete 2 Name')).toBeInTheDocument();
      expect(screen.queryByText('Athlete 3 Name')).not.toBeInTheDocument();
      expect(screen.queryByText('Athlete 4 Name')).not.toBeInTheDocument();

      expect(disabledDatePicker).toBeEnabled();
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
            <AddMedicalFileSidePanel {...props} />
          </LocalizationProvider>
        </Provider>
      );
      await screen.findByText('Add documents');
      // Label element value on old datepicker
      const oldDatePickerLabel = screen.queryByLabelText('Date of document');

      expect(oldDatePickerLabel).not.toBeInTheDocument();
    });

    it('renders new movement datepicker', async () => {
      render(
        <Provider store={store}>
          <LocalizationProvider>
            <AddMedicalFileSidePanel {...props} />
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
            <AddMedicalFileSidePanel {...props} />
          </LocalizationProvider>
        </Provider>
      );
      await screen.findByText('Add documents');
      const datePickerLabel = screen.getByText('Date of document');
      const datePickerInputField = screen.getByPlaceholderText('MM/DD/YYYY');

      expect(datePickerLabel).toBeInTheDocument();
      expect(datePickerInputField).toBeDisabled();
    });

    it('document date selector is enabled when athlete id is passed via props', async () => {
      render(
        <Provider store={store}>
          <LocalizationProvider>
            <AddMedicalFileSidePanel {...props} athleteId={1} />
          </LocalizationProvider>
        </Provider>
      );
      await screen.findByText('Add documents');
      const datePickerInputField = screen.getByPlaceholderText('MM/DD/YYYY');
      await waitFor(() => {
        expect(datePickerInputField).toBeEnabled();
      });
    });

    it('document date selector is enabled after athlete is selected', async () => {
      render(
        <Provider store={store}>
          <LocalizationProvider>
            <AddMedicalFileSidePanel {...props} />
          </LocalizationProvider>
        </Provider>
      );
      await screen.findByText('Add documents');

      const athleteSelector = await waitFor(() =>
        screen.getByLabelText('Athlete')
      );
      const datePickerInputField = screen.getByPlaceholderText('MM/DD/YYYY');

      // Initially disabled
      expect(datePickerInputField).toBeDisabled();

      // Select athlete dropdown
      selectEvent.openMenu(athleteSelector);

      // Athletes render
      expect(screen.queryByText('Athlete 1 Name')).toBeInTheDocument();
      expect(screen.queryByText('Athlete 2 Name')).toBeInTheDocument();
      expect(screen.queryByText('Athlete 3 Name')).toBeInTheDocument();
      expect(screen.queryByText('Athlete 4 Name')).toBeInTheDocument();

      // Choose athlete from dropdown list
      await selectEvent.select(athleteSelector, 'Athlete 2 Name');

      // Dropdown list closes
      expect(screen.queryByText('Athlete 1 Name')).not.toBeInTheDocument();
      expect(screen.queryByText('Athlete 2 Name')).toBeInTheDocument();
      expect(screen.queryByText('Athlete 3 Name')).not.toBeInTheDocument();
      expect(screen.queryByText('Athlete 4 Name')).not.toBeInTheDocument();

      // Datepicker field is now enabled
      expect(datePickerInputField).toBeEnabled();
    });
  });

  describe('Editing a selected document', () => {
    it('auto populates the form with the passed in values', async () => {
      render(
        <Provider store={store}>
          <AddMedicalFileSidePanel
            {...props}
            selectedFile={mockSelectedFile}
            isEditing
            toasts={[]}
          />
        </Provider>
      );

      await screen.findByText('Edit Document');

      // this first waitFor is needed because we need to wait for state to be set
      await waitFor(() => {
        expect(screen.getByText('Athlete 1 Name')).toBeInTheDocument();
      });

      expect(screen.getByText('Document Category 1')).toBeInTheDocument();

      const firstInput = screen.getAllByLabelText('Title')[0];
      expect(firstInput.value).toBe('myAttachment.pdf');
    });
  });

  describe('[PLAYER MOVEMENT]', () => {
    describe('[PAST ATHLETE] when viewing a past athlete', () => {
      let trackEventMock;

      beforeEach(() => {
        jest.useFakeTimers();
        jest.setSystemTime(new Date('2023-01-28T12:00:00Z')); // Set a specific date for predictable maxDate

        useGetAthleteDataQuery.mockReturnValue({
          data: mockedPastAthlete,
          isLoading: false,
        });

        trackEventMock = jest.fn();
        jest.spyOn(useEventTrackingModule, 'default').mockReturnValue({
          trackEvent: trackEventMock,
        });
      });

      afterEach(() => {
        jest.runOnlyPendingTimers();
        jest.useRealTimers();
        jest.restoreAllMocks(); // Restore all mocks, including useGetAthleteDataQuery and useEventTracking
      });

      it('renders the correct content', async () => {
        render(
          <Provider store={store}>
            <MockedPermissionContextProvider
              permissionsContext={{
                ...mockedDefaultPermissionsContextValue,
                permissions: {
                  ...mockedDefaultPermissionsContextValue.permissions,
                  medical: {
                    ...defaultMedicalPermissions,
                    documents: {
                      canCreate: true,
                    },
                  },
                },
              }}
            >
              <LocalizationProvider>
                <AddMedicalFileSidePanel {...props} athleteId={5} />
              </LocalizationProvider>
            </MockedPermissionContextProvider>
          </Provider>
        );

        // Athlete Selector assertions
        const athleteSelectCombobox = screen.getByLabelText('Athlete');
        expect(athleteSelectCombobox).toBeInTheDocument();
        expect(athleteSelectCombobox).toBeDisabled();
        expect(screen.getByText('Macho Man Randy Savage')).toBeInTheDocument();

        // Document Date Selector assertions
        const dateOfDocumentLabel = screen.getByLabelText('Date of document');
        expect(dateOfDocumentLabel).toBeInTheDocument();
        expect(dateOfDocumentLabel).toBeEnabled();
      });
    });
  });
});
