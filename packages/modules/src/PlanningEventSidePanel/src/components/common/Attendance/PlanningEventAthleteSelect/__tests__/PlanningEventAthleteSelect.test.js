import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import selectEvent from 'react-select-event';
import { VirtuosoMockContext } from 'react-virtuoso';

import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { server, rest } from '@kitman/services/src/mocks/server';
import { data as mockSquadAthletes } from '@kitman/services/src/mocks/handlers/getSquadAthletes';

import PlanningEventAthleteSelect from '../PlanningEventAthleteSelect';

const mockOnUpdateEventDetails = jest.fn();

const defaultProps = {
  onUpdateEventDetails: mockOnUpdateEventDetails,
  athleteIds: [],
  t: i18nextTranslateStub(),
};

describe('<PlanningEventAthleteSelect />', () => {
  beforeEach(() => {
    server.use(
      rest.get('/ui/squad_athletes', (req, res, ctx) => {
        return res(ctx.json(mockSquadAthletes));
      })
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
    server.resetHandlers();
  });

  const renderAndAwait = async (props = defaultProps) => {
    render(<PlanningEventAthleteSelect {...props} />, {
      wrapper: ({ children }) => (
        <VirtuosoMockContext.Provider
          value={{ viewportHeight: 10000, itemHeight: 50 }}
        >
          {children}
        </VirtuosoMockContext.Provider>
      ),
    });

    await waitFor(() => {
      expect(screen.getByLabelText('Athletes')).toBeInTheDocument();
    });
  };

  it('renders with default placeholder text when no athletes are selected', async () => {
    await renderAndAwait();
    expect(screen.getByText('No athletes selected')).toBeInTheDocument();
  });

  it('renders with athletes label', async () => {
    await renderAndAwait();
    expect(screen.getByText('Athletes')).toBeInTheDocument();
  });

  it('calls onUpdateEventDetails when athletes are selected', async () => {
    const user = userEvent.setup();
    await renderAndAwait();

    await selectEvent.openMenu(screen.getByLabelText('Athletes'));
    await user.click(await screen.findByText('International Squad'));
    await user.click(await screen.findByText('Athlete Two'));

    expect(mockOnUpdateEventDetails).toHaveBeenCalledWith({
      athlete_ids: [2],
    });
  });

  it('calls onUpdateEventDetails with empty array when all selections are cleared', async () => {
    const propsWithSelectedAthletes = {
      ...defaultProps,
      athleteIds: [1, 2],
    };

    const user = userEvent.setup();
    await renderAndAwait(propsWithSelectedAthletes);

    await selectEvent.openMenu(screen.getByLabelText('Athletes'));
    await user.click(screen.getByText('International Squad'));
    await user.click(screen.getAllByText('Clear all')[0]);

    expect(mockOnUpdateEventDetails).toHaveBeenCalledWith({
      athlete_ids: [],
    });
  });

  it('calls onSelectAllClick when Select all is clicked', async () => {
    const user = userEvent.setup();
    await renderAndAwait();

    await selectEvent.openMenu(screen.getByLabelText('Athletes'));
    await user.click(screen.getByText('International Squad'));
    await user.click(screen.getAllByText('Select all')[0]);

    expect(mockOnUpdateEventDetails).toHaveBeenCalled();
  });

  it('calls onClearAllClick when Clear All is clicked', async () => {
    const user = userEvent.setup();
    const propsWithSelectedAthletes = {
      ...defaultProps,
      athleteIds: [1, 2],
    };

    await renderAndAwait(propsWithSelectedAthletes);

    await selectEvent.openMenu(screen.getByLabelText('Athletes'));
    await user.click(screen.getByText('International Squad'));
    await user.click(screen.getAllByText('Clear all')[0]);

    expect(mockOnUpdateEventDetails).toHaveBeenCalled();
  });

  it('displays selected athletes correctly when athleteIds prop is provided', async () => {
    const propsWithSelectedAthletes = {
      ...defaultProps,
      athleteIds: [1, 2],
    };

    await renderAndAwait(propsWithSelectedAthletes);

    expect(screen.queryByText('No athletes selected')).not.toBeInTheDocument();
    expect(screen.getByText('Athlete One, Athlete Two')).toBeInTheDocument();
  });

  it('uses filteredAthletes prop when provided instead of loading all athletes', async () => {
    const filteredAthletes = [
      {
        id: 1,
        name: 'Filtered Squad',
        owner_id: 6,
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-01T00:00:00Z',
        position_groups: [
          {
            id: 1,
            name: 'Test Position Group',
            order: 1,
            positions: [
              {
                id: 1,
                name: 'Test Position',
                order: 1,
                athletes: [
                  {
                    id: 999,
                    firstname: 'Filtered',
                    lastname: 'Athlete',
                    fullname: 'Filtered Athlete',
                    shortname: 'F Athlete',
                    user_id: 999,
                    avatar_url: '',
                  },
                ],
              },
            ],
          },
        ],
      },
    ];

    const propsWithFilteredAthletes = {
      ...defaultProps,
      filteredAthletes,
    };

    await renderAndAwait(propsWithFilteredAthletes);

    await selectEvent.openMenu(screen.getByLabelText('Athletes'));

    expect(screen.getByText('Filtered Squad')).toBeInTheDocument();
    expect(screen.getByText('Filtered Athlete')).toBeInTheDocument();
  });

  it('merges new selections with existing athleteIds correctly', async () => {
    const user = userEvent.setup();
    const propsWithExistingIds = {
      ...defaultProps,
      athleteIds: [1],
    };

    await renderAndAwait(propsWithExistingIds);

    await selectEvent.openMenu(screen.getByLabelText('Athletes'));
    await user.click(screen.getByText('International Squad'));
    await user.click(screen.getAllByText('Select all')[0]);

    expect(mockOnUpdateEventDetails).toHaveBeenCalledWith({
      athlete_ids: [1, 2],
    });
  });
});
