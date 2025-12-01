import $ from 'jquery';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import moment from 'moment-timezone';

import GameForm from '../../components/GameForm';

describe('GameForm component', () => {
  const fixtureData = {
    id: '51',
    title: 'Feb 26 2018 - fixtureTeamName (fixtureVenueName)',
    duration: '13',
    fixture: {
      date: '2018-02-26',
      teamName: 'fixtureTeamName',
      venueTypeId: '123',
      venueTypeName: 'fixtureVenueName',
      competitionName: 'fixtureCompName',
      organisationTeamName: 'fixtureOrgTeamName',
      roundNumber: '90',
      turnaroundPrefix: 'IS',
    },
  };

  let props;

  beforeEach(() => {
    props = {
      game: {
        date: '',
        markerId: '',
        score: '',
        opponentScore: '',
        localTimezone: 'UTC',
        duration: '13',
        fixture: {
          date: moment('2018-02-26T10:30:00+00:00'),
          venueTypeId: '31',
          venueTypeName: 'propVenueName',
          organisationTeamId: '32',
          organisationTeamName: 'propOrgTeamName',
          teamId: '33',
          teamName: 'propTeamName',
          competitionId: '34',
          competitionName: 'propCompName',
          roundNumber: '87',
          turnaroundPrefix: 'PS',
        },
        surfaceType: '12',
        surfaceQuality: '21',
        weather: '31',
        temperature: '40',
      },
      gameFormData: {
        loaded: true,
        fixtures: [fixtureData],
        venueTypes: [{ id: '31', name: 'LoadedVenue' }],
        organisationTeams: [{ id: '32', name: 'LoadedOrgTeam' }],
        teams: [{ id: '33', name: 'LoadedTeam' }],
        competitions: [{ id: '34', name: 'LoadedComp' }],
        surfaceTypes: [
          {
            id: '12',
            name: 'Artificial',
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
        temperatureUnit: 'F',
      },
      calledOutsideReact: true,
      onSaveSuccess: sinon.spy(),
      t: (value) => value,
    };

    props.onGameFormDataLoad = sinon.spy();
  });

  afterEach(() => {
    if ($.ajax.restore) $.ajax.restore();
  });

  it('renders', () => {
    const wrapper = shallow(<GameForm {...props} />);
    expect(wrapper).to.have.length(1);
  });

  describe('when the fixture date is in the past', () => {
    it('does not validate turnaround, round number, createTurnaroundMarker, surfaceType, surfaceQuality, weather and temperature', () => {
      const wrapper = shallow(
        <GameForm
          {...props}
          game={{
            ...props.game,
            fixture: {
              ...props.game.fixture,
              date: moment().subtract(1, 'days'),
            },
          }}
        />
      );

      expect(
        wrapper.find('FormValidator').props().inputNamesToIgnore
      ).to.deep.eq([
        'advanced_option_surface_type',
        'turnaround_prefix_optional',
        'roundNumber',
        'createTurnaroundMarker',
        'surfaceType',
        'surfaceQuality',
        'weather',
      ]);
    });
  });

  describe('when the fixture date is in the future', () => {
    it('does not validate turnaround, round number, score, surfaceType, surfaceQuality, weather, temperature duration, and createTurnaroundMarker', () => {
      const wrapper = shallow(
        <GameForm
          {...props}
          game={{
            ...props.game,
            fixture: {
              ...props.game.fixture,
              date: moment().add(1, 'days'),
            },
          }}
        />
      );

      expect(
        wrapper.find('FormValidator').props().inputNamesToIgnore
      ).to.deep.eq([
        'advanced_option_surface_type',
        'turnaround_prefix_optional',
        'roundNumber',
        'createTurnaroundMarker',
        'surfaceType',
        'surfaceQuality',
        'weather',
        'duration',
        'score',
        'opponentScore',
      ]);
    });
  });

  describe('when the temperature field is filled', () => {
    it('validates temperature', () => {
      const wrapper = shallow(<GameForm {...props} />);

      wrapper.setState({ temperature: 10 });

      expect(
        wrapper.find('FormValidator').props().inputNamesToIgnore
      ).to.deep.eq([
        'advanced_option_surface_type',
        'turnaround_prefix_optional',
        'roundNumber',
        'createTurnaroundMarker',
        'surfaceType',
        'surfaceQuality',
        'weather',
      ]);
    });
  });

  it('sets createTurnaroundMarker to true when blank', () => {
    const wrapper = shallow(<GameForm {...props} />);

    expect(wrapper.state('fixture').createTurnaroundMarker).to.equal(true);
  });

  it('shows the fixture view when viewType is FIXTURE', () => {
    const wrapper = shallow(<GameForm {...props} />);

    wrapper.setState({ viewType: 'FIXTURE' });

    expect(wrapper.find('LoadNamespace(FixtureForm)')).to.have.length(1);
  });

  it('shows the game view when viewType is GAME', () => {
    const wrapper = shallow(<GameForm {...props} />);

    wrapper.setState({ viewType: 'GAME' });

    expect(wrapper.find('[name="duration"]')).to.have.length(1);
    expect(wrapper.find('[name="score"]')).to.have.length(1);
    expect(wrapper.find('[name="opponentScore"]')).to.have.length(1);
  });

  it('shows the choose fixture view when opening the modal', () => {
    const wrapper = shallow(<GameForm {...props} />);

    expect(wrapper.find('LoadNamespace(FixtureForm)')).to.have.length(1);
  });

  it("doesn't show the select fixture dropdown when showFixtureSelection is false", () => {
    const wrapper = shallow(
      <GameForm {...props} showFixtureSelection={false} />
    );

    expect(wrapper.find('.gameModalForm__markerIdWrapper')).to.have.length(0);
  });

  describe('when saving a new game', () => {
    let origXhr;
    let xhr;
    let request;

    beforeEach(() => {
      origXhr = window.XMLHttpRequest;
      xhr = sinon.useFakeXMLHttpRequest();
      window.XMLHttpRequest = xhr;
      request = '';
      xhr.onCreate = (req) => {
        request = req;
      };
    });

    afterEach(() => {
      // we must clean up when tampering with globals.
      xhr.restore();
      window.XMLHttpRequest = origXhr;
    });

    it('sends the correct request', () => {
      const wrapper = shallow(<GameForm {...props} />);
      wrapper.instance().handleSaveClick();

      expect(request.url).to.eq('/planning_hub/events');
      expect(request.method).to.eq('POST');
      expect(request.requestBody).to.eq(
        JSON.stringify({
          type: 'game_event',
          start_time: '2018-02-26T10:30:00+00:00',
          duration: '13',
          local_timezone: 'UTC',
          venue_type_id: '31',
          competition_id: '34',
          organisation_team_id: '32',
          team_id: '33',
          score: '',
          opponent_score: '',
          surface_type: '12',
          surface_quality: '21',
          weather: '31',
          temperature: '40',
          round_number: '87',
          turnaround_prefix: 'PS',
          turnaround_fixture: true,
        })
      );
    });
  });

  describe('when useNewEventFlow is true', () => {
    describe('when saving a new game', () => {
      let origXhr;
      let xhr;
      let request;

      beforeEach(() => {
        origXhr = window.XMLHttpRequest;
        xhr = sinon.useFakeXMLHttpRequest();
        window.XMLHttpRequest = xhr;
        request = '';
        xhr.onCreate = (req) => {
          request = req;
        };
      });

      afterEach(() => {
        // we must clean up when tampering with globals.
        xhr.restore();
        window.XMLHttpRequest = origXhr;
      });

      it('sends the correct request', () => {
        const wrapper = shallow(<GameForm {...props} useNewEventFlow />);
        wrapper.instance().handleSaveClick();

        expect(request.url).to.eq('/planning_hub/events');
        expect(request.method).to.eq('POST');
        expect(request.requestBody).to.eq(
          JSON.stringify({
            type: 'game_event',
            start_time: '2018-02-26T10:30:00+00:00',
            duration: '13',
            local_timezone: 'UTC',
            venue_type_id: '31',
            competition_id: '34',
            organisation_team_id: '32',
            team_id: '33',
            score: '',
            opponent_score: '',
            surface_type: '12',
            surface_quality: '21',
            weather: '31',
            temperature: '40',
            round_number: '87',
            turnaround_prefix: 'PS',
            turnaround_fixture: true,
          })
        );
      });
    });
  });

  describe('when editing a game', () => {
    let origXhr;
    let xhr;
    let request;

    beforeEach(() => {
      origXhr = window.XMLHttpRequest;
      xhr = sinon.useFakeXMLHttpRequest();
      window.XMLHttpRequest = xhr;
      request = '';
      xhr.onCreate = (req) => {
        request = req;
      };
    });

    afterEach(() => {
      // we must clean up when tampering with globals.
      xhr.restore();
      window.XMLHttpRequest = origXhr;
    });

    it('sends the correct request', () => {
      const wrapper = shallow(
        <GameForm
          {...props}
          formMode="EDIT"
          game={{
            ...props.game,
            id: 12,
            markerId: 42,
            fixture: props.game.fixture,
          }}
        />
      );
      wrapper.instance().handleSaveClick();

      expect(request.url).to.eq('/planning_hub/events/12');
      expect(request.method).to.eq('PATCH');
      expect(request.requestBody).to.eq(
        JSON.stringify({
          type: 'game_event',
          start_time: '2018-02-26T10:30:00+00:00',
          duration: '13',
          local_timezone: 'UTC',
          venue_type_id: '31',
          competition_id: '34',
          organisation_team_id: '32',
          team_id: '33',
          score: '',
          opponent_score: '',
          surface_type: '12',
          surface_quality: '21',
          weather: '31',
          temperature: '40',
          round_number: '87',
          turnaround_prefix: 'PS',
          turnaround_fixture: true,
        })
      );
    });
  });

  describe('when the server request fails', () => {
    let origXhr;
    let xhr;
    let server;

    beforeEach(() => {
      origXhr = window.XMLHttpRequest;
      xhr = sinon.useFakeXMLHttpRequest();
      window.XMLHttpRequest = xhr;
      server = sinon.fakeServer.create();
      server.respondWith((request) => {
        request.respond(500, {}, 'ERROR');
      });
      server.respondImmediately = true;
    });

    afterEach(() => {
      // we must clean up when tampering with globals.
      xhr.restore();
      window.XMLHttpRequest = origXhr;
    });

    it('Shows an error message', () => {
      const wrapper = shallow(<GameForm {...props} />);
      wrapper.instance().handleSaveClick();

      expect(wrapper.find('LoadNamespace(AppStatus)').props().status).to.eq(
        'error'
      );
    });
  });

  describe('when the form is called from React', () => {
    it('calls the correct callback on save success', () => {
      const wrapper = shallow(
        <GameForm {...props} calledOutsideReact={false} />
      );
      wrapper.instance().saveSuccess({});
      expect(props.onSaveSuccess.calledOnce).to.eq(true);
    });
  });
});
