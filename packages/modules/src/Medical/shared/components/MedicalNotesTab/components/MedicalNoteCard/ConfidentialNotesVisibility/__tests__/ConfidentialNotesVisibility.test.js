import { render, screen } from '@testing-library/react';
import { mockConfidentialNote, mockUser } from './data.mock';
import { ConfidentialNotesTranslated as ConfidentialNotesVisibility } from '..';

describe('<ConfidentialNotesVisibility />', () => {
  describe('renders accordion component and list of users allowed to view note', () => {
    beforeEach(() => {
      window.featureFlags['medical-procedure'] = true;
    });

    afterEach(() => {
      window.featureFlags['medical-procedure'] = false;
    });

    it('renders the correct visibility heading', async () => {
      render(
        <ConfidentialNotesVisibility
          note={mockConfidentialNote}
          currentUser={mockUser}
        />
      );

      expect(
        screen.getByTestId('PresentationView|NoteVisibility')
      ).toBeInTheDocument();

      expect(screen.getByTestId('accordion-content')).toBeInTheDocument();

      expect(
        screen.getByRole('heading', { level: 4, name: 'Visibility' })
      ).toBeInTheDocument();

      expect(
        screen.getByText('Private - Specific users (3)')
      ).toBeInTheDocument();

      expect(
        screen.getByText('Edward Howe (Owner), Colt Wuckert, Marlon Wyman')
      ).toBeInTheDocument();
    });

    it('renders the correct visibility heading for note with no restrictions', async () => {
      render(
        <ConfidentialNotesVisibility
          note={{ ...mockConfidentialNote, allow_list: [] }}
          currentUser={mockUser}
        />
      );

      expect(
        screen.getByRole('heading', { level: 4, name: 'Visibility' })
      ).toBeInTheDocument();

      expect(screen.getByText('Default')).toBeInTheDocument();
      expect(screen.queryByTestId('accordion-content')).not.toBeInTheDocument();
    });

    it('renders the correct visibility heading title for note restricted to multiple users including creator', async () => {
      render(
        <ConfidentialNotesVisibility
          note={{
            ...mockConfidentialNote,
            allow_list: [
              {
                id: 22,
                fullname: 'Tim Weah',
              },
              {
                id: 44438,
                fullname: 'Edward Howe',
              },
            ],
          }}
          currentUser={{ id: 44438 }}
        />
      );

      expect(
        screen.getByRole('heading', { level: 4, name: 'Visibility' })
      ).toBeInTheDocument();

      expect(screen.queryByTestId('accordion-content')).toBeInTheDocument();

      expect(
        screen.getByText('Edward Howe (You - Owner), Tim Weah')
      ).toBeInTheDocument();
    });

    it('renders the correct visibility heading title for note restricted to just the creator', async () => {
      render(
        <ConfidentialNotesVisibility
          note={{
            ...mockConfidentialNote,
            allow_list: [
              {
                id: 44438,
                fullname: 'Edward Howe',
              },
            ],
          }}
          currentUser={{ id: 44438 }}
        />
      );

      expect(
        screen.getByRole('heading', { level: 4, name: 'Visibility' })
      ).toBeInTheDocument();

      expect(screen.getByText('Only me')).toBeInTheDocument();
      expect(screen.queryByTestId('accordion-content')).not.toBeInTheDocument();
    });
  });
});
