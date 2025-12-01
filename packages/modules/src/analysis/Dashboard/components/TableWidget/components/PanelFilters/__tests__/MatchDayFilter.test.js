import { VirtuosoMockContext } from 'react-virtuoso';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithStore } from '@kitman/modules/src/analysis/Dashboard/utils/testUitils';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { render } from '@kitman/modules/src/analysis/BenchmarkReport/testUtils';
import MatchDayFilter from '../components/MatchDayFilter';
import { GAMEDAY_FILTER_OPTIONS as options } from '../../../consts';

describe('<MatchDayFilter />', () => {
  beforeEach(() => {
    window.setFlag('rep-match-day-filter', true);
  });

  afterEach(() => {
    window.setFlag('rep-match-day-filter', false);
  });

  const props = {
    t: i18nextTranslateStub(),
    onSelectMatchDays: jest.fn(),
    selectedMatchDays: [],
  };

  it('renders the Match Day filters selector', () => {
    renderWithStore(<MatchDayFilter {...props} />);

    expect(screen.getByLabelText('Game Day +/-')).toBeInTheDocument();
  });

  it('renders the available match day options', async () => {
    const user = userEvent.setup();
    const { container } = render(<MatchDayFilter {...props} />, {
      wrapper: ({ children }) => (
        <VirtuosoMockContext.Provider
          value={{ viewportHeight: 2000, itemHeight: 50 }}
        >
          {children}
        </VirtuosoMockContext.Provider>
      ),
    });

    await user.click(container.querySelectorAll('.kitmanReactSelect input')[0]);

    options.forEach((matchDay) => {
      expect(screen.queryAllByText(matchDay.label)[0]).toBeVisible();
    });
  });

  it('calls props.onSelectMatchDays when clicking on a match day', async () => {
    const user = userEvent.setup();

    const { container } = render(<MatchDayFilter {...props} />, {
      wrapper: ({ children }) => (
        <VirtuosoMockContext.Provider
          value={{ viewportHeight: 2000, itemHeight: 50 }}
        >
          {children}
        </VirtuosoMockContext.Provider>
      ),
    });

    await user.click(container.querySelectorAll('.kitmanReactSelect input')[0]);

    await user.click(screen.getByText(options[1].label));

    expect(props.onSelectMatchDays).toHaveBeenCalledWith([options[1].value]);
  });

  it('renders the filters prefilled from props', () => {
    const updatedProps = {
      ...props,
      selectedMatchDays: [options[1].value, options[2].value],
    };
    renderWithStore(<MatchDayFilter {...updatedProps} />);

    const selectedFilterString = [options[1].label, options[2].label].join(
      ', '
    );

    expect(screen.getByText(selectedFilterString)).toBeVisible();
  });
});
