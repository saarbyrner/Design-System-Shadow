import { render, screen } from '@testing-library/react';
import BodySkeleton from '../index';

describe('<BodySkeleton />', () => {
  it('renders the correct number of skeleton rows', () => {
    render(<BodySkeleton />);
    const skeletonRows = screen.getAllByTestId('skeleton-row');
    expect(skeletonRows.length).toBe(7);
  });

  it('renders text and rectangular skeletons in each row', () => {
    render(<BodySkeleton />);
    const textSkeletons = screen.getAllByTestId('skeleton-text');
    const rectSkeletons = screen.getAllByTestId('skeleton-rect');

    expect(textSkeletons.length).toBe(7);
    expect(rectSkeletons.length).toBe(7);
  });
});
