import { render, screen } from '@testing-library/react';
import i18n from 'i18next';
import userEvent from '@testing-library/user-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';

import DynamicColumnHeader from '../DynamicColumnHeader';

describe('DynamicColumnHeader', () => {
  const i18nT = i18nextTranslateStub(i18n);
  const props = {
    columnName: 'International Squad',
    onClickDeleteColumn: jest.fn(),
    onClickEditColumn: jest.fn(),
    onClickSortColumn: jest.fn(),
    setColumnRankingCalculation: jest.fn(),
    canManageDashboard: true,
    isHistoricPopulation: false,
    squads: [],
    t: i18nT,
  };

  describe('when FF rep-historic-reporting is on', () => {
    beforeEach(() => {
      window.setFlag('rep-historic-reporting', true);
      window.setFlag('table-updated-pivot', true);
    });

    afterEach(() => {
      window.setFlag('rep-historic-reporting', false);
      window.setFlag('table-updated-pivot', false);
    });

    it('shows the text Historical squad if isHistoricPopulation is true', () => {
      render(<DynamicColumnHeader {...props} isHistoricPopulation />);
      expect(screen.getByText('Historical squad')).toBeInTheDocument();
    });

    it('does not show the Historical squad text if isHistoricPopulation is false', () => {
      render(<DynamicColumnHeader {...props} isHistoricPopulation={false} />);
      expect(screen.queryByText('Historical squad')).not.toBeInTheDocument();
    });

    it('renders Edit and Delete Row menu items', async () => {
      const user = userEvent.setup();

      render(<DynamicColumnHeader {...props} />);
      await user.click(screen.getByText('International Squad'));
      expect(screen.getByText('Edit')).toBeInTheDocument();
      expect(screen.getByText('Delete Row(s)')).toBeInTheDocument();
    });

    it('renders the burger menu icon', () => {
      render(<DynamicColumnHeader {...props} />);
      const burgerMenuIcon = document.querySelector(
        '.tableWidget__rowHeader--burgerMenu.icon-more'
      );
      expect(burgerMenuIcon).toBeInTheDocument();
      expect(burgerMenuIcon).toHaveClass(
        'tableWidget__rowHeader--burgerMenu',
        'icon-more'
      );
    });
  });
});
