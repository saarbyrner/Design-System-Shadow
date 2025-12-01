import { getRegistrationStatus } from '../getRegistrationStatus';

describe('getRegistrationStatus', () => {
  it('should match snapshot when newAnnotation is provided', () => {
    const data = { status: 'approved', annotation: 'some annotation' };
    expect(getRegistrationStatus(data)).toMatchSnapshot();
  });

  it('should match snapshot when newAnnotation is not provided', () => {
    const data = { status: 'approved' };
    expect(getRegistrationStatus(data)).toMatchSnapshot();
  });
});
