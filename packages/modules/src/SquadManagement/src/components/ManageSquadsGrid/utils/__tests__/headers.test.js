import DefaultHeaderCell from '@kitman/modules/src/shared/MassUpload/New/components/DefaultHeaderCell';
import {
  StartSeasonMarkerDate,
  NameHeader,
  EndSeasonMarkerDate,
  StateHeader,
  CoachesHeader,
  PlayersHeader,
} from '../headers';

describe('headers', () => {
  it('has a StartSeasonMarkerDate', () => {
    expect(StartSeasonMarkerDate).toEqual({
      id: 'start_marker',
      row_key: 'start_marker',
      content: <DefaultHeaderCell title="Start date" />,
    });
  });
  it('has a NameHeader', () => {
    expect(NameHeader).toEqual({
      id: 'squad',
      row_key: 'squad',
      content: <DefaultHeaderCell title="Name" />,
    });
  });
  it('has a EndSeasonMarkerDate', () => {
    expect(EndSeasonMarkerDate).toEqual({
      id: 'end_marker',
      row_key: 'end_marker',
      content: <DefaultHeaderCell title="End date" />,
    });
  });

  it('has a StateHeader', () => {
    expect(StateHeader).toEqual({
      id: 'state_address',
      row_key: 'state_address',
      content: <DefaultHeaderCell title="State / Province" />,
    });
  });

  it('has a CoachesHeader', () => {
    expect(CoachesHeader).toEqual({
      id: 'total_coaches',
      row_key: 'total_coaches',
      content: <DefaultHeaderCell title="Coaches" />,
    });
  });
  it('has a PlayersHeader', () => {
    expect(PlayersHeader).toEqual({
      id: 'total_players',
      row_key: 'total_players',
      content: <DefaultHeaderCell title="Players" />,
    });
  });
});
