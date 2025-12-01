import { render, screen, fireEvent } from '@testing-library/react';
import ProgressContainer from '..';

describe('<ProgressContainer />', () => {
  const defaultProps = {
    title: 'Progress Container',
    progress: 20,
    onDelete: jest.fn(),
    onTitleClick: jest.fn(),
  };

  it('should render as expected', () => {
    render(<ProgressContainer {...defaultProps} />);

    expect(screen.getAllByRole('button').length).toEqual(2);
    expect(screen.getByText(defaultProps.title)).toBeInTheDocument();
    expect(screen.getByTestId('UploadProgress')).toBeInTheDocument();
  });

  it('should wrap title in Button tag if onTitleClick is passed', () => {
    render(<ProgressContainer {...defaultProps} onTitleClick={() => {}} />);

    expect(screen.getByText(defaultProps.title)).toBeInTheDocument();
    expect(screen.getAllByRole('button')[1]).toBeInTheDocument();
  });

  it('should call function passed as onTitleClick on click of title', () => {
    const handleTitleClick = jest.fn();
    render(
      <ProgressContainer {...defaultProps} onTitleClick={handleTitleClick} />
    );

    fireEvent.click(screen.getAllByRole('button')[1]);
    expect(handleTitleClick).toHaveBeenCalled();
  });

  it('should call function passed as props on click of bin icon', () => {
    render(<ProgressContainer {...defaultProps} />);

    fireEvent.click(screen.getAllByRole('button')[0]);
    expect(defaultProps.onDelete).toHaveBeenCalled();
  });

  it('should call function passed as props on click of title', () => {
    render(<ProgressContainer {...defaultProps} src="test/link" />);

    fireEvent.click(screen.getAllByRole('button')[1]);
    expect(defaultProps.onTitleClick).toHaveBeenCalled();
  });

  it('should render loading spinner if progress is 0', () => {
    render(<ProgressContainer {...defaultProps} progress={0} />);

    expect(screen.queryByTestId('UploadProgress')).not.toBeInTheDocument();
    expect(screen.getByTestId('LoadingSpinner')).toBeInTheDocument();
  });

  it('should render upload progress if progress is not 0', () => {
    render(<ProgressContainer {...defaultProps} progress={20} />);

    expect(screen.queryByTestId('LoadingSpinner')).not.toBeInTheDocument();
    expect(screen.getByTestId('UploadProgress')).toBeInTheDocument();
  });
});
