import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { setI18n } from 'react-i18next';
import i18n from '@kitman/common/src/utils/i18n';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import {
  annotation,
  noteTypeOptions,
  athleteOptions,
} from '../resources/AnnotationDummyData';
import AnnotationModal from '../index';

jest.mock('@kitman/components', () => {
  const actualMoment = jest.requireActual('moment-timezone');
  return {
    ActionCheckbox: jest.fn((props) => (
      <div data-testid="mock-action-checkbox" onClick={props.onToggle} aria-checked={props.isChecked} role="checkbox" tabIndex="0">
        {props.id}
      </div>
    )),
    DatePicker: jest.fn((props) => {
      return (
        <input
          data-testid="mock-date-picker"
          value={props.value || ''}
          onChange={(e) => {
            const dateValue = e.target.value ? actualMoment(e.target.value) : null;
            props.onDateChange(dateValue);
          }}
          min={props.minDate}
          max={props.maxDate}
        />
      );
    }),
    Dropdown: jest.fn((props) => (
      <>
        <label htmlFor={`mock-dropdown-${props.label}`}>{props.label}</label>
        <select id={`mock-dropdown-${props.label}`} data-testid="mock-dropdown" onChange={(e) => props.onChange(e.target.value)} value={props.value || ''} disabled={props.disabled}>
          {props.items.map((item) => (
            <option key={item.id} value={item.id}>{item.title}</option>
          ))}
        </select>
      </>
    )),
    FormValidator: jest.fn((props) => (
      <div data-testid="mock-form-validator">
        {props.children}
        <button data-testid="mock-form-validator-success-button" onClick={props.successAction} type="button">Submit</button>
      </div>
    )),
    FileUploadArea: jest.fn((props) => (
      <div data-testid="mock-file-upload-area">
        <input type="file" data-testid="mock-file-input" onChange={(e) => props.onUpdateFiles(e.target.files)} />
        {props.files.map((file) => (
          <div key={file.name} data-testid={`mock-uploaded-file-${file.name}`}>
            {file.name}
            <button onClick={() => props.onRemoveUploadedFile(file.name)} type="button">Remove</button>
          </div>
        ))}
      </div>
    )),
    RichTextEditor: jest.fn((props) => (
      <textarea data-testid="mock-rich-text-editor" value={props.value} onChange={(e) => props.onChange(e.target.value)} />
    )),
    IconButton: jest.fn((props) => (
      <button data-testid="mock-icon-button" onClick={props.onClick} type="button">{props.icon}</button>
    )),
    MultiSelectDropdown: jest.fn((props) => (
      <div data-testid="mock-multi-select-dropdown">
        <label>{props.label}</label>
        <div data-testid="mock-multi-select-dropdown-header">
          {props.selectedItems.length > 0 ? props.listItems.find(item => item.id === props.selectedItems[0])?.name : ''}
        </div>
        {props.listItems.map((item) => (
          <button
            key={item.id}
            data-testid={`mock-multi-select-dropdown-option-${item.id}`}
            onClick={() => props.onItemSelect({ id: item.id, checked: true })}
            type="button"
          >
            {item.name}
          </button>
        ))}
      </div>
    )),
    Textarea: jest.fn((props) => (
      <>
        <label htmlFor={`mock-textarea-${props.label}`}>{props.label}</label>
        <textarea id={`mock-textarea-${props.label}`} data-testid="mock-textarea" value={props.value} onChange={(e) => props.onChange(e.target.value, 0)} />
      </>
    )),
    TextButton: jest.fn((props) => (
      <button data-testid="mock-text-button" onClick={props.onClick} type="button">{props.text}</button>
    )),
    InputText: jest.fn((props) => (
      <input data-testid="mock-input-text" value={props.value || ''} onChange={(e) => props.onValidation({ value: e.target.value })} />
    )),
    LegacyModal: jest.fn((props) => (
      <div data-testid="mock-modal">
        {props.children}
        <button data-testid="mock-modal-close-button" onClick={props.close} type="button">Close</button>
      </div>
    )),
    AnnotationActions: jest.fn(() => (
      <div data-testid="mock-annotation-actions" />
    )),
    AnnotationActionsTranslated: jest.fn(() => (
      <div data-testid="mock-annotation-actions-translated" />
    )),
  };
});

setI18n(i18n);

const defaultProps = {
  annotation: {
    ...annotation(),
  },
  athletes: [...athleteOptions()],
  onTypeChange: jest.fn(),
  onSaveAnnotation: jest.fn(),
  onEditAnnotation: jest.fn(),
  widgetAnnotationTypes: [
    {
      organisation_annotation_type_id: 1,
    },
  ],
  annotationTypes: [...noteTypeOptions()],
  modalType: 'ADD_NEW',
  timeRange: {
    start_time: '2019-01-29T00:00:00.000+00:00',
    end_time: '2020-01-30T23:59:59.000+00:00',
  },
  isTextOptional: false,
  onUpdateFiles: jest.fn(),
  onRemoveUploadedFile: jest.fn(),
  t: i18nextTranslateStub(),
};

const renderWithState = (initialAnnotation, props) => {
  const Wrapper = () => {
    const [currentAnnotation, setCurrentAnnotation] = React.useState(initialAnnotation);

    const handleTypeChange = (newType) => {
      setCurrentAnnotation((prev) => ({ ...prev, annotation_type_id: newType }));
      props.onTypeChange(newType);
    };

    const handleSaveAnnotation = () => {
      props.onSaveAnnotation();
    };

    const handleEditAnnotation = () => {
      props.onEditAnnotation();
    };

    const handleUpdateFiles = (files) => {
      setCurrentAnnotation((prev) => ({ ...prev, unUploadedFiles: [...prev.unUploadedFiles, ...files] }));
      props.onUpdateFiles(files);
    };

    const handleRemoveUploadedFile = (index) => {
      const newFiles = currentAnnotation.unUploadedFiles.filter((_, i) => i !== index);
      setCurrentAnnotation((prev) => ({ ...prev, unUploadedFiles: newFiles }));
      props.onRemoveUploadedFile(index);
    };

    return (
      <AnnotationModal
        {...props}
        annotation={currentAnnotation}
        onTypeChange={handleTypeChange}
        onSaveAnnotation={handleSaveAnnotation}
        onEditAnnotation={handleEditAnnotation}
        onUpdateFiles={handleUpdateFiles}
        onRemoveUploadedFile={handleRemoveUploadedFile}
      />
    );
  };
  return render(<Wrapper />);
};


describe('<AnnotationModal />', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    defaultProps.onTypeChange.mockClear();
    defaultProps.onSaveAnnotation.mockClear();
    defaultProps.onEditAnnotation.mockClear();
    defaultProps.onUpdateFiles.mockClear();
    defaultProps.onRemoveUploadedFile.mockClear();
  });

  test('renders', () => {
    renderWithState(defaultProps.annotation, defaultProps);
    expect(screen.getByTestId('mock-input-text')).toHaveValue('Notes title');
    expect(screen.getByLabelText('Note text')).toHaveValue('Notes note');
  });

  test('renders the actions section', () => {
    renderWithState(defaultProps.annotation, defaultProps);
    expect(screen.getByTestId('annotation-actions')).toBeInTheDocument();
  });

  test('does not render the actions section when type is not Evaluation', () => {
    const notEvalNote = {
      ...defaultProps.annotation,
      annotation_type_id: 9000,
    };
    renderWithState(notEvalNote, defaultProps);
    expect(screen.queryByTestId('annotation-actions')).not.toBeInTheDocument();
  });

  test('calls the correct action when the type is changed', () => {
    renderWithState(defaultProps.annotation, defaultProps);
    const dropdown = screen.getAllByTestId('mock-dropdown')[0];
    fireEvent.change(dropdown, { target: { value: '1' } });
    expect(defaultProps.onTypeChange).toHaveBeenCalledWith('1');
  });

  test('calls the correct action when the note is saved', () => {
    renderWithState(defaultProps.annotation, defaultProps);
    const submitButton = screen.getByTestId('mock-form-validator-success-button');
    fireEvent.click(submitButton);
    expect(defaultProps.onSaveAnnotation).toHaveBeenCalledTimes(1);
  });

  describe('when modalType is EDIT', () => {
    beforeEach(() => {
      defaultProps.modalType = 'EDIT';
    });

    afterEach(() => {
      defaultProps.modalType = 'ADD_NEW';
    });

    test('disables the note type field', () => {
      renderWithState(defaultProps.annotation, { ...defaultProps, modalType: 'EDIT' });
      const dropdown = screen.getAllByTestId('mock-dropdown')[0];
      expect(dropdown).toBeDisabled();
    });

    test('calls the correct callback when save is clicked', () => {
      renderWithState(defaultProps.annotation, { ...defaultProps, modalType: 'EDIT' });
      const submitButton = screen.getByTestId('mock-form-validator-success-button');
      fireEvent.click(submitButton);
      expect(defaultProps.onEditAnnotation).toHaveBeenCalledTimes(1);
    });
  });

  describe('when optionalText is true', () => {
    beforeEach(() => {
      defaultProps.isTextOptional = true;
    });

    afterEach(() => {
      defaultProps.isTextOptional = false;
    });

    test('ignores the text input on validation', () => {
      renderWithState(defaultProps.annotation, { ...defaultProps, isTextOptional: true });
      // eslint-disable-next-line global-require
      const FormValidatorMock = require('@kitman/components').FormValidator;
      expect(FormValidatorMock).toHaveBeenCalledWith(
        expect.objectContaining({
          inputNamesToIgnore: expect.arrayContaining(['annotation_textarea']),
        }),
        {}
      );
    });
  });

  describe('when the note is general type', () => {
    beforeEach(() => {
      defaultProps.annotation.annotation_type_id = 2;
    });

    afterEach(() => {
      defaultProps.annotation.annotation_type_id = annotation().annotation_type_id;
    });

    test('renders a file upload area', () => {
      renderWithState(defaultProps.annotation, defaultProps);
      expect(screen.getByTestId('mock-file-upload-area')).toBeInTheDocument();
    });

    test('does not render a file upload field when the type is not general note', () => {
      const notGeneralNote = {
        ...defaultProps.annotation,
        annotation_type_id: 9000,
      };
      renderWithState(notGeneralNote, defaultProps);
      expect(screen.queryByTestId('mock-file-upload-area')).not.toBeInTheDocument();
    });
  });

  describe('when the customMinDate property is given', () => {
    test('uses customMinDate as minDate on the Datepicker', () => {
      const customMinDate = '2020-04-08T23:00:00Z';
      renderWithState(defaultProps.annotation, { ...defaultProps, customMinDate });
      const datePicker = screen.getAllByTestId('mock-date-picker')[0];
      expect(datePicker).toHaveAttribute('min', customMinDate);
    });
  });

  describe('when the customMaxDate property is given', () => {
    test('uses customMaxDate as maxDate on the Datepicker', () => {
      const customMaxDate = '2020-04-08T23:00:00Z';
      renderWithState(defaultProps.annotation, { ...defaultProps, customMaxDate });
      const datePicker = screen.getAllByTestId('mock-date-picker')[0];
      expect(datePicker).toHaveAttribute('max', customMaxDate);
    });
  });

  describe('when the rich-text-editor feature flag is enabled', () => {
    beforeEach(() => {
      window.featureFlags['rich-text-editor'] = true;
    });

    afterEach(() => {
      window.featureFlags['rich-text-editor'] = false;
    });

    test('renders a rich text editor', () => {
      renderWithState(defaultProps.annotation, defaultProps);
      expect(screen.getByTestId('mock-rich-text-editor')).toBeInTheDocument();
    });
  });
});
