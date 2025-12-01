import { render, screen } from '@testing-library/react';

import CardLayout from '../index';

describe('<CardLayout/>', () => {
  it('renders the <CardLayout/> component and children correctly', () => {
    render(
      <CardLayout>
        <CardLayout.Title title="title" />
        <CardLayout.Flex>CardLayout.Flex</CardLayout.Flex>
        <div>CardLayout</div>
      </CardLayout>
    );

    expect(screen.getByText('CardLayout')).toBeInTheDocument();
    expect(screen.getByText(/title/i)).toBeInTheDocument();
    expect(screen.getByText(/CardLayout.Flex/i)).toBeInTheDocument();
  });
});
