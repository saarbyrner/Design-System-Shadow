import { Provider } from 'react-redux';
import { expect } from 'chai';
import sinon from 'sinon';
import { shallow, mount } from 'enzyme';
import i18n from 'i18next';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { MOCK_DASHBOARD_STATE } from '@kitman/modules/src/analysis/Dashboard/redux/__mocks__/dashboard';
import LongitudinalPanel from '../components/LongitudinalPanel';

const componentSelector = (key) => `[data-testid="LongitudinalPanel|${key}"]`;

const storeFake = (state = {}) => ({
  default: () => {},
  subscribe: () => {},
  dispatch: () => {},
  getState: () => ({ ...state }),
});

const MockGameModule = () => <div data-testid="GameActivityModule" />;
const MockAvailabilityModule = () => <div data-testid="AvailabilityModule" />;

describe('ColumnPanel: <LongitudinalPanel />', () => {
  const i18nT = i18nextTranslateStub(i18n);

  const props = {
    source: 'metric',
    availableVariables: [],
    metrics: [],
    isLoading: false,
    calculation: '',
    columnTitle: '',
    dataSource: {},
    dateRange: {},
    onApply: sinon.spy(),
    onSetCalculation: sinon.spy(),
    onSetColumnTitle: sinon.spy(),
    onSetMetrics: sinon.spy(),
    squads: [],
    squadAthletes: {
      applies_to_squad: false,
      position_groups: [],
      positions: [],
      athletes: [],
      all_squads: false,
      squads: [],
    },
    selectedPopulation: {
      applies_to_squad: false,
      position_groups: [],
      positions: [],
      athletes: [],
      all_squads: false,
      squads: [],
    },
    filters: {
      time_loss: [],
      competitions: [],
      event_types: [],
      session_type: [],
      training_session_types: [],
    },
    sessionTypeData: {
      data: [],
      isFetching: false,
    },
    gameActivityModule: <MockGameModule />,
    availabilityModule: <MockAvailabilityModule />,
    t: i18nT,
  };

  it('renders correctly', () => {
    const wrapper = shallow(<LongitudinalPanel {...props} />);
    expect(wrapper).to.have.length(1);
  });

  it('renders the MetricModule component', () => {
    const wrapper = shallow(<LongitudinalPanel {...props} source="metric" />);
    const metricModule = wrapper.find(componentSelector('MetricModule'));

    expect(metricModule).to.have.length(1);
  });

  it('renders the ActivityModule component', () => {
    const wrapper = shallow(<LongitudinalPanel {...props} source="activity" />);
    const activityModule = wrapper.find(componentSelector('ActivityModule'));

    expect(activityModule).to.have.length(1);
  });

  it('renders the AvailabilityModule component', () => {
    const wrapper = mount(
      <LongitudinalPanel {...props} source="availability" />
    );
    const availabilityModule = wrapper.find({
      'data-testid': 'AvailabilityModule',
    });

    expect(availabilityModule).to.have.length(1);
  });

  it('renders the ParticipationModule component', () => {
    const wrapper = shallow(
      <LongitudinalPanel {...props} source="participation" />
    );
    const participationModule = wrapper.find(
      componentSelector('ParticipationModule')
    );

    expect(participationModule).to.have.length(1);
  });

  it('renders the GameActivityModule component', () => {
    const wrapper = mount(<LongitudinalPanel {...props} source="games" />);
    const gameActivityModule = wrapper.find({
      'data-testid': 'GameActivityModule',
    });

    expect(gameActivityModule).to.have.length(1);
  });

  it('renders the AthleteModule component', () => {
    const wrapper = shallow(<LongitudinalPanel {...props} />);
    const athleteModule = wrapper.find(componentSelector('AthleteModule'));

    expect(athleteModule).to.have.length(1);
  });

  describe('for medical source', () => {
    const medicalProps = {
      ...props,
      source: 'medical',
    };

    it('renders the MedicalModule', () => {
      const wrapper = shallow(<LongitudinalPanel {...medicalProps} />);
      const medicalModule = wrapper.find(componentSelector('MedicalModule'));

      expect(medicalModule).to.have.length(1);
    });

    it('doesnt render the PanelFilters', () => {
      const wrapper = shallow(<LongitudinalPanel {...medicalProps} />);
      const medicalModule = wrapper.find(componentSelector('Filters'));

      expect(medicalModule).to.have.length(0);
    });

    it('renders the MedicalData', () => {
      const wrapper = shallow(<LongitudinalPanel {...medicalProps} />);
      const medicalModule = wrapper.find(componentSelector('MedicalData'));

      expect(medicalModule).to.have.length(1);
    });
  });

  describe('the actions footer', () => {
    it('renders the add another checkbox', () => {
      const wrapper = shallow(<LongitudinalPanel {...props} />);
      const addAnother = wrapper.find(componentSelector('AddAnother'));

      expect(addAnother).to.have.length(1);
    });

    it('renders the Apply button', () => {
      const wrapper = shallow(<LongitudinalPanel {...props} />);
      const apply = wrapper.find(componentSelector('Apply'));

      expect(apply).to.have.length(1);
    });

    it('disables the text button if dataSource and calculation are empty', () => {
      const wrapper = shallow(<LongitudinalPanel {...props} />);
      const apply = wrapper.find(componentSelector('Apply'));

      expect(apply.props().isDisabled).to.be.equal(true);

      wrapper.setProps({
        dataSource: { key_name: 'kitman:tv|dataname', name: 'Data Name' },
        calculation: 'sum',
        selectedPopulation: {
          applies_to_squad: true,
          position_groups: [],
          positions: [],
          athletes: [],
          all_squads: false,
          squads: [],
        },
      });

      expect(
        wrapper.find(componentSelector('Apply')).props().isDisabled
      ).to.be.equal(false);
    });

    it('passes the value of add another checkbox to the onApply', () => {
      const onApply = sinon.spy();
      const wrapper = shallow(
        <LongitudinalPanel {...props} onApply={onApply} />
      );
      const addAnother = () => wrapper.find(componentSelector('AddAnother'));
      const apply = () => wrapper.find(componentSelector('Apply'));

      apply().props().onClick();

      expect(onApply.args[0][0]).to.equal(false);

      addAnother().props().toggle();

      apply().props().onClick();

      expect(onApply.args[1][0]).to.equal(true);
    });
  });

  describe('Filter panel for TableMetric', () => {
    it('renders the filter panel for TableMetric', () => {
      const wrapper = shallow(
        <LongitudinalPanel {...props} dataSource={{ type: 'TableMetric' }} />
      );
      const columnTitle = wrapper.find(componentSelector('Filters'));

      expect(columnTitle).to.have.length(1);
    });

    it('renders the session filter', () => {
      const wrapper = shallow(
        <LongitudinalPanel {...props} dataSource={{ type: 'TableMetric' }} />
      );
      const columnTitle = wrapper.find(componentSelector('Filters'));

      expect(columnTitle).to.have.length(1);
    });

    it('opens the filters when isEditMode and filter values are present', () => {
      const store = storeFake(MOCK_DASHBOARD_STATE);
      const TestComponent = (componentProps) => (
        <Provider store={store}>
          <LongitudinalPanel
            {...componentProps}
            dataSource={{ type: 'TableMetric' }}
          />
        </Provider>
      );
      const wrapper = mount(<TestComponent {...props} />);

      const getFilters = () => wrapper.find(componentSelector('Filters')).at(0);

      expect(
        getFilters().props().isOpen,
        'filters are initially closed'
      ).to.equal(false);

      wrapper.setProps({
        ...props,
        dataSource: { type: 'TableMetric' },
        isOpen: true,
        isEditMode: true,
      });

      wrapper.update();

      expect(
        getFilters().props().isOpen,
        'filters are initially closed even in edit mode'
      ).to.equal(false);

      wrapper.setProps({
        ...props,
        dataSource: { type: 'TableMetric' },
        isOpen: false,
        isEditMode: false,
      });

      wrapper.update();

      wrapper.setProps({
        ...props,
        dataSource: { type: 'TableMetric' },
        isOpen: true,
        isEditMode: true,
        filters: {
          time_loss: [],
          competitions: [],
          event_types: ['game'],
          session_type: [],
          training_session_types: [],
        },
      });

      wrapper.update();

      expect(
        getFilters().props().isOpen,
        'filters are open after filters are provided in edit mode'
      ).to.equal(true);
    });
  });

  describe('when the graph-squad-selector is true', () => {
    beforeEach(() => {
      window.setFlag('graph-squad-selector', true);
    });

    afterEach(() => {
      window.setFlag('graph-squad-selector', false);
    });

    it('renders the SquadModule and hides the AthleteModule', () => {
      const wrapper = shallow(<LongitudinalPanel {...props} />);
      const athleteModule = wrapper.find(componentSelector('AthleteModule'));
      const squadModule = wrapper.find(componentSelector('SquadModule'));

      expect(athleteModule).to.have.length(0);
      expect(squadModule).to.have.length(1);
    });
  });
});
