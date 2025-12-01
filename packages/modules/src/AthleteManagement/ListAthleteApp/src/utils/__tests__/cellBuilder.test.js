import { render, screen } from '@testing-library/react';
import buildCellContent from '../cellBuilder';

describe('buildCellContent', () => {
  const mockAthlete = {
    name: 'Ric Flair',
    id: 1,
    avatar: 'www.avatar.path',
    username: 'thenatureboy',
    date_of_birth: '25 Feb 1949',
    email: 'rick@whooo.com',
    position: 'center',
    organisations: [
      { logo_full_path: 'www.log.path', name: 'Organisation United' },
    ],
    athlete_game_status: 'Unavailable - On Loan',
  };
  it('returns the correct cell content for name key', () => {
    render(buildCellContent({ row_key: 'name' }, mockAthlete, { id: 1 }));
    expect(screen.getByText(mockAthlete.name)).toBeInTheDocument();
  });

  it('returns the correct cell content for assigned_to key', () => {
    render(
      buildCellContent({ row_key: 'assigned_to' }, mockAthlete, { id: 1 })
    );
    expect(screen.getByLabelText('Organisation United')).toBeInTheDocument();
  });
  it('returns the correct cell content for email key', () => {
    render(buildCellContent({ row_key: 'email' }, mockAthlete, { id: 1 }));
    expect(screen.getByText(mockAthlete.email)).toBeInTheDocument();
  });
  it('returns the correct cell content for date_of_birth key', () => {
    render(
      buildCellContent({ row_key: 'date_of_birth' }, mockAthlete, { id: 1 })
    );
    expect(screen.getByText(mockAthlete.date_of_birth)).toBeInTheDocument();
  });
  it('returns the correct cell content for id key', () => {
    render(buildCellContent({ row_key: 'id' }, mockAthlete, { id: 1 }));
    expect(screen.getByText(mockAthlete.id)).toBeInTheDocument();
  });
  it('returns the correct cell content for username key', () => {
    render(buildCellContent({ row_key: 'username' }, mockAthlete, { id: 1 }));
    expect(screen.getByText(mockAthlete.username)).toBeInTheDocument();
  });
  it('returns the correct cell content for position key', () => {
    render(buildCellContent({ row_key: 'position' }, mockAthlete, { id: 1 }));
    expect(screen.getByText(mockAthlete.position)).toBeInTheDocument();
  });
  it('returns the correct cell content for career_status key', () => {
    render(
      buildCellContent({ row_key: 'career_status' }, mockAthlete, { id: 1 })
    );
    expect(screen.getByText('N/A')).toBeInTheDocument();
  });
  it('returns the correct cell content for availability status (athlete_game_status) key', () => {
    render(
      buildCellContent({ row_key: 'athlete_game_status' }, mockAthlete, {
        id: 1,
      })
    );
    expect(screen.getByText('Unavailable')).toBeInTheDocument();
  });
});
