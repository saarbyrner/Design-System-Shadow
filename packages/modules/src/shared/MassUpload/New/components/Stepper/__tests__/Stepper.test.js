import { screen, render } from '@testing-library/react';

import { renderWithUserEventSetup } from '@kitman/common/src/utils/test_utils';
import useEventTracking from '@kitman/common/src/hooks/useEventTracking';

import Stepper from '../index';

jest.mock('@kitman/common/src/hooks/useEventTracking');

describe('<Stepper />', () => {
  const mockProps = {
    activeStep: 0,
    onChange: jest.fn(),
    canProceed: false,
    onImport: jest.fn(),
    isLoading: false,
    uploadSteps: [
      { title: 'Upload file', caption: 'Must be a .CSV' },
      { title: 'Preview import', caption: 'Check for errors' },
    ],
  };

  beforeEach(() => {
    useEventTracking.mockReturnValue({ trackEvent: jest.fn() });
  });

  it('should render steps', () => {
    render(<Stepper {...mockProps} />);

    expect(screen.getByText('Upload file')).toBeInTheDocument();
    expect(screen.getByText('Must be a .CSV')).toBeInTheDocument();

    expect(screen.getByText('Preview import')).toBeInTheDocument();
    expect(screen.getByText('Check for errors')).toBeInTheDocument();

    expect(
      screen.getByRole('button', { name: 'Previous' })
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Next' })).toBeInTheDocument();
  });

  describe('Buttons', () => {
    describe('Previous', () => {
      it('should disable Previous button if activeStep === 0', () => {
        render(<Stepper {...mockProps} />);
        expect(screen.getByRole('button', { name: 'Previous' })).toBeDisabled();
      });

      it('should enable Previous button if activeStep !== 0', () => {
        render(<Stepper {...mockProps} activeStep={1} />);
        expect(screen.getByRole('button', { name: 'Previous' })).toBeEnabled();
      });

      it('should call onChange onClick of Previous', async () => {
        const { user } = renderWithUserEventSetup(
          <Stepper {...mockProps} activeStep={1} />
        );

        await user.click(screen.getByRole('button', { name: 'Previous' }));
        expect(mockProps.onChange).toHaveBeenCalled();
      });
    });

    describe('Next/Import', () => {
      it('should disable Next button if canProceed === false', () => {
        render(<Stepper {...mockProps} />);
        expect(screen.getByRole('button', { name: 'Next' })).toBeDisabled();
      });

      it('should enable Next button if canProceed === true', () => {
        render(<Stepper {...mockProps} canProceed />);
        expect(screen.getByRole('button', { name: 'Next' })).toBeEnabled();
      });

      it('should call onChange on click of Next', async () => {
        const { user } = renderWithUserEventSetup(
          <Stepper {...mockProps} canProceed />
        );

        await user.click(screen.getByRole('button', { name: 'Next' }));
        expect(mockProps.onChange).toHaveBeenCalled();
      });

      it('should change Next button text to Import if on final step', () => {
        render(<Stepper {...mockProps} canProceed activeStep={1} />);

        expect(
          screen.queryByRole('button', { name: 'Next' })
        ).not.toBeInTheDocument();
        expect(
          screen.getByRole('button', { name: 'Import' })
        ).toBeInTheDocument();
      });

      it('should call onImport on click of Import', async () => {
        const { user } = renderWithUserEventSetup(
          <Stepper {...mockProps} canProceed activeStep={1} />
        );

        await user.click(screen.getByRole('button', { name: 'Import' }));
        expect(mockProps.onImport).toHaveBeenCalled();
      });

      it('should call disable button and show loading svg if isLoading', async () => {
        const { container } = render(
          <Stepper {...mockProps} canProceed activeStep={1} isLoading />
        );

        const importButton = screen.getAllByRole('button')[1];

        expect(importButton).toBeDisabled();
        expect(
          container.getElementsByClassName('MuiCircularProgress-svg')[0]
        ).toBeInTheDocument();
      });
    });
  });
});
