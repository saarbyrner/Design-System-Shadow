import $ from 'jquery';
import sinon from 'sinon';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import App from '../../components/App';

describe('Game Form Modal <App /> component', () => {
  const fixtureData = {
    id: '51',
    title: 'fetchedFixture',
    date: '2018-02-26',
    team: { id: '1', name: 'fixtureTeamName' },
    venue_type: { id: '1', name: 'fixtureVenueName' },
    competition: { id: '1', name: 'fixtureCompName' },
    organisation_team: { id: '1', name: 'fixtureOrgTeamName' },
    roundNumber: '90',
    turnaround_prefix: 'IS',
  };

  const gameFormData = {
    fixtures: [fixtureData],
    venue_types: [{ id: '31', title: 'LoadedVenue' }],
    organisation_teams: [{ id: '32', title: 'LoadedOrgTeam' }],
    teams: [{ id: '33', title: 'LoadedTeam' }],
    competitions: [{ id: '34', title: 'LoadedComp' }],
    duration: 90,
    surface_types: [
      {
        id: '12',
        title: 'Artificial',
      },
    ],
    surface_qualities: [
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
  };

  const props = {
    formMode: 'CREATE',
    calledOutsideReact: true,
    t: (value) => value,
  };

  describe('when the form mode is EDIT', () => {
    beforeEach(() => {
      sinon.stub($, 'ajax').yieldsTo('success', {
        ...gameFormData,
        event_attributes: {
          id: '1',
          date: '',
          score: '',
          opponent_score: '',
          local_timezone: '',
          duration: '',
          fixture: {
            id: '',
            marker_date: '',
            round_number: '',
            turnaround_prefix: '',
            venue_type: { id: '1', name: 'Venue Name' },
            organisation_team: { id: '1', name: 'Organisation Name' },
            team: { id: '1', name: 'Team Name' },
            competition: { id: '1', name: 'Competition Name' },
          },
        },
      });
    });

    after(() => {
      $.ajax.restore();
    });

    it('renders the correct title', () => {
      it('renders the correct title', () => {
        const wrapper = shallow(<App {...props} formMode="EDIT" />);
        expect(wrapper.find('Modal').props().title).to.equal(
          '#sport_specific__Edit_Game'
        );
      });
    });
  });

  describe('when the modal is triggered from React', () => {
    before(() => {
      sinon.stub($, 'ajax').yieldsTo('success', gameFormData);
    });

    after(() => {
      $.ajax.restore();
    });

    it('calls the correct callback when the modal is closed', () => {
      const mockCloseModal = sinon.spy();
      const wrapper = shallow(
        <App
          {...props}
          calledOutsideReact={false}
          closeModal={mockCloseModal}
          isOpen
        />
      );
      wrapper.find('Modal').props().close();
      expect(mockCloseModal.withArgs().calledOnce).to.equal(true);
    });
  });
});
