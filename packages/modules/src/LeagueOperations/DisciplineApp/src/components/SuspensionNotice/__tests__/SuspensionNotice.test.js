import { render, screen } from '@testing-library/react';
import SuspensionNotice from '../index';

const mockProfile = {
  id: '123',
  name: 'John Doe',
  squad_id: '456',
  organisations: [
    {
      id: 1268,
      text: 'KL Toronto',
      avatar_src: 'someUrlHere',
      href: '/someLinkHere',
    },
  ],
};

describe('<SuspensionNotice />', () => {
  const games = [
    {
      id: '1',
      opponent_squad: { owner_name: 'Team A', name: 'Squad A' },
      start_date: '2024-06-01T12:00:00Z',
    },
    {
      id: '2',
      opponent_squad: { owner_name: 'Team B', name: 'Squad B' },
      start_date: '2024-06-08T12:00:00Z',
    },
  ];
  it('renders suspension notice with correct values, games list, and policy text', () => {
    render(
      <SuspensionNotice
        profile={mockProfile}
        numberOfGames={2}
        startDateFormatted="June 1, 2024"
        games={games}
      />
    );

    expect(
      screen.getByText(
        /John Doe will be suspended for 2 games starting June 1, 2024. The games are:/
      )
    ).toBeInTheDocument();

    expect(
      screen.getByText(/vs Team A \(Squad A\) - June 01, 2024/)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/vs Team B \(Squad B\) - June 08, 2024/)
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        /Suspensions shift to the next available game if postponed\/canceled\. The user is ineligible for all games \(any age group\) until the suspension is fully served\./
      )
    ).toBeInTheDocument();
  });

  it('handles when isSquadOpposition', () => {
    render(
      <SuspensionNotice
        profile={mockProfile}
        numberOfGames={2}
        startDateFormatted="June 1, 2024"
        games={[
          {
            id: '1',
            opponent_squad: {
              owner_name: 'Team A',
              name: 'Squad A',
              owner_id: 1269,
            },
            squad: {
              id: 456,
              name: 'U13',
              owner_name: 'KL Toronto',
              owner_id: 1268,
            },
            start_date: '2024-06-01T12:00:00Z',
          },
          {
            id: '2',
            opponent_squad: {
              owner_name: 'Team B',
              name: 'Squad B',
              owner_id: 1267,
            },
            squad: {
              id: 456,
              name: 'U13',
              owner_name: 'KL Toronto',
              owner_id: 1268,
            },
            start_date: '2024-06-08T12:00:00Z',
          },
        ]}
      />
    );

    expect(
      screen.getByText(/vs Team A \(Squad A\) - June 01, 2024/)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/vs Team B \(Squad B\) - June 08, 2024/)
    ).toBeInTheDocument();
  });

  it('handles when isOpponentSquadOpposition', () => {
    render(
      <SuspensionNotice
        profile={{
          ...mockProfile,
          organisations: [
            {
              id: 1269,
              text: 'KL Galaxy',
              avatar_src: 'someUrlHere',
              href: '/someLinkHere',
            },
          ],
        }}
        numberOfGames={2}
        startDateFormatted="June 1, 2024"
        games={[
          {
            id: '1',
            opponent_squad: {
              owner_name: 'Team A',
              name: 'Squad A',
              owner_id: 1269,
            },
            squad: {
              id: 456,
              name: 'U13',
              owner_name: 'KL Toronto',
              owner_id: 1268,
            },
            start_date: '2024-06-01T12:00:00Z',
          },
          {
            id: '2',
            opponent_squad: {
              owner_name: 'Team B',
              name: 'Squad B',
              owner_id: 1269,
            },
            squad: {
              id: 456,
              name: 'U13',
              owner_name: 'KL Toronto',
              owner_id: 1268,
            },
            start_date: '2024-06-08T12:00:00Z',
          },
        ]}
      />
    );

    expect(
      screen.getByText(/vs KL Toronto \(U13\) - June 01, 2024/)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/vs KL Toronto \(U13\) - June 08, 2024/)
    ).toBeInTheDocument();
  });
});
