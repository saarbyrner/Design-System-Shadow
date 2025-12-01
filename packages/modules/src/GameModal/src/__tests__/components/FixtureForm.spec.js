import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import moment from 'moment';

import FixtureForm from '../../components/GameForm/components/FixtureForm';

describe('FixtureForm component', () => {
  const props = {
    fixture: {
      date: '',
      venueTypeId: '',
      organisationTeamId: '',
      teamId: '',
      competitionId: '',
      roundNumber: '',
      turnaroundPrefix: '',
      createTurnaroundMarker: '',
    },
    seasonMarkerRange: ['2014-06-14T00:00:00.000Z', '2023-12-31T00:00:00.000Z'],
    gameFormData: {
      loaded: true,
      fixtures: [],
      venueTypes: [{ id: '543', title: 'Home' }],
      organisationTeams: [{ id: '143', title: 'Kitman Tags' }],
      teams: [{ id: '9', title: 'Tag Lions' }],
      competitions: [{ id: '51', title: 'World Cup' }],
      surfaceTypes: [
        {
          id: '12',
          title: 'Artificial',
        },
      ],
      surfaceQualities: [
        {
          id: '21',
          title: 'Dry',
        },
      ],
      weathers: [
        {
          id: '31',
          title: 'Sunny/Clear',
        },
      ],
    },
    errors: {},
    handleSurfaceTypeChange: sinon.spy(),
    handleSurfaceQualityChange: sinon.spy(),
    handleWeatherChange: sinon.spy(),
    handleTemperatureChange: sinon.spy(),
    t: (value) => value,
  };

  beforeEach(() => {
    const onChangeSpy = sinon.spy();
    const handleTimezoneChangeSpy = sinon.spy();
    const handleTimeChangeSpy = sinon.spy();
    const handleScoreChangeSpy = sinon.spy();
    const handleOpponentScoreChangeSpy = sinon.spy();
    const handleDurationChangeChangeSpy = sinon.spy();
    props.onChange = onChangeSpy;
    props.handleTimezoneChange = handleTimezoneChangeSpy;
    props.handleTimeChange = handleTimeChangeSpy;
    props.handleScoreChange = handleScoreChangeSpy;
    props.handleOpponentScoreChange = handleOpponentScoreChangeSpy;
    props.handleDurationChange = handleDurationChangeChangeSpy;
  });

  it('renders', () => {
    const wrapper = shallow(<FixtureForm {...props} />);
    expect(wrapper).to.have.length(1);
  });

  describe('when the standard-date-formatting flag is off', () => {
    beforeEach(() => {
      window.featureFlags['standard-date-formatting'] = false;
    });

    it('calls onChange callback with the correct arguments when date changes', () => {
      const wrapper = shallow(<FixtureForm {...props} />);

      wrapper.find('[name="date"]').prop('onDateChange')('2018-02-26');

      expect(
        props.onChange.withArgs({ date: '2018-02-26' }).calledOnce
      ).to.equal(true);
    });
  });

  it('disables the turnaround field when the create turnaround checkbox is unchecked', () => {
    const wrapper = shallow(
      <FixtureForm
        {...props}
        fixture={{ ...props.fixture, createTurnaroundMarker: false }}
      />
    );

    expect(
      wrapper.find('[name="turnaround_prefix_optional"]').props().disabled
    ).to.equal(true);
  });

  describe('when the standard-date-formatting flag is on', () => {
    beforeEach(() => {
      window.featureFlags['standard-date-formatting'] = true;
    });

    afterEach(() => {
      window.featureFlags['standard-date-formatting'] = false;
    });

    it('calls onChange callback with the correct arguments when date changes', () => {
      const wrapper = shallow(<FixtureForm {...props} />);

      wrapper.find('[name="date"]').prop('onDateChange')('2018-02-26');

      expect(
        props.onChange.withArgs({ date: '2018-02-26' }).calledOnce
      ).to.equal(true);
    });
  });

  it('calls onChange callback with the correct arguments when venueTypeId changes', () => {
    const wrapper = shallow(<FixtureForm {...props} />);

    wrapper.find('[name="venueTypeId"]').prop('onChange')('543');

    expect(
      props.onChange.withArgs({ venueTypeId: '543', venueTypeName: 'Home' })
        .calledOnce
    ).to.equal(true);
  });

  it('calls onChange callback with the correct arguments when organisationTeamId changes', () => {
    const wrapper = shallow(<FixtureForm {...props} />);

    wrapper.find('[name="organisationTeamId"]').prop('onChange')('143');

    expect(
      props.onChange.withArgs({
        organisationTeamId: '143',
        organisationTeamName: 'Kitman Tags',
      }).calledOnce
    ).to.equal(true);
  });

  it('calls onChange callback with the correct arguments when teamId changes', () => {
    const wrapper = shallow(<FixtureForm {...props} />);

    wrapper.find('[name="teamId"]').prop('onChange')('9');

    expect(
      props.onChange.withArgs({ teamId: '9', teamName: 'Tag Lions' }).calledOnce
    ).to.equal(true);
  });

  it('calls onChange callback with the correct arguments when competitionId changes', () => {
    const wrapper = shallow(<FixtureForm {...props} />);

    wrapper.find('[name="competitionId"]').prop('onChange')('51');

    expect(
      props.onChange.withArgs({
        competitionId: '51',
        competitionName: 'World Cup',
      }).calledOnce
    ).to.equal(true);
  });

  it('calls onChange callback with the correct arguments when roundNumber changes', () => {
    const wrapper = shallow(<FixtureForm {...props} />);

    wrapper.find('[name="roundNumber"]').prop('onChange')('13');

    expect(props.onChange.withArgs({ roundNumber: '13' }).calledOnce).to.equal(
      true
    );
  });

  it('calls onChange callback with the correct arguments when turnaroundPrefix changes', () => {
    const wrapper = shallow(<FixtureForm {...props} />);

    wrapper.find('[name="turnaround_prefix_optional"]').prop('onValidation')({
      value: 'IS',
    });

    expect(
      props.onChange.withArgs({ turnaroundPrefix: 'IS' }).calledOnce
    ).to.equal(true);
  });

  it('calls onChange callback with the correct arguments when createTurnaroundMarker changes', () => {
    const wrapper = shallow(<FixtureForm {...props} />);

    wrapper.find('[name="createTurnaroundMarker"]').prop('toggle')({
      checked: true,
    });

    expect(
      props.onChange.withArgs({ createTurnaroundMarker: true }).calledOnce
    ).to.equal(true);
  });

  it('calls handleDurationChange callback with the correct arguments when duration changes', () => {
    const wrapper = shallow(<FixtureForm {...props} />);

    wrapper.find('[name="duration"]').prop('onChange')('13');

    expect(props.handleDurationChange.withArgs('13').calledOnce).to.equal(true);
  });

  it('calls handleTimezoneChange with the correct arguments when the timezone changes', () => {
    const wrapper = shallow(<FixtureForm {...props} />);

    wrapper.find('[name="timezone"]').prop('onChange')('Europe/Dublin');

    expect(
      props.handleTimezoneChange.withArgs('Europe/Dublin').calledOnce
    ).to.equal(true);
  });

  it('calls handleTimeChange with the correct arguments when time changes', () => {
    const wrapper = shallow(<FixtureForm {...props} />);

    wrapper.find('LoadNamespace(TimePicker)').prop('onChange')('12pm');

    expect(props.handleTimeChange.withArgs('12pm').calledOnce).to.equal(true);
  });

  it('disables the date, time and timezone fields when the game is active', () => {
    const wrapper = shallow(<FixtureForm {...props} isGameActive />);

    expect(wrapper.find('LoadNamespace(DatePicker)').props().disabled).to.equal(
      true
    );
    expect(wrapper.find('LoadNamespace(TimePicker)').props().disabled).to.equal(
      true
    );
    expect(wrapper.find('[name="timezone"]').props().disabled).to.equal(true);
  });

  it('calls handleScoreChange with the correct arguments when the score changes', () => {
    const wrapper = shallow(<FixtureForm {...props} />);

    wrapper.find('[name="score"]').prop('onChange')('3');

    expect(props.handleScoreChange.withArgs('3').calledOnce).to.equal(true);
  });

  it('calls handleOpponentScoreChange with the correct arguments when opponent score changes', () => {
    const wrapper = shallow(<FixtureForm {...props} />);

    wrapper.find('[name="opponentScore"]').prop('onChange')('6');

    expect(props.handleOpponentScoreChange.withArgs('6').calledOnce).to.equal(
      true
    );
  });

  it('disables the score fields when the fixture date is null', () => {
    const wrapper = shallow(
      <FixtureForm {...props} fixture={{ ...props.fixture, date: null }} />
    );

    expect(wrapper.find('[name="score"]').prop('disabled')).to.equal(true);
    expect(wrapper.find('[name="opponentScore"]').prop('disabled')).to.equal(
      true
    );
  });

  it('disables the score fields when the fixture date is in the future', () => {
    const wrapper = shallow(
      <FixtureForm
        {...props}
        fixture={{ ...props.fixture, date: moment().add(1, 'days') }}
      />
    );

    expect(wrapper.find('[name="score"]').prop('disabled')).to.equal(true);
    expect(wrapper.find('[name="opponentScore"]').prop('disabled')).to.equal(
      true
    );
  });

  it('enables the score fields when the fixture date is today', () => {
    const wrapper = shallow(
      <FixtureForm {...props} fixture={{ ...props.fixture, date: moment() }} />
    );

    expect(wrapper.find('[name="score"]').prop('disabled')).to.equal(false);
    expect(wrapper.find('[name="opponentScore"]').prop('disabled')).to.equal(
      false
    );
  });

  it('enables the score fields when the fixture date is in the past', () => {
    const wrapper = shallow(
      <FixtureForm
        {...props}
        fixture={{ ...props.fixture, date: moment().subtract(1, 'days') }}
      />
    );

    expect(wrapper.find('[name="score"]').prop('disabled')).to.equal(false);
    expect(wrapper.find('[name="opponentScore"]').prop('disabled')).to.equal(
      false
    );
  });

  it('empties the scores when selecting a date in the future', () => {
    const wrapper = shallow(<FixtureForm {...props} />);

    wrapper
      .find('LoadNamespace(DatePicker)')
      .props()
      .onDateChange(moment().add(1, 'days'));

    expect(props.handleScoreChange.withArgs(null).calledOnce).to.equal(true);

    expect(props.handleOpponentScoreChange.withArgs(null).calledOnce).to.equal(
      true
    );
  });

  it('shows an error message when a date is selected after the season end marker', () => {
    const wrapper = shallow(<FixtureForm {...props} />);
    const datePicker = wrapper.find('LoadNamespace(DatePicker)').at(0);
    datePicker
      .props()
      .onDateChange(moment(props.seasonMarkerRange[1]).add(1, 'days'));

    expect(wrapper.find('.gameModalForm__error').length).to.equal(1);
    expect(wrapper.find('.gameModalForm__error').text()).to.contains(
      'This Game is outside your current squad Season Markers. Please contact the admin team to re-configure your season markers.'
    );
  });

  describe('when the mls-emr-advanced-options feature flag is enabled', () => {
    beforeEach(() => {
      window.featureFlags['mls-emr-advanced-options'] = true;
    });

    afterEach(() => {
      window.featureFlags['mls-emr-advanced-options'] = false;
    });

    it('renders the an advanced option area', () => {
      const wrapper = shallow(<FixtureForm {...props} />);
      expect(
        wrapper.find('LoadNamespace(AdvancedEventOptions)')
      ).to.have.length(1);
    });
  });
});
