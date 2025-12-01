import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  Checkbox,
  DropdownWrapper,
  GroupedDropdown,
  MultiSelect,
  InputNumeric,
  Textarea,
} from '@kitman/components';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import FormValidator from '../index';

const dropdownProps = {
  options: [{ name: 'Option 1' }, { name: 'Option 2' }, { name: 'Option 3' }],
  onChange: jest.fn(),
};

const textareaProps = {
  name: 'my_textarea',
  minLimit: 1,
  maxLimit: 40,
  onChange: jest.fn(),
  t: i18nextTranslateStub(),
};

const checkboxProps = {
  name: 'my_checkbox',
  toggle: jest.fn(),
};

const multiSelectBase = {
  name: 'my_multiselect',
  items: [
    { id: 'item_1', title: 'Item 1', description: 'Select all Item 1' },
    { id: 'item_2', title: 'Item 2', description: 'Select all Item 2' },
    { id: 'item_3', title: 'Item 3' },
  ],
  onChange: jest.fn(),
};

const renderForm = (children, props = {}) =>
  render(
    <FormValidator {...props}>
      {children}
      <button type="submit">Submit</button>
    </FormValidator>
  );

const renderNumericInput = (overrides = {}, formProps = {}) =>
  renderForm(
    <input
      name={overrides.name ?? 'numeric'}
      value={overrides.value ?? 9999}
      min={overrides.min ?? 1}
      max={overrides.max ?? 10}
      data-minlimit={overrides['data-minlimit'] ?? '1'}
      data-maxlimit={overrides['data-maxlimit'] ?? '10'}
      onChange={overrides.onChange ?? (() => {})}
      {...overrides}
    />,
    formProps
  );

const renderBaseForm = (extraFields = [], formProps = {}) =>
  renderForm(
    <>
      <input name="b" defaultValue="y" />
      <Textarea {...textareaProps} value="Ok text" />
      <Checkbox {...checkboxProps} isChecked />
      <MultiSelect {...multiSelectBase} selectedItems={['item_1']} />
      {extraFields.map((field, index) =>
        React.cloneElement(field, {
          key: field.props?.name ?? `extra-${index}`,
        })
      )}
    </>,
    formProps
  );

describe('FormValidator Component', () => {
  it('Renders children elements', () => {
    renderBaseForm([
      <input name="a" defaultValue="x" />,
      <GroupedDropdown {...dropdownProps} />,
    ]);
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
    expect(screen.getAllByRole('textbox').length).toBeGreaterThan(0);
  });

  it('Validates false working', async () => {
    const validateMock = jest.fn();
    renderBaseForm(
      [<input name="a" />, <GroupedDropdown {...dropdownProps} />],
      { validate: validateMock }
    );
    await userEvent.click(screen.getByRole('button', { name: /submit/i }));
    expect(validateMock).toHaveBeenCalledTimes(1);
    expect(validateMock).toHaveBeenCalledWith(false);
  });

  it('Validates false when textarea below minLimit', async () => {
    const validateMock = jest.fn();
    renderForm(
      <>
        <Textarea {...textareaProps} value="" />
        <MultiSelect {...multiSelectBase} />
      </>,
      { validate: validateMock }
    );
    await userEvent.click(screen.getByRole('button'));
    expect(validateMock).toHaveBeenCalledWith(false);
  });

  it('Does not validate the checkbox if it is part of a checkbox group', async () => {
    const validateMock = jest.fn();
    renderForm(
      <>
        <div className="checkboxGroup">
          <Checkbox {...checkboxProps} isChecked={false} />
        </div>
      </>,
      { validate: validateMock }
    );
    await userEvent.click(screen.getByRole('button'));
    expect(validateMock).toHaveBeenCalledWith(true);
  });

  it('Validates true working', async () => {
    const validateMock = jest.fn();
    renderBaseForm(
      [
        <input name="first" defaultValue="test" />,
        <input name="second" defaultValue="test" />,
      ],
      { validate: validateMock }
    );
    await userEvent.click(screen.getByRole('button'));
    expect(validateMock).toHaveBeenCalledWith(true);
  });

  it('adds an error class when the validation fails', async () => {
    renderForm(
      <>
        <input name="input1" />
        <Textarea
          {...textareaProps}
          value="This textarea sample text is exceeding the character limit."
        />
        <Checkbox {...checkboxProps} isChecked={false} />
        <GroupedDropdown {...dropdownProps} />
        <MultiSelect {...multiSelectBase} />
        <DropdownWrapper customClass="dropdownWrapper--validationFailure" />
        <InputNumeric onChange={() => {}} name="numeric" />
      </>
    );

    await userEvent.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      const namedInput = document.querySelector('input[name="input1"]');
      expect(namedInput).not.toBeNull();
      expect(namedInput.className).toMatch(/km-error/);

      const textarea = document.querySelector('textarea');
      expect(textarea).not.toBeNull();
      expect(textarea.className).toMatch(/km-error/);

      const checkboxRoot = document.querySelector('.reactCheckbox');
      expect(checkboxRoot).not.toBeNull();
      expect(checkboxRoot.className).toMatch(/km-error/);

      const grouped = document.querySelector('.groupedDropdown');
      expect(grouped).not.toBeNull();
      expect(grouped.className).toMatch(/hasError/);
    });
  });

  it('Does not validate the ignored input', async () => {
    const validateMock = jest.fn();
    renderForm(
      <input
        name="Ignored Input Name"
        value="12"
        data-minlimit="1"
        data-maxlimit="10"
      />,
      { validate: validateMock, inputNamesToIgnore: ['Ignored Input Name'] }
    );
    await userEvent.click(screen.getByRole('button'));
    expect(validateMock).toHaveBeenCalledWith(true);
    const ignoredInput = document.querySelector(
      'input[name="Ignored Input Name"]'
    );
    expect(ignoredInput.className).not.toMatch(/km-error/);
  });

  it('Does not remove a class from an ignored input', async () => {
    const validateMock = jest.fn();
    renderForm(
      <input
        name="Ignored Input Name"
        value="12"
        data-minlimit="1"
        data-maxlimit="10"
        className="km-error"
      />,
      { validate: validateMock, inputNamesToIgnore: ['Ignored Input Name'] }
    );
    await userEvent.click(screen.getByRole('button'));
    const ignoredInput = document.querySelector(
      'input[name="Ignored Input Name"]'
    );
    expect(ignoredInput.className).toMatch(/km-error/);
  });

  it('Runs the custom validation and `false` overrides internal validation', async () => {
    const validateMock = jest.fn();
    const customValidation = jest.fn(() => false);
    renderForm(
      <>
        <input name="ok" defaultValue="value" />
        <Textarea {...textareaProps} value="Valid sample text" />
      </>,
      { validate: validateMock, customValidation }
    );
    await userEvent.click(screen.getByRole('button'));
    expect(customValidation).toHaveBeenCalled();
    expect(validateMock).toHaveBeenCalledWith(false);
  });

  it('Runs the custom validation and `true` does not override internal invalid field', async () => {
    const validateMock = jest.fn();
    const customValidation = jest.fn(() => true);
    renderForm(
      <>
        <Textarea {...textareaProps} value="" />
      </>,
      { validate: validateMock, customValidation }
    );
    await userEvent.click(screen.getByRole('button'));
    expect(customValidation).not.toHaveBeenCalled();
    expect(validateMock).toHaveBeenCalledWith(false);
  });

  it('validates numeric input min/max (adds error when out of bounds)', async () => {
    renderNumericInput({ value: 20 });
    await userEvent.click(screen.getByRole('button'));
    const numeric = document.querySelector('input[name="numeric"]');
    expect(numeric.className).toMatch(/km-error/);
  });

  it('passes numeric input within bounds', async () => {
    const validateMock = jest.fn();
    renderNumericInput({ value: 5 }, { validate: validateMock });

    await userEvent.click(screen.getByRole('button'));
    expect(validateMock).toHaveBeenCalledWith(true);
  });
});
