import { render, screen } from '@testing-library/react';
import Errors from '@kitman/components/src/DocumentSplitter/src/components/Errors';

const props = {
  errors: [
    'This field is required',
    'At least one file is required either from your computer or injuries/illnesses',
  ],
};

const renderComponent = () => render(<Errors {...props} />);

describe('Errors component', () => {
  it('renders correctly', () => {
    renderComponent();

    expect(screen.getByText('This field is required')).toBeInTheDocument();
    expect(
      screen.getByText(
        'At least one file is required either from your computer or injuries/illnesses'
      )
    ).toBeInTheDocument();
  });
});
