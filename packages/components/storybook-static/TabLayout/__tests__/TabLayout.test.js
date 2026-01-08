import { render, screen } from '@testing-library/react';

import TabLayout from '../index';

describe('<TabLayout/>', () => {
  it('renders the <TabLayout/> component and children correctly', () => {
    render(
      <TabLayout>
        <TabLayout.Body>
          <TabLayout.Header>
            <TabLayout.Title>TabLayout title</TabLayout.Title>
            <TabLayout.Actions>
              <div>TabLayout.Actions</div>
            </TabLayout.Actions>
          </TabLayout.Header>
          <TabLayout.Filters>
            <div>TabLayout.Filters</div>
          </TabLayout.Filters>
          <TabLayout.Content>
            <div>TabLayout.Content</div>
          </TabLayout.Content>
        </TabLayout.Body>
      </TabLayout>
    );

    expect(screen.getByText(/TabLayout title/i)).toBeInTheDocument();
    expect(screen.getByText(/TabLayout.Actions/i)).toBeInTheDocument();
    expect(screen.getByText(/TabLayout.Filters/i)).toBeInTheDocument();
    expect(screen.getByText(/TabLayout.Content/i)).toBeInTheDocument();
  });
});
