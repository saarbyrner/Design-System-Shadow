import { render, screen } from '@testing-library/react';

import SideDrawerLayout from '../index';

describe('<SideDrawerLayout/>', () => {
  it('renders the <SideDrawerLayout/> component and children correctly', () => {
    render(
      <SideDrawerLayout>
        <SideDrawerLayout.Title title="title" />
        <SideDrawerLayout.Body>SideDrawerLayout.Body</SideDrawerLayout.Body>
        <SideDrawerLayout.Actions>
          SideDrawerLayout.Actions
        </SideDrawerLayout.Actions>
      </SideDrawerLayout>
    );

    expect(screen.getByText(/title/i)).toBeInTheDocument();
    expect(screen.getByText(/SideDrawerLayout.Body/i)).toBeInTheDocument();
    expect(screen.getByText(/SideDrawerLayout.Actions/i)).toBeInTheDocument();
  });
});
