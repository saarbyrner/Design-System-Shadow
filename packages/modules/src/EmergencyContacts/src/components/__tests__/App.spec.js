import { expect } from 'chai';
import { shallow } from 'enzyme';
import App from '../App';

describe('Emergency Contacts App', () => {
  const props = {
    t: (key) => key,
  };

  let wrapper;

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount();
    }
  });

  it('renders', () => {
    wrapper = shallow(<App {...props} />);
    expect(wrapper).to.have.length(1);
  });
});
