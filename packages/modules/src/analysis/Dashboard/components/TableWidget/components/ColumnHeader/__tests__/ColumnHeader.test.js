import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithStore } from '@kitman/modules/src/analysis/Dashboard/utils/testUitils';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import ColumnHeader from '../ColumnHeader';

describe('<ColumnHeader />', () => {
  const defaultProps = {
    columnCalculation: 'Sum',
    canManageDashboard: true,
    columnName: 'RPE',
    hasError: false,
    isForbidden: false,
    isSorted: false,
    t: i18nextTranslateStub(),
  };

  const mockOnClickEditColumn = jest.fn();
  const mockOnClickFormatColumn = jest.fn();
  const mockOnClickDeleteColumn = jest.fn();
  const mockOnDuplicateColumn = jest.fn();

  it('renders a meatball menu with the correct items', () => {
    const { container } = renderWithStore(<ColumnHeader {...defaultProps} />);

    const menuTrigger = container.querySelector('.icon-more');
    expect(menuTrigger).toBeInTheDocument();

    expect(screen.getByText('RPE')).toBeInTheDocument();
    expect(screen.getByText('Sum')).toBeInTheDocument();
  });

  it('renders a meatball menu with the correct items when hasError', async () => {
    const user = userEvent.setup();
    const { container } = renderWithStore(
      <ColumnHeader {...defaultProps} hasError />
    );

    const menuTrigger = container.querySelector('.icon-more');
    await user.click(menuTrigger);

    // Only Edit and Delete Column should be available when hasError is true
    expect(screen.getByText('Edit')).toBeInTheDocument();
    expect(screen.getByText('Delete Column')).toBeInTheDocument();
    expect(
      screen.queryByText('Conditional Formatting')
    ).not.toBeInTheDocument();
    expect(screen.queryByText('Sort')).not.toBeInTheDocument();
  });

  it('renders a meatball menu with the correct items when isForbidden', async () => {
    const user = userEvent.setup();
    const { container } = renderWithStore(
      <ColumnHeader {...defaultProps} isForbidden />
    );

    const menuTrigger = container.querySelector('.icon-more');
    await user.click(menuTrigger);

    // Only Edit and Delete Column should be available when isForbidden is true
    expect(screen.getByText('Edit')).toBeInTheDocument();
    expect(screen.getByText('Delete Column')).toBeInTheDocument();
    expect(
      screen.queryByText('Conditional Formatting')
    ).not.toBeInTheDocument();
    expect(screen.queryByText('Sort')).not.toBeInTheDocument();
  });

  it('calls onClickEditColumn when clicking Edit', async () => {
    const user = userEvent.setup();
    const { container } = renderWithStore(
      <ColumnHeader
        {...defaultProps}
        onClickEditColumn={mockOnClickEditColumn}
      />
    );

    const menuTrigger = container.querySelector('.icon-more');
    await user.click(menuTrigger);

    const editButton = screen.getByText('Edit');
    await user.click(editButton);

    expect(mockOnClickEditColumn).toHaveBeenCalledTimes(1);
  });

  it('calls onClickFormatColumn when clicking Conditional Formatting', async () => {
    const user = userEvent.setup();
    const { container } = renderWithStore(
      <ColumnHeader
        {...defaultProps}
        onClickFormatColumn={mockOnClickFormatColumn}
      />
    );

    const menuTrigger = container.querySelector('.icon-more');
    await user.click(menuTrigger);

    const formatButton = screen.getByText('Conditional Formatting');
    await user.click(formatButton);

    expect(mockOnClickFormatColumn).toHaveBeenCalledTimes(1);
  });

  it('calls onClickDeleteColumn when clicking Delete', async () => {
    const user = userEvent.setup();
    const { container } = renderWithStore(
      <ColumnHeader
        {...defaultProps}
        onClickDeleteColumn={mockOnClickDeleteColumn}
      />
    );

    const menuTrigger = container.querySelector('.icon-more');
    await user.click(menuTrigger);

    const deleteButton = screen.getByText('Delete Column');
    await user.click(deleteButton);

    expect(mockOnClickDeleteColumn).toHaveBeenCalledTimes(1);
  });

  describe('when the table-updated-pivot flag is on', () => {
    beforeEach(() => {
      window.setFlag('table-updated-pivot', true);
    });

    afterEach(() => {
      window.setFlag('table-updated-pivot', false);
    });

    it('renders a meatball menu with the correct items', async () => {
      const user = userEvent.setup();
      const options = [
        'Edit',
        'Conditional Formatting',
        'Lock Pivot',
        'Sort',
        'Delete Column',
      ];
      const { container } = renderWithStore(<ColumnHeader {...defaultProps} />);

      const menuTrigger = container.querySelector('.icon-more');
      await user.click(menuTrigger);

      options.forEach((option) => {
        expect(screen.getByText(option)).toBeInTheDocument();
      });
    });
  });

  describe('when the rep-defense-bmt-mvp flag is on', () => {
    beforeEach(() => {
      window.setFlag('rep-defense-bmt-mvp', true);
      window.setFlag('table-updated-pivot', true);
    });

    afterEach(() => {
      window.setFlag('rep-defense-bmt-mvp', false);
      window.setFlag('table-updated-pivot', false);
    });

    it('does not render the PivotDashboardButton', async () => {
      const user = userEvent.setup();
      const { container } = renderWithStore(<ColumnHeader {...defaultProps} />);

      const menuTrigger = container.querySelector('.icon-more');
      await user.click(menuTrigger);

      expect(screen.queryByText('Lock Pivot')).not.toBeInTheDocument();
    });
  });

  describe('when the table-widget-duplicate-column flag is on', () => {
    beforeEach(() => {
      window.setFlag('table-widget-duplicate-column', true);
    });

    afterEach(() => {
      window.setFlag('table-widget-duplicate-column', false);
    });

    it('renders a meatball menu with the correct items', async () => {
      const user = userEvent.setup();
      const options = [
        'Edit',
        'Conditional Formatting',
        'Sort',
        'Duplicate Column',
        'Delete Column',
      ];
      const { container } = renderWithStore(<ColumnHeader {...defaultProps} />);

      const menuTrigger = container.querySelector('.icon-more');
      await user.click(menuTrigger);

      options.forEach((option) => {
        expect(screen.getByText(option)).toBeInTheDocument();
      });
    });

    it('calls onDuplicateColumn when clicking Duplicate Column', async () => {
      const user = userEvent.setup();
      const { container } = renderWithStore(
        <ColumnHeader
          {...defaultProps}
          onDuplicateColumn={mockOnDuplicateColumn}
        />
      );

      const menuTrigger = container.querySelector('.icon-more');
      await user.click(menuTrigger);

      const duplicateButton = screen.getByText('Duplicate Column');
      await user.click(duplicateButton);

      expect(mockOnDuplicateColumn).toHaveBeenCalledTimes(1);
    });
  });

  describe('when the table-widget-ranking flag is on', () => {
    beforeEach(() => {
      window.setFlag('table-widget-ranking', true);
    });

    afterEach(() => {
      window.setFlag('table-widget-ranking', false);
    });

    it('has the Rank Calculation MenuItem', async () => {
      const user = userEvent.setup();
      const { container } = renderWithStore(<ColumnHeader {...defaultProps} />);

      const menuTrigger = container.querySelector('.icon-more');
      await user.click(menuTrigger);

      const rankButtons = screen.getAllByText('Rank');
      expect(rankButtons.length).toBeGreaterThan(0);
    });

    it('displays ranking submenu when enabled', async () => {
      const user = userEvent.setup();
      const { container } = renderWithStore(<ColumnHeader {...defaultProps} />);

      const menuTrigger = container.querySelector('.icon-more');
      await user.click(menuTrigger);

      expect(screen.getByText('None')).toBeInTheDocument();
      expect(screen.getByText('Percentile')).toBeInTheDocument();
    });
  });
});
