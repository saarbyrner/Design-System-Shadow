import { screen } from '@testing-library/react';
import {
  i18nextTranslateStub,
  renderWithUserEventSetup,
} from '@kitman/common/src/utils/test_utils';
import { useExportSettings } from '../../../Context';
import Checkbox from '../Checkbox';

jest.mock('../../../Context', () => ({
  ...jest.requireActual('../../../Context'),
  useExportSettings: jest.fn(),
}));

const defaultProps = {
  fieldKey: 'testCheckbox',
  label: 'Test Checkbox',
  t: i18nextTranslateStub(),
};

const renderComponent = (props = defaultProps, formState = {}) => {
  useExportSettings.mockReturnValue({
    formState,
    setFieldValue: jest.fn(),
  });
  return renderWithUserEventSetup(<Checkbox {...props} />);
};

describe('Checkbox', () => {
  it('renders the checkbox with the correct label', () => {
    renderComponent();
    expect(screen.getByLabelText('Test Checkbox')).toBeInTheDocument();
  });

  it('is unchecked by default when defaultValue is false or not provided', () => {
    renderComponent();
    expect(screen.getByLabelText('Test Checkbox')).not.toBeChecked();
  });

  it('is checked when defaultValue is true', () => {
    renderComponent({ ...defaultProps, defaultValue: true });
    expect(screen.getByLabelText('Test Checkbox')).toBeChecked();
  });

  it('is checked when formState has a true value for the fieldKey', () => {
    renderComponent(defaultProps, { testCheckbox: true });
    expect(screen.getByLabelText('Test Checkbox')).toBeChecked();
  });

  it('calls setFieldValue with the correct value when clicked', async () => {
    const setFieldValueSpy = jest.fn();
    useExportSettings.mockReturnValue({
      formState: { testCheckbox: false },
      setFieldValue: setFieldValueSpy,
    });
    const { user, rerender } = renderWithUserEventSetup(
      <Checkbox {...defaultProps} />
    );

    await user.click(screen.getByLabelText('Test Checkbox'));
    expect(setFieldValueSpy).toHaveBeenCalledWith('testCheckbox', true, false);

    useExportSettings.mockReturnValue({
      formState: { testCheckbox: true },
      setFieldValue: setFieldValueSpy,
    });
    rerender(<Checkbox {...defaultProps} />);

    await user.click(screen.getByLabelText('Test Checkbox'));
    expect(setFieldValueSpy).toHaveBeenCalledWith('testCheckbox', false, false);
  });

  it('calls setFieldValue with isCached true when isCached prop is true', async () => {
    const setFieldValueSpy = jest.fn();
    useExportSettings.mockReturnValue({
      formState: { testCheckbox: false },
      setFieldValue: setFieldValueSpy,
    });
    const { user, rerender } = renderWithUserEventSetup(
      <Checkbox {...defaultProps} isCached />
    );

    await user.click(screen.getByLabelText('Test Checkbox'));
    expect(setFieldValueSpy).toHaveBeenCalledWith('testCheckbox', true, true);

    useExportSettings.mockReturnValue({
      formState: { testCheckbox: true },
      setFieldValue: setFieldValueSpy,
    });
    rerender(<Checkbox {...defaultProps} isCached />);

    await user.click(screen.getByLabelText('Test Checkbox'));
    expect(setFieldValueSpy).toHaveBeenCalledWith('testCheckbox', false, true);
  });
});
