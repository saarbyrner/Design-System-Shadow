import { render, screen } from '@testing-library/react';

import ListLayout from '../index';

describe('<ListLayout/>', () => {
  it('renders the <ListLayout/> component and children correctly', () => {
    render(
      <ListLayout>
        <div>ListLayout</div>

        <ListLayout.Content>
          <ListLayout.Title>
            <div>ListLayout.Title</div>
          </ListLayout.Title>
          <ListLayout.Filters>
            <div>ListLayout.Filters</div>
          </ListLayout.Filters>
          <div>ListLayout.Content</div>
        </ListLayout.Content>
      </ListLayout>
    );

    expect(screen.getByText('ListLayout')).toBeInTheDocument();
    expect(screen.getByText('ListLayout.Title')).toBeInTheDocument();
    expect(screen.getByText('ListLayout.Content')).toBeInTheDocument();
    expect(screen.getByText('ListLayout.Filters')).toBeInTheDocument();
  });
  it('renders the <ListLayout.LoadingLayout/> component and children correctly', () => {
    render(<ListLayout.LoadingLayout />);

    expect(screen.getByTestId('ListLayout.LoadingTitle')).toBeInTheDocument();
    expect(screen.getByTestId('ListLayout.LoadingFilters')).toBeInTheDocument();
  });
});
