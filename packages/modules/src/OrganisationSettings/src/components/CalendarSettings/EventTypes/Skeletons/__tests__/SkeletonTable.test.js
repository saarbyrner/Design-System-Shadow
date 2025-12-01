import { render } from '@testing-library/react';
import SkeletonTable, { numberOfSkeletonRows } from '../SkeletonTable';

describe('<SkeletonTable />', () => {
  it('should render', () => {
    const { container } = render(<SkeletonTable />);
    expect(container.getElementsByClassName('MuiSkeleton-rounded').length).toBe(
      numberOfSkeletonRows
    );
  });
});
