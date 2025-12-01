import sinon from 'sinon';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import HeaderForm from '../HeaderForm';

describe('HeaderForm Form component', () => {
  const props = {
    onClickCloseModal: sinon.spy(),
    onClickSave: sinon.spy(),
    t: (t) => t,
  };

  it('renders the form in a modal', () => {
    const wrapper = shallow(<HeaderForm {...props} />);

    expect(wrapper.find('LoadNamespace(ChooseNameModal)')).to.have.length(1);
  });

  it('populates the form with the initial value when passed', () => {
    const wrapper = shallow(
      <HeaderForm {...props} initialValue="Initial value" />
    );

    expect(wrapper.find('LoadNamespace(ChooseNameModal)').props().value).to.eq(
      'Initial value'
    );
  });

  it('saves the header when clicking save', () => {
    const wrapper = shallow(<HeaderForm {...props} />);

    wrapper
      .find('LoadNamespace(ChooseNameModal)')
      .props()
      .onConfirm('Header name');

    expect(props.onClickSave.calledWith('Header name')).to.eq(true);
  });
});
