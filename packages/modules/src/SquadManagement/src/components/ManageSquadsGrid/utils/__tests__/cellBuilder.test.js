import { render, screen } from '@testing-library/react';
import buildCellContent from '../cellBuilder';
import { data } from '../../../../shared/services/mocks/data/mock_squads_settings';

describe('buildCellContent', () => {
  it('renders an LinkCell for squad', () => {
    render(buildCellContent({ row_key: 'squad' }, data[0]));
    expect(screen.getByText(data[0].name)).toBeInTheDocument();
  });

  it('renders an TextCell for state_address', () => {
    render(buildCellContent({ row_key: 'state_address' }, data[0]));
    expect(screen.getByText(data[0].address.state)).toBeInTheDocument();
  });

  it('renders an TextCell for total_coaches', () => {
    render(buildCellContent({ row_key: 'total_coaches' }, data[0]));
    expect(screen.getByText(data[0].total_coaches)).toBeInTheDocument();
  });

  it('renders an TextCell for total_players', () => {
    render(buildCellContent({ row_key: 'total_players' }, data[0]));
    expect(screen.getByText(data[0].total_athletes)).toBeInTheDocument();
  });

  it('renders an TextCell for start_marker', () => {
    render(buildCellContent({ row_key: 'start_marker' }, data[0]));
    expect(screen.getByText('Fri 17 Feb')).toBeInTheDocument();
  });

  it('renders an TextCell for end_marker', () => {
    render(buildCellContent({ row_key: 'end_marker' }, data[0]));
    expect(screen.getByText('Fri 3 Nov')).toBeInTheDocument();
  });
});
