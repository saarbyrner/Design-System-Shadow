import { render, screen } from '@testing-library/react';
import { data } from '@kitman/modules/src/shared/MassUpload/services/mocks/data/mock_athlete_csv';
import buildCellContent from '../cellBuilder';

describe('buildCellContent', () => {
  describe('Valid CS Data', () => {
    const cells = [
      'FirstName',
      'LastName',
      'Email',
      'DOB',
      'SquadName',
      'Country',
      'Position',
    ];

    cells.forEach((cell) => {
      it(`renders the ${cell} cell for a valid athlete`, () => {
        render(buildCellContent({ row_key: cell }, data.validData[0]));
        expect(screen.getByText(data.validData[0][cell])).toBeInTheDocument();
      });
    });
  });

  describe('Invalid CS Data', () => {
    const cells = [
      'FirstName',
      'LastName',
      'Email',
      'DOB',
      'SquadName',
      'Country',
      'Position',
    ];

    cells.forEach((cell) => {
      it(`renders the ${cell} cell in an error state for an invalid athlete`, () => {
        render(buildCellContent({ row_key: cell }, data.invalidData[0], true));
        expect(screen.getByTestId('InvalidCell')).toHaveClass('icon-warning');
      });
    });
  });
});
