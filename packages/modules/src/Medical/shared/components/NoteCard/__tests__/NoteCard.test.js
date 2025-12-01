import { render, screen } from '@testing-library/react';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { data as mockedMedicalNotes } from '@kitman/services/src/mocks/handlers/medical/getMedicalNotes';
import NoteCard from '..';

describe('<NoteCard />', () => {
  const i18nT = i18nextTranslateStub();
  const props = {
    note: mockedMedicalNotes.medical_notes[0],
    showAthleteInformations: true,
    t: i18nT,
  };

  it('binds the note id to the note card', () => {
    render(<NoteCard {...props} />);

    expect(screen.getByTestId('Note|Content')).toHaveAttribute(
      'id',
      props.note.id.toString()
    );
  });

  it('renders the loader when is loading', () => {
    render(<NoteCard {...props} isLoading />);

    expect(screen.getByTestId('NoteCardLoader|lineLoader')).toBeInTheDocument();
  });

  it('renders the correct styles with vertical layout', () => {
    render(<NoteCard {...props} withVerticalLayout />);

    expect(screen.getByTestId('Note|Content')).toHaveStyle(
      'flex-direction:column'
    );
  });
});
