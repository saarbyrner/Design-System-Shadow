import { render, screen } from '@testing-library/react';
import i18n from 'i18next';
import userEvent from '@testing-library/user-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { emptySquadAthletes } from '@kitman/modules/src/analysis/Dashboard/components/utils';
import ScorecardColumnHeader from '../ScorecardColumnHeader';

jest.mock('@kitman/common/src/contexts/PermissionsContext', () => ({
  usePermissions: jest.fn(),
}));

describe('ScorecardColumnHeader', () => {
  const i18nT = i18nextTranslateStub(i18n);
  const props = {
    columnName: 'Entire Squad',
    isSorted: false,
    canManageDashboard: true,
    isPivotLocked: false,
    onClickLockColumnPivot: jest.fn(),
    t: i18nT,
  };

  it('renders the column header with the correct name', () => {
    render(<ScorecardColumnHeader {...props} />);
    expect(screen.getByText('Entire Squad')).toBeInTheDocument();
  });

  it('renders a meatball menu with the correct items', async () => {
    const options = ['Edit', 'Sort', 'High - Low', 'Low - High'];
    const user = userEvent.setup();
    const { container } = render(
      <ScorecardColumnHeader
        {...props}
        populationDetails={{ ...emptySquadAthletes }}
      />
    );

    const menuTrigger = container.querySelector('.icon-more');
    await user.click(menuTrigger);

    options.forEach((option) => {
      expect(screen.getByText(option)).toBeInTheDocument();
    });
  });

  describe('when FF rep-historic-reporting is on', () => {
    beforeEach(() => {
      window.setFlag('rep-historic-reporting', true);
      window.setFlag('table-updated-pivot', true);
    });

    afterEach(() => {
      window.setFlag('rep-historic-reporting', false);
      window.setFlag('table-updated-pivot', false);
    });

    it('shows the text Historical squad if historic is true in the population', () => {
      render(
        <ScorecardColumnHeader
          {...props}
          populationDetails={{ ...emptySquadAthletes, historic: true }}
        />
      );
      expect(screen.getByText('Historical squad')).toBeInTheDocument();
    });

    it('does not show the Historical squad text if historic is false in the population', () => {
      render(
        <ScorecardColumnHeader
          {...props}
          populationDetails={{ ...emptySquadAthletes }}
        />
      );
      expect(screen.queryByText('Historical squad')).not.toBeInTheDocument();
    });

    it('renders Lock Pivot button', async () => {
      const user = userEvent.setup();

      render(
        <ScorecardColumnHeader
          {...props}
          populationDetails={{ ...emptySquadAthletes }}
        />
      );
      await user.click(screen.getByText('Entire Squad'));
      expect(screen.getByText('Lock Pivot')).toBeInTheDocument();
    });
  });
});
