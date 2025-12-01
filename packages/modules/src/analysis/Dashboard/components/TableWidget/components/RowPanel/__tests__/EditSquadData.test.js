import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import selectEvent from 'react-select-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { useOptionSelect } from '@kitman/components/src/Athletes/hooks';
import EditSquadData from '../components/EditSquadData';

jest.mock('@kitman/components/src/Athletes/hooks', () => ({
  ...jest.requireActual('@kitman/components/src/Athletes/hooks'),
  useOptions: jest.fn().mockReturnValue({
    data: [
      {
        id: 8,
        name: 'International Squad',
        options: [
          { type: 'position_groups', id: 25, name: 'Forward' },
          { type: 'positions', id: 72, name: 'Loose-head Prop' },
          {
            type: 'athletes',
            id: 33925,
            name: 'AJ McClune',
            fullname: 'AJ McClune',
            firstname: 'AJ',
            lastname: 'McClune',
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
          {
            type: 'athletes',
            id: 53839,
            name: 'Athlete QA',
            fullname: 'Athlete QA',
            firstname: 'Athlete',
            lastname: 'QA',
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
          {
            type: 'athletes',
            id: 81233,
            name: 'Bhuvan Bhatt',
            fullname: 'Bhuvan Bhatt',
            firstname: 'Bhuvan',
            lastname: 'Bhatt',
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
        ],
      },
      {
        id: 73,
        name: 'Academy Squad',
        options: [
          { type: 'position_groups', id: 25, name: 'Forward' },
          { type: 'positions', id: 72, name: 'Loose-head Prop' },
          {
            type: 'athletes',
            id: 66776,
            name: 'Android Tester',
            fullname: 'Android Tester',
            firstname: 'Android',
            lastname: 'Tester',
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
          {
            type: 'athletes',
            id: 81233,
            name: 'Bhuvan Bhatt',
            fullname: 'Bhuvan Bhatt',
            firstname: 'Bhuvan',
            lastname: 'Bhatt',
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
          {
            type: 'athletes',
            id: 74104,
            name: 'Dewalt Duvenage',
            fullname: 'Dewalt Duvenage',
            firstname: 'Dewalt',
            lastname: 'Duvenage',
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
          {
            type: 'athletes',
            id: 58157,
            name: 'Message Test Steve1',
            fullname: 'Message Test Steve1',
            firstname: 'Message',
            lastname: 'Test Steve1',
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
          {
            type: 'athletes',
            id: 32774,
            name: 'Sarah Jones',
            fullname: 'Sarah Jones',
            firstname: 'Sarah',
            lastname: 'Jones',
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
        ],
      },
    ],
  }),
  useOptionSelect: jest.fn().mockReturnValue({
    isSelected: jest.fn(),
  }),
}));

describe('TableWidget| RowPanel: <EditSquadData />', () => {
  const i18nT = i18nextTranslateStub();
  const mockProps = {
    selectedPopulation: [],
    setAllContextSquads: jest.fn(),
    onChangeContextSquads: jest.fn(),
    t: i18nT,
  };

  const mockIsSelected = (selectedPopulationItems) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { isSelected } = useOptionSelect();
    isSelected.mockImplementation((id, type, squadId) => {
      const index = selectedPopulationItems.findIndex(
        (item) =>
          item.id === id && item.type === type && item.squadId === squadId
      );
      return index > -1;
    });
  };

  it('renders a checkbox for the selected grouping', () => {
    render(<EditSquadData {...mockProps} />);

    expect(screen.getAllByText('Athlete').length).toEqual(1);
    expect(screen.getAllByText('Include data from').length).toEqual(1);
  });

  it('renders selected athletes grouped by squad with a squad select for each one', async () => {
    const MOCK_POPULATION = [
      { id: 25, contextSquads: [], squadId: 8, type: 'position_groups' },
      { id: 53839, contextSquads: [], squadId: 8, type: 'athletes' },
    ];
    mockIsSelected(MOCK_POPULATION);

    render(
      <EditSquadData {...mockProps} selectedPopulation={MOCK_POPULATION} />
    );

    expect(screen.getByText('International Squad')).toBeInTheDocument();
    expect(screen.getByText('Forward')).toBeInTheDocument();
    expect(screen.getByLabelText('Forward')).toBeInTheDocument();

    expect(screen.getByText('Athlete QA')).toBeInTheDocument();
    expect(screen.getByLabelText('Athlete QA')).toBeInTheDocument();
  });

  it('calls onChangeContextSquads when clicking a select', async () => {
    const MOCK_POPULATION = [
      { id: 25, contextSquads: [], squadId: 8, type: 'position_groups' },
      { id: 53839, contextSquads: [], squadId: 8, type: 'athletes' },
    ];
    mockIsSelected(MOCK_POPULATION);

    render(
      <EditSquadData {...mockProps} selectedPopulation={MOCK_POPULATION} />
    );

    const forwardInput = screen.getByLabelText('Forward');

    selectEvent.openMenu(forwardInput);

    const labelContainer =
      forwardInput.closest('.kitmanReactSelect').parentElement;

    await selectEvent.select(labelContainer, ['International Squad']);

    expect(mockProps.onChangeContextSquads).toHaveBeenCalledWith(
      25,
      'position_groups',
      8,
      [8]
    );
  });
  it('renders the Other squad selections for null squadId options', () => {
    const MOCK_POPULATION = [
      {
        id: 25,
        contextSquads: [],
        squadId: null,
        type: 'position_groups',
        option: { id: 25, name: 'Forward', type: 'position_groups' },
      },
      {
        id: 53839,
        contextSquads: [],
        squadId: null,
        type: 'athletes',
        option: { id: 53839, name: 'Athlete QA', type: 'position_groups' },
      },
    ];
    mockIsSelected(MOCK_POPULATION);

    render(
      <EditSquadData {...mockProps} selectedPopulation={MOCK_POPULATION} />
    );

    expect(screen.getByText('Non-squad selections')).toBeInTheDocument();
    expect(screen.getByText('Forward')).toBeInTheDocument();
    expect(screen.getByLabelText('Forward')).toBeInTheDocument();

    expect(screen.getByText('Athlete QA')).toBeInTheDocument();
    expect(screen.getByLabelText('Athlete QA')).toBeInTheDocument();
  });

  it('renders calls onChangeContextSquads with currect params for null squadId options', async () => {
    const MOCK_POPULATION = [
      {
        id: 25,
        contextSquads: [],
        squadId: null,
        type: 'position_groups',
        option: { id: 25, name: 'Forward', type: 'position_groups' },
      },
      {
        id: 53839,
        contextSquads: [],
        squadId: null,
        type: 'athletes',
        option: { id: 53839, name: 'Athlete QA', type: 'position_groups' },
      },
    ];
    mockIsSelected(MOCK_POPULATION);

    render(
      <EditSquadData {...mockProps} selectedPopulation={MOCK_POPULATION} />
    );
    const forwardInput = screen.getByLabelText('Forward');

    selectEvent.openMenu(forwardInput);

    const labelContainer =
      forwardInput.closest('.kitmanReactSelect').parentElement;

    await selectEvent.select(labelContainer, ['International Squad']);

    expect(mockProps.onChangeContextSquads).toHaveBeenCalledWith(
      25,
      'position_groups',
      null,
      [8]
    );
  });

  describe('when using the set all feature', () => {
    it('renders a tooltip with squads for setting all', async () => {
      const MOCK_POPULATION = [
        { id: 25, contextSquads: [], squadId: 8, type: 'position_groups' },
        { id: 53839, contextSquads: [], squadId: 8, type: 'athletes' },
      ];
      mockIsSelected(MOCK_POPULATION);
      const user = userEvent.setup();

      render(
        <EditSquadData {...mockProps} selectedPopulation={MOCK_POPULATION} />
      );

      await user.click(screen.getByText('Set all'));

      expect(screen.queryByRole('tooltip')).toBeVisible();
      expect(
        screen.queryByRole('checkbox', {
          name: 'International Squad',
        })
      ).toBeInTheDocument();
      expect(
        screen.queryByRole('checkbox', {
          name: 'Academy Squad',
        })
      ).toBeInTheDocument();
    });

    it('calls setAllContextSquads when setting all', async () => {
      const MOCK_POPULATION = [
        { id: 25, contextSquads: [], squadId: 8, type: 'position_groups' },
        { id: 53839, contextSquads: [], squadId: 8, type: 'athletes' },
      ];
      mockIsSelected(MOCK_POPULATION);
      const user = userEvent.setup();

      render(
        <EditSquadData {...mockProps} selectedPopulation={MOCK_POPULATION} />
      );

      await user.click(screen.getByText('Set all'));

      await user.click(
        screen.queryByRole('checkbox', {
          name: 'International Squad',
        })
      );

      expect(
        screen.queryByRole('checkbox', {
          name: 'International Squad',
        })
      ).toBeChecked();

      const getTooltip = () => screen.queryByRole('tooltip');

      await user.click(
        within(getTooltip()).getByRole('button', {
          name: 'Set all',
        })
      );

      expect(mockProps.setAllContextSquads).toHaveBeenCalledWith([8]);
    });
  });
});
