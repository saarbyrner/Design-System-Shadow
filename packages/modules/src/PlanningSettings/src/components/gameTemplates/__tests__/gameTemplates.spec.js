import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import GameTemplates from '..';

describe('<GameTemplates />', () => {
  const props = {
    assessmentTemplates: [],
    editedGameTemplates: [],
    getGameTemplates: sinon.spy(),
    onCancelEdit: sinon.spy(),
    onClickSave: sinon.spy(),
    onSelectAssessmentType: sinon.spy(),
    requestStatus: 'SUCCESS',
    gameTemplates: [],
    t: (t) => t,
  };

  it('renders the correct content', () => {
    const wrapper = shallow(<GameTemplates {...props} />);

    expect(wrapper.find('LoadNamespace(Header)')).to.have.length(1);
    expect(wrapper.find('LoadNamespace(Editor)')).to.have.length(1);
  });

  it('renders the correct content when loading', () => {
    const wrapper = shallow(
      <GameTemplates {...props} requestStatus="LOADING" />
    );

    expect(wrapper.find('LoadNamespace(Header)')).to.have.length(0);
    expect(wrapper.find('LoadNamespace(Editor)')).to.have.length(0);
    expect(wrapper.find('DelayedLoadingFeedback')).to.have.length(1);
  });

  it('renders the correct content when there has been an error', () => {
    const wrapper = shallow(
      <GameTemplates {...props} requestStatus="FAILURE" />
    );

    expect(wrapper.find('LoadNamespace(Header)')).to.have.length(0);
    expect(wrapper.find('LoadNamespace(Editor)')).to.have.length(0);
    expect(wrapper.find('LoadNamespace(AppStatus)')).to.have.length(1);
  });
});
