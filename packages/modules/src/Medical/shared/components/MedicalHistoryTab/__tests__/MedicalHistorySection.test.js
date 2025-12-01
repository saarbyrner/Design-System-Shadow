import { render, screen } from '@testing-library/react';
import MedicalHistorySection from '../MedicalHistorySection';

describe('<MedicalHistorySection />', () => {
  it('renders correctly', async () => {
    render(
      <MedicalHistorySection>
        <MedicalHistorySection.Title>Vaccinations</MedicalHistorySection.Title>
        <MedicalHistorySection.Content>
          <p>content</p>
        </MedicalHistorySection.Content>
      </MedicalHistorySection>
    );

    expect(screen.getByText('Vaccinations')).toBeInTheDocument();
    expect(screen.getByText('content')).toBeInTheDocument();
  });
  it('render header actions', async () => {
    render(
      <MedicalHistorySection>
        <MedicalHistorySection.Title>Vaccinations</MedicalHistorySection.Title>
        <MedicalHistorySection.Content>
          <p>content</p>
          <button type="button">click me</button>
        </MedicalHistorySection.Content>
      </MedicalHistorySection>
    );

    expect(
      screen.getByText('click me', { selector: 'button' })
    ).toBeInTheDocument();
  });
});
