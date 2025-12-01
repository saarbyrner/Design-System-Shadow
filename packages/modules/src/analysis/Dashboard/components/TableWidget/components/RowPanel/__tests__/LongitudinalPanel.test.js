import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithStore } from '@kitman/modules/src/analysis/Dashboard/utils/testUitils';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import LongitudinalPanel from '../components/LongitudinalPanel';

describe('<LongitudinalPanel />', () => {
  const defaultProps = {
    onApply: jest.fn(),
    dateRange: {},
    onSetDateRange: jest.fn(),
    onSetTimePeriod: jest.fn(),
    onSetTimePeriodLength: jest.fn(),
    onSetTimePeriodLengthOffset: jest.fn(),
    timePeriod: '',
    timePeriodLength: 0,
    timePeriodLengthOffset: 0,
    isLoading: false,
    isEditMode: false,
    isOpen: false,
    t: i18nextTranslateStub(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    renderWithStore(<LongitudinalPanel {...defaultProps} />);

    expect(screen.getByLabelText('Date')).toBeInTheDocument();
  });

  describe('the actions footer', () => {
    it('renders the add another checkbox adnd the Apply button', () => {
      renderWithStore(<LongitudinalPanel {...defaultProps} />);

      expect(
        screen.getByRole('checkbox', { name: 'Add another' })
      ).toBeInTheDocument();

      expect(screen.getByRole('button', { name: 'Apply' })).toBeInTheDocument();
    });

    it('disables the Apply button if timePeriod is empty', () => {
      renderWithStore(<LongitudinalPanel {...defaultProps} />);

      expect(screen.getByRole('button', { name: 'Apply' })).toBeDisabled();
    });

    it('enables the Apply button when timePeriod is provided', () => {
      renderWithStore(
        <LongitudinalPanel {...defaultProps} timePeriod="today" />
      );

      expect(screen.getByRole('button', { name: 'Apply' })).toBeEnabled();
    });

    it('passes the value of add another checkbox to the onApply', async () => {
      const user = userEvent.setup();
      const onApplyMock = jest.fn();
      renderWithStore(
        <LongitudinalPanel
          {...defaultProps}
          onApply={onApplyMock}
          timePeriod="today"
        />
      );

      const addAnotherCheckbox = screen.getByRole('checkbox', {
        name: 'Add another',
      });
      const applyButton = screen.getByRole('button', { name: 'Apply' });

      await user.click(applyButton);
      expect(onApplyMock).toHaveBeenCalledWith(false);

      await user.click(addAnotherCheckbox);
      await user.click(applyButton);
      expect(onApplyMock).toHaveBeenCalledWith(true);
    });
  });
});
