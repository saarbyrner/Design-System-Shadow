import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import i18n from 'i18next';
import { setI18n } from 'react-i18next';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';

import ExternalAccessForm from '../ExternalAccessForm';
import {
  validateFormFields,
  validateAllFieldsWithErrors,
  validateFieldWithError,
} from '../utils';

jest.mock('axios');

const i18nT = i18nextTranslateStub();
setI18n(i18n);

describe('ExternalAccessForm Component', () => {
  const defaultProps = {
    t: i18nT,
    onFormChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders form with initial empty fields', () => {
    render(<ExternalAccessForm {...defaultProps} />);

    expect(screen.getByLabelText('First Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Last Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByText('Add')).toBeInTheDocument();
  });

  it('renders with pre-filled data', () => {
    const requests = [
      {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
      },
    ];

    render(<ExternalAccessForm {...defaultProps} requests={requests} />);
    expect(screen.getByLabelText('First Name')).toHaveValue('John');
    expect(screen.getByLabelText('Last Name')).toHaveValue('Doe');
    expect(screen.getByLabelText('Email')).toHaveValue('john@example.com');
  });

  it('can type external access user email', () => {
    render(<ExternalAccessForm {...defaultProps} />);
    const emailValue = 'john.doe@example.com';
    const emailField = screen.getByLabelText('Email');
    fireEvent.change(emailField, { target: { value: emailValue } });
    expect(screen.getByLabelText('Email')).toHaveValue(emailValue);
  });

  it('adds new request form when Add button is clicked', () => {
    render(<ExternalAccessForm {...defaultProps} />);
    const addButton = screen.getByText('Add');
    fireEvent.click(addButton);

    // Should have 2 sets of form fields
    expect(screen.getAllByLabelText('First Name')).toHaveLength(2);
    expect(screen.getAllByLabelText('Last Name')).toHaveLength(2);
    expect(screen.getAllByLabelText('Email')).toHaveLength(2);
  });

  it('disables Add button after 5 requests', () => {
    render(<ExternalAccessForm {...defaultProps} />);

    const addButton = screen.getByText('Add');

    // Click 4 times (total 5)
    for (let i = 0; i < 4; i++) {
      fireEvent.click(addButton);
    }

    expect(addButton).toBeDisabled();
  });

  it('deletes request form when delete button is clicked', () => {
    render(<ExternalAccessForm {...defaultProps} />);

    fireEvent.click(screen.getByText('Add'));

    // Find and click delete button
    const deleteButtons = screen.getAllByRole('button')[0];
    fireEvent.click(deleteButtons);
    expect(screen.getByLabelText('First Name')).toBeInTheDocument();
  });

  it('validates fields on blur', async () => {
    render(<ExternalAccessForm {...defaultProps} />);

    const firstNameInput = screen.getByLabelText('First Name');
    firstNameInput.focus();
    fireEvent.blur(firstNameInput);

    // Empty field should show error
    expect(firstNameInput).toHaveAttribute('aria-invalid', 'true');
  });

  it('calls onFormChange when form data changes', () => {
    render(<ExternalAccessForm {...defaultProps} />);
    const firstNameInput = screen.getByLabelText('First Name');
    fireEvent.change(firstNameInput, { target: { value: 'John' } });
    expect(defaultProps.onFormChange).toHaveBeenCalled();
  });

  it('form reference checkFormValidation works correctly', () => {
    const ref = React.createRef();
    render(<ExternalAccessForm {...defaultProps} ref={ref} />);
    expect(ref.current.checkFormValidation()).toBe(false); // Should be false with empty fields
    // Fill in all required fields
    const inputs = {
      'First Name': 'John',
      'Last Name': 'Doe',
      Email: 'john@example.com',
    };

    Object.entries(inputs).forEach(([label, value]) => {
      fireEvent.change(screen.getByLabelText(label), { target: { value } });
    });
    expect(ref.current.checkFormValidation()).toBe(true);
  });
});

describe('Validation Utils', () => {
  describe('validateFormFields', () => {
    it('validates empty fields', () => {
      const fields = {
        firstName: '',
        lastName: '',
        email: '',
      };

      const result = validateFormFields(fields);
      expect(result).toEqual({
        firstName: true,
        lastName: true,
        email: true,
      });
    });

    it('validates filled fields', () => {
      const fields = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
      };

      const result = validateFormFields(fields);
      expect(result).toEqual({
        firstName: false,
        lastName: false,
        email: false,
      });
    });

    it('validates specific field only', () => {
      const fields = {
        firstName: 'John',
        lastName: '',
        email: '',
      };

      const result = validateFormFields(fields, { firstName: 'John' });
      expect(result).toEqual({
        firstName: false,
      });
    });
  });

  describe('validateAllFieldsWithErrors', () => {
    it('validates multiple forms', () => {
      const forms = [
        { firstName: 'John', lastName: 'Doe', email: 'john@example.com' },
        { firstName: '', lastName: '', email: '' },
      ];

      const result = validateAllFieldsWithErrors(forms);
      expect(result).toEqual([
        { firstName: false, lastName: false, email: false },
        { firstName: true, lastName: true, email: true },
      ]);
    });
  });

  describe('validateFieldWithError', () => {
    it('validates single field and updates error array', () => {
      const field = { firstName: '' };
      const index = 0;
      const errorArray = [];
      const result = validateFieldWithError(field, index, errorArray);
      expect(result[0]).toEqual({ firstName: true });
    });

    it('merges with existing errors', () => {
      const field = { firstName: 'John' };
      const index = 0;
      const errorArray = [{ lastName: true, email: true }];
      const result = validateFieldWithError(field, index, errorArray);
      expect(result[0]).toEqual({
        firstName: false,
        lastName: true,
        email: true,
      });
    });
  });
});
