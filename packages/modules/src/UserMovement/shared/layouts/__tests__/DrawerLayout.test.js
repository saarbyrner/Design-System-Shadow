import { render, screen } from '@testing-library/react';

import DrawerLayout from '../DrawerLayout';

describe('<DrawerLayout/>', () => {
  it('renders the <DrawerLayout/> component and children correctly', () => {
    render(
      <DrawerLayout>
        <DrawerLayout.Title title="title" />
        <DrawerLayout.Steps steps={['Label 1']} activeStepIndex={0} />
        <DrawerLayout.Instructions
          instructions={{ primary: 'primary', secondary: 'secondary' }}
        />
        <DrawerLayout.Profile
          profile={{ name: 'fullname', avatar_url: 'avatar_url' }}
        />
        <DrawerLayout.ProfileItems
          items={[{ primary: 'item_primary', secondary: 'item_secondary' }]}
        />
        <DrawerLayout.Form>DrawerLayout.Form</DrawerLayout.Form>
        <DrawerLayout.Actions>DrawerLayout.Actions</DrawerLayout.Actions>
      </DrawerLayout>
    );

    expect(screen.getByText(/title/i)).toBeInTheDocument();
    expect(screen.getByText('primary')).toBeInTheDocument();
    expect(screen.getByText('secondary')).toBeInTheDocument();
    expect(screen.getByText(/fullname/i)).toBeInTheDocument();
    expect(screen.getByText(/item_primary/i)).toBeInTheDocument();
    expect(screen.getByText(/item_secondary/i)).toBeInTheDocument();
    expect(screen.getByText(/DrawerLayout.Form/i)).toBeInTheDocument();
    expect(screen.getByText(/DrawerLayout.Actions/i)).toBeInTheDocument();
  });
});
