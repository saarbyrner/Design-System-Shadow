import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { server, rest } from '@kitman/services/src/mocks/server';
import * as globalApi from '@kitman/common/src/redux/global/services/globalApi';
import ScaleColours from '../index';

// Mock the child components to isolate the ScaleColours component's logic
jest.mock('../ScaleColoursForm', () => ({
  ScaleColoursFormTranslated: ({
    onClickCancel,
    onSaveSuccess,
    trainingVariables,
  }) => (
    <div>
      <h2>ScaleColoursForm</h2>
      <span>{trainingVariables.length} variables available</span>
      <button type="button" onClick={onClickCancel}>
        Cancel Form
      </button>
      <button
        type="button"
        onClick={() =>
          onSaveSuccess({
            id: 'new',
            name: 'New Palette',
            conditions: [],
            metrics: [],
          })
        }
      >
        Save Form
      </button>
    </div>
  ),
}));

jest.mock('../ScaleColourPalette', () => ({
  ScaleColourPaletteTranslated: ({
    scaleColourPalette,
    onEditSuccess,
    onDeleteSuccess,
    trainingVariablesAlreadySelected,
  }) => (
    <div data-testid={`palette-${scaleColourPalette.id}`}>
      <h3>Palette: {scaleColourPalette.name}</h3>
      <span>
        {trainingVariablesAlreadySelected.length} variables already selected
      </span>
      <button
        type="button"
        onClick={() => onEditSuccess({ ...scaleColourPalette, name: 'Edited' })}
      >
        Edit Palette
      </button>
      <button type="button" onClick={onDeleteSuccess}>
        Delete Palette
      </button>
    </div>
  ),
}));

// Mock the RTK Query hook
jest.mock('@kitman/common/src/redux/global/services/globalApi');

const mockTrainingVariables = [
  { id: 54, name: 'Body Weight' },
  { id: 55, name: 'Sit & Reach' },
  { id: 56, name: 'Mood' },
];

const mockColourSchemes = {
  colour_schemes: [
    {
      id: 1,
      name: 'Scheme 1',
      conditions: [
        { id: 1, colour: '#DEDEDE', condition: 'equals', value1: 0 },
      ],
      metrics: [
        { id: 2, record: { id: 54, name: 'Body Weight' } },
        { id: 3, record: { id: 55, name: 'Sit & Reach' } },
      ],
    },
  ],
};

describe('Organisation Settings <ScaleColours /> component', () => {
  let user;

  beforeEach(() => {
    user = userEvent.setup();
    // Setup default successful API handlers
    server.use(
      rest.get('/colour_schemes', (req, res, ctx) => {
        return res(ctx.json(mockColourSchemes));
      })
    );
    // Setup default successful RTK query hook
    globalApi.useGetTrainingVariablesQuery.mockReturnValue({
      data: { training_variables: mockTrainingVariables },
      isLoading: false,
      isError: false,
    });
  });

  it('shows the scale colours form when clicking "Add palette" and hides it on cancel', async () => {
    render(<ScaleColours t={i18nextTranslateStub()} />);

    // Wait for initial data to load
    expect(await screen.findByText('Palette: Scheme 1')).toBeInTheDocument();

    // Click "Add palette"
    await user.click(screen.getByRole('button', { name: 'Add palette' }));
    expect(
      await screen.findByRole('heading', { name: 'ScaleColoursForm' })
    ).toBeVisible();

    // Click "Cancel Form" in the mocked form
    await user.click(screen.getByRole('button', { name: 'Cancel Form' }));
    expect(
      screen.queryByRole('heading', { name: 'ScaleColoursForm' })
    ).not.toBeInTheDocument();
  });

  it('adds a new palette to the list on successful save', async () => {
    render(<ScaleColours t={i18nextTranslateStub()} />);
    await screen.findByText('Palette: Scheme 1');

    await user.click(screen.getByRole('button', { name: 'Add palette' }));
    await user.click(await screen.findByRole('button', { name: 'Save Form' }));

    // The form should disappear and a new palette should be added
    expect(
      screen.queryByRole('heading', { name: 'ScaleColoursForm' })
    ).not.toBeInTheDocument();
    // We can't check the name of the new palette as it's controlled by the mock,
    // but we can check that a second palette container is rendered.
    expect(screen.getAllByTestId(/palette-/)).toHaveLength(2);
  });

  it('passes only unselected training variables to the new palette form', async () => {
    render(<ScaleColours t={i18nextTranslateStub()} />);
    await screen.findByText('Palette: Scheme 1');

    await user.click(screen.getByRole('button', { name: 'Add palette' }));

    // The mocked form receives the filtered list and renders the count.
    // Initial palettes use IDs 54 and 55, so only ID 56 ('Mood') should be available.
    expect(
      await screen.findByText('1 variables available')
    ).toBeInTheDocument();
  });

  it('passes the correct count of already selected variables to child palettes', async () => {
    render(<ScaleColours t={i18nextTranslateStub()} />);

    // The mocked child component renders the length of the prop.
    // The first palette uses 2 variables, so the prop should contain 2 IDs.
    const palette = await screen.findByTestId('palette-1');
    expect(
      within(palette).getByText('2 variables already selected')
    ).toBeInTheDocument();
  });

  it('updates the colour palette list when a palette is successfully edited', async () => {
    render(<ScaleColours t={i18nextTranslateStub()} />);
    const palette = await screen.findByTestId('palette-1');

    // The mocked child has an "Edit Palette" button that calls onEditSuccess
    await user.click(
      within(palette).getByRole('button', { name: 'Edit Palette' })
    );

    // The name of the palette should change from "Scheme 1" to "Edited"
    expect(
      await within(palette).findByText('Palette: Edited')
    ).toBeInTheDocument();
  });

  it('removes a palette from the list when it is successfully deleted', async () => {
    render(<ScaleColours t={i18nextTranslateStub()} />);
    const palette = await screen.findByTestId('palette-1');

    // The mocked child has a "Delete Palette" button that calls onDeleteSuccess
    await user.click(
      within(palette).getByRole('button', { name: 'Delete Palette' })
    );

    // The palette should be removed from the DOM
    expect(screen.queryByTestId('palette-1')).not.toBeInTheDocument();
  });

  describe('when API calls fail', () => {
    it('shows an error message if fetching colour schemes fails', async () => {
      server.use(
        rest.get('/colour_schemes', (req, res, ctx) => res(ctx.status(500)))
      );
      render(<ScaleColours t={i18nextTranslateStub()} />);

      expect(await screen.findByTestId('AppStatus-error')).toBeInTheDocument();
    });

    it('shows an error message if fetching training variables fails', async () => {
      globalApi.useGetTrainingVariablesQuery.mockReturnValue({
        data: undefined,
        isLoading: false,
        isError: true,
      });
      render(<ScaleColours t={i18nextTranslateStub()} />);
      expect(await screen.findByTestId('AppStatus-error')).toBeInTheDocument();
    });
  });
});
