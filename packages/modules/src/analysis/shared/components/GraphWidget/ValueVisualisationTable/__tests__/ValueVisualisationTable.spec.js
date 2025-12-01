import sinon from 'sinon';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import _cloneDeep from 'lodash/cloneDeep';
import i18n from 'i18next';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { getDummyData } from '../../../../resources/graph/DummyData';
import ValueVisualisationTable from '..';

describe('Graph Composer <ValueVisualisationTable /> component', () => {
  const props = {
    graphData: getDummyData('value_visualisation'),
    showTitle: true,
    t: i18nextTranslateStub(i18n),
  };

  it('renders the graph description', () => {
    const wrapper = shallow(<ValueVisualisationTable {...props} showTitle />);
    const GraphDescription = wrapper.find('LoadNamespace(GraphDescription)');

    expect(GraphDescription.length).to.eq(1);
    expect(GraphDescription.props().showTitle).to.eq(true);
  });

  it("doesn't render the title when showTitle is false", () => {
    const wrapper = shallow(
      <ValueVisualisationTable {...props} showTitle={false} />
    );
    const GraphDescription = wrapper.find('LoadNamespace(GraphDescription)');

    expect(GraphDescription.props().showTitle).to.eq(false);
  });

  it('renders the table', () => {
    const wrapper = shallow(<ValueVisualisationTable {...props} />);

    const tableHead = wrapper.find('table thead');
    const tableBody = wrapper.find('table tbody');

    expect(tableHead.find('th').at(0).text()).to.eq('Name');
    expect(tableHead.find('th').at(1).text()).to.eq('Data');
    expect(tableHead.find('th').at(2).text()).to.eq('Value');

    expect(tableBody.find('td').at(0).text()).to.eq('Forwards');
    expect(tableBody.find('td').at(1).text()).to.eq(
      'Illness - No. of Illness Occurrences'
    );
    expect(tableBody.find('td').at(2).text()).to.eq('32');
  });

  describe('when a metric is linked to a dashboard', () => {
    const { location } = window;

    beforeEach(() => {
      delete window.location;
      window.location = { assign: sinon.spy() };
    });

    afterEach(() => {
      window.location = location;
    });

    it('redirects to the correct dashboard when clicking a link', () => {
      const customGraphData = _cloneDeep(props.graphData);
      customGraphData.metrics[0].linked_dashboard_id = '3';
      customGraphData.metrics[0].series[0].population_type = 'athlete';
      customGraphData.metrics[0].series[0].population_id = '3';
      customGraphData.time_period = 'this_season';

      const wrapper = shallow(
        <ValueVisualisationTable {...props} graphData={customGraphData} />
      );

      wrapper.find('.valueVisualisation__link').at(0).simulate('click');

      expect(
        window.location.assign.calledWithExactly(
          '/analysis/dashboard/3?pivot=true&athletes=3&time_period=this_season'
        )
      ).to.equal(true);
    });
  });
});
