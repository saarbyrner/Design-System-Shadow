import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { TextContentInputTranslated as TextContextInput } from '../index';

describe('<TextContextInput />', () => {
  const props = {
    text: { content: 'test content', hidden: false },
    handleChange: jest.fn(),
  };

  it('should render the component with data', () => {
    render(<TextContextInput {...props} />);

    expect(screen.getByLabelText('Text')).toBeInTheDocument();
    expect(screen.getByDisplayValue('test content')).toBeInTheDocument();
    expect(screen.getByLabelText('Hide')).toBeInTheDocument();
  });

  it('should call handleChange when a different text content is typed', async () => {
    const user = userEvent.setup();

    render(<TextContextInput {...props} />);

    expect(screen.getByLabelText('Text')).toBeInTheDocument();

    const textInput = screen.getByLabelText('Text');

    await user.type(textInput, '2');

    expect(props.handleChange).toHaveBeenCalledWith({
      content: 'test content2',
    });
  });
});
