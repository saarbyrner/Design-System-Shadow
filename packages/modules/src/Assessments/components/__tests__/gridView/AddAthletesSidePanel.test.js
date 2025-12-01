import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import renderWithRedux from '@kitman/common/src/utils/renderWithRedux';
import SquadAthletesContext from '@kitman/modules/src/Assessments/contexts/SquadAthletesContext';
import AddAthletesSidePanel from '../../gridView/AddAthletesSidePanel';

describe('<AddAthletesSidePanel />', () => {
  let baseProps;
  let squadAthletes;
  let allAthletes;

  beforeEach(() => {
    baseProps = {
      selectedAthleteIds: [],
      onSave: jest.fn(),
      onClose: jest.fn(),
      t: i18nextTranslateStub(),
    };

    allAthletes = [
      {
        id: 12410,
        fullname: 'John Doe',
        avatar_url: '01_fake_avatar_url',
        position_group: 'Goalkeeper',
      },
      {
        id: 54565,
        fullname: 'Paul Smith',
        avatar_url: '02_fake_avatar_url',
        position_group: 'Goalkeeper',
      },
      {
        id: 45557,
        fullname: 'Peter Callahan',
        avatar_url: '04_fake_avatar_url',
        position_group: 'Defenders',
      },
      {
        id: 96844,
        fullname: 'Thomas Roth',
        avatar_url: '025_fake_avatar_url',
        position_group: 'Defenders',
      },
    ];

    squadAthletes = {
      id: 452,
      name: 'Mocked team',
      position_groups: [
        {
          id: 78,
          name: 'Goalkeeper',
          positions: [
            {
              id: 956,
              name: 'Mocked position',
              athletes: [
                {
                  id: 12410,
                  fullname: 'John Doe',
                  avatar_url: '01_fake_avatar_url',
                  position_group: 'Goalkeeper',
                },
                {
                  id: 54565,
                  fullname: 'Paul Smith',
                  avatar_url: '02_fake_avatar_url',
                  position_group: 'Goalkeeper',
                },
              ],
            },
          ],
        },
        {
          id: 67,
          name: 'Defenders',
          positions: [
            {
              id: 754,
              name: 'Mocked position',
              athletes: [
                {
                  id: 45557,
                  fullname: 'Peter Callahan',
                  avatar_url: '04_fake_avatar_url',
                  position_group: 'Defenders',
                },
                {
                  id: 96844,
                  fullname: 'Thomas Roth',
                  avatar_url: '025_fake_avatar_url',
                  position_group: 'Defenders',
                },
              ],
            },
          ],
        },
      ],
    };
  });

  const renderComponent = (props, state = {}) => {
    const preloadedState = {
      athletes: allAthletes,
      ...state,
    };

    return renderWithRedux(
      <SquadAthletesContext.Provider value={squadAthletes}>
        <AddAthletesSidePanel {...props} />
      </SquadAthletesContext.Provider>,
      { preloadedState, useGlobalStore: false }
    );
  };

  it('renders the side panel with a list of all athletes', () => {
    renderComponent(baseProps);

    expect(screen.getByText('Add Athletes')).toBeInTheDocument();

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Peter Callahan')).toBeInTheDocument();
  });

  it('pre-selects athletes based on the selectedAthleteIds prop', () => {
    renderComponent({ ...baseProps, selectedAthleteIds: [12410, 96844] });

    expect(screen.getByRole('checkbox', { name: 'John Doe' })).toBeChecked();
    expect(screen.getByRole('checkbox', { name: 'Thomas Roth' })).toBeChecked();
    expect(
      screen.getByRole('checkbox', { name: 'Paul Smith' })
    ).not.toBeChecked();
  });

  it('calls onSave with selected athletes and closes when the save button is clicked', async () => {
    const user = userEvent.setup();
    renderComponent(baseProps);

    await user.click(screen.getByRole('checkbox', { name: 'John Doe' }));
    await user.click(screen.getByRole('checkbox', { name: 'Peter Callahan' }));

    await user.click(screen.getByRole('button', { name: /save/i }));

    expect(baseProps.onSave).toHaveBeenCalledTimes(1);
    expect(baseProps.onSave).toHaveBeenCalledWith([
      squadAthletes.position_groups[0].positions[0].athletes[0], // John Doe
      squadAthletes.position_groups[1].positions[0].athletes[0], // Peter Callahan
    ]);

    expect(baseProps.onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onSave with an empty array if no athletes are selected', async () => {
    const user = userEvent.setup();
    renderComponent(baseProps);

    await user.click(screen.getByRole('button', { name: /save/i }));

    expect(baseProps.onSave).toHaveBeenCalledTimes(1);
    expect(baseProps.onSave).toHaveBeenCalledWith([]);
    expect(baseProps.onClose).toHaveBeenCalledTimes(1);
  });
});
