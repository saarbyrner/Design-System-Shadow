import { render, screen } from '@testing-library/react';
import { data as mockedMedicalNotes } from '@kitman/services/src/mocks/handlers/medical/getMedicalNotes';
import InfiniteScrollLayout from '..';
import NoteCard from '../../NoteCard';

jest.mock('../../NoteCard', () => ({
  __esModule: true,
  default: jest.fn(() => <div data-testid="NoteCard" />),
}));

describe('<InfiniteScrollLayout />', () => {
  const props = {
    hasMore: false,
    itemsLength: 1,
    actions: [],
    t: (t) => t,
  };

  it('renders the child components', () => {
    render(
      <InfiniteScrollLayout {...props}>
        <NoteCard note={mockedMedicalNotes.medical_notes[0]} hasMore={false} />
      </InfiniteScrollLayout>
    );

    expect(screen.getByTestId('NoteCard')).toBeInTheDocument();
    expect(NoteCard).toHaveBeenCalledWith(
      {
        note: mockedMedicalNotes.medical_notes[0],
        hasMore: false,
      },
      {}
    );
  });
});
