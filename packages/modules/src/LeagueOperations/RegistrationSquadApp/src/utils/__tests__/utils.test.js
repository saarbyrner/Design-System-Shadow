import { screen, render } from '@testing-library/react';
import { MOCK_REGISTRATION_SQUAD } from '@kitman/modules/src/LeagueOperations/__tests__/test_utils';
import getSquadStatics from '..';

describe('getSquadStatics', () => {
  it('renders correctly with all data provided', () => {
    render(getSquadStatics({ squad: MOCK_REGISTRATION_SQUAD }));
    expect(screen.getByText('Club')).toBeInTheDocument();
    expect(screen.getByText('LA Galaxy')).toBeInTheDocument();
    expect(screen.getByText('Country')).toBeInTheDocument();
    expect(screen.getByText('Guadeloupe')).toBeInTheDocument();
    expect(screen.getByText('Staff')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('Players')).toBeInTheDocument();
    expect(screen.getByText('12')).toBeInTheDocument();
  });

  it('renders correctly with missing country', () => {
    const modifiedSquad = { ...MOCK_REGISTRATION_SQUAD, address: null };
    render(getSquadStatics({ squad: modifiedSquad }));
    expect(screen.getByText('Country')).toBeInTheDocument();
    expect(screen.getByText('-')).toBeInTheDocument();
  });

  it('renders correctly with missing organisation', () => {
    const modifiedSquad = { ...MOCK_REGISTRATION_SQUAD, organisations: [] };
    render(getSquadStatics({ squad: modifiedSquad }));
    expect(screen.getByText('Club')).toBeInTheDocument();
    expect(screen.queryByText('LA Galaxy')).not.toBeInTheDocument();
  });
});
