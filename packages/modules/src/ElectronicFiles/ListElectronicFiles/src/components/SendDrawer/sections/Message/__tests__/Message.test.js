import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { Provider } from 'react-redux';
import { storeFake } from '@kitman/common/src/utils/renderWithRedux';
import { mockState } from '@kitman/modules/src/ElectronicFiles/shared/services/mocks/data/mockData.mock';
import Message from '@kitman/modules/src/ElectronicFiles/ListElectronicFiles/src/components/SendDrawer/sections/Message';

const mockHandleChange = jest.fn();
const props = {
  handleChange: mockHandleChange,
  t: i18nextTranslateStub(),
};

const store = storeFake({
  sendDrawerSlice: mockState.sendDrawerSlice,
});

const renderComponent = () =>
  render(
    <Provider store={store}>
      <Message {...props} />
    </Provider>
  );

describe('Message section', () => {
  it('renders correctly', () => {
    renderComponent();

    expect(screen.getByLabelText('Message')).toBeInTheDocument();
    expect(screen.getByLabelText('Subject')).toBeInTheDocument();
    expect(screen.getByLabelText('Include cover page')).toBeInTheDocument();
  });

  it('calls updateData when subject is being populated', async () => {
    renderComponent();

    const subjectText = 'dummy subject';
    const messageInput = screen.getByLabelText('Subject');

    await fireEvent.change(messageInput, {
      target: { value: subjectText },
    });

    expect(mockHandleChange).toHaveBeenCalledTimes(1);
    expect(mockHandleChange).toHaveBeenCalledWith('subject', 'dummy subject');
  });

  it('calls updateData when message is being populated', async () => {
    renderComponent();

    const messageText = 'dummy message';
    const messageInput = screen.getByLabelText('Message');

    await fireEvent.change(messageInput, {
      target: { value: messageText },
    });

    expect(mockHandleChange).toHaveBeenCalledTimes(1);
    expect(mockHandleChange).toHaveBeenCalledWith('message', 'dummy message');
  });
  it('calls updateData when "Include cover page" checkbox is checked', async () => {
    const user = userEvent.setup();

    renderComponent();

    const includeCoverPageCheckbox =
      screen.getByLabelText('Include cover page');

    expect(includeCoverPageCheckbox).toBeChecked();

    await user.click(includeCoverPageCheckbox);

    expect(mockHandleChange).toHaveBeenCalledTimes(1);
    expect(mockHandleChange).toHaveBeenCalledWith('includeCoverPage', false);
  });
});
