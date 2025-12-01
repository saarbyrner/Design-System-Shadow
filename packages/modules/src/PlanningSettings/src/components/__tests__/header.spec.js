import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import Header from '../header';

describe('<Header />', () => {
  const props = {
    isEditMode: false,
    onCancelEdit: sinon.spy(),
    onClickEditValues: sinon.spy(),
    onClickSave: sinon.spy(),
    t: (t) => t,
  };

  it('renders the correct basic content', () => {
    const wrapper = shallow(<Header {...props} />);

    expect(wrapper.find('.planningSettings__sectionHeader')).to.have.length(1);
    expect(
      wrapper.find('.planningSettings__sectionHeaderContent')
    ).to.have.length(1);
    expect(
      wrapper.find('.planningSettings__sectionHeaderTitle')
    ).to.have.length(1);
  });

  it('renders the correct desktop actions buttons', () => {
    const wrapper = shallow(<Header {...props} />);
    expect(
      wrapper.find('.planningSettings__sectionHeaderActions--desktop')
    ).to.have.length(1);
    expect(wrapper.find('ForwardRef(TextButton)')).to.have.length(1);
    expect(wrapper.find('ForwardRef(TextButton)').props().text).to.eq(
      'Edit values'
    );
  });

  it('calls the correct function when edit values is clicked', () => {
    const wrapper = shallow(<Header {...props} />);
    expect(wrapper.find('ForwardRef(TextButton)').props().onClick());
    expect(props.onClickEditValues.calledOnce).to.eq(true);
  });

  it('renders the correct desktop actions buttons when in edit mode', () => {
    const wrapper = shallow(<Header {...props} isEditMode />);
    expect(
      wrapper.find('.planningSettings__sectionHeaderActions--desktop')
    ).to.have.length(1);
    expect(wrapper.find('ForwardRef(TextButton)')).to.have.length(2);
    expect(wrapper.find('ForwardRef(TextButton)').at(0).props().text).to.eq(
      'Save'
    );
    expect(wrapper.find('ForwardRef(TextButton)').at(1).props().text).to.eq(
      'Cancel'
    );
  });

  it('calls the correct function when save is clicked', () => {
    const wrapper = shallow(<Header {...props} isEditMode />);
    expect(wrapper.find('ForwardRef(TextButton)').at(0).props().onClick());
    expect(props.onClickSave.calledOnce).to.eq(true);
  });

  it('calls the correct function when cancel is clicked', () => {
    const wrapper = shallow(<Header {...props} isEditMode />);
    expect(wrapper.find('ForwardRef(TextButton)').at(1).props().onClick());
    expect(props.onCancelEdit.calledOnce).to.eq(true);
  });

  describe('mobile actions', () => {
    it('renders the correct mobile actions buttons', () => {
      const wrapper = shallow(<Header {...props} />);
      expect(
        wrapper.find('.planningSettings__sectionHeaderActions--mobile')
      ).to.have.length(1);
      expect(
        wrapper.find('TooltipMenu').props().menuItems[0].description
      ).to.eq('Edit values');
    });

    it('calls the correct function when edit values is clicked', () => {
      const wrapper = shallow(<Header {...props} />);
      expect(wrapper.find('TooltipMenu').props().menuItems[0].onClick);
      expect(props.onClickEditValues.calledOnce).to.eq(true);
    });

    it('renders the correct mobile actions buttons when in edit mode', () => {
      const wrapper = shallow(<Header {...props} isEditMode />);
      expect(
        wrapper.find('.planningSettings__sectionHeaderActions--mobile')
      ).to.have.length(1);
      expect(
        wrapper.find('TooltipMenu').props().menuItems[0].description
      ).to.eq('Save');
      expect(
        wrapper.find('TooltipMenu').props().menuItems[1].description
      ).to.eq('Cancel');
    });

    it('calls the correct function when save is clicked', () => {
      const wrapper = shallow(<Header {...props} isEditMode />);
      expect(wrapper.find('TooltipMenu').props().menuItems[0].onClick);
      expect(props.onClickSave.calledOnce).to.eq(true);
    });

    it('calls the correct function when cancel is clicked', () => {
      const wrapper = shallow(<Header {...props} isEditMode />);
      expect(wrapper.find('TooltipMenu').props().menuItems[1].onClick);
      expect(props.onCancelEdit.calledOnce).to.eq(true);
    });
  });
});
