import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import BulkEditTooltip from '../../gridView/BulkEditTooltip';

describe('BulkEditTooltip component', () => {
  let baseProps;

  beforeEach(() => {
    baseProps = {
      trainingVariable: {
        id: 1,
        name: 'Mood',
        min: -2,
        max: 2,
      },
      organisationTrainingVariables: [
        {
          id: 53,
          training_variable: {
            id: 1,
            name: 'Mood',
            min: -2,
            max: 2,
          },
          scale_increment: '1',
        },
      ],
      onApply: jest.fn(),
      t: i18nextTranslateStub(),
    };
  });

  it('allows a user to select a score and apply it', async () => {
    const user = userEvent.setup();
    render(<BulkEditTooltip {...baseProps} />);

    // 1. Find and click the trigger button to open the tooltip
    const triggerButton = screen.getByRole('button', { name: /Mood/i });
    await user.click(triggerButton);

    // 2. The tooltip/popover should appear.
    const tooltip = await screen.findByRole('tooltip');

    // 3. Find the dropdown control by its class and click it to open the options.
    const scoreDropdown = tooltip.querySelector('.kitmanReactSelect__control');
    await user.click(scoreDropdown);

    // 4. Find the desired option in the list that appears and click it.
    const optionToSelect = await screen.findByText('-2');
    await user.click(optionToSelect);

    // 5. Find and click the "Apply" button within the tooltip.
    const applyButton = within(tooltip).getByRole('button', { name: /apply/i });
    await user.click(applyButton);

    // 6. Assert that the onApply callback was fired with the selected score.
    expect(baseProps.onApply).toHaveBeenCalledTimes(1);
    expect(baseProps.onApply).toHaveBeenCalledWith(-2);
  });
});
