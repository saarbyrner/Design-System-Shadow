import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import ProgressTracker from '../index';

describe('<ProgressTracker />', () => {
  const props = {
    currentHeadingId: 1,
    headings: [
      {
        id: 1,
        name: 'Heading One',
      },
      {
        id: 2,
        name: 'Heading Two',
      },
      {
        id: 3,
        name: 'Heading Three',
      },
    ],
  };
  const progressNextMock = jest.fn();
  const progressBackMock = jest.fn();
  const formValidationMock = () => true;

  describe('desktop view', () => {
    beforeEach(() => {
      window.innerWidth = 1400;
      render(<ProgressTracker {...props} />);
    });

    it('shows a progress bar', () => {
      const [progressBarBackground, progressBarContent] = screen
        .getByRole('progressbar')
        .querySelectorAll('hr');
      expect(progressBarBackground).toBeInTheDocument();
      expect(progressBarContent).toBeInTheDocument();
    });

    it('shows the headings', () => {
      expect(screen.getByText('Heading One')).toBeInTheDocument();
      expect(screen.getByText('Heading Two')).toBeInTheDocument();
      expect(screen.getByText('Heading Three')).toBeInTheDocument();
    });
  });

  describe('mobile view', () => {
    let component;

    beforeEach(() => {
      window.innerWidth = 500;
      component = render(
        <ProgressTracker
          {...props}
          progressBack={progressBackMock}
          progressNext={progressNextMock}
          formValidation={formValidationMock}
        />
      );
    });

    afterEach(() => {
      window.innerWidth = 1400;
    });

    it('renders the first heading and the current step count', () => {
      expect(component.getByText('Heading One')).toBeInTheDocument();
      expect(component.getByText('Step 1 of 3')).toBeInTheDocument();
      expect(component.queryByText('Heading Two')).not.toBeInTheDocument();
    });

    it('clicking on the next chevron arrow calls progressNext', async () => {
      await userEvent.click(component.getByTestId('icon-next-chevron'));
      expect(progressNextMock).toHaveBeenCalled();
    });

    it('clicking on the previous chevron arrow calls progressBack', async () => {
      component.rerender(
        <ProgressTracker
          {...props}
          currentHeadingId={3}
          progressBack={progressBackMock}
          progressNext={progressNextMock}
          formValidation={formValidationMock}
        />
      );
      expect(component.getByText('Heading Three')).toBeInTheDocument();
      await userEvent.click(component.getByTestId('icon-back-chevron'));
      expect(progressBackMock).toHaveBeenCalled();
    });
  });
});
