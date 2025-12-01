import growthAndMaturationHeaders from '../growthAndMaturationHeaders';

describe('growthAndMaturationHeaders', () => {
  it('should return as expected', () => {
    expect(growthAndMaturationHeaders).toMatchSnapshot();
  });
});
