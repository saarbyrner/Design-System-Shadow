import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import EditGroupingData from '../components/EditGroupingData';

jest.mock('@kitman/modules/src/analysis/Dashboard/redux/services/chartBuilder');
const onSelectedGrouping = jest.fn();

describe('Table Widget | RowPanel: <EditGroupingData />', () => {
  const mockProps = {
    groupingOptions: [
      {
        label: 'Athlete',
        value: 'athlete_id',
      },
      {
        label: 'Squad',
        value: 'squad',
      },
      {
        label: 'No grouping',
        value: 'no_grouping',
      },
    ],
    selectedPopulation: [
      {
        id: 72,
        type: 'positions',
        squadId: 8,
        option: {
          type: 'positions',
          id: 72,
          name: 'Loose-head Prop',
        },
        contextSquads: [],
      },
      {
        id: 51488,
        type: 'athletes',
        squadId: 8,
        option: {
          type: 'athletes',
          id: 51488,
          name: 'Athlete A',
          fullname: 'Athlete A',
          firstname: 'Athlete',
          lastname: 'A',
          avatar_url: null,
          position: {
            type: 'positions',
            id: 72,
            name: 'Loose-head Prop',
          },
          positionGroup: {
            type: 'position_groups',
            id: 25,
            name: 'Forward',
          },
        },
        contextSquads: [],
      },
    ],
    onSelectedGrouping,
    t: i18nextTranslateStub(),
  };

  it('renders the groupings header text', () => {
    render(<EditGroupingData {...mockProps} />);

    expect(screen.getByText('Groupings')).toBeVisible();
  });

  it('renders selected populations on screen', () => {
    render(<EditGroupingData {...mockProps} />);

    mockProps.selectedPopulation.forEach((population) => {
      expect(screen.getByText(population.option.name)).toBeVisible();
    });
  });

  it('does not render historic populations', () => {
    const mockHistoricPopulation = {
      id: 51488,
      type: 'athletes',
      squadId: 8,
      historic: true,
      option: {
        type: 'athletes',
        id: 51488,
        name: 'Historic Athlete A',
      },
      contextSquads: [],
    };

    render(
      <EditGroupingData
        {...mockProps}
        selectedPopulation={[
          ...mockProps.selectedPopulation,
          mockHistoricPopulation,
        ]}
      />
    );

    expect(
      screen.queryByText(mockHistoricPopulation.option.name)
    ).not.toBeInTheDocument();
  });

  it('renders a group by selector for each population', () => {
    render(<EditGroupingData {...mockProps} />);

    const groupBySelectors = screen.getAllByLabelText('Group by');

    expect(groupBySelectors.length).toBe(mockProps.selectedPopulation.length);
  });

  it('renders a list of population groupings on select', async () => {
    const user = userEvent.setup();

    render(<EditGroupingData {...mockProps} />);

    const groupBySelectors = screen.getAllByLabelText('Group by');

    await user.click(groupBySelectors[0]);

    expect(screen.getByText('Athlete')).toBeVisible();
    expect(screen.getByText('Squad')).toBeVisible();
    expect(screen.getByText('No grouping')).toBeVisible();
  });

  it('calls "onSelectedGrouping" when clicking a grouping', async () => {
    const user = userEvent.setup();

    render(<EditGroupingData {...mockProps} />);

    const groupBySelectors = screen.getAllByLabelText('Group by');

    await user.click(groupBySelectors[0]);
    await user.click(screen.getByText('No grouping'));
    expect(onSelectedGrouping).toHaveBeenCalled();
  });

  it('calls "onSelectedGrouping" with the expected data', async () => {
    const user = userEvent.setup();

    render(<EditGroupingData {...mockProps} />);

    const groupBySelectors = screen.getAllByLabelText('Group by');

    await user.click(groupBySelectors[0]);

    await user.click(screen.getByText('Athlete'));
    expect(onSelectedGrouping).toHaveBeenCalledWith({
      id: 72,
      type: 'positions',
      squadId: 8,
      grouping: 'athlete_id',
    });
  });
});
