import { expect } from 'chai';
import { shallow, mount } from 'enzyme';
import sinon from 'sinon';
import ParticipantForm from '../ParticipantForm';

describe('ParticipantForm component', () => {
  const props = {
    availableSquads: [
      {
        id: 8,
        name: 'Squad 1',
        position_groups: [],
      },
      {
        id: 73,
        name: 'Squad 2',
        position_groups: [],
      },
      {
        id: 262,
        name: 'Squad 3',
        position_groups: [],
      },
    ],
    primarySquads: [
      {
        id: 8,
        name: 'Squad 1',
      },
      {
        id: 73,
        name: 'Squad 2',
      },
    ],
    participants: [
      {
        athlete_id: 1,
        athlete_fullname: 'John Doe',
        rpe: 5,
        duration: 30,
        squads: [73, 8, 262],
        availability: 'available',
        participation_level_id: 1,
      },
      {
        athlete_id: 2,
        athlete_fullname: 'Paula Poe',
        rpe: 3,
        duration: 10,
        squads: [73, 262],
        availability: 'unavailable',
        participation_level_id: 2,
      },
      {
        athlete_id: 3,
        athlete_fullname: 'William Woe',
        rpe: 2,
        duration: 20,
        squads: [262],
        availability: 'returning',
        participation_level_id: 2,
      },
    ],
    participationLevels: [
      {
        id: 1,
        name: 'Full',
        canonical_participation_level: 'full',
      },
      {
        id: 2,
        name: 'Modified',
        canonical_participation_level: 'modified',
      },
      {
        id: 3,
        name: 'Partial',
        canonical_participation_level: 'partial',
      },
      {
        id: 4,
        name: 'Did not participate',
        canonical_participation_level: 'none',
      },
    ],
    showSquadTab: true,
    onDurationChange: sinon.spy(),
    onRpeChange: sinon.spy(),
    onToggleIncludeInGroupCalculations: sinon.spy(),
    onChangeAllDurations: sinon.spy(),
    onParticipationLevelChange: sinon.spy(),
    onChangeAllParticipationLevels: sinon.spy(),
    onToggleAllIncludeInGroupCalculations: sinon.spy(),
    onClickSave: sinon.spy(),
    t: (t) => t,
  };

  afterEach(() => {
    props.onClickSave.resetHistory();
  });

  describe('when showSquadTab is false', () => {
    it('shows a list of all the participants of the first squad', () => {
      const wrapper = shallow(
        <ParticipantForm {...props} showSquadTab={false} />
      );

      const tableRows = wrapper.find('tbody tr');

      expect(tableRows).to.have.length(1);

      expect(tableRows.at(0).find('td').at(0).text()).to.contain('John Doe');
    });
  });

  describe('when showSquadTab is true', () => {
    it('shows the squad tabs', () => {
      const wrapper = shallow(<ParticipantForm {...props} showSquadTab />);

      expect(wrapper.find('TabBarComp').props().tabPanes[0].title).to.eq(
        'Squad 1'
      );
      expect(wrapper.find('TabBarComp').props().tabPanes[1].title).to.eq(
        'Squad 2'
      );
      expect(wrapper.find('TabBarComp').props().tabPanes[2].title).to.eq(
        'Squad 3'
      );
    });

    it("shows a list of the selected squad's participants", () => {
      const wrapper = shallow(<ParticipantForm {...props} showSquadTab />);

      let tableRows = wrapper.find('tbody tr');
      expect(tableRows).to.have.length(1);

      expect(tableRows.at(0).find('td').at(0).text()).to.contain('John Doe');

      wrapper.find('TabBarComp').props().onClickTab(1);

      tableRows = wrapper.find('tbody tr');
      expect(tableRows).to.have.length(2);
      expect(tableRows.at(0).find('td').at(0).text()).to.contain('John Doe');
      expect(tableRows.at(1).find('td').at(0).text()).to.contain('Paula Poe');
    });
  });

  it('calls the correct function when updating a duration field', () => {
    const wrapper = shallow(<ParticipantForm {...props} />);

    const firstParticipantRow = wrapper.find('tbody tr').at(0);
    const firstParticipantDurationField = firstParticipantRow
      .find('LoadNamespace(InputNumeric)')
      .at(0);

    firstParticipantDurationField.props().onChange(12);

    expect(props.onDurationChange.calledWith(1, 12)).to.eq(true);
  });

  it('calls the correct function when updating a RPE field', () => {
    const wrapper = shallow(<ParticipantForm {...props} />);

    const firstParticipantRow = wrapper.find('tbody tr').at(0);
    const firstParticipantRpeField = firstParticipantRow
      .find('LoadNamespace(InputNumeric)')
      .at(1);

    firstParticipantRpeField.props().onChange(9);

    expect(props.onRpeChange.calledWith(1, 9)).to.eq(true);
  });

  it('calls the correct function when updating the bulk duration form', () => {
    const wrapper = mount(<ParticipantForm {...props} />);

    wrapper.find('ActionTooltip').at(2).find('Tippy').simulate('click');

    wrapper.update();

    wrapper
      .find('.bulkEditTooltip__durationField InputNumeric')
      .props()
      .onChange(14);

    wrapper.update();

    wrapper.find('ActionTooltip').at(2).props().actionSettings.onCallAction();

    expect(props.onChangeAllDurations.calledWith([1], 14)).to.eq(true);
  });

  it('calls the correct function when clicking the save button', () => {
    const wrapper = shallow(<ParticipantForm {...props} />);

    wrapper.find('ForwardRef(TextButton)').at(1).props().onClick();

    expect(props.onClickSave.calledOnce).to.eq(true);
  });

  describe('when the form is invalid', () => {
    it("doesn't save the form when clicking save", () => {
      const wrapper = shallow(
        <ParticipantForm
          {...props}
          participants={[
            ...props.participants,
            {
              athlete_id: 5,
              athlete_fullname: 'John Doe',
              rpe: 578,
              duration: 30,
              squads: [73, 8, 262],
            },
          ]}
        />
      );

      wrapper.find('ForwardRef(TextButton)').at(1).props().onClick();

      expect(props.onClickSave.calledOnce).to.eq(false);
    });

    it('shows the list of errors', () => {
      const wrapper = shallow(
        <ParticipantForm
          {...props}
          participants={[
            ...props.participants,
            {
              athlete_id: 5,
              athlete_fullname: 'John Doe',
              rpe: 578.5,
              duration: -30,
              squads: [73, 8, 262],
            },
          ]}
        />
      );

      wrapper.find('ForwardRef(TextButton)').at(1).props().onClick();

      expect(wrapper.find('.participantForm__errors li').at(0).text()).to.eq(
        'RPE must be between 0 and 10 (inclusive)'
      );

      expect(wrapper.find('.participantForm__errors li').at(1).text()).to.eq(
        'RPE must be an integer'
      );

      expect(wrapper.find('.participantForm__errors li').at(2).text()).to.eq(
        'Duration must be greater than or equal to 0'
      );
    });
  });

  it('shows a filter section for each squad when showSquadTab is true', () => {
    const wrapper = shallow(<ParticipantForm {...props} showSquadTab />);

    const firstTab = wrapper.find('TabBarComp').props().tabPanes[0];
    expect(firstTab.content.type.displayName).to.equal(
      'LoadNamespace(ParticipantsFilter)'
    );
    expect(firstTab.content.props.squad).to.deep.equal(
      props.availableSquads[0]
    );

    const secondTab = wrapper.find('TabBarComp').props().tabPanes[1];
    expect(secondTab.content.type.displayName).to.equal(
      'LoadNamespace(ParticipantsFilter)'
    );
    expect(secondTab.content.props.squad).to.deep.equal(
      props.availableSquads[1]
    );

    const thirdTab = wrapper.find('TabBarComp').props().tabPanes[2];
    expect(thirdTab.content.type.displayName).to.equal(
      'LoadNamespace(ParticipantsFilter)'
    );
    expect(thirdTab.content.props.squad).to.deep.equal(
      props.availableSquads[2]
    );
  });

  it('shows a filter section for the first squad when showSquadTab is false', () => {
    const wrapper = shallow(
      <ParticipantForm {...props} showSquadTab={false} />
    );

    const participantsFilter = wrapper.find(
      'LoadNamespace(ParticipantsFilter)'
    );
    expect(participantsFilter.props().squad).to.deep.equal(
      props.availableSquads[0]
    );
  });

  it('filters the athletes of the selected squad when the filter changes', () => {
    const wrapper = shallow(
      <ParticipantForm {...props} showSquadTab={false} />
    );

    const participantsFilter = wrapper.find(
      'LoadNamespace(ParticipantsFilter)'
    );

    participantsFilter.props().onFilterChange([1]);

    const tableRows = wrapper.find('tbody tr');
    expect(tableRows).to.have.length(1);
    expect(tableRows.at(0).find('td').at(0).text()).to.contain('John Doe');
  });

  it('shows a message when none of the athletes match the filter', () => {
    const wrapper = shallow(
      <ParticipantForm {...props} showSquadTab={false} />
    );

    const participantsFilter = wrapper.find(
      'LoadNamespace(ParticipantsFilter)'
    );

    participantsFilter.props().onFilterChange([]);

    const tableRow = wrapper.find('tbody tr').at(0);
    expect(tableRow.find('.participantForm__noResult')).to.have.length(1);
  });

  it('shows an availability badge and tooltip for each athlete', () => {
    const wrapper = shallow(
      <ParticipantForm
        {...props}
        participants={props.participants.map((participant) => ({
          ...participant,
          squads: [8],
        }))}
      />
    );

    const tableRows = wrapper.find('tbody tr');

    expect(
      tableRows.at(0).find('.participantForm__availabilityCircle--available')
    ).to.have.length(1);
    expect(tableRows.at(0).find('InfoTooltip').props().content).to.eq(
      'Available'
    );

    expect(
      tableRows.at(1).find('.participantForm__availabilityCircle--unavailable')
    ).to.have.length(1);
    expect(tableRows.at(1).find('InfoTooltip').props().content).to.eq(
      'Unavailable'
    );

    expect(
      tableRows.at(2).find('.participantForm__availabilityCircle--returning')
    ).to.have.length(1);
    expect(tableRows.at(2).find('InfoTooltip').props().content).to.eq(
      'Available (Returning from injury/illness)'
    );
  });

  it('calls the correct function when updating a participation level field', () => {
    const wrapper = shallow(<ParticipantForm {...props} />);

    const firstParticipantRow = wrapper.find('tbody tr').at(0);
    const firstParticipantParticipationLevelField = firstParticipantRow.find(
      'LoadNamespace(Dropdown)'
    );

    firstParticipantParticipationLevelField.props().onChange(2);

    expect(
      props.onParticipationLevelChange.calledWith(1, {
        id: 2,
        name: 'Modified',
        canonical_participation_level: 'modified',
      })
    ).to.eq(true);
  });

  it('calls the correct function when updating the bulk participation level form', () => {
    const wrapper = mount(<ParticipantForm {...props} />);

    wrapper.find('ActionTooltip').at(0).find('Tippy').simulate('click');

    wrapper.update();

    wrapper
      .find('.bulkEditTooltip__participationLevelField LoadNamespace(Dropdown)')
      .props()
      .onChange(2);

    wrapper.update();

    wrapper.find('ActionTooltip').at(0).props().actionSettings.onCallAction();

    expect(
      props.onChangeAllParticipationLevels.calledWith([1], {
        id: 2,
        name: 'Modified',
        canonical_participation_level: 'modified',
      })
    ).to.deep.eq(true);
  });

  it('disables the duration and RPE fields when the participant did not participate', () => {
    const wrapper = mount(
      <ParticipantForm
        {...props}
        participants={[
          {
            athlete_id: 1,
            athlete_fullname: 'John Doe',
            rpe: 5,
            duration: 30,
            squads: [73, 8, 262],
            availability: 'available',
            participation_level_id: 4,
          },
        ]}
      />
    );

    expect(
      wrapper.find('.participantForm__durationField InputNumeric').props()
        .disabled
    ).to.eq(true);
    expect(
      wrapper.find('.participantForm__rpeField InputNumeric').props().disabled
    ).to.eq(true);
  });

  it('calls the correct function when updating an Include in Average toggle', () => {
    const wrapper = shallow(<ParticipantForm {...props} />);

    const firstParticipantRow = wrapper.find('tbody tr').at(0);
    const firstParticipantIncludeInAverage =
      firstParticipantRow.find('ToggleSwitch');

    firstParticipantIncludeInAverage.props().toggle();

    expect(props.onToggleIncludeInGroupCalculations.calledOnce).to.eq(true);
  });

  it('calls the correct function when updating the bulk Include in Average form', () => {
    const wrapper = mount(<ParticipantForm {...props} />);

    wrapper.find('ActionTooltip').at(1).find('Tippy').simulate('click');

    wrapper.update();

    expect(
      wrapper
        .find('.bulkEditIncludeInGroupCalculationsTooltip ToggleSwitch')
        .props().isSwitchedOn
    ).to.eq(false);
    wrapper
      .find('.bulkEditIncludeInGroupCalculationsTooltip ToggleSwitch')
      .props()
      .toggle();

    wrapper.update();

    wrapper.find('ActionTooltip').at(1).props().actionSettings.onCallAction();

    expect(
      props.onToggleAllIncludeInGroupCalculations.calledWith([1], true)
    ).to.eq(true);
  });

  it('renders the athlete primary squad if there is one', () => {
    const participantsWithPrimarySquad = [...props.participants];
    participantsWithPrimarySquad[0].primary_squad_id = 73;

    const wrapper = shallow(
      <ParticipantForm {...props} participants={participantsWithPrimarySquad} />
    );

    const firstParticipantNameCell = wrapper
      .find('tbody tr')
      .at(0)
      .find('.participantForm__athleteNameContainer');
    expect(
      firstParticipantNameCell.find('.participantForm__primarySquadName')
    ).to.have.length(1);
  });
});
