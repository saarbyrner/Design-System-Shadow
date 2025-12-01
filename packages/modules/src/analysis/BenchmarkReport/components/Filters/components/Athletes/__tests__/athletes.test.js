import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { VirtuosoMockContext } from 'react-virtuoso';
import Athletes from '..';
import { render } from '../../../../../testUtils';
import * as services from '../../../../../redux/service';

const mockSetFilter = jest.fn();

jest.mock('../../../../../hooks/useFilter', () => {
  return jest.fn(() => ({
    filter: {
      athlete_ids: [1],
      seasons: [],
      testing_window_ids: [],
    },
    setFilter: mockSetFilter,
  }));
});

const MOCK_SQUAD_ATHLETES = {
  squads: [
    {
      id: 8,
      name: 'International Squad',
      position_groups: [
        {
          id: 1,
          name: 'Forward',
          order: 1,
          positions: [
            {
              id: 1,
              name: 'Loose-head Prop',
              order: 1,
              athletes: [
                {
                  id: 1,
                  firstname: 'A Athlete',
                  lastname: 'One',
                  fullname: 'A Athlete One',
                  shortname: 'A. One',
                  user_id: 1,
                  avatar_url: 'url_string',
                },
                {
                  id: 2,
                  firstname: 'B Athlete',
                  lastname: 'Two',
                  fullname: 'B Athlete Two',
                  shortname: 'B. Two',
                  user_id: 2,
                  avatar_url: 'url_string',
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};

const props = {
  t: i18nextTranslateStub(),
};

describe('BenchmarkReport|Filters|Athletes', () => {
  beforeEach(() => {
    jest.spyOn(services, 'useGetAllSquadAthletesQuery').mockReturnValue({
      data: MOCK_SQUAD_ATHLETES,
      isFetching: false,
    });
  });

  it('renders the Athletes component', () => {
    render(<Athletes {...props} />);

    const athletes = screen.getByLabelText('Athlete(s)');

    expect(athletes).toBeInTheDocument();
  });

  it('renders the filter prefilled from the useFilter hook', () => {
    render(<Athletes {...props} />);

    const athlete = screen.getByText('A Athlete One');

    expect(athlete).toBeInTheDocument();
  });

  it('renders the athlete options', async () => {
    const user = userEvent.setup();
    const { container } = render(<Athletes {...props} />, {
      wrapper: ({ children }) => (
        <VirtuosoMockContext.Provider
          value={{ viewportHeight: 2000, itemHeight: 50 }}
        >
          {children}
        </VirtuosoMockContext.Provider>
      ),
    });

    // click on select dropdown
    await user.click(container.querySelectorAll('.kitmanReactSelect input')[0]);

    expect(screen.getByText('B Athlete Two')).toBeInTheDocument();
  });

  it('calls setFilter when option(s) are selected', async () => {
    const user = userEvent.setup();
    const { container } = render(<Athletes {...props} />, {
      wrapper: ({ children }) => (
        <VirtuosoMockContext.Provider
          value={{ viewportHeight: 2000, itemHeight: 50 }}
        >
          {children}
        </VirtuosoMockContext.Provider>
      ),
    });
    // click on select dropdown
    await user.click(container.querySelectorAll('.kitmanReactSelect input')[0]);
    // click on an option
    await user.click(screen.getByText('B Athlete Two'));

    expect(mockSetFilter).toHaveBeenCalledWith({
      athlete_ids: [1, 2],
      seasons: [],
      testing_window_ids: [],
    });
  });
});
