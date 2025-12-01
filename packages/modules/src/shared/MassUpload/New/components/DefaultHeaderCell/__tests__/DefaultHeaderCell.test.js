import { render, screen } from '@testing-library/react';
import DefaultHeaderCell from '../index';

describe('<DefaultHeaderCell />', () => {
  it('should render', () => {
    const title = 'Test title';

    render(<DefaultHeaderCell title={title} />);
    expect(screen.getByText(title)).toBeInTheDocument();
  });
});
