import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import App from '../App';

describe('<App />', () => {
  const props = {
    assessmentTemplates: [],
    getAssessmentTemplates: sinon.spy(),
    requestStatus: 'SUCCESS',
    t: (t) => t,
  };

  it('renders the correct content', () => {
    const wrapper = shallow(<App {...props} />);

    expect(wrapper.find('.planningSettings')).to.have.length(1);
    expect(wrapper.find('.planningSettings__sections')).to.have.length(1);
    expect(
      wrapper.find('.planningSettings__section--sessionAssessments')
    ).to.have.length(1);
    expect(
      wrapper.find('.planningSettings__section--gameTemplates')
    ).to.have.length(1);
  });

  it('renders the correct content when loading', () => {
    const wrapper = shallow(<App {...props} requestStatus="LOADING" />);

    expect(wrapper.find('.planningSettings')).to.have.length(0);
    expect(wrapper.find('DelayedLoadingFeedback')).to.have.length(1);
  });

  it('renders the correct content when there has been an error', () => {
    const wrapper = shallow(<App {...props} requestStatus="FAILURE" />);

    expect(wrapper.find('.planningSettings')).to.have.length(0);
    expect(wrapper.find('LoadNamespace(AppStatus)')).to.have.length(1);
  });
});
