import { screen, fireEvent } from '@testing-library/react';
import moment from 'moment';
import { setI18n } from 'react-i18next';
import i18n from '@kitman/common/src/utils/i18n';
import {
  i18nextTranslateStub,
  renderWithUserEventSetup,
} from '@kitman/common/src/utils/test_utils';
import athleteData from '../../AthleteAvailabilityList/utils/dummyAthleteData';
import AddNoteModal from '../index';

jest.mock('@kitman/components', () => {
  const actualMoment = jest.requireActual('moment');
  return {
    AppStatus: () => <div data-testid="AppStatus" />,
    DatePicker: ({ label, onDateChange, name, value }) => (
      <div>
        <label htmlFor={`datepicker-${name}`}>{label}</label>
        <input
          id={`datepicker-${name}`}
          type="text"
          name={name}
          value={value || ''}
          onChange={(e) =>
            onDateChange(actualMoment(e.target.value, 'DD/MM/YYYY').toDate())
          }
        />
      </div>
    ),
    Dropdown: ({ label, onChange, items, value, clearBtn, onClickClear }) => (
      <div>
        <label htmlFor={`dropdown-${label}`}>{label}</label>
        <select
          id={`dropdown-${label}`}
          onChange={(e) => onChange(e.target.value)}
          value={value || ''}
        >
          {items.map((item) => (
            <option key={item.id} value={item.id}>
              {item.title}
            </option>
          ))}
        </select>
        {clearBtn && (
          <button type="button" onClick={onClickClear}>
            clear
          </button>
        )}
      </div>
    ),
    FormValidator: ({ children }) => <div>{children}</div>,
    GroupedDropdown: ({ label, onChange, options, value }) => (
      <div>
        <label htmlFor={`grouped-dropdown-${label}`}>{label}</label>
        <select
          id={`grouped-dropdown-${label}`}
          onChange={(e) =>
            onChange(options.find((o) => o.key_name === e.target.value))
          }
          value={value || ''}
        >
          {options.map((item, index) => (
            <option key={item.key_name || index} value={item.key_name}>
              {item.name}
            </option>
          ))}
        </select>
      </div>
    ),
    InputFile: ({ onChange }) => (
      <input
        type="file"
        data-testid="file-input"
        onChange={(e) => onChange(e.target.files[0])}
      />
    ),
    InputText: ({ label, onValidation, value }) => {
      const [inputValue, setInputValue] = jest
        .requireActual('react')
        .useState(value);
      return (
        <div>
          <label htmlFor={`input-text-${label}`}>{label}</label>
          <input
            id={`input-text-${label}`}
            type="text"
            value={inputValue || ''}
            onChange={(e) => setInputValue(e.target.value)}
            onBlur={() => onValidation({ value: inputValue })}
          />
        </div>
      );
    },
    LegacyModal: ({ children, close }) => (
      <div>
        <button type="button" onClick={close} data-testid="modal-close-button">
          Close
        </button>
        {children}
      </div>
    ),
    Textarea: ({ label, onChange, value }) => {
      const [textareaValue, setTextareaValue] = jest
        .requireActual('react')
        .useState(value);
      return (
        <div>
          <label htmlFor={`textarea-${label}`}>{label}</label>
          <textarea
            id={`textarea-${label}`}
            value={textareaValue || ''}
            onChange={(e) => setTextareaValue(e.target.value)}
            onBlur={() => onChange(textareaValue)}
          />
        </div>
      );
    },
    TextButton: ({ text, onClick }) => (
      <button type="button" onClick={onClick}>
        {text}
      </button>
    ),
    Checkbox: ({ label, toggle, isChecked }) => (
      <label>
        {label}
        <input
          type="checkbox"
          onChange={(e) => toggle({ checked: e.target.checked })}
          checked={isChecked}
        />
      </label>
    ),
  };
});

describe('<AddNoteModal /> component', () => {
  const athletes = athleteData();
  let props;

  beforeEach(() => {
    setI18n(i18n);
    props = {
      isOpen: true,
      athleteId: athletes[0].id,
      athleteFullName: athletes[0].full_name,
      athleteInjuries: athletes[0].injuries,
      athleteIllnesses: athletes[0].illnesses,
      attachments: [],
      noteData: {
        attachment_ids: [],
        note_date: null,
        note_type: null,
        medical_type: null,
        medical_name: null,
        injury_ids: [],
        illness_ids: [],
        note: '',
        expiration_date: null,
        batch_number: null,
        renewal_date: null,
        restricted: false,
        psych_only: false,
      },
      requestStatus: {
        status: null,
        message: null,
      },
      injuryOsicsPathologies: [
        { id: 1168, name: 'Abdominopelvic Structural abnormality' },
        { id: 366, name: 'Accessory bone foot' },
      ],
      illnessOsicsPathologies: [
        { id: 1392, name: '1st CMC joint instability' },
        { id: 948, name: 'AC Joint contusion' },
      ],
      sides: [
        {
          id: 1,
          name: 'left',
        },
        {
          id: 2,
          name: 'right',
        },
        {
          id: 3,
          name: 'center',
        },
      ],
      noteMedicalTypeOptions: [
        { isGroupOption: true, name: 'Allergy' },
        { name: 'Allergy', key_name: 'Allergy' },
        { name: 'TUE', key_name: 'TUE' },
        { name: 'Blood Test', key_name: 'Blood Test' },
        { name: 'Vaccination', key_name: 'Vaccination' },
      ],
      updateNoteDate: jest.fn(),
      updateNoteType: jest.fn(),
      updateNote: jest.fn(),
      updateIsRestricted: jest.fn(),
      updatePsychOnly: jest.fn(),
      updateNoteMedicalType: jest.fn(),
      updateNoteMedicalTypeName: jest.fn(),
      updateNoteAttachments: jest.fn(),
      updateNoteExpDate: jest.fn(),
      updateNoteBatchNumber: jest.fn(),
      updateNoteRenewalDate: jest.fn(),
      getLastNote: jest.fn(),
      uploadAttachments: jest.fn(),
      hideRequestStatus: jest.fn(),
      closeModal: jest.fn(),
      t: i18nextTranslateStub(),
      populateAthleteIssuesForNote: jest.fn(),
      updateRelevantInjuries: jest.fn(),
      updateRelevantIllnesses: jest.fn(),
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
    };
  });

  it('renders the component', () => {
    renderWithUserEventSetup(<AddNoteModal {...props} />);
    expect(screen.getByText('Add Note')).toBeInTheDocument();
    expect(screen.getByText(props.athleteFullName)).toBeInTheDocument();
  });

  it('has the correct title', () => {
    renderWithUserEventSetup(<AddNoteModal {...props} />);
    expect(screen.getByText('Add Note')).toBeInTheDocument();
    expect(screen.getByText(props.athleteFullName)).toBeInTheDocument();
  });

  describe('when the modal is closed', () => {
    it('calls the correct callbacks', async () => {
      const { user } = renderWithUserEventSetup(<AddNoteModal {...props} />);
      await user.click(screen.getByRole('button', { name: 'Close' }));
      expect(props.hideRequestStatus).toHaveBeenCalledTimes(1);
      expect(props.closeModal).toHaveBeenCalledTimes(1);
    });
  });

  describe('when the note date is changed', () => {
    it('calls the correct callback', () => {
      const testDate = moment('2019-04-15').toDate();
      renderWithUserEventSetup(<AddNoteModal {...props} />);
      const datePicker = screen.getByLabelText('Date');
      fireEvent.change(datePicker, { target: { value: '15/04/2019' } });
      expect(props.updateNoteDate).toHaveBeenCalledWith(testDate);
    });
  });

  describe('when the note type is medical', () => {
    beforeEach(() => {
      props.noteData.note_type = 3;
    });

    it('renders medical related fields', () => {
      renderWithUserEventSetup(<AddNoteModal {...props} />);
      expect(screen.getByLabelText('Medical Type')).toBeInTheDocument();
    });

    it('does not render a name field by default', () => {
      renderWithUserEventSetup(<AddNoteModal {...props} />);
      expect(screen.queryByLabelText('Name')).not.toBeInTheDocument();
    });
  });

  describe('when the note medication type is changed', () => {
    beforeEach(() => {
      props.noteData.note_type = 3;
      props.noteData.medical_type = 'Allergy';
    });

    it('calls the correct callback', async () => {
      const { user } = renderWithUserEventSetup(<AddNoteModal {...props} />);
      await user.selectOptions(screen.getByLabelText('Medical Type'), 'TUE');
      expect(props.updateNoteMedicalType).toHaveBeenCalledWith('TUE');
    });
  });

  describe('when the note medication name is changed', () => {
    beforeEach(() => {
      props.noteData.note_type = 3;
      props.noteData.medical_type = 'Allergy';
    });

    it('calls the correct callback', async () => {
      const { user } = renderWithUserEventSetup(<AddNoteModal {...props} />);
      await user.type(screen.getByLabelText('Name'), 'New Name');
      fireEvent.blur(screen.getByLabelText('Name'));
      expect(props.updateNoteMedicalTypeName).toHaveBeenLastCalledWith(
        'New Name'
      );
    });
  });

  describe('when the note type is medical and medical type is selected', () => {
    beforeEach(() => {
      props.noteData.note_type = 3;
      props.noteData.medical_type = 'Blood Test';
    });

    it('renders a file upload field', async () => {
      renderWithUserEventSetup(<AddNoteModal {...props} />);
      expect(await screen.findByTestId('file-input')).toBeInTheDocument();
    });

    it('calls the correct callback when file is changed', async () => {
      const date = new Date('Nov 20 2018');
      const dummyFileAttachment = {
        lastModified: 1542706027020,
        lastModifiedDate: date,
        name: 'sample.csv',
        size: 124625,
        type: 'text/csv',
        webkitRelativePath: '',
      };
      renderWithUserEventSetup(<AddNoteModal {...props} />);
      const fileInput = await screen.findByTestId('file-input');
      fireEvent.change(fileInput, { target: { files: [dummyFileAttachment] } });
      expect(props.uploadAttachments).toHaveBeenCalledWith(
        dummyFileAttachment,
        1
      );
    });
  });

  describe('when the note type is medical and medical type is Allergy', () => {
    beforeEach(() => {
      props.noteData.note_type = 3;
      props.noteData.medical_type = 'Allergy';
    });

    it('does not render a file upload field', () => {
      renderWithUserEventSetup(<AddNoteModal {...props} />);
      expect(screen.queryByText('Upload File')).not.toBeInTheDocument();
    });

    it('renders a name field', () => {
      renderWithUserEventSetup(<AddNoteModal {...props} />);
      expect(screen.getByLabelText('Name')).toBeInTheDocument();
    });
  });

  describe('when the note type is medical and medical type is TUE', () => {
    beforeEach(() => {
      props.noteData.note_type = 3;
      props.noteData.medical_type = 'TUE';
    });

    it('renders an expiration date picker', () => {
      renderWithUserEventSetup(<AddNoteModal {...props} />);
      expect(screen.getByText('Expiration Date')).toBeInTheDocument();
    });

    it('renders a name field', () => {
      renderWithUserEventSetup(<AddNoteModal {...props} />);
      expect(screen.getByLabelText('Name')).toBeInTheDocument();
    });
  });

  describe('when the note type is medical and medical type is Vaccination', () => {
    beforeEach(() => {
      props.noteData.note_type = 3;
      props.noteData.medical_type = 'Vaccination';
    });

    it('renders the vaccination related fields', () => {
      renderWithUserEventSetup(<AddNoteModal {...props} />);
      expect(screen.getByText('Expiration Date')).toBeInTheDocument();
      expect(screen.getByLabelText('Batch Number')).toBeInTheDocument();
      expect(screen.getByText('Renewal Date')).toBeInTheDocument();
    });

    it('renders a name field', () => {
      renderWithUserEventSetup(<AddNoteModal {...props} />);
      expect(screen.getByLabelText('Name')).toBeInTheDocument();
    });
  });

  describe('when the medication expiration date is changed', () => {
    beforeEach(() => {
      props.noteData.note_type = 3;
      props.noteData.medical_type = 'TUE';
    });

    it('calls the correct callback', () => {
      const testDate = moment('2019-04-15').toDate();
      renderWithUserEventSetup(<AddNoteModal {...props} />);
      const datePicker = screen.getByLabelText('Expiration Date');
      fireEvent.change(datePicker, { target: { value: '15/04/2019' } });
      expect(props.updateNoteExpDate).toHaveBeenCalledWith(testDate);
    });
  });

  describe('when the medication batch number is changed', () => {
    beforeEach(() => {
      props.noteData.note_type = 3;
      props.noteData.medical_type = 'Vaccination';
    });

    it('calls the correct callback', async () => {
      const { user } = renderWithUserEventSetup(<AddNoteModal {...props} />);
      await user.type(screen.getByLabelText('Batch Number'), 'Batch No 1234');
      fireEvent.blur(screen.getByLabelText('Batch Number'));
      expect(props.updateNoteBatchNumber).toHaveBeenLastCalledWith(
        'Batch No 1234'
      );
    });
  });

  describe('when the medication renewal date is changed', () => {
    beforeEach(() => {
      props.noteData.note_type = 3;
      props.noteData.medical_type = 'Vaccination';
    });

    it('calls the correct callback', () => {
      const testDate = moment('2019-04-15').toDate();
      renderWithUserEventSetup(<AddNoteModal {...props} />);
      const datePicker = screen.getByLabelText('Renewal Date');
      fireEvent.change(datePicker, { target: { value: '15/04/2019' } });
      expect(props.updateNoteRenewalDate).toHaveBeenCalledWith(testDate);
    });
  });

  describe('when the note text is changed', () => {
    it('calls the correct callback', async () => {
      const { user } = renderWithUserEventSetup(<AddNoteModal {...props} />);
      await user.type(
        screen.getByRole('textbox', { name: 'Notes' }),
        'This is a note.'
      );
      fireEvent.blur(screen.getByRole('textbox', { name: 'Notes' }));
      expect(props.updateNote).toHaveBeenLastCalledWith('This is a note.');
    });
  });

  describe('when the restrict note to doctors checkbox is checked', () => {
    it('calls the correct callback', async () => {
      const { user } = renderWithUserEventSetup(<AddNoteModal {...props} />);
      await user.click(screen.getByLabelText('Restrict note to Doctors'));
      expect(props.updateIsRestricted).toHaveBeenCalledWith(true);
    });
  });

  describe('when the flag mls-emr-psych-notes is on', () => {
    beforeEach(() => {
      window.featureFlags['mls-emr-psych-notes'] = true;
    });

    afterEach(() => {
      window.featureFlags['mls-emr-psych-notes'] = false;
    });

    it('shows a dropdown with the correct items', async () => {
      renderWithUserEventSetup(<AddNoteModal {...props} />);
      expect(screen.getByLabelText('Restrict access to')).toBeInTheDocument();
      expect(
        screen.getByRole('option', { name: 'Doctors' })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('option', { name: 'Psych Team' })
      ).toBeInTheDocument();
    });

    it('calls the correct actions when restricting to all', async () => {
      const { user } = renderWithUserEventSetup(<AddNoteModal {...props} />);
      await user.selectOptions(
        screen.getByLabelText('Restrict access to'),
        'all'
      );
      expect(props.updateIsRestricted).toHaveBeenCalledWith(false);
      expect(props.updatePsychOnly).toHaveBeenCalledWith(false);
    });

    it('calls the correct actions when restricting to Doctors', async () => {
      const { user } = renderWithUserEventSetup(<AddNoteModal {...props} />);
      await user.selectOptions(
        screen.getByLabelText('Restrict access to'),
        'isRestricted'
      );
      expect(props.updateIsRestricted).toHaveBeenCalledWith(true);
      expect(props.updatePsychOnly).toHaveBeenCalledWith(false);
    });

    it('calls the correct actions when restricting to Psych Team', async () => {
      const { user } = renderWithUserEventSetup(<AddNoteModal {...props} />);
      await user.selectOptions(
        screen.getByLabelText('Restrict access to'),
        'psychOnly'
      );
      expect(props.updateIsRestricted).toHaveBeenCalledWith(false);
      expect(props.updatePsychOnly).toHaveBeenCalledWith(true);
    });
  });
  describe('when the flag note-templates is on', () => {
    beforeEach(() => {
      window.featureFlags['note-templates'] = true;
    });

    afterEach(() => {
      window.featureFlags['note-templates'] = false;
    });

    it('shows a dropdown with the correct items', async () => {
      renderWithUserEventSetup(<AddNoteModal {...props} />);
      expect(screen.getByLabelText('Template')).toBeInTheDocument();
      expect(screen.getByRole('option', { name: 'SOAP' })).toBeInTheDocument();
      expect(
        screen.getByRole('option', { name: 'Postural assessment' })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('option', { name: 'Knee assessment' })
      ).toBeInTheDocument();
    });

    describe('when the SOAP template is selected', () => {
      it('calls props.updateNote with the correct text', async () => {
        const { user } = renderWithUserEventSetup(<AddNoteModal {...props} />);
        await user.selectOptions(screen.getByLabelText('Template'), 'soap');
        expect(props.updateNote).toHaveBeenCalledWith(
          'Subjective:\n\nObjective:\n\nAssessment:\n\nPlan:\n'
        );
      });
    });

    describe('when the Postural assessment template is selected', () => {
      it('calls props.updateNote with the correct text', async () => {
        const { user } = renderWithUserEventSetup(<AddNoteModal {...props} />);
        await user.selectOptions(screen.getByLabelText('Template'), 'postural');
        expect(props.updateNote).toHaveBeenCalledWith(
          'Head:\n\nShoulders:\n\nThoracic Spine:\n\nLumbar Spine:\n\nPelvis:\n\nHips:\n\nKnees:\n'
        );
      });
    });

    describe('when the Knee assessment template is selected', () => {
      it('calls props.updateNote with the correct text', async () => {
        const { user } = renderWithUserEventSetup(<AddNoteModal {...props} />);
        await user.selectOptions(screen.getByLabelText('Template'), 'knee');
        expect(props.updateNote).toHaveBeenCalledWith(
          `Passive Knee Extension:\n\nPassive Knee Flexion:\n\nActive Knee Extension:\n\nActive Knee Flexion:\n\nPatellar Tap:\n\nSweep Test:\n\nAnterior Drawer Test:\n\nPosterior Drawer Test::\n\nLachman’s Test:\n`
        );
      });
    });

    describe('when the clear option is selected', () => {
      it('shows a blank text on the text area', async () => {
        const { user } = renderWithUserEventSetup(<AddNoteModal {...props} />);
        await user.selectOptions(screen.getByLabelText('Template'), 'soap'); // Select a template first
        await user.click(screen.getByRole('button', { name: 'clear' })); // Click the clear button
        expect(screen.getByRole('textbox', { name: 'Notes' })).toHaveValue('');
      });
    });
  });

  describe('when the copy last note link is clicked', () => {
    it('calls the correct callback', async () => {
      const { user } = renderWithUserEventSetup(<AddNoteModal {...props} />);
      await user.click(screen.getByText('Copy last note'));
      expect(props.getLastNote).toHaveBeenCalledWith(props.athleteId);
    });
  });

  describe('when there are multiple files attached', () => {
    const date = new Date('Nov 20 2018');
    const dummyFileAttachment = {
      lastModified: 1542706027020,
      lastModifiedDate: date,
      name: 'sample.csv',
      size: 124625,
      type: 'text/csv',
      webkitRelativePath: '',
    };

    beforeEach(() => {
      props.noteData.note_type = 3;
      props.noteData.medical_type = 'Vaccination';
      props.attachments = [dummyFileAttachment];
    });

    it('renders the correct number of file upload field', async () => {
      renderWithUserEventSetup(<AddNoteModal {...props} />);
      expect(await screen.findAllByTestId('file-input')).toHaveLength(2);
    });
  });

  describe('when the request status is error', () => {
    it('renders an error message', async () => {
      renderWithUserEventSetup(
        <AddNoteModal
          {...props}
          requestStatus={{ status: 'error', message: 'No note to copy' }}
        />
      );
      expect(await screen.findByText('No note to copy')).toBeInTheDocument();
    });
  });
});
