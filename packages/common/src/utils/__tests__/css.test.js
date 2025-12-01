import { convertPixelsToREM } from '../css';

describe('convertPixelsToREM', () => {
  it('can convert pixel numbers to rem', () => {
    expect(convertPixelsToREM(16)).toEqual('1rem');
    expect(convertPixelsToREM(32)).toEqual('2rem');
    expect(convertPixelsToREM(99)).toEqual('6.188rem');
    expect(convertPixelsToREM(100)).toEqual('6.25rem');
  });
});
