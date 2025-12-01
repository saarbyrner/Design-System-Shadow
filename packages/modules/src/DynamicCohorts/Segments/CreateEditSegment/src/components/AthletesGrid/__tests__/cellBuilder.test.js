import { render, screen } from '@testing-library/react';
import { paginatedAthletesResponse } from '@kitman/services/src/mocks/handlers/dynamicCohorts/Segments/searchAthletes';
import { buildCellContent, ROW_KEY } from '../cellBuilder';

describe('buildCellContent', () => {
  it('returns the correct cell content for athlete key', () => {
    render(
      buildCellContent({
        row_key: ROW_KEY.athlete,
        athlete: paginatedAthletesResponse.athletes[0],
      })
    );

    // link with athletes name
    expect(
      screen.getByRole('link', {
        name: paginatedAthletesResponse.athletes[0].name,
      })
    ).toBeInTheDocument();

    // avatar
    expect(
      screen.getByRole('img', {
        name: paginatedAthletesResponse.athletes[0].name,
      })
    ).toBeInTheDocument();
  });
});
