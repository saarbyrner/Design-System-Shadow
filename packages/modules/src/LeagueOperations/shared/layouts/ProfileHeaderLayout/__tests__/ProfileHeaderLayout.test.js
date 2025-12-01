import { render, screen } from '@testing-library/react';

import ProfileHeaderLayout from '../index';

describe('<ProfileHeaderLayout/>', () => {
  it('renders the <ProfileHeaderLayout/> component and children correctly', () => {
    render(
      <ProfileHeaderLayout>
        ProfileHeaderLayout
        <ProfileHeaderLayout.Left>
          ProfileHeaderLayout.Left
          <ProfileHeaderLayout.Actions>
            ProfileHeaderLayout.Actions
          </ProfileHeaderLayout.Actions>
        </ProfileHeaderLayout.Left>
        <ProfileHeaderLayout.Right>
          ProfileHeaderLayout.Right
          <ProfileHeaderLayout.Main>
            ProfileHeaderLayout.Main
            <ProfileHeaderLayout.Avatar>
              ProfileHeaderLayout.Avatar
            </ProfileHeaderLayout.Avatar>
            <ProfileHeaderLayout.Content>
              ProfileHeaderLayout.Content
            </ProfileHeaderLayout.Content>
          </ProfileHeaderLayout.Main>
        </ProfileHeaderLayout.Right>
      </ProfileHeaderLayout>
    );

    expect(screen.getByText('ProfileHeaderLayout')).toBeInTheDocument();
    expect(screen.getByText(/ProfileHeaderLayout.Left/i)).toBeInTheDocument();
    expect(screen.getByText(/ProfileHeaderLayout.Right/i)).toBeInTheDocument();
    expect(
      screen.getByText(/ProfileHeaderLayout.Actions/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/ProfileHeaderLayout.Main/i)).toBeInTheDocument();
    expect(screen.getByText(/ProfileHeaderLayout.Avatar/i)).toBeInTheDocument();
    expect(
      screen.getByText(/ProfileHeaderLayout.Content/i)
    ).toBeInTheDocument();
  });
});
