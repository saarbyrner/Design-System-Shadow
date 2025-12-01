import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import EventFilters from '../index';

const selectLoadNamespace = 'LoadNamespace(Select)';
const eventFiltersDesktopClassname = '.planning__eventFilters--desktop';

describe('<EventFilters />', () => {
  const props = {
    pageView: 'SCHEDULE',
    eventFilters: {
      dateRange: {
        start_date: '',
        end_date: '',
      },
      eventTypes: [],
      competitions: [],
      gameDays: [],
      oppositions: [],
    },
    competitions: [],
    teams: [],
    turnarounds: [],
    onEventFiltersChange: sinon.spy(),
    onPageViewChange: sinon.spy(),
    t: (t) => t,
  };

  beforeEach(() => {
    window.setFlag('planning-toggle-to-other-planning-views', true);
  });

  afterEach(() => {
    window.setFlag('planning-toggle-to-other-planning-views', false);
  });

  it('calls onPageViewChange when the user changes the page view', () => {
    const wrapper = shallow(<EventFilters {...props} />);

    wrapper.find(selectLoadNamespace).at(0).props().onChange('PLANNING');

    expect(props.onPageViewChange.calledWith('PLANNING')).to.eq(true);
  });

  it('calls onEventFiltersChange when the user changes the date range', () => {
    const wrapper = shallow(<EventFilters {...props} />);
    const eventFiltersDesktop = wrapper.find(eventFiltersDesktopClassname);

    eventFiltersDesktop
      .find('DateRangePicker')
      .props()
      .onChange({ start_date: '01/01/2020', end_date: '30/02/2020' });

    expect(
      props.onEventFiltersChange.calledWith({
        dateRange: {
          start_date: '01/01/2020',
          end_date: '30/02/2020',
        },
      })
    ).to.eq(true);
  });

  it('calls onEventFiltersChange when the user changes the event types', () => {
    const wrapper = shallow(<EventFilters {...props} />);
    const eventFiltersDesktop = wrapper.find(eventFiltersDesktopClassname);

    const eventTypesDropdown = eventFiltersDesktop
      .find(selectLoadNamespace)
      .at(1);

    eventTypesDropdown.props().onChange(['fixture']);

    expect(
      props.onEventFiltersChange.calledWith({
        eventTypes: ['fixture'],
      })
    ).to.eq(true);
  });

  it('calls onEventFiltersChange when the user changes the competitions', () => {
    const wrapper = shallow(<EventFilters {...props} />);
    const eventFiltersDesktop = wrapper.find(eventFiltersDesktopClassname);

    const competitionsDropdown = eventFiltersDesktop
      .find(selectLoadNamespace)
      .at(2);

    competitionsDropdown.props().onChange(['premier_league']);

    expect(
      props.onEventFiltersChange.calledWith({
        competitions: ['premier_league'],
      })
    ).to.eq(true);
  });

  it('calls onEventFiltersChange when the user changes the game days', () => {
    const wrapper = shallow(<EventFilters {...props} />);
    const eventFiltersDesktop = wrapper.find(eventFiltersDesktopClassname);

    const gameDaysDropdown = eventFiltersDesktop
      .find(selectLoadNamespace)
      .at(3);

    gameDaysDropdown.props().onChange(['+1', '-3']);

    expect(
      props.onEventFiltersChange.calledWith({
        gameDays: ['+1', '-3'],
      })
    ).to.eq(true);
  });

  it('calls onEventFiltersChange when the user changes the oppositions', () => {
    const wrapper = shallow(<EventFilters {...props} />);
    const eventFiltersDesktop = wrapper.find(eventFiltersDesktopClassname);

    const oppositionsDropdown = eventFiltersDesktop
      .find(selectLoadNamespace)
      .at(4);

    oppositionsDropdown.props().onChange(['chelsea']);

    expect(
      props.onEventFiltersChange.calledWith({
        oppositions: ['chelsea'],
      })
    ).to.eq(true);
  });

  it('renders the filters in a side panel when on mobile', () => {
    const wrapper = shallow(<EventFilters {...props} />);
    const eventFiltersMobile = wrapper.find('.planning__eventFilters--mobile');

    expect(
      eventFiltersMobile.find(
        '.planning__eventFiltersPanel .planning__eventFiltersDropdown'
      )
    ).to.have.length(4);

    // The side panel is closed by default
    expect(eventFiltersMobile.find('SlidingPanel').props().isOpen).to.eq(false);

    eventFiltersMobile.find('ForwardRef(TextButton)').props().onClick();

    // The side panel is openned after clicking the filter option
    expect(
      wrapper.find('.planning__eventFilters--mobile SlidingPanel').props()
        .isOpen
    ).to.eq(true);
  });

  describe('CustomEvent option FF usage', () => {
    const customEventOptionValue = 'custom_event';
    it(`should not contain the '${customEventOptionValue}' option since the FF is off`, () => {
      window.featureFlags['custom-events'] = false;
      const wrapper = shallow(<EventFilters {...props} />);
      const eventFiltersDesktop = wrapper.find(eventFiltersDesktopClassname);
      const eventsSelect = eventFiltersDesktop.find(selectLoadNamespace).at(1);
      expect(
        eventsSelect
          .props()
          .options.find((option) => option.value === customEventOptionValue)
      ).to.eq(undefined);
    });

    it(`should contain the '${customEventOptionValue}' option since the FF is on`, () => {
      window.featureFlags['custom-events'] = true;
      const wrapper = shallow(<EventFilters {...props} />);
      const eventFiltersDesktop = wrapper.find(eventFiltersDesktopClassname);
      const eventsSelect = eventFiltersDesktop.find(selectLoadNamespace).at(1);
      expect(
        eventsSelect
          .props()
          .options.filter((option) => option.value === customEventOptionValue)
          .length
      ).to.eq(1);
      window.featureFlags['custom-events'] = false;
    });
  });
});
