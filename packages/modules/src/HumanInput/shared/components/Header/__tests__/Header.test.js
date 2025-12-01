import { render, screen } from '@testing-library/react';
import Header from '@kitman/modules/src/HumanInput/shared/components/Header';

describe('Header', () => {
  const props = {
    title: 'Example Title',
  };

  it('renders', () => {
    render(<Header {...props} />);

    expect(screen.getByText(props.title)).toBeInTheDocument();
  });
});
