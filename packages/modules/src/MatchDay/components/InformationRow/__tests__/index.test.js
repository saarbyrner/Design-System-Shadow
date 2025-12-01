import { render, screen } from '@testing-library/react';
import InformationRow from '..';

describe('InformationRow', () => {
  it('renders correctly', () => {
    render(<InformationRow label="Label" value="Value" />);
    expect(screen.getByText('Label')).toBeInTheDocument();
    expect(screen.getByText('Value')).toBeInTheDocument();
  });
  it('hides the real info with Lorem ipsum when hideInfo is true', () => {
    render(<InformationRow label="Label" value="Value" hideInfo />);
    expect(screen.getByText('Label')).toBeInTheDocument();
    expect(screen.getByText('Lorem ipsum')).toBeInTheDocument();
  });
});
