import { Provider } from 'react-redux';
import { expect } from 'chai';
import sinon from 'sinon';
import { shallow, mount } from 'enzyme';
import i18n from 'i18next';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { MOCK_DASHBOARD_STATE } from '@kitman/modules/src/analysis/Dashboard/redux/__mocks__/dashboard';
import ScorecardPanel from '../components/ScorecardPanel';

const componentSelector = (key) => `[data-testid="ScorecardPanel|${key}"]`;

const storeFake = (state = {}) => ({
  default: () => {},
  subscribe: () => {},
  dispatch: () => {},
  getState: () => ({ ...state }),
});

describe('RowPanel: <ScorecardPanel />', () => {
  const i18nT = i18nextTranslateStub(i18n);
  const props = {
    availableVariables: [],
    calculation: '',
    columnTitle: '',
    dataSource: {},
    onApply: sinon.spy(),
    onSetCalculation: sinon.spy(),
    onSetColumnTitle: sinon.spy(),
    onSetMetrics: sinon.spy(),
    isLoading: false,
    t: i18nT,
    filters: {
      time_loss: [],
      competitions: [],
      event_types: [],
      session_type: [],
      training_session_types: [],
    },
  };

  it('renders correctly', () => {
    const wrapper = shallow(<ScorecardPanel {...props} />);
    expect(wrapper).to.have.length(1);
  });

  it('renders the MetricModule component for metric', () => {
    const wrapper = shallow(<ScorecardPanel {...props} source="metric" />);
    const metricModule = wrapper.find(componentSelector('MetricModule'));

    expect(metricModule).to.have.length(1);
  });

  it('renders the ActivityModule component for activity', () => {
    const wrapper = shallow(<ScorecardPanel {...props} source="activity" />);
    const activityModule = wrapper.find(componentSelector('ActivityModule'));

    expect(activityModule).to.have.length(1);
  });

  it('renders the AvailabilityModule component for activity', () => {
    const wrapper = shallow(
      <ScorecardPanel {...props} source="availability" />
    );
    const activityModule = wrapper.find(
      componentSelector('AvailabilityModule')
    );

    expect(activityModule).to.have.length(1);
  });

  it('renders the GameActivityModule component for activity', () => {
    const wrapper = shallow(<ScorecardPanel {...props} source="games" />);
    const activityModule = wrapper.find(
      componentSelector('GameActivityModule')
    );

    expect(activityModule).to.have.length(1);
  });

  describe('for medical source', () => {
    const medicalProps = {
      ...props,
      source: 'medical',
    };

    it('renders the MedicalModule', () => {
      const wrapper = shallow(<ScorecardPanel {...medicalProps} />);
      const medicalModule = wrapper.find(componentSelector('MedicalModule'));

      expect(medicalModule).to.have.length(1);
    });

    it('doesnt render the PanelFilters', () => {
      const wrapper = shallow(<ScorecardPanel {...medicalProps} />);
      const medicalModule = wrapper.find(componentSelector('Filters'));

      expect(medicalModule).to.have.length(0);
    });

    it('renders the MedicalData', () => {
      const wrapper = shallow(<ScorecardPanel {...medicalProps} />);
      const medicalModule = wrapper.find(componentSelector('MedicalData'));

      expect(medicalModule).to.have.length(1);
    });
  });

  describe('the actions footer', () => {
    it('renders the add another checkbox', () => {
      const wrapper = shallow(<ScorecardPanel {...props} />);
      const addAnother = wrapper.find(componentSelector('AddAnother'));

      expect(addAnother).to.have.length(1);
    });

    it('renders the Apply button', () => {
      const wrapper = shallow(<ScorecardPanel {...props} />);
      const apply = wrapper.find(componentSelector('Apply'));

      expect(apply).to.have.length(1);
    });

    it('disables the text button if timePeriod and calculation are empty', () => {
      const wrapper = shallow(<ScorecardPanel {...props} />);
      const apply = wrapper.find(componentSelector('Apply'));

      expect(apply.props().isDisabled).to.be.equal(true);

      wrapper.setProps({
        dataSource: { key_name: 'kitman:tv|dataname', name: 'Data Name' },
        calculation: 'sum',
        timePeriod: 'today',
      });

      expect(
        wrapper.find(componentSelector('Apply')).props().isDisabled
      ).to.be.equal(false);
    });

    it('passes the value of add another checkbox to the onApply', () => {
      const onApply = sinon.spy();
      const wrapper = shallow(<ScorecardPanel {...props} onApply={onApply} />);
      const addAnother = () => wrapper.find(componentSelector('AddAnother'));
      const apply = () => wrapper.find(componentSelector('Apply'));

      apply().props().onClick();

      expect(onApply.args[0][0]).to.equal(false);

      addAnother().props().toggle();

      apply().props().onClick();

      expect(onApply.args[1][0]).to.equal(true);
    });
  });

  describe('Filter panel', () => {
    it('renders the filter panel', () => {
      const wrapper = shallow(
        <ScorecardPanel {...props} dataSource={{ type: 'TableMetric' }} />
      );
      const columnTitle = wrapper.find(componentSelector('Filters'));

      expect(columnTitle).to.have.length(1);
    });

    it('renders the session filter', () => {
      const wrapper = shallow(
        <ScorecardPanel {...props} dataSource={{ type: 'TableMetric' }} />
      );
      const columnTitle = wrapper.find(componentSelector('Filters'));

      expect(columnTitle).to.have.length(1);
    });

    it('opens the filters when isEditMode and filter values are present', () => {
      const store = storeFake(MOCK_DASHBOARD_STATE);
      const TestComponent = (componentProps) => (
        <Provider store={store}>
          <ScorecardPanel
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
          event_types: [],
          session_type: [],
          training_session_types: [1],
        },
      });

      wrapper.update();

      expect(
        getFilters().props().isOpen,
        'filters are open after filters are provided in edit mode'
      ).to.equal(true);
    });
  });
});
