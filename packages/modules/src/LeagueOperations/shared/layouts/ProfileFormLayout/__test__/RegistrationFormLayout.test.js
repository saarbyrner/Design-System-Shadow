import { render, screen } from '@testing-library/react';

import ProfileFormLayout from '../index';

describe('<ProfileFormLayout/>', () => {
  it('renders the <ProfileFormLayout/> component and children correctly', () => {
    render(
      <ProfileFormLayout>
        ProfileFormLayout
        <ProfileFormLayout.MenuContainer>
          ProfileFormLayout.MenuContainer
          <ProfileFormLayout.FormTitle>
            ProfileFormLayout.FormTitle
          </ProfileFormLayout.FormTitle>
        </ProfileFormLayout.MenuContainer>
        <ProfileFormLayout.FormContainer>
          ProfileFormLayout.FormContainer
          <ProfileFormLayout.SectionTitle>
            ProfileFormLayout.SectionTitle
          </ProfileFormLayout.SectionTitle>
          <ProfileFormLayout.FormBody>
            ProfileFormLayout.FormBody
          </ProfileFormLayout.FormBody>
          <ProfileFormLayout.FormFooter>
            ProfileFormLayout.FormFooter
          </ProfileFormLayout.FormFooter>
        </ProfileFormLayout.FormContainer>
      </ProfileFormLayout>
    );

    expect(screen.getByText('ProfileFormLayout')).toBeInTheDocument();
    expect(
      screen.getByText('ProfileFormLayout.MenuContainer')
    ).toBeInTheDocument();
    expect(screen.getByText('ProfileFormLayout.FormTitle')).toBeInTheDocument();
    expect(
      screen.getByText('ProfileFormLayout.FormContainer')
    ).toBeInTheDocument();
    expect(
      screen.getByText('ProfileFormLayout.SectionTitle')
    ).toBeInTheDocument();
    expect(screen.getByText('ProfileFormLayout.FormBody')).toBeInTheDocument();
    expect(
      screen.getByText('ProfileFormLayout.FormFooter')
    ).toBeInTheDocument();
  });
  it('renders the <ProfileFormLayout.Loading/> component', () => {
    render(<ProfileFormLayout.Loading />);

    expect(
      screen.getByTestId('ProfileFormLayout.Loading.FormTitle')
    ).toBeInTheDocument();
    expect(
      screen.getByTestId('ProfileFormLayout.Loading.Menu')
    ).toBeInTheDocument();

    expect(
      screen.getByTestId('ProfileFormLayout.Loading.SectionTitle')
    ).toBeInTheDocument();
    expect(
      screen.getByTestId('ProfileFormLayout.Loading.FormBody')
    ).toBeInTheDocument();
    expect(
      screen.getByTestId('ProfileFormLayout.Loading.FormFooter')
    ).toBeInTheDocument();
  });
});
