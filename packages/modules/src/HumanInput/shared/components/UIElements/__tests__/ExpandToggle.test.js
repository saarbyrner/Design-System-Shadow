import { screen, render } from '@testing-library/react';
import { ExpandMore } from '@mui/icons-material';
import ExpandToggle from '../ExpandToggle';

describe('<ExpandToggle/>', () => {
  it('renders', () => {
    render(
      <ExpandToggle>
        <ExpandMore />
      </ExpandToggle>
    );
    expect(screen.getByTestId('ExpandMoreIcon')).toBeInTheDocument();
  });
});
