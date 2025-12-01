import { render, screen } from '@testing-library/react';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import PatientNotes from '..';

describe('<PatientNotes />', () => {
  const props = {
    t: i18nextTranslateStub(),
  };

  it('renders the correct heading & note content when supplied', () => {
    render(
      <PatientNotes
        {...props}
        patientNotes={[
          { body: 'Sample note content' },
          { body: 'Second item of note content' },
        ]}
      />
    );

    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toHaveTextContent('Patient Comments');
    expect(screen.getByText('Sample note content')).toBeInTheDocument();
    expect(screen.getByText('Second item of note content')).toBeInTheDocument();
  });
});
