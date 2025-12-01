import { render, screen } from '@testing-library/react';
import DrillItem from '../DrillItem';

describe('DrillItem', () => {
  const props = {
    name: 'This is the display name',
    onClick: jest.fn(),
  };

  it('renders correctly', async () => {
    render(<DrillItem {...props} />);
    const drillName = await screen.findByText(props.name);
    expect(drillName).toBeInTheDocument();
  });
});
