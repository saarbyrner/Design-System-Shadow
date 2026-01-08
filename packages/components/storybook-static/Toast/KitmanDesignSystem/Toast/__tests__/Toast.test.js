import { render, screen, act } from '@testing-library/react';
import { colorByStatus } from '../../utils';
import Toast from '..';

describe('<Toast />', () => {
  const props = {
    id: 1,
    onClose: jest.fn(),
  };

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('displays the correct title', () => {
    render(
      <Toast {...props}>
        <Toast.Title>Toast title</Toast.Title>
      </Toast>
    );
    expect(screen.getByText('Toast title')).toBeInTheDocument();
  });

  it('displays the correct description', () => {
    render(
      <Toast {...props}>
        <Toast.Description>Toast description</Toast.Description>
      </Toast>
    );
    expect(screen.getByText('Toast description')).toBeInTheDocument();
  });

  it('displays the correct links with the correct href', () => {
    render(
      <Toast {...props}>
        <Toast.Links
          links={[
            {
              id: 1,
              text: 'Toast first link',
              link: 'www.mock-first-link.com',
            },
            {
              id: 2,
              text: 'Toast second link',
              link: 'www.mock-second-link.com',
            },
          ]}
        />
      </Toast>
    );

    const firstLink = screen.getByText('Toast first link');
    expect(firstLink).toHaveAttribute('href', 'www.mock-first-link.com');

    const secondLink = screen.getByText('Toast second link');
    expect(secondLink).toHaveAttribute('href', 'www.mock-second-link.com');
  });

  describe('when a status is provided', () => {
    it('calls the correct callback after 5 seconds when the status is SUCCESS', () => {
      render(<Toast {...props} status="SUCCESS" />);

      act(() => {
        jest.advanceTimersByTime(5000);
      });

      expect(props.onClose).toHaveBeenCalledTimes(1);
      expect(props.onClose).toHaveBeenCalledWith(1);
    });

    it('sets the correct styles when the status is SUCCESS', () => {
      render(
        <Toast {...props} status="SUCCESS">
          <Toast.Icon />
        </Toast>
      );

      expect(screen.getByTestId('Toast')).toHaveStyle({
        borderLeft: `4px solid ${colorByStatus.SUCCESS}`,
      });

      const icon = screen.getByTestId('Toast').querySelector('i');
      expect(icon).toHaveStyle({
        color: colorByStatus.SUCCESS,
      });
    });

    it('calls the correct callback after 5 seconds when the status is WARNING', () => {
      render(<Toast {...props} status="WARNING" />);

      act(() => {
        jest.advanceTimersByTime(5000);
      });

      expect(props.onClose).toHaveBeenCalledTimes(1);
      expect(props.onClose).toHaveBeenCalledWith(1);
    });

    it('sets the correct styles when the status is WARNING', () => {
      render(
        <Toast {...props} status="WARNING">
          <Toast.Icon />
        </Toast>
      );

      expect(screen.getByTestId('Toast')).toHaveStyle({
        borderLeft: `4px solid ${colorByStatus.WARNING}`,
      });

      const icon = screen.getByTestId('Toast').querySelector('i');
      expect(icon).toHaveStyle({
        color: colorByStatus.WARNING,
      });
    });

    it('sets the correct styles when the status is ERROR', () => {
      render(
        <Toast {...props} status="ERROR">
          <Toast.Icon />
        </Toast>
      );

      expect(screen.getByTestId('Toast')).toHaveStyle({
        borderLeft: `4px solid ${colorByStatus.ERROR}`,
      });

      const icon = screen.getByTestId('Toast').querySelector('i');
      expect(icon).toHaveStyle({
        color: colorByStatus.ERROR,
      });
    });

    it('calls the correct callback after 5 seconds when the status is INFO', () => {
      render(<Toast {...props} status="INFO" />);

      act(() => {
        jest.advanceTimersByTime(5000);
      });

      expect(props.onClose).toHaveBeenCalledTimes(1);
      expect(props.onClose).toHaveBeenCalledWith(1);
    });

    it('sets the correct styles when the status is INFO', () => {
      render(
        <Toast {...props} status="INFO">
          <Toast.Icon />
        </Toast>
      );

      expect(screen.getByTestId('Toast')).toHaveStyle({
        borderLeft: `4px solid ${colorByStatus.INFO}`,
      });

      const icon = screen.getByTestId('Toast').querySelector('i');
      expect(icon).toHaveStyle({
        color: colorByStatus.INFO,
      });
    });

    it('displays the loader on the title when status is LOADING', () => {
      render(
        <Toast {...props} status="LOADING">
          <Toast.Icon />
        </Toast>
      );

      expect(screen.getByTestId('Toast')).toHaveStyle({
        borderLeft: `4px solid ${colorByStatus.LOADING}`,
      });

      expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });
  });
});
