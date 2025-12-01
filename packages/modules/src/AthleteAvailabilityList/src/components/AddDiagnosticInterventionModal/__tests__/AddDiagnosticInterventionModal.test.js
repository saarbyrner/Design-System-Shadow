import { screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import renderWithRedux from '@kitman/common/src/utils/renderWithRedux';
import AddDiagnosticInterventionModal from '../index';

jest.mock('@kitman/common/src/hooks/useEventTracking', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    trackEvent: jest.fn(),
  })),
}));

jest.mock('@kitman/components', () => ({
  Dropdown: ({ onChange, items = [], value, label }) => (
    <select
      data-testid="dropdown"
      onChange={(e) => onChange(e.target.value)}
      value={value === null ? '' : value}
      aria-label={label}
    >
      {items.map((option) => (
        <option key={option.id} value={option.id}>
          {option.title || option.text || option.name}
        </option>
      ))}
    </select>
  ),
  DatePicker: ({ onDateChange, value, label }) => (
    <input
      type="date"
      data-testid="datepicker"
      onChange={(e) => onDateChange(e.target.value)}
      value={value === null ? '' : value}
      aria-label={label}
    />
  ),
  InputFile: ({ onChange, label }) => (
    <input
      type="file"
      data-testid="inputfile"
      onChange={(e) => onChange(e.target.files[0])}
      aria-label={label}
    />
  ),
  InputText: ({ onValidation, value, label }) => (
    <input
      type="text"
      data-testid="inputtext"
      onChange={(e) => onValidation({ value: e.target.value })}
      value={value}
      aria-label={label}
    />
  ),
  Textarea: ({ onChange, value, label }) => (
    <textarea
      data-testid="textarea"
      onChange={(e) => onChange(e.target.value)}
      value={value}
      aria-label={label}
    />
  ),
  Checkbox: ({ toggle, checked, label, id }) => (
    <input
      type="checkbox"
      data-testid="checkbox"
      onChange={() => toggle({ checked: !checked })}
      checked={checked}
      aria-label={label || id}
    />
  ),
  LegacyModal: ({ isOpen, close, title, children }) => (
    <div
      data-testid="modal"
      aria-modal="true"
      role="dialog"
      style={{ display: isOpen ? 'block' : 'none' }}
    >
      <h2>{title}</h2>
      <button type="button" onClick={close}>
        Close
      </button>
      {children}
    </div>
  ),
  FormValidator: ({ children, successAction }) => (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        successAction();
      }}
    >
      {children}
    </form>
  ),
  TextButton: ({ onClick, text, isSubmit }) => (
    <button type={isSubmit ? 'submit' : 'button'} onClick={onClick}>
      {text}
    </button>
  ),
  AppStatus: ({ status, message, close }) => (
    <div data-testid="app-status-component-mock">
      <span>Status: {status}</span>
      <span>Message: {message}</span>
      <button type="button" onClick={close}>
        Close
      </button>
    </div>
  ),
}));

let props;
describe('AddDiagnosticInterventionModal', () => {
  const date = new Date('Nov 20 2018');
  const dummyFileAttachment = {
    lastModified: 1542706027020,
    lastModifiedDate: date,
    name: 'sample.csv',
    size: 124625,
    type: 'text/csv',
    webkitRelativePath: '',
  };

  const mockAthleteInjuries = [
    {
      issue_id: 123456,
      name: 'Injury 1',
      description: 'Description 1',
      events_order: [],
      events: [],
      osics: { osics_pathology_id: '1168' },
      side_id: 1,
    },
    {
      issue_id: 123457,
      name: 'Injury 2',
      description: 'Description 2',
      events_order: [],
      events: [],
      osics: { osics_pathology_id: '366' },
      side_id: 2,
    },
  ];

  const mockAthleteIllnesses = [
    {
      issue_id: 123458,
      name: 'Illness 1',
      description: 'Description 3',
      events_order: [],
      events: [],
      osics: { osics_pathology_id: '1392' },
      side_id: null,
    },
    {
      issue_id: 123459,
      name: 'Illness 2',
      description: 'Description 4',
      events_order: [],
      events: [],
      osics: { osics_pathology_id: '948' },
      side_id: null,
    },
  ];

  beforeEach(() => {
    props = {
      isOpen: true, // Set to true for rendering in tests
      closeModal: jest.fn(),
      athleteId: 'athlete-123',
      athleteInjuries: mockAthleteInjuries,
      athleteIllnesses: mockAthleteIllnesses,
      attachments: [],
      diagnosticTypes: [
        { id: 1, title: '3D Analysis' },
        { id: 2, title: 'PRP Injection' },
        { id: 3, title: 'Video' },
      ],
      diagnosticsWithExtraFields: {
        blood_tests: 30,
        cardiac_data: 74,
        concussion: 75,
        covid_19_antibody_test: 70,
        covid_19_test: 67,
        medication: 24,
      },
      covidResults: [{ id: 'Positive', text: 'Positive' }],
      covidAntibodyResults: [{ id: 'Positive', text: 'Positive' }],
      diagnosticData: {
        diagnostic_date: null,
        diagnostic_type: null,
        injury_ids: [],
        illness_ids: [],
        attachment_ids: [],
        medication_type: null,
        medication_dosage: null,
        medication_frequency: null,
        medication_notes: null,
        medication_completed: false,
        medication_completed_at: null,
      },
      injuryOsicsPathologies: [
        { id: '1168', name: 'Abdominopelvic Structural abnormality' },
        { id: '366', name: 'Accessory bone foot' },
      ],
      illnessOsicsPathologies: [
        { id: '1392', name: '1st CMC joint instability' },
        { id: '948', name: 'AC Joint contusion' },
      ],
      restrictAccessList: [
        { id: 'Default Visibility', text: 'Default Visibility' },
        { id: 'Doctors', text: 'Doctors' },
        { id: 'Psych Team', text: 'Psych Team' },
      ],
      sides: [
        { id: 1, name: 'left' },
        { id: 2, name: 'right' },
        { id: 3, name: 'center' },
      ],
      injuryStatuses: [
        {
          cause_unavailability: true,
          description: 'Causing unavailability (time-loss)',
          id: 1,
          injury_status_system_id: 1,
          order: 1,
          restore_availability: false,
        },
        {
          cause_unavailability: false,
          description: 'Not affecting availability (medical attention)',
          id: 2,
          injury_status_system_id: 1,
          order: 2,
          restore_availability: true,
        },
        {
          cause_unavailability: false,
          description: 'Resolved',
          id: 3,
          injury_status_system_id: 1,
          order: 3,
          restore_availability: true,
        },
      ],
      updateRelevantInjuries: jest.fn(),
      updateRelevantIllnesses: jest.fn(),
      populateAthleteIssuesForDiagnostics: jest.fn(),
      updateDiagnosticAttachments: jest.fn(),
      uploadAttachments: jest.fn(),
      updateDiagnosticType: jest.fn(),
      updateDiagnosticDate: jest.fn(),
      updateDiagnosticMedicationType: jest.fn(),
      updateDiagnosticMedicationDosage: jest.fn(),
      updateDiagnosticMedicationFrequency: jest.fn(),
      updateDiagnosticMedicationNotes: jest.fn(),
      updateDiagnosticMedicationCompleted: jest.fn(),
      updateDiagnosticCovidTestDate: jest.fn(),
      updateDiagnosticCovidTestType: jest.fn(),
      updateDiagnosticCovidResult: jest.fn(),
      updateDiagnosticCovidReference: jest.fn(),
      updateDiagnosticCovidAntibodyTestDate: jest.fn(),
      updateDiagnosticCovidAntibodyTestType: jest.fn(),
      updateDiagnosticCovidAntibodyResult: jest.fn(),
      updateDiagnosticCovidAntibodyReference: jest.fn(),
      updateDiagnosticAnnotationContent: jest.fn(),
      updateDiagnosticRestrictAccessTo: jest.fn(),
      t: (key) => key,
    };
    window.featureFlags = {}; // Reset feature flags for each test
  });

  test('renders the component', () => {
    renderWithRedux(<AddDiagnosticInterventionModal {...props} />, {
      preloadedState: {
        appStatus: {
          status: null,
          message: null,
        },
      },
      useGlobalStore: false,
    });
    expect(screen.getByText('Diagnostic/Intervention')).toBeInTheDocument();
  });

  test('renders an empty text when there are no issues', () => {
    renderWithRedux(
      <AddDiagnosticInterventionModal
        {...props}
        athleteInjuries={[]}
        athleteIllnesses={[]}
      />,
      {
        preloadedState: {
          appStatus: {
            status: null,
            message: null,
          },
        },
        useGlobalStore: false,
      }
    );
    expect(
      screen.queryAllByText(
        '#sport_specific__There_are_no_issues_for_this_athlete.'
      )
    ).toHaveLength(2);
  });

  test('renders the correct number of injuries', () => {
    renderWithRedux(<AddDiagnosticInterventionModal {...props} />, {
      preloadedState: {
        appStatus: {
          status: null,
          message: null,
        },
      },
      useGlobalStore: false,
    });
    expect(screen.getByLabelText('isSelectedIssue_123456')).toBeInTheDocument();
    expect(
      screen.getByText('Abdominopelvic Structural abnormality')
    ).toBeInTheDocument();
    expect(screen.getByLabelText('isSelectedIssue_123457')).toBeInTheDocument();
    expect(screen.getByText('Accessory bone foot')).toBeInTheDocument();
  });

  test('renders the correct number of illnesses', () => {
    renderWithRedux(<AddDiagnosticInterventionModal {...props} />, {
      preloadedState: {
        appStatus: {
          status: null,
          message: null,
        },
      },
      useGlobalStore: false,
    });
    expect(screen.getByLabelText('isSelectedIssue_123458')).toBeInTheDocument();
    expect(screen.getByText('1st CMC joint instability')).toBeInTheDocument();
    expect(screen.getByLabelText('isSelectedIssue_123459')).toBeInTheDocument();
    expect(screen.getByText('AC Joint contusion')).toBeInTheDocument();
  });

  test('calls the correct callback when diagnostic type is selected', async () => {
    const user = userEvent.setup();
    renderWithRedux(<AddDiagnosticInterventionModal {...props} />, {
      preloadedState: {
        appStatus: {
          status: null,
          message: null,
        },
      },
      useGlobalStore: false,
    });
    const dropdown = screen.getByRole('combobox', { name: 'Diagnostic Type' });
    await user.selectOptions(dropdown, '1');
    expect(props.updateDiagnosticType).toHaveBeenCalledWith('1');
  });

  test('calls the correct callback when diagnostic date is selected', async () => {
    renderWithRedux(<AddDiagnosticInterventionModal {...props} />, {
      preloadedState: {
        appStatus: {
          status: null,
          message: null,
        },
      },
      useGlobalStore: false,
    });
    const datePicker = screen.getByLabelText('Date');
    fireEvent.change(datePicker, { target: { value: '2020-03-27' } });
    expect(props.updateDiagnosticDate).toHaveBeenCalledWith('2020-03-27');
  });

  test('calls the correct callback when an issue checkbox is checked for injuries', async () => {
    const user = userEvent.setup();
    renderWithRedux(<AddDiagnosticInterventionModal {...props} />, {
      preloadedState: {
        appStatus: {
          status: null,
          message: null,
        },
      },
      useGlobalStore: false,
    });
    const injuryCheckbox = screen.getByLabelText('isSelectedIssue_123456');
    await user.click(injuryCheckbox);
    expect(props.updateRelevantInjuries).toHaveBeenCalledWith(123456);
  });

  test('calls the correct callback when an issue checkbox is checked for illnesses', async () => {
    const user = userEvent.setup();
    renderWithRedux(<AddDiagnosticInterventionModal {...props} />, {
      preloadedState: {
        appStatus: {
          status: null,
          message: null,
        },
      },
      useGlobalStore: false,
    });
    const illnessCheckbox = screen.getByLabelText('isSelectedIssue_123458');
    await user.click(illnessCheckbox);
    expect(props.updateRelevantIllnesses).toHaveBeenCalledWith(123458);
  });

  test('calls the correct callback when file is changed', async () => {
    const user = userEvent.setup();
    renderWithRedux(<AddDiagnosticInterventionModal {...props} />, {
      preloadedState: {
        appStatus: {
          status: null,
          message: null,
        },
      },
      useGlobalStore: false,
    });
    const inputFile = screen.getByTestId('inputfile');
    const file = new File(['dummy content'], 'sample.csv', {
      type: 'text/csv',
    });
    await user.upload(inputFile, file);
    expect(props.uploadAttachments).toHaveBeenCalledWith(file, 1);
  });

  test('renders the correct number of file upload field when there are multiple files attached', () => {
    const file = { ...dummyFileAttachment };
    const file2 = { ...dummyFileAttachment, name: 'sample_2.csv' };
    renderWithRedux(
      <AddDiagnosticInterventionModal {...props} attachments={[file, file2]} />,
      {
        preloadedState: {
          appStatus: {
            status: null,
            message: null,
          },
        },
        useGlobalStore: false,
      }
    );
    expect(screen.getAllByTestId('inputfile')).toHaveLength(3); // Initial + 2 attached
  });

  describe('when medical type is selected', () => {
    beforeEach(() => {
      props.diagnosticData.diagnostic_type = 24; // Medication type
    });

    test('renders the medication related fields', () => {
      renderWithRedux(<AddDiagnosticInterventionModal {...props} />, {
        preloadedState: {
          appStatus: {
            status: null,
            message: null,
          },
        },
        useGlobalStore: false,
      });
      expect(screen.getByRole('textbox', { name: 'Type' })).toBeInTheDocument();
      expect(
        screen.getByRole('textbox', { name: 'Dosage' })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('textbox', { name: 'Frequency' })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('textbox', { name: 'Notes' })
      ).toBeInTheDocument();
      expect(
        screen.getByLabelText('Course already completed')
      ).toBeInTheDocument();
    });

    test('calls the correct callback when medication type is updated', async () => {
      renderWithRedux(<AddDiagnosticInterventionModal {...props} />, {
        preloadedState: {
          appStatus: {
            status: null,
            message: null,
          },
        },
        useGlobalStore: false,
      });
      const input = screen.getByRole('textbox', { name: 'Type' });
      fireEvent.change(input, { target: { value: 'abc' } });
      expect(props.updateDiagnosticMedicationType).toHaveBeenCalledWith('abc');
    });

    test('calls the correct callback when medication dosage is updated', async () => {
      renderWithRedux(<AddDiagnosticInterventionModal {...props} />, {
        preloadedState: {
          appStatus: {
            status: null,
            message: null,
          },
        },
        useGlobalStore: false,
      });
      const input = screen.getByRole('textbox', { name: 'Dosage' });
      fireEvent.change(input, { target: { value: 'abc' } });
      expect(props.updateDiagnosticMedicationDosage).toHaveBeenCalledWith(
        'abc'
      );
    });

    test('calls the correct callback when medication frequency is updated', async () => {
      renderWithRedux(<AddDiagnosticInterventionModal {...props} />, {
        preloadedState: {
          appStatus: {
            status: null,
            message: null,
          },
        },
        useGlobalStore: false,
      });
      const input = screen.getByRole('textbox', { name: 'Frequency' });
      fireEvent.change(input, { target: { value: 'abc' } });
      expect(props.updateDiagnosticMedicationFrequency).toHaveBeenCalledWith(
        'abc'
      );
    });

    test('calls the correct callback when medication note is updated', async () => {
      renderWithRedux(<AddDiagnosticInterventionModal {...props} />, {
        preloadedState: {
          appStatus: {
            status: null,
            message: null,
          },
        },
        useGlobalStore: false,
      });
      const textarea = screen.getByRole('textbox', { name: 'Notes' });
      fireEvent.change(textarea, { target: { value: 'abc' } });
      expect(props.updateDiagnosticMedicationNotes).toHaveBeenCalledWith('abc');
    });

    test('calls the correct callback when course completed is checked', async () => {
      const user = userEvent.setup();
      renderWithRedux(<AddDiagnosticInterventionModal {...props} />, {
        preloadedState: {
          appStatus: {
            status: null,
            message: null,
          },
        },
        useGlobalStore: false,
      });
      const checkbox = screen.getByLabelText('Course already completed');
      await user.click(checkbox);
      expect(props.updateDiagnosticMedicationCompleted).toHaveBeenCalledWith(
        true
      );
    });
  });

  describe('[feature-flag] covid-19-medical-diagnostic', () => {
    beforeEach(() => {
      window.featureFlags['covid-19-medical-diagnostic'] = true;
    });

    afterEach(() => {
      window.featureFlags['covid-19-medical-diagnostic'] = false;
    });

    describe('when COVID-19 Test type is selected', () => {
      beforeEach(() => {
        props.diagnosticData.diagnostic_type = 67; // COVID-19 Test type
      });

      test('renders the COVID-19 Test related fields', () => {
        renderWithRedux(<AddDiagnosticInterventionModal {...props} />, {
          preloadedState: {
            appStatus: {
              status: null,
              message: null,
            },
          },
          useGlobalStore: false,
        });
        expect(screen.getByLabelText('Date of Test')).toBeInTheDocument();
        expect(
          screen.getByRole('textbox', { name: 'Test Type' })
        ).toBeInTheDocument();
        expect(
          screen.getByRole('combobox', { name: 'Result' })
        ).toBeInTheDocument();
        expect(
          screen.getByRole('textbox', { name: 'Reference' })
        ).toBeInTheDocument();
      });

      test('calls the correct callback when the covid test date is updated', async () => {
        renderWithRedux(<AddDiagnosticInterventionModal {...props} />, {
          preloadedState: {
            appStatus: {
              status: null,
              message: null,
            },
          },
          useGlobalStore: false,
        });
        const datePicker = screen.getByLabelText('Date of Test');
        fireEvent.change(datePicker, { target: { value: '2020-03-27' } });
        expect(props.updateDiagnosticCovidTestDate).toHaveBeenCalledWith(
          '2020-03-27'
        );
      });

      test('calls the correct callback when the covid test type is updated', async () => {
        renderWithRedux(<AddDiagnosticInterventionModal {...props} />, {
          preloadedState: {
            appStatus: {
              status: null,
              message: null,
            },
          },
          useGlobalStore: false,
        });
        const input = screen.getByRole('textbox', { name: 'Test Type' });
        fireEvent.change(input, { target: { value: 'Test type' } });
        expect(props.updateDiagnosticCovidTestType).toHaveBeenCalledWith(
          'Test type'
        );
      });

      test('calls the correct callback when the covid test result is updated', async () => {
        const user = userEvent.setup();
        renderWithRedux(<AddDiagnosticInterventionModal {...props} />, {
          preloadedState: {
            appStatus: {
              status: null,
              message: null,
            },
          },
          useGlobalStore: false,
        });
        const dropdown = screen.getByRole('combobox', { name: 'Result' });
        await user.selectOptions(dropdown, 'Positive');
        expect(props.updateDiagnosticCovidResult).toHaveBeenCalledWith(
          'Positive'
        );
      });

      test('calls the correct callback when the covid test reference is updated', async () => {
        renderWithRedux(<AddDiagnosticInterventionModal {...props} />, {
          preloadedState: {
            appStatus: {
              status: null,
              message: null,
            },
          },
          useGlobalStore: false,
        });
        const input = screen.getByRole('textbox', { name: 'Reference' });
        fireEvent.change(input, { target: { value: 'Test Reference' } });
        expect(props.updateDiagnosticCovidReference).toHaveBeenCalledWith(
          'Test Reference'
        );
      });
    });

    describe('when COVID-19 Antibody Test type is selected', () => {
      beforeEach(() => {
        props.diagnosticData.diagnostic_type = 70; // COVID-19 Antibody Test type
      });

      test('renders the COVID-19 Antibody Test related fields', () => {
        renderWithRedux(<AddDiagnosticInterventionModal {...props} />, {
          preloadedState: {
            appStatus: {
              status: null,
              message: null,
            },
          },
          useGlobalStore: false,
        });
        expect(screen.getByLabelText('Date of Test')).toBeInTheDocument();
        expect(
          screen.getByRole('textbox', { name: 'Test Type' })
        ).toBeInTheDocument();
        expect(
          screen.getByRole('combobox', { name: 'Result' })
        ).toBeInTheDocument();
        expect(
          screen.getByRole('textbox', { name: 'Reference' })
        ).toBeInTheDocument();
      });

      test('calls the correct callback when the covid test date is updated', async () => {
        renderWithRedux(<AddDiagnosticInterventionModal {...props} />, {
          preloadedState: {
            appStatus: {
              status: null,
              message: null,
            },
          },
          useGlobalStore: false,
        });
        const datePicker = screen.getByLabelText('Date of Test');
        fireEvent.change(datePicker, { target: { value: '2020-03-27' } });
        expect(
          props.updateDiagnosticCovidAntibodyTestDate
        ).toHaveBeenCalledWith('2020-03-27');
      });

      test('calls the correct callback when the covid test type is updated', async () => {
        renderWithRedux(<AddDiagnosticInterventionModal {...props} />, {
          preloadedState: {
            appStatus: {
              status: null,
              message: null,
            },
          },
          useGlobalStore: false,
        });
        const input = screen.getByRole('textbox', { name: 'Test Type' });
        fireEvent.change(input, { target: { value: 'Test type' } });
        expect(
          props.updateDiagnosticCovidAntibodyTestType
        ).toHaveBeenCalledWith('Test type');
      });

      test('calls the correct callback when the covid test result is updated', async () => {
        const user = userEvent.setup();
        renderWithRedux(<AddDiagnosticInterventionModal {...props} />, {
          preloadedState: {
            appStatus: {
              status: null,
              message: null,
            },
          },
          useGlobalStore: false,
        });
        const dropdown = screen.getByRole('combobox', { name: 'Result' });
        await user.selectOptions(dropdown, 'Positive');
        expect(props.updateDiagnosticCovidAntibodyResult).toHaveBeenCalledWith(
          'Positive'
        );
      });

      test('calls the correct callback when the covid test reference is updated', async () => {
        renderWithRedux(<AddDiagnosticInterventionModal {...props} />, {
          preloadedState: {
            appStatus: {
              status: null,
              message: null,
            },
          },
          useGlobalStore: false,
        });
        const input = screen.getByRole('textbox', { name: 'Reference' });
        fireEvent.change(input, { target: { value: 'Test Reference' } });
        expect(
          props.updateDiagnosticCovidAntibodyReference
        ).toHaveBeenCalledWith('Test Reference');
      });
    });
  });

  describe('when a diagnostic that supports annotation is selected', () => {
    beforeEach(() => {
      props.diagnosticData.diagnostic_type = 75; // Concussion type (supports annotation)
    });

    test('renders the annotation_content and related fields', () => {
      renderWithRedux(<AddDiagnosticInterventionModal {...props} />, {
        preloadedState: {
          appStatus: {
            status: null,
            message: null,
          },
        },
        useGlobalStore: false,
      });
      expect(screen.getByRole('textbox', { name: 'Note' })).toBeInTheDocument();
      expect(
        screen.getByRole('combobox', { name: 'Restrict access to' })
      ).toBeInTheDocument();
    });

    test('calls the correct callback when the annotation content is updated', async () => {
      renderWithRedux(<AddDiagnosticInterventionModal {...props} />, {
        preloadedState: {
          appStatus: {
            status: null,
            message: null,
          },
        },
        useGlobalStore: false,
      });
      const textarea = screen.getByRole('textbox', { name: 'Note' });
      fireEvent.change(textarea, {
        target: { value: 'New annotation content' },
      });
      expect(props.updateDiagnosticAnnotationContent).toHaveBeenCalledWith(
        'New annotation content'
      );
    });

    test('calls the correct callback when the restrict_access_to is updated', async () => {
      const user = userEvent.setup();
      renderWithRedux(<AddDiagnosticInterventionModal {...props} />, {
        preloadedState: {
          appStatus: {
            status: null,
            message: null,
          },
        },
        useGlobalStore: false,
      });
      const dropdown = screen.getByRole('combobox', {
        name: 'Restrict access to',
      });
      await user.selectOptions(dropdown, 'Doctors');
      expect(props.updateDiagnosticRestrictAccessTo).toHaveBeenCalledWith(
        'Doctors'
      );
    });
  });
});
