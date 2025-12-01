import { expect } from 'chai';
import { shallow } from 'enzyme';
import App from '../App';

describe('Manage Users <App /> component', () => {
  const props = {
    languages: [],
    t: (key) => key,
  };

  beforeEach(() => {
    window.featureFlags = {};
  });

  it('renders', () => {
    const wrapper = shallow(<App {...props} />);
    expect(wrapper).to.have.length(1);
  });
});
