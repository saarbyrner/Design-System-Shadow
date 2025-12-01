import { render, screen, act } from '@testing-library/react';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';

import AutosaveStatus from '../index';

const defaultProps = {
  t: i18nextTranslateStub(),
};

describe('<AutosaveStatus />', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it('should render null when no status props are provided', () => {
    const { container } = render(<AutosaveStatus {...defaultProps} />);

    expect(container).toBeEmptyDOMElement();
  });

  it('should render the saving status when isAutosaving is true', () => {
    render(<AutosaveStatus {...defaultProps} isAutosaving />);

    expect(screen.getByText('Saving...')).toBeInTheDocument();
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('should render the error status when an autosaveError is provided', () => {
    const errorText = 'Failed to save.';

    render(<AutosaveStatus {...defaultProps} autosaveError={errorText} />);

    expect(screen.getByText(errorText)).toBeInTheDocument();
  });

  describe('Time Ago Formatting', () => {
    const MOCK_NOW = new Date('2025-10-09T12:00:00.000Z');

    beforeEach(() => {
      jest.setSystemTime(MOCK_NOW);
    });

    it('should render "just now" if lastSaved was less than 10 seconds ago', () => {
      const savedDate = new Date(MOCK_NOW.getTime() - 5 * 1000).toISOString();

      render(<AutosaveStatus {...defaultProps} lastSaved={savedDate} />);

      expect(screen.getByText('Last saved just now')).toBeInTheDocument();
    });

    it('should render "less than a minute ago" if lastSaved was between 10 and 60 seconds ago', () => {
      const savedDate = new Date(MOCK_NOW.getTime() - 30 * 1000).toISOString();

      render(<AutosaveStatus {...defaultProps} lastSaved={savedDate} />);

      expect(
        screen.getByText('Last saved less than a minute ago')
      ).toBeInTheDocument();
    });

    it('should render "1 minute ago" if lastSaved was between 1 and 2 minutes ago', () => {
      const savedDate = new Date(MOCK_NOW.getTime() - 90 * 1000).toISOString();

      render(<AutosaveStatus {...defaultProps} lastSaved={savedDate} />);
      expect(screen.getByText('Last saved 1 minute ago')).toBeInTheDocument();
    });

    it('should render "X minutes ago" if lastSaved was less than an hour ago', () => {
      const savedDate = new Date(
        MOCK_NOW.getTime() - 10 * 60 * 1000
      ).toISOString();

      render(<AutosaveStatus {...defaultProps} lastSaved={savedDate} />);

      expect(screen.getByText('Last saved 10 minutes ago')).toBeInTheDocument();
    });

    it('should render "1 hour ago" if lastSaved was between 1 and 2 hours ago', () => {
      const savedDate = new Date(
        MOCK_NOW.getTime() - 90 * 60 * 1000
      ).toISOString();

      render(<AutosaveStatus {...defaultProps} lastSaved={savedDate} />);

      expect(screen.getByText('Last saved 1 hour ago')).toBeInTheDocument();
    });

    it('should render "X hours ago" if lastSaved was less than a day ago', () => {
      const savedDate = new Date(
        MOCK_NOW.getTime() - 5 * 60 * 60 * 1000
      ).toISOString();

      render(<AutosaveStatus {...defaultProps} lastSaved={savedDate} />);

      expect(screen.getByText('Last saved 5 hours ago')).toBeInTheDocument();
    });

    it('should render the time if lastSaved was more than 24 hours ago', () => {
      const savedDate = new Date('2025-10-08T10:30:00.000Z').toISOString(); // 25.5 hours before MOCK_NOW

      render(<AutosaveStatus {...defaultProps} lastSaved={savedDate} />);

      expect(screen.getByText(/Last saved at \d{2}:\d{2}/)).toBeInTheDocument();
    });

    it('should also render the time if lastSaved was several days ago', () => {
      const savedDate = new Date('2025-10-06T10:30:00.000Z').toISOString(); // 3 days before MOCK_NOW

      render(<AutosaveStatus {...defaultProps} lastSaved={savedDate} />);

      expect(screen.getByText(/Last saved at \d{2}:\d{2}/)).toBeInTheDocument();
    });
  });

  it('should update the time ago text after the interval', () => {
    const startTime = new Date('2025-10-09T12:00:00.000Z');

    jest.setSystemTime(startTime);

    render(
      <AutosaveStatus {...defaultProps} lastSaved={startTime.toISOString()} />
    );

    expect(screen.getByText('Last saved just now')).toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(30000);
    });

    expect(
      screen.getByText('Last saved less than a minute ago')
    ).toBeInTheDocument();
  });
});
