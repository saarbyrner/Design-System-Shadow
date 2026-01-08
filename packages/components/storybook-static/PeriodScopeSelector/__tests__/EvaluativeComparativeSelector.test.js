import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { EvaluativeComparativeSelectorComponent } from '../EvaluativeComparativeSelector';

describe('EvaluativeComparativeSelector component', () => {
  const props = {
    onChange: jest.fn(),
    t: (key) => key, // i18n stub
  };

  it('returns correct evaluated and comparitive days', async () => {
    render(<EvaluativeComparativeSelectorComponent {...props} />);

    // days input
    await userEvent.type(screen.getAllByRole('spinbutton')[0], '3');
    expect(props.onChange).toHaveBeenCalledWith({
      first: 3,
      second: undefined,
    });

    // weeks input
    await userEvent.type(screen.getAllByRole('spinbutton')[1], '7');
    expect(props.onChange).toHaveBeenCalledWith({
      first: undefined,
      second: 7,
    });
  });

  it('prepopulates EvaluativeComparative fields if values provided', () => {
    render(
      <EvaluativeComparativeSelectorComponent
        {...props}
        firstPeriodLength={3}
        secondPeriodLength={21}
      />
    );

    expect(screen.getAllByRole('spinbutton')[0]).toHaveValue(3);
    expect(screen.getAllByRole('spinbutton')[1]).toHaveValue(21);
  });
});
