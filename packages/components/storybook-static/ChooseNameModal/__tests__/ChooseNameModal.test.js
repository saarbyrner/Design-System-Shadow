import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import ChooseNameModal from '..';

describe('<ChooseNameModal />', () => {
  const props = {
    title: 'my title',
    label: 'my label',
    isOpen: true,
    onConfirm: jest.fn(),
    onChange: jest.fn(),
    closeModal: jest.fn(),
    t: i18nextTranslateStub(),
  };

  it('renders the component', () => {
    render(<ChooseNameModal {...props} />);
    expect(
      screen.getByText('my title').closest('.ReactModal__Content')
    ).toBeInTheDocument();
  });

  it('renders the InputText', () => {
    render(<ChooseNameModal {...props} />);
    expect(screen.getByText('my label')).toBeInTheDocument();
  });

  it('hides the errors by default', () => {
    render(<ChooseNameModal {...props} />);
    expect(screen.queryByText('A value is required')).not.toBeInTheDocument();
  });

  it('modal is hidden when the isOpen property of the modal is false', () => {
    render(<ChooseNameModal {...props} isOpen={false} />);
    expect(screen.queryByText('my title')).not.toBeInTheDocument();
  });

  it('displays the modal at the correct size', () => {
    render(<ChooseNameModal {...props} />);
    expect(
      screen.getByText('my title').closest('.ReactModal__Content')
    ).toHaveStyle({ width: '490px' });
  });

  it('renders the cancel button', () => {
    render(<ChooseNameModal {...props} />);
    expect(screen.getByText('Cancel').closest('button')).toHaveClass(
      'textButton--secondary'
    );
  });

  it('calls onConfirm when the user clicks the action button and the form is valid', async () => {
    render(<ChooseNameModal {...props} />);

    await userEvent.type(
      screen
        .getByText('my label')
        .parentNode.parentNode.querySelector('input.km-input-control'),
      'hi there'
    );
    await userEvent.click(screen.getByText('Create'));

    expect(props.onConfirm).toHaveBeenCalledWith('hi there');
  });

  it('shows errors and does not call onConfirm when the user clicks the action button and the form is not valid', async () => {
    render(<ChooseNameModal {...props} />);

    await userEvent.click(screen.getByText('Create'));

    expect(props.onConfirm).not.toHaveBeenCalled();
    expect(screen.getByText('A value is required')).toBeInTheDocument();
  });

  it('renders action button with custom text when actionButtonText is passed a value', () => {
    render(
      <ChooseNameModal {...props} actionButtonText="custom action text" />
    );

    expect(screen.getByText('custom action text')).toBeInTheDocument();
  });

  it('sets the max enabled characters on the input when the maxLength property is set', async () => {
    render(<ChooseNameModal {...props} maxLength={10} />);

    await userEvent.type(
      screen
        .getByText('my label')
        .parentNode.parentNode.querySelector('input.km-input-control'),
      'hi'
    );
    expect(screen.getByText('8 characters remaining')).toBeInTheDocument();
  });

  it('renders the correct error message when the customEmptyMessage is set', async () => {
    render(<ChooseNameModal {...props} customEmptyMessage="this is wrong" />);

    await userEvent.click(screen.getByText('Create'));
    expect(screen.getByText('this is wrong')).toBeInTheDocument();
  });

  it('renders the content when the adminContent is set', () => {
    render(
      <ChooseNameModal
        {...props}
        adminContent={<h1>admin content goes here</h1>}
      />
    );

    expect(screen.getByText('admin content goes here')).toBeInTheDocument();
  });

  it('adds the correct classname to the container when adminContent is set', () => {
    render(
      <ChooseNameModal
        {...props}
        adminContent={<h1>admin content goes here</h1>}
      />
    );

    expect(
      screen.getByText('my label').closest('.chooseNameModal')
    ).toHaveClass('chooseNameModal--withAdminContent');
  });

  it('hides the errors and calls closeModal when the user closes the modal', async () => {
    render(<ChooseNameModal {...props} />);

    await userEvent.click(
      screen
        .getByText('my title')
        .parentNode.querySelector('button.reactModal__closeBtn')
    );

    expect(screen.queryByText('A value is required')).not.toBeInTheDocument();
    expect(props.closeModal).toHaveBeenCalledTimes(1);
  });
});
