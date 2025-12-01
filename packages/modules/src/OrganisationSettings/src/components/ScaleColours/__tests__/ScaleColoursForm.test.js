import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { server, rest } from '@kitman/services/src/mocks/server';
import ScaleColoursForm from '../ScaleColoursForm';

describe('Organisation Settings <ScaleColoursForm /> component', () => {
  let user;
  let baseProps;

  beforeEach(() => {
    user = userEvent.setup();
    baseProps = {
      trainingVariables: [
        { id: 1, name: 'Sit & Reach' },
        { id: 2, name: 'Joint Soreness' },
      ],
      onSaveSuccess: jest.fn(),
      onClickCancel: jest.fn(),
      t: i18nextTranslateStub(),
    };
  });

  it('renders with a default color in the palette', () => {
    render(<ScaleColoursForm {...baseProps} />);

    const colorInput = screen.getByTestId('ColourPalette');
    expect(colorInput).toBeInTheDocument();

    expect(screen.getByTestId('ColorPicker|SwatchColor')).toHaveStyle({
      backgroundColor: 'rgb(222, 222, 222)', // Default color #DEDEDE
    });
  });

  it('calls onClickCancel when the cancel button is clicked', async () => {
    render(<ScaleColoursForm {...baseProps} />);
    await user.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(baseProps.onClickCancel).toHaveBeenCalledTimes(1);
  });

  it('shows a validation error if save is clicked with no metrics selected', async () => {
    render(<ScaleColoursForm {...baseProps} />);

    await user.click(screen.getByRole('button', { name: 'Save' }));

    // The MultiSelectDropdown should now be marked as invalid.
    // We check for the invalid class on its parent container.
    const metricsDropdown = screen
      .getByText('Metrics')
      .closest('div.dropdownWrapper');
    expect(metricsDropdown).toHaveClass('dropdownWrapper--invalid');
  });

  it('selects all metrics when "Select All" is used', async () => {
    render(<ScaleColoursForm {...baseProps} />);
    const metricsDropdown = screen.getByText('Metrics').nextElementSibling;

    // Select all
    await user.click(metricsDropdown);

    await user.click(screen.getByText(/select all/i));
    // The dropdown header should now show the selected items
    expect(
      await screen.findByText('Sit & Reach, Joint Soreness')
    ).toBeInTheDocument();
  });

  describe('when creating a new colour palette', () => {
    it('calls onSaveSuccess after a successful POST request', async () => {
      const mockResponse = { colour_scheme: { id: 'new-1' } };
      server.use(
        rest.post('/colour_schemes', async (req, res, ctx) => {
          const body = await req.json();
          // Verify the updated color and selected metric are in the payload
          expect(body.metrics).toHaveLength(1);
          expect(body.metrics[0].record_id).toBe(1);
          return res(ctx.status(200), ctx.json(mockResponse));
        })
      );

      render(<ScaleColoursForm {...baseProps} />);

      // Select a metric
      await user.click(screen.getByText('Metrics').nextElementSibling);
      await user.click(await screen.findByText('Sit & Reach'));

      // Save
      await user.click(screen.getByRole('button', { name: 'Save' }));

      await waitFor(() => {
        expect(baseProps.onSaveSuccess).toHaveBeenCalledWith(
          mockResponse.colour_scheme
        );
      });
    });
  });

  describe('when editing an existing colour palette', () => {
    const editProps = {
      scaleColourPalette: {
        id: 13,
        name: 'Colour Scheme A',
        conditions: [
          { id: 23, condition: 'equals', value1: 1.0, colour: '#00BBAA' },
        ],
        metrics: [
          {
            id: 1,
            record_type: 'TrainingVariable',
            record: { id: 1, name: 'Sit & Reach' },
          },
        ],
      },
    };

    it('calls onSaveSuccess after a successful PUT request', async () => {
      const mockResponse = { colour_scheme: { id: 13, name: 'Updated' } };
      server.use(
        rest.put('/colour_schemes/13', async (req, res, ctx) => {
          const body = await req.json();
          expect(body.metrics[0].record_id).toBe(1);
          return res(ctx.status(200), ctx.json(mockResponse));
        })
      );

      render(<ScaleColoursForm {...baseProps} {...editProps} />);

      // The metric is already selected, so we can just save
      await user.click(screen.getByRole('button', { name: 'Save' }));

      await waitFor(() => {
        expect(baseProps.onSaveSuccess).toHaveBeenCalledWith(
          mockResponse.colour_scheme
        );
      });
    });
  });

  describe('when saving fails', () => {
    it('shows an error message', async () => {
      server.use(
        rest.post('/colour_schemes', (req, res, ctx) => {
          return res(ctx.status(500));
        })
      );

      render(<ScaleColoursForm {...baseProps} />);

      // Select a metric to make the form valid
      await user.click(screen.getByText('Metrics').nextElementSibling);
      await user.click(await screen.findByText('Sit & Reach'));

      // Save
      await user.click(screen.getByRole('button', { name: 'Save' }));

      // The AppStatus component should appear with an error
      expect(await screen.findByTestId('AppStatus-error')).toBeInTheDocument();
    });
  });
});
