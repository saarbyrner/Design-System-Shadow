import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithStore } from '@kitman/modules/src/analysis/Dashboard/utils/testUitils';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';

import TableWidgetModal from '..';

const mockTrackEvent = jest.fn();
jest.mock('@kitman/common/src/hooks/useEventTracking', () => ({
  __esModule: true,
  default: () => ({
    trackEvent: mockTrackEvent,
  }),
}));

describe('<TableWidgetModal />', () => {
  const mockOnClickCloseModal = jest.fn();
  const mockOnClickCreateTable = jest.fn();

  const defaultProps = {
    isOpen: false,
    onClickCloseModal: mockOnClickCloseModal,
    onClickCreateTable: mockOnClickCreateTable,
    t: i18nextTranslateStub(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('contains a modal', () => {
    renderWithStore(<TableWidgetModal {...defaultProps} isOpen />);

    expect(screen.getByText('Create Table')).toBeInTheDocument();
  });

  it('calls the correct props when closing the modal', async () => {
    const user = userEvent.setup();
    renderWithStore(<TableWidgetModal {...defaultProps} isOpen />);

    const closeButton = screen.getByRole('button', { name: '' });
    await user.click(closeButton);

    expect(mockOnClickCloseModal).toHaveBeenCalledTimes(1);
  });

  it('calls trackEvent with correct Data', async () => {
    const user = userEvent.setup();
    renderWithStore(<TableWidgetModal {...defaultProps} isOpen />);

    const createButton = screen.getByText('Create table');
    await user.click(createButton);

    expect(mockTrackEvent).toHaveBeenCalledWith('Add Table Widget', {
      tableType: 'COMPARISON',
    });
  });

  describe('The preview', () => {
    it('contains the correct label for the preview', () => {
      renderWithStore(<TableWidgetModal {...defaultProps} isOpen />);

      expect(screen.getByText('Preview')).toBeInTheDocument();
      expect(screen.getByRole('table')).toBeInTheDocument();
    });

    it('has the correct primaryHeaderText', () => {
      renderWithStore(<TableWidgetModal {...defaultProps} isOpen />);

      expect(screen.getByText('Metric 1')).toBeInTheDocument();
      expect(screen.getByText('Metric 2')).toBeInTheDocument();
    });

    it('has the correct secondaryHeaderText', () => {
      renderWithStore(<TableWidgetModal {...defaultProps} isOpen />);

      const dateRangeElements = screen.getAllByText('Date Range');
      expect(dateRangeElements).toHaveLength(2);
    });
  });

  it('the InputRadio value is COMPARISON by default', () => {
    renderWithStore(<TableWidgetModal {...defaultProps} isOpen />);

    const comparisonRadio = screen.getByDisplayValue('COMPARISON');
    expect(comparisonRadio).toBeChecked();
  });

  it('has the correct type description text', () => {
    renderWithStore(<TableWidgetModal {...defaultProps} isOpen />);

    expect(
      screen.getByText(
        'Gather insights by comparing multiple athletes across a variety of metrics'
      )
    ).toBeInTheDocument();
  });

  describe('for scorecard table', () => {
    it('has the correct InputRadio labels', () => {
      renderWithStore(<TableWidgetModal {...defaultProps} isOpen />);

      expect(screen.getByText('Comparison')).toBeInTheDocument();
      expect(screen.getByText('Scorecard')).toBeInTheDocument();
    });

    it('has the correct description text for each type', () => {
      renderWithStore(<TableWidgetModal {...defaultProps} isOpen />);

      expect(
        screen.getByText(
          'Gather insights by comparing multiple athletes across a variety of metrics'
        )
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          'Monitor performance by comparing athletes against their own historical data or those of their peers'
        )
      ).toBeInTheDocument();
    });

    describe('the preview', () => {
      it('has the correct primaryHeaderText after the type is changed to SCORECARD', async () => {
        const user = userEvent.setup();
        renderWithStore(<TableWidgetModal {...defaultProps} isOpen />);

        const scorecardRadio = screen.getByDisplayValue('SCORECARD');
        await user.click(scorecardRadio);

        expect(screen.getByText('Athlete A')).toBeInTheDocument();
        expect(screen.getByText('Athlete B')).toBeInTheDocument();
      });
    });
  });

  describe('for longitudinal table', () => {
    it('contains 3 table type options', () => {
      renderWithStore(<TableWidgetModal {...defaultProps} isOpen />);

      expect(screen.getByText('Comparison')).toBeInTheDocument();
      expect(screen.getByText('Scorecard')).toBeInTheDocument();
      expect(screen.getByText('Longitudinal')).toBeInTheDocument();
    });

    it('has the correct description text for each type', () => {
      renderWithStore(<TableWidgetModal {...defaultProps} isOpen />);
      expect(
        screen.getByText(
          'Gather insights by comparing multiple athletes across a variety of metrics'
        )
      ).toBeInTheDocument();
      expect(
        screen.getByText('Track changes across a variety of time frames')
      ).toBeInTheDocument();
    });

    describe('the preview', () => {
      it('has the correct primaryHeaderText after the type is changed to LONGITUDINAL', async () => {
        const user = userEvent.setup();
        renderWithStore(<TableWidgetModal {...defaultProps} isOpen />);

        const longitudinalRadio = screen.getByDisplayValue('LONGITUDINAL');
        await user.click(longitudinalRadio);

        expect(screen.getByText('Metric 1')).toBeInTheDocument();
        expect(screen.getByText('Metric 2')).toBeInTheDocument();
      });

      it('has the correct rowHeaderText after the type is changed to LONGITUDINAL', async () => {
        const user = userEvent.setup();
        renderWithStore(<TableWidgetModal {...defaultProps} isOpen />);

        const longitudinalRadio = screen.getByDisplayValue('LONGITUDINAL');
        await user.click(longitudinalRadio);

        const dateRangeElements = screen.getAllByText('Date Range');
        expect(dateRangeElements).toHaveLength(2);
      });
    });
  });
});
