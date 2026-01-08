import { render, screen } from '@testing-library/react';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import userEvent from '@testing-library/user-event';
import Dialogue from '..';

describe('<Dialogue />', () => {
  const props = {
    message: 'Message here',
    isEmbed: false,
    visible: true,
    type: 'confirm',
    confirmAction: jest.fn(),
    cancelAction: jest.fn(),
    t: i18nextTranslateStub(),
  };

  it('when isEmbed is set to false the dialogue is not embedded in the page', () => {
    render(<Dialogue {...props} />);

    expect(screen.getByRole('dialog')).not.toHaveClass('reactDialogue--embed');
  });

  it('when isEmbed is set to true the dialogue is embedded in the page', () => {
    render(<Dialogue {...props} isEmbed />);

    expect(screen.getByRole('dialog')).toHaveClass('reactDialogue--embed');
  });

  it('when visible is set to false the dialogue is not visible', () => {
    render(<Dialogue {...props} visible={false} />);

    expect(screen.getByRole('dialog')).toHaveClass('reactDialogue--hidden');
  });

  it('when visible is set to true the dialogue is visible', () => {
    render(<Dialogue {...props} />);

    expect(screen.getByRole('dialog')).not.toHaveClass('reactDialogue--hidden');
  });

  it('when message prop provided it shows the message', () => {
    render(<Dialogue {...props} />);

    expect(screen.getByText('Message here')).toBeInTheDocument();
  });

  it('when cancel button text not provided it shows the default cancel button text', () => {
    render(<Dialogue {...props} />);

    expect(screen.getAllByRole('button')[0]).toHaveTextContent('Cancel');
  });

  it('when confirm button text not provided it shows the default cancel button text', () => {
    render(<Dialogue {...props} />);

    expect(screen.getAllByRole('button')[1]).toHaveTextContent('Confirm');
  });

  it('when cancel button text provided it shows the provided cancel button text', () => {
    render(<Dialogue {...props} cancelButtonText="Cancel me!" />);

    expect(screen.getByText('Cancel me!')).toBeInTheDocument();
  });

  it('when confirm button text is provided it shows the provided confirm button text', () => {
    render(<Dialogue {...props} confirmButtonText="Confirm me!" />);

    expect(screen.getByText('Confirm me!')).toBeInTheDocument();
  });

  it('when cancel callback not provided it doesnt show the the cancel button', () => {
    render(<Dialogue {...props} cancelAction={undefined} />);

    expect(screen.getByText('Confirm')).toBeInTheDocument();
    expect(screen.queryByText('Cancel')).not.toBeInTheDocument();
  });

  it('when cancel callback and confirm callback is provided it shows the the cancel and confirm buttons', () => {
    render(<Dialogue {...props} />);

    expect(screen.getAllByRole('button')).toHaveLength(2);
  });

  it('when confirm is clicked it fires the correct callback function', async () => {
    render(<Dialogue {...props} />);

    await userEvent.click(screen.getByText('Confirm'));
    expect(props.confirmAction).toHaveBeenCalledTimes(1);
  });

  it('when cancel is clicked it fires the correct callback function', async () => {
    render(<Dialogue {...props} />);

    await userEvent.click(screen.getByText('Cancel'));
    expect(props.cancelAction).toHaveBeenCalledTimes(1);
  });

  it('when type is "info" it only renders an OK button', () => {
    render(<Dialogue {...props} type="info" />);

    expect(screen.getByRole('button')).toBeInTheDocument();
    expect(screen.getByText('Ok')).toBeInTheDocument();
  });
});
