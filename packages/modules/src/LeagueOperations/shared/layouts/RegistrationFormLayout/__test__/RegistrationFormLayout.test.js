import { render, screen } from '@testing-library/react';

import RegistrationFormLayout from '../index';

describe('<RegistrationFormLayout/>', () => {
  it('renders the <RegistrationFormLayout/> component and children correctly', () => {
    render(
      <RegistrationFormLayout>
        RegistrationFormLayout
        <RegistrationFormLayout.MenuContainer>
          RegistrationFormLayout.MenuContainer
          <RegistrationFormLayout.FormTitle>
            RegistrationFormLayout.FormTitle
          </RegistrationFormLayout.FormTitle>
        </RegistrationFormLayout.MenuContainer>
        <RegistrationFormLayout.FormContainer>
          RegistrationFormLayout.FormContainer
          <RegistrationFormLayout.SectionTitle>
            RegistrationFormLayout.SectionTitle
          </RegistrationFormLayout.SectionTitle>
          <RegistrationFormLayout.FormBody>
            RegistrationFormLayout.FormBody
          </RegistrationFormLayout.FormBody>
          <RegistrationFormLayout.FormFooter>
            RegistrationFormLayout.FormFooter
          </RegistrationFormLayout.FormFooter>
        </RegistrationFormLayout.FormContainer>
      </RegistrationFormLayout>
    );

    expect(screen.getByText('RegistrationFormLayout')).toBeInTheDocument();
    expect(
      screen.getByText('RegistrationFormLayout.MenuContainer')
    ).toBeInTheDocument();
    expect(
      screen.getByText('RegistrationFormLayout.FormTitle')
    ).toBeInTheDocument();
    expect(
      screen.getByText('RegistrationFormLayout.FormContainer')
    ).toBeInTheDocument();
    expect(
      screen.getByText('RegistrationFormLayout.SectionTitle')
    ).toBeInTheDocument();
    expect(
      screen.getByText('RegistrationFormLayout.FormBody')
    ).toBeInTheDocument();
    expect(
      screen.getByText('RegistrationFormLayout.FormFooter')
    ).toBeInTheDocument();
  });
  it('renders the <RegistrationFormLayout.Loading/> component', () => {
    render(<RegistrationFormLayout.Loading />);

    expect(
      screen.getByTestId('RegistrationFormLayout.Loading.FormTitle')
    ).toBeInTheDocument();
    expect(
      screen.getByTestId('RegistrationFormLayout.Loading.Menu')
    ).toBeInTheDocument();

    expect(
      screen.getByTestId('RegistrationFormLayout.Loading.SectionTitle')
    ).toBeInTheDocument();
    expect(
      screen.getByTestId('RegistrationFormLayout.Loading.FormBody')
    ).toBeInTheDocument();
    expect(
      screen.getByTestId('RegistrationFormLayout.Loading.FormFooter')
    ).toBeInTheDocument();
  });
});
