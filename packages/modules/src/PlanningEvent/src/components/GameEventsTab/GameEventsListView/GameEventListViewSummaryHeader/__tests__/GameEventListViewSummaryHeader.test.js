import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { eventTypes } from '@kitman/common/src/consts/gameEventConsts';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';

import GameEventListViewSummaryHeader from '../GameEventListViewSummaryHeader';

describe('GameEventLsitViewSummaryHeader', () => {
  const defaultProps = {
    gameActivities: [
      {
        id: 1,
        kind: eventTypes.formation_change,
        absolute_minute: 10,
        relation: { id: 1, name: '4-4-2' },
      },
      {
        id: 2,
        kind: eventTypes.formation_change,
        absolute_minute: 30,
        relation: { id: 2, name: '4-3-3' },
      },
    ],

    t: i18nextTranslateStub(),
    periods: [{ duration: 45 }, { duration: 45 }],
    onOpenPeriodPanel: jest.fn(),
  };

  const renderComponent = (props = defaultProps) =>
    render(<GameEventListViewSummaryHeader {...props} />);

  describe('initial render', () => {
    it('renders the title', () => {
      renderComponent();
      expect(screen.getByText('Game summary')).toBeInTheDocument();
    });
    it('renders the correct amount of periods, formations, and calculates the duration correctly', () => {
      renderComponent();
      expect(
        screen.getByText(
          'Total duration: 90 mins | Number of periods: 2 | 4-4-2 | 4-3-3'
        )
      ).toBeInTheDocument();
    });
  });

  describe('onOpenPeriodPanel render', () => {
    it('allows the user to click the burger icon and fire onOpenPeriodPanel', async () => {
      const user = userEvent.setup();
      renderComponent();
      await user.click(screen.getByRole('button'));
      expect(defaultProps.onOpenPeriodPanel).toHaveBeenCalled();
    });
  });
});
