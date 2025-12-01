import { render, screen } from '@testing-library/react';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import userEvent from '@testing-library/user-event';
import EditableInput from '../index';

describe('<EditableInput />', () => {
  const props = {
    value: '',
    onSubmit: jest.fn(),
    t: i18nextTranslateStub(),
  };

  it('renders a button if the value is null', () => {
    render(<EditableInput {...props} />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('renders the value if it is given', () => {
    const testValue = 'Test Value';

    render(<EditableInput {...props} value={testValue} />);
    expect(
      screen.getByRole('button', { name: 'Test Value' })
    ).toBeInTheDocument();
  });

  it('sets the mode to edit when clicking on the value', async () => {
    render(<EditableInput {...props} />);
    await userEvent.click(screen.getByRole('button'));
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('calls the correct action when submitting changes', async () => {
    render(<EditableInput {...props} />);
    await userEvent.click(screen.getByRole('button'));
    await userEvent.type(screen.getByRole('textbox'), 'New Test Value');
    await userEvent.click(screen.getAllByRole('button')[0]);
    expect(props.onSubmit).toHaveBeenCalledWith('New Test Value');
  });

  it('trims the input value when submitting changes', async () => {
    render(<EditableInput {...props} />);
    await userEvent.click(screen.getByRole('button'));
    await userEvent.type(screen.getByRole('textbox'), ' New Test Value ');
    await userEvent.click(screen.getAllByRole('button')[0]);
    expect(props.onSubmit).toHaveBeenCalledWith('New Test Value');
  });

  it('does not submit changes when editing is cancelled', async () => {
    render(<EditableInput {...props} />);
    await userEvent.click(screen.getByRole('button'));
    expect(screen.getByRole('textbox')).toBeInTheDocument();

    await userEvent.click(screen.getAllByRole('button')[1]);
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
  });

  it('disables the buttons when isDisabled is true', () => {
    render(<EditableInput {...props} isDisabled />);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('disables the buttons when isDisabled is true and a value is set', () => {
    render(<EditableInput {...props} inputValue="Current Value" isDisabled />);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  describe('when only numbers are allowed to be entered', () => {
    it('does not allow saving non-numeric values', async () => {
      render(<EditableInput {...props} allowOnlyNumbers />);
      await userEvent.click(screen.getByRole('button'));
      await userEvent.type(screen.getByRole('textbox'), 'New Test Value');
      await userEvent.click(screen.getAllByRole('button')[0]);
      expect(props.onSubmit).not.toHaveBeenCalledWith('New Test Value');
    });

    it('allows saving numeric values', async () => {
      render(<EditableInput {...props} allowOnlyNumbers />);
      await userEvent.click(screen.getByRole('button'));
      await userEvent.type(screen.getByRole('textbox'), '1234');
      await userEvent.click(screen.getAllByRole('button')[0]);
      expect(props.onSubmit).toHaveBeenCalledWith('1234');
    });
  });

  describe('when only numbers or letters are allowed to be entered', () => {
    it('allow saving word values', async () => {
      render(<EditableInput {...props} allowOnlyAlphanumeric />);
      await userEvent.click(screen.getByRole('button'));
      await userEvent.type(screen.getByRole('textbox'), 'New Test Value');
      await userEvent.click(screen.getAllByRole('button')[0]);
      expect(props.onSubmit).toHaveBeenCalledWith('New Test Value');
    });

    it('allows saving numeric values', async () => {
      render(<EditableInput {...props} allowOnlyAlphanumeric />);
      await userEvent.click(screen.getByRole('button'));
      await userEvent.type(screen.getByRole('textbox'), '1234');
      await userEvent.click(screen.getAllByRole('button')[0]);
      expect(props.onSubmit).toHaveBeenCalledWith('1234');
    });

    it('does not allow saving non alphanumeric values', async () => {
      render(<EditableInput {...props} allowOnlyAlphanumeric />);
      await userEvent.click(screen.getByRole('button'));
      await userEvent.type(screen.getByRole('textbox'), '!!....!!');
      await userEvent.click(screen.getAllByRole('button')[0]);
      expect(props.onSubmit).not.toHaveBeenCalledWith('!!....!!');
    });
  });

  describe('when max length is defined', () => {
    it('does not allow saving values longer than the max length', async () => {
      render(<EditableInput {...props} maxLength={3} />);
      await userEvent.click(screen.getByRole('button'));
      await userEvent.type(screen.getByRole('textbox'), 'value');
      await userEvent.click(screen.getAllByRole('button')[0]);
      expect(props.onSubmit).not.toHaveBeenCalled();
    });
  });

  describe('when an empty value is allowed', () => {
    it('saves the input with empty value', async () => {
      render(<EditableInput {...props} allowSavingEmpty />);
      await userEvent.click(screen.getByRole('button'));
      await userEvent.clear(screen.getByRole('textbox'));
      await userEvent.click(screen.getAllByRole('button')[0]);
      expect(props.onSubmit).toHaveBeenCalledWith('');
    });
  });

  describe('when the renderContent prop is supplied', () => {
    it('renders a custom component and passes the value and onclick', async () => {
      const renderContent = ({ value, onClick }) => {
        return (
          <button
            data-testid="EditableInput|MyContent"
            onClick={onClick}
            type="button"
          >
            {value}
          </button>
        );
      };
      render(
        <EditableInput
          {...props}
          value="My content"
          renderContent={renderContent}
        />
      );

      expect(screen.getByTestId('EditableInput|MyContent')).toBeInTheDocument();
      await userEvent.click(screen.getByTestId('EditableInput|MyContent'));
      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });
  });
});
