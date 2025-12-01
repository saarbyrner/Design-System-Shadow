import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import Editor from '../editor';

describe('<Editor />', () => {
  const props = {
    assessmentTemplates: [],
    editedGameTemplates: [],
    isEditMode: false,
    onSelectAssessmentType: sinon.spy(),
    gameTemplates: [],
    t: (t) => t,
  };

  it('renders the correct content', () => {
    const wrapper = shallow(<Editor {...props} />);

    expect(wrapper.find('.sessionAssessmentTable')).to.have.length(1);
    expect(wrapper.find('LoadNamespace(DataGrid)')).to.have.length(1);
  });

  it('renders the correct content when in edit mode', () => {
    const wrapper = shallow(<Editor {...props} isEditMode />);

    expect(wrapper.find('.sessionAssessmentTable--edit')).to.have.length(1);
    expect(wrapper.find('LoadNamespace(DataGrid)')).to.have.length(1);
  });
});
