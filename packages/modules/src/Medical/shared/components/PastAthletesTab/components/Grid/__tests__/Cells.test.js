import { screen } from '@testing-library/react';
import { FIELD_KEY } from '@kitman/modules/src/Medical/shared/components/PastAthletesTab/components/Grid/Columns';
import { data as pastAthletes } from '@kitman/services/src/mocks/handlers/medical/getPastAthletes';
import buildCellContent from '@kitman/modules/src/Medical/shared/components/PastAthletesTab/components/Grid/Cells';
import renderWithProviders from '@kitman/common/src/utils/renderWithProviders';

const mockAthlete = {
  ...pastAthletes.athletes[0],
  player_id: 1,
};

describe('buildCellContent', () => {
  it('renders player cell correctly', () => {
    renderWithProviders(
      buildCellContent({
        field: FIELD_KEY.player,
        row: mockAthlete,
      })
    );

    expect(screen.getByText(mockAthlete.fullname)).toBeInTheDocument();
  });
  it('renders player id cell correctly', () => {
    renderWithProviders(
      buildCellContent({
        field: FIELD_KEY.player_id,
        row: mockAthlete,
      })
    );

    expect(screen.getByText(mockAthlete.player_id)).toBeInTheDocument();
  });

  it('renders departed date cell correctly', () => {
    renderWithProviders(
      buildCellContent({
        field: FIELD_KEY.departed_date,
        row: mockAthlete,
      })
    );

    expect(screen.getByText('Nov 22, 2022')).toBeInTheDocument();
  });

  it('renders open injury/ illness cell correctly', () => {
    renderWithProviders(
      buildCellContent({
        field: FIELD_KEY.open_injury_illness,
        row: mockAthlete,
      })
    );

    expect(
      screen.getByText('28 Aug 2023 - Capitellar osteochondrosis [Left]')
    ).toBeInTheDocument();
    expect(screen.getByText('Unavailable - time-loss')).toBeInTheDocument();
  });
});
