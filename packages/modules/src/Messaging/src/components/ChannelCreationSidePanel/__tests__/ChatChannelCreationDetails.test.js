import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import ChatChannelCreationDetails from '../ChatChannelCreationDetails';

jest.mock('@kitman/components', () => ({
  FormValidator: ({ children, successAction = () => {} }) => (
    <div>
      {children}
      <button
        type="button"
        data-testid="manual-submit"
        onClick={successAction}
      />
    </div>
  ),
  InputText: ({
    value = '',
    onValidation = () => {},
    label = '',
    customValidations = [],
  }) => (
    <div>
      <label htmlFor={label}>{label}</label>
      <input
        id={label}
        value={value}
        onChange={(e) => {
          const validationResult = customValidations[0]
            ? customValidations[0](e.target.value)
            : { isValid: true };
          onValidation({ value: e.target.value, ...validationResult });
        }}
      />
    </div>
  ),
  TextButton: ({
    text = '',
    onClick = () => {},
    isSubmit = false,
    isDisabled = false,
  }) => (
    <button
      type={isSubmit ? 'submit' : 'button'}
      onClick={onClick}
      disabled={isDisabled}
    >
      {text}
    </button>
  ),
  ToggleSwitch: ({ label = '', toggle = () => {}, isSwitchedOn = false }) => (
    <div>
      <label htmlFor={label}>{label}</label>
      <input
        id={label}
        type="checkbox"
        onChange={toggle}
        checked={isSwitchedOn}
      />
    </div>
  ),
}));

describe('<ChatChannelCreationDetails /> component', () => {
  const baseProps = {
    onCreate: jest.fn(),
    onStepBack: jest.fn(),
    channelNameValidation: () => ({ isvalid: true }),
    t: i18nextTranslateStub(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calls onCreate with correct data when only athletes can send', async () => {
    const user = userEvent.setup();
    render(
      <ChatChannelCreationDetails
        {...baseProps}
        staffCanSend={false}
        athletesCanSend
      />
    );

    fireEvent.change(screen.getByLabelText('Channel name'), {
      target: { value: 'Athlete Channel' },
    });
    fireEvent.change(screen.getByLabelText('Description'), {
      target: { value: 'For athletes' },
    });

    await user.click(screen.getByTestId('manual-submit'));

    expect(baseProps.onCreate).toHaveBeenCalledWith(
      'Athlete Channel',
      'For athletes',
      false, // staffCanSend
      true // athletesCanSend
    );
  });

  it('calls onCreate with correct data when staff and athletes can send', async () => {
    const user = userEvent.setup();
    render(<ChatChannelCreationDetails {...baseProps} />);

    fireEvent.change(screen.getByLabelText('Channel name'), {
      target: { value: 'Test Channel' },
    });
    fireEvent.change(screen.getByLabelText('Description'), {
      target: { value: 'Test Description' },
    });

    await user.click(screen.getByLabelText('Athletes can send messages'));

    await user.click(screen.getByTestId('manual-submit'));

    expect(baseProps.onCreate).toHaveBeenCalledWith(
      'Test Channel',
      'Test Description',
      true, // staffCanSend (default is true)
      false // athletesCanSend (we unchecked it)
    );
  });

  it('calls the onStepBack callback when the back button is clicked', async () => {
    const user = userEvent.setup();
    render(<ChatChannelCreationDetails {...baseProps} />);

    await user.click(screen.getByRole('button', { name: 'Back' }));

    expect(baseProps.onStepBack).toHaveBeenCalledTimes(1);
  });

  it('disables the submit button if the channel name is invalid', () => {
    const invalidValidation = () => ({ isValid: false });
    render(
      <ChatChannelCreationDetails
        {...baseProps}
        channelNameValidation={invalidValidation}
      />
    );

    fireEvent.change(screen.getByLabelText('Channel name'), {
      target: { value: 'bad' },
    });

    expect(
      screen.getByRole('button', { name: 'Create Channel' })
    ).toBeDisabled();
  });
});
