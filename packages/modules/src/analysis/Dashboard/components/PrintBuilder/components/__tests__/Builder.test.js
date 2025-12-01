import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import useLayoutStateManager from '../../hooks/useLayoutStateManager';
import Builder from '../Builder';
import { MOCK_LAYOUTS, MOCK_WIDGETS } from '../../__tests__/mockData';
import { renderWithContext } from './testUtils';

// Mocking this as it is tested separattely
jest.mock('../PDFRender', () => {
  return {
    PDFRenderTranslated: () => <>PDFRender</>,
  };
});

jest.mock('../../hooks/useLayoutStateManager');

describe('PrintBuilder|<Builder />', () => {
  const i18nT = i18nextTranslateStub();
  const defaultProps = {
    t: i18nT,
    widgets: MOCK_WIDGETS,
    dashboardPrintLayout: MOCK_LAYOUTS[0],
    dashboardName: 'My Dashboard',
    close: jest.fn(),
    onUpdateDashboardPrintLayout: jest.fn(),
  };

  const saveChanges = jest.fn();
  const updatePreview = jest.fn();
  const resetLayout = jest.fn();
  const undoChanges = jest.fn();
  const redoChanges = jest.fn();

  beforeEach(() => {
    useLayoutStateManager.mockReturnValue({
      localPrintLayouts: MOCK_LAYOUTS,
      localPrintLayoutIndex: 0,
      saveChanges,
      updatePreview,
      resetLayout,
      undoChanges,
      redoChanges,
      hasChanges: false,
      hasUndoChanges: false,
      hasRedoChanges: false,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('calls the close prop when back button is clicked', async () => {
    renderWithContext(<Builder {...defaultProps} />);

    expect(defaultProps.close).not.toHaveBeenCalled();

    await userEvent.click(screen.getByRole('button', { name: 'Back' }));

    expect(defaultProps.close).toHaveBeenCalled();
  });

  it('displays the dashboard name', () => {
    renderWithContext(<Builder {...defaultProps} />);

    expect(screen.queryByText(defaultProps.dashboardName)).toBeInTheDocument();
  });

  it('renders the correct areas', () => {
    renderWithContext(<Builder {...defaultProps} />);

    expect(screen.queryByText('Settings')).toBeInTheDocument();
    expect(screen.queryByText('Layout')).toBeInTheDocument();
  });

  it('disables the Save button', () => {
    renderWithContext(<Builder {...defaultProps} />);

    expect(screen.getByRole('button', { name: 'Save' })).toBeDisabled();
  });

  it('disables the Reset button', () => {
    renderWithContext(<Builder {...defaultProps} />);

    expect(screen.getByRole('button', { name: 'Reset' })).toBeDisabled();
  });

  it('disables the Undo button', () => {
    renderWithContext(<Builder {...defaultProps} />);

    expect(screen.getByRole('button', { name: 'Undo' })).toBeDisabled();
  });

  it('disables the Redo button', () => {
    renderWithContext(<Builder {...defaultProps} />);

    expect(screen.getByRole('button', { name: 'Redo' })).toBeDisabled();
  });

  describe('when hasChanges is true', () => {
    beforeEach(() => {
      useLayoutStateManager.mockReturnValue({
        localPrintLayouts: MOCK_LAYOUTS,
        localPrintLayoutIndex: 0,
        saveChanges,
        updatePreview,
        resetLayout,
        undoChanges,
        redoChanges,
        hasChanges: true,
        hasUndoChanges: true,
        hasRedoChanges: true,
      });
    });

    it('enables the Save button', () => {
      renderWithContext(<Builder {...defaultProps} />);

      expect(screen.getByRole('button', { name: 'Save' })).toBeEnabled();
    });

    it('calls saveChanges when clicking Save', async () => {
      renderWithContext(<Builder {...defaultProps} />);

      await userEvent.click(screen.getByRole('button', { name: 'Save' }));

      expect(saveChanges).toHaveBeenCalled();
    });

    it('enables the Reset button', () => {
      renderWithContext(<Builder {...defaultProps} />);

      expect(screen.getByRole('button', { name: 'Reset' })).toBeEnabled();
    });

    describe('when warning dialog is showing after clicking Reset', () => {
      it('calls cancel changes when clicking Reset', async () => {
        renderWithContext(<Builder {...defaultProps} />);

        await userEvent.click(screen.getByRole('button', { name: 'Reset' }));
        await waitFor(() => {
          expect(
            screen.queryByText(
              'Are you sure you want to discard changes? All changes will be lost'
            )
          ).toBeVisible();
        });

        await userEvent.click(
          screen.getByRole('button', { name: 'Discard changes' })
        );

        expect(resetLayout).toHaveBeenCalled();
      });

      it('calls closes modal and does nothing when clicking Cancel', async () => {
        renderWithContext(<Builder {...defaultProps} />);

        await userEvent.click(screen.getByRole('button', { name: 'Reset' }));
        await waitFor(() => {
          expect(
            screen.queryByText(
              'Are you sure you want to discard changes? All changes will be lost'
            )
          ).toBeVisible();
        });

        await userEvent.click(screen.getByRole('button', { name: 'Cancel' }));

        expect(resetLayout).not.toHaveBeenCalled();
        await waitFor(() => {
          expect(
            screen.queryByText(
              'Are you sure you want to discard changes? All changes will be lost'
            )
          ).not.toBeVisible();
        });
      });
    });

    it('enables the Undo button', () => {
      renderWithContext(<Builder {...defaultProps} />);

      expect(screen.getByRole('button', { name: 'Undo' })).toBeEnabled();
    });

    it('calls undoChanges when clicking Undo', async () => {
      renderWithContext(<Builder {...defaultProps} />);

      await userEvent.click(screen.getByRole('button', { name: 'Undo' }));

      expect(undoChanges).toHaveBeenCalled();
    });

    it('enables the Redo button', () => {
      renderWithContext(<Builder {...defaultProps} />);

      expect(screen.getByRole('button', { name: 'Redo' })).toBeEnabled();
    });

    it('calls redoChanges when clicking Redo', async () => {
      renderWithContext(<Builder {...defaultProps} />);

      await userEvent.click(screen.getByRole('button', { name: 'Redo' }));

      expect(redoChanges).toHaveBeenCalled();
    });

    it('will display a warning dialog when clicking Reset', async () => {
      renderWithContext(<Builder {...defaultProps} />);

      await userEvent.click(screen.getByRole('button', { name: 'Reset' }));

      await waitFor(() => {
        expect(
          screen.queryByText(
            'Are you sure you want to discard changes? All changes will be lost'
          )
        ).toBeVisible();
      });
    });

    it('will display a warning dialog when clicking Back', async () => {
      renderWithContext(<Builder {...defaultProps} />);

      await userEvent.click(screen.getByRole('button', { name: 'Back' }));

      await waitFor(() => {
        expect(
          screen.queryByText(
            'You have unsaved changes. Are you sure you want to discard changes? Unsaved changes will be lost'
          )
        ).toBeVisible();
      });
    });

    describe('when warning dialog is showing after clicking Back', () => {
      it('calls cancel changes when clicking Back', async () => {
        renderWithContext(<Builder {...defaultProps} />);

        await userEvent.click(screen.getByRole('button', { name: 'Back' }));
        await waitFor(() => {
          expect(
            screen.queryByText(
              'You have unsaved changes. Are you sure you want to discard changes? Unsaved changes will be lost'
            )
          ).toBeVisible();
        });

        await userEvent.click(
          screen.getByRole('button', { name: 'Discard changes' })
        );

        expect(resetLayout).toHaveBeenCalled();
      });

      it('calls closes modal and does nothing when clicking Cancel', async () => {
        renderWithContext(<Builder {...defaultProps} />);

        await userEvent.click(screen.getByRole('button', { name: 'Back' }));
        await waitFor(() => {
          expect(
            screen.queryByText(
              'You have unsaved changes. Are you sure you want to discard changes? Unsaved changes will be lost'
            )
          ).toBeVisible();
        });

        await userEvent.click(screen.getByRole('button', { name: 'Cancel' }));

        expect(resetLayout).not.toHaveBeenCalled();
        await waitFor(() => {
          expect(
            screen.queryByText(
              'You have unsaved changes. Are you sure you want to discard changes? Unsaved changes will be lost'
            )
          ).not.toBeVisible();
        });
      });
    });
  });
});
