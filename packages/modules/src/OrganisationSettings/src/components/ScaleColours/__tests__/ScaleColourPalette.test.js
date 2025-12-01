import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { server, rest } from '@kitman/services/src/mocks/server';
import ScaleColourPalette from '../ScaleColourPalette';

// Mock the form component to isolate the ScaleColourPalette component's logic
jest.mock('../ScaleColoursForm', () => ({
  ScaleColoursFormTranslated: ({ onClickCancel, trainingVariables }) => (
    <div>
      <h2>ScaleColoursForm</h2>
      {/* Render something from the props to allow for more specific tests if needed */}
      <span>{trainingVariables.length} variables available</span>
      <button type="button" onClick={onClickCancel}>
        Cancel Form
      </button>
    </div>
  ),
}));

describe('Organisation Settings <ScaleColourPalette /> component', () => {
  let user;
  let baseProps;

  beforeEach(() => {
    user = userEvent.setup();
    baseProps = {
      scaleColourPalette: {
        id: 13,
        name: 'Colour Scheme A',
        conditions: [
          { id: 23, condition: 'equals', value1: 1.0, colour: '#00BBAA' },
          { id: 24, condition: 'equals', value1: 2.0, colour: '#1133FF' },
        ],
        metrics: [
          {
            id: 1,
            record_type: 'TrainingVariable',
            record: { id: 13, name: 'Body Weight' },
          },
          {
            id: 2,
            record_type: 'TrainingVariable',
            record: { id: 14, name: 'Sit & Reach' },
          },
        ],
      },
      trainingVariables: [
        { id: 13, name: 'Body Weight' },
        { id: 14, name: 'Sit & Reach' },
        { id: 15, name: 'Mood' },
        { id: 16, name: 'Sleep duration' },
      ],
      trainingVariablesAlreadySelected: [16], // 'Sleep duration' is already used elsewhere
      onEditSuccess: jest.fn(),
      onDeleteSuccess: jest.fn(),
      t: i18nextTranslateStub(),
    };
  });

  it('shows the list of colours in the palette', () => {
    render(<ScaleColourPalette {...baseProps} />);
    // Find the container for the color swatches by finding its preceding label
    const paletteContainer = screen.getByText('Palette').nextElementSibling;

    // Get all direct children of the container
    const colorSwatches = paletteContainer.children;

    expect(colorSwatches[0]).toHaveStyle({ backgroundColor: '#00BBAA' });
    expect(colorSwatches[1]).toHaveStyle({ backgroundColor: '#1133FF' });
  });

  it('shows and hides the list of metrics when clicking the expand/collapse buttons', async () => {
    render(<ScaleColourPalette {...baseProps} />);

    // Initially, the list is hidden
    expect(screen.getByText(/2 Metric/i)).toBeInTheDocument();
    expect(screen.queryByRole('listitem')).not.toBeInTheDocument();

    // Expand metrics
    const moreButton = screen.getByRole('button', { name: 'More' });
    await user.click(moreButton);

    expect(await screen.findByText('1) Body Weight')).toBeVisible();
    expect(screen.getByText('2) Sit & Reach')).toBeVisible();

    // Collapse metrics
    const lessButton = screen.getByRole('button', { name: 'Less' });
    await user.click(lessButton);

    expect(screen.queryByText('1) Body Weight')).not.toBeInTheDocument();
  });

  it('shows the edit form when clicking "Edit" and closes it when clicking "Cancel"', async () => {
    render(<ScaleColourPalette {...baseProps} />);

    // The TooltipMenu trigger button has an icon, so we find it by its accessible name,
    // which is likely to be "more" or "actions".
    const menuButton = await screen.getAllByRole('button')[0];
    await user.click(menuButton);

    // Click the "Edit" option
    const editMenuItem = screen.getByRole('button', {
      name: /edit/i,
    });

    await user.click(editMenuItem);

    // The form should now be visible
    expect(
      await screen.findByRole('heading', { name: 'ScaleColoursForm' })
    ).toBeVisible();

    // Click the cancel button inside the mocked form
    const cancelButton = screen.getByRole('button', { name: 'Cancel Form' });
    await user.click(cancelButton);

    // The form should now be hidden
    expect(
      screen.queryByRole('heading', { name: 'ScaleColoursForm' })
    ).not.toBeInTheDocument();
  });

  it('passes only available training variables to the form component', async () => {
    // This test verifies that the logic to filter variables is run before rendering the form.
    // The component should pass its own variables (Body Weight, Sit & Reach) plus any unselected ones (Mood).
    // It should filter out 'Sleep duration' (ID 16) which is already selected elsewhere.
    render(<ScaleColourPalette {...baseProps} />);
    const menuButton = screen.getAllByRole('button')[0];
    await user.click(menuButton);
    const editMenuItem = await screen.findByRole('button', { name: 'Edit' });
    await user.click(editMenuItem);

    // Our mocked form renders the count of variables it receives.
    // Expected: Body Weight (13), Sit & Reach (14), Mood (15). Total = 3.
    expect(await screen.findByText('3 variables available')).toBeVisible();
  });

  describe('when deleting the colour palette', () => {
    it('calls onDeleteSuccess after a successful API call', async () => {
      // Mock the successful DELETE request
      server.use(
        rest.delete('/colour_schemes/:id', (req, res, ctx) => {
          return res(ctx.status(200), ctx.json({}));
        })
      );

      render(<ScaleColourPalette {...baseProps} />);

      // Open actions menu and click delete
      const menuButton = screen.getAllByRole('button')[0];
      await user.click(menuButton);
      const deleteMenuItem = await screen.findByRole('button', {
        name: 'Delete',
      });
      await user.click(deleteMenuItem);

      // A confirmation dialogue should appear
      expect(await screen.findByText('Delete palette?')).toBeVisible();

      // Click the final delete button in the confirmation
      const confirmDeleteButton = screen.getByRole('button', {
        name: 'Delete',
      });
      await user.click(confirmDeleteButton);

      // The success callback should be called
      await waitFor(() => {
        expect(baseProps.onDeleteSuccess).toHaveBeenCalledTimes(1);
      });
    });

    it('shows an error message after a failed API call', async () => {
      // Mock the failed DELETE request
      server.use(
        rest.delete('/colour_schemes/:id', (req, res, ctx) => {
          return res(ctx.status(500));
        })
      );

      render(<ScaleColourPalette {...baseProps} />);

      // Open actions menu and click delete
      const menuButton = screen.getAllByRole('button')[0];
      await user.click(menuButton);
      const deleteMenuItem = await screen.findByRole('button', {
        name: 'Delete',
      });
      await user.click(deleteMenuItem);

      // Click the final delete button in the confirmation
      const confirmDeleteButton = await screen.findByRole('button', {
        name: 'Delete',
      });
      await user.click(confirmDeleteButton);

      // An error status should appear
      expect(screen.getByText('Something went wrong!')).toBeInTheDocument();
      // The success callback should not have been called
      expect(baseProps.onDeleteSuccess).not.toHaveBeenCalled();
    });
  });
});
