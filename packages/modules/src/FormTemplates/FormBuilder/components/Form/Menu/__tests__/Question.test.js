import { render, screen } from '@testing-library/react';

import Question from '../Question';

describe('<Question />', () => {
  const props = { name: 'Who am I' };
  it('should render the question properly', () => {
    render(<Question {...props} />);

    expect(screen.getByText(props.name)).toBeInTheDocument();
  });
});
