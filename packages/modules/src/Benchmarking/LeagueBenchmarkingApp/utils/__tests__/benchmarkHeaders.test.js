import benchmarkHeaders from '../benchmarkHeaders';

describe('benchmark headers', () => {
  it('should return headers as expected', () => {
    expect(benchmarkHeaders).toMatchSnapshot();
  });
});
