import { render, screen } from '@testing-library/react';
import PHIAndPIIAlertBanner from '../components/PHIAndPIIAlertBanner/PHIAndPIIAlertBanner';

jest.mock('@kitman/common/src/contexts/OrganisationContext', () => ({
  useOrganisation: () => ({
    organisationPHIWarning: true,
    setOrganisationPHIWarning: jest.fn(),
  }),
}));

describe('PHIAndPIIAlertBanner', () => {
  it('renders default message, if all props are false', () => {
    render(<PHIAndPIIAlertBanner isPHI={false} isPII={false} />);

    expect(
      screen.getByText(
        'Authorized Access Only: This page may contain Protected Health Information (PHI) and/or Personally Identifiable Information (PII). Use of this system is monitored. Unauthorized access or disclosure is prohibited and subject to legal action.'
      )
    ).toBeInTheDocument();
  });

  it('renders PHI message, when isPHI  is true', () => {
    render(<PHIAndPIIAlertBanner isPHI isPII={false} />);
    expect(
      screen.getByText(
        'Authorized Access Only: This page contains Protected Health Information (PHI). Use of this system is monitored. Unauthorized access or disclosure of PHI is prohibited and subject to legal action.'
      )
    ).toBeInTheDocument();
  });

  it('renders PHI message, when isPII  is true', () => {
    render(<PHIAndPIIAlertBanner isPHI={false} isPII />);
    expect(
      screen.getByText(
        'Authorized Access Only: This page contains Personally Identifiable Information (PII). Use of this system is monitored. Unauthorized access or misuse of PII is prohibited and subject to legal action.'
      )
    ).toBeInTheDocument();
  });
});
