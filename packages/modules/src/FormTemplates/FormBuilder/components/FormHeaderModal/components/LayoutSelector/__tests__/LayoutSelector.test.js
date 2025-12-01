import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { LayoutSelectorTranslated as LayoutSelector } from '../index';

describe('<LayoutSelector />', () => {
  const props = {
    layout: 'left',
    handleChange: jest.fn(),
  };

  it('should render the component with default layout', () => {
    render(<LayoutSelector {...props} />);

    expect(screen.getByText('Layout')).toBeInTheDocument();
    expect(screen.getByDisplayValue('left')).toBeChecked();
  });

  it('should call handleChange when a different layout is selected', async () => {
    const user = userEvent.setup();

    render(<LayoutSelector {...props} />);

    const rightRadio = screen.getByDisplayValue('right');

    await user.click(rightRadio);

    expect(props.handleChange).toHaveBeenCalledWith('right');
  });

  it('should render all layout options', () => {
    render(<LayoutSelector {...props} />);

    expect(screen.getByDisplayValue('left')).toBeInTheDocument();
    expect(screen.getByDisplayValue('center')).toBeInTheDocument();
    expect(screen.getByDisplayValue('right')).toBeInTheDocument();

    expect(screen.getAllByText('Logo | Title')).toHaveLength(3);
  });
});
