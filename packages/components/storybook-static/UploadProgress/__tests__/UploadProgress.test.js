import { render, screen, within } from '@testing-library/react';
import UploadProgress from '..';

describe('<UploadProgress />', () => {
  const defaultProps = {
    radius: 20,
    progress: 20,
    strokeWidth: 2,
    showPercentageIndicator: false,
  };

  it('should render as expected', () => {
    render(<UploadProgress {...defaultProps} />);
    const uploadProgressContainer = screen.getByTestId('UploadProgress');

    expect(uploadProgressContainer).toBeInTheDocument();
    expect(
      within(uploadProgressContainer).queryByText('20%')
    ).not.toBeInTheDocument();
    expect(
      within(uploadProgressContainer).getByTestId('UploadProgress|Progress')
    ).toBeInTheDocument();
  });

  it('should render progress indicator if prop passed', () => {
    render(<UploadProgress {...defaultProps} showProgressIndicator />);
    const uploadProgressContainer = screen.getByTestId('UploadProgress');

    expect(uploadProgressContainer).toBeInTheDocument();
    expect(
      within(uploadProgressContainer).queryByText('20%')
    ).toBeInTheDocument();
  });

  it('should show progress as 100% if progress passed is greater than 100', () => {
    render(
      <UploadProgress {...defaultProps} showProgressIndicator progress={200} />
    );
    const uploadProgressContainer = screen.getByTestId('UploadProgress');

    expect(uploadProgressContainer).toBeInTheDocument();
    expect(
      within(uploadProgressContainer).queryByText('100%')
    ).toBeInTheDocument();
  });
});
