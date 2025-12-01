import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import Time from '../index';

describe('<Time />', () => {
  const i18nT = i18nextTranslateStub();
  const onSelectSpy = jest.fn();
  const props = {
    onSelect: onSelectSpy,
    t: i18nT,
  };

  it('only has four options for the min select element', () => {
    render(<Time {...props} />);
    const minutesList = screen.getAllByRole('list')[1];
    expect(within(minutesList).getAllByRole('listitem')).toHaveLength(4);
  });

  it('only has 24 options for the hour select element', () => {
    render(<Time {...props} />);
    const hoursList = screen.getAllByRole('list')[0];
    expect(within(hoursList).getAllByRole('listitem')).toHaveLength(24);
  });

  it('fires the callback when either of the selects change', async () => {
    render(<Time {...props} />);

    const hoursList = screen.getAllByRole('list')[0];
    const minutesList = screen.getAllByRole('list')[1];

    await userEvent.click(within(hoursList).getByText('12'));
    expect(onSelectSpy).toHaveBeenCalledWith(720); // 12*60=720

    await userEvent.click(within(minutesList).getByText('15'));
    expect(onSelectSpy).toHaveBeenCalledWith(15);
  });

  it('Sets a limit on hours available if specified', () => {
    render(<Time {...props} limit={14} />);

    // only displays 14 hours
    const hoursList = screen.getAllByRole('list')[0];
    expect(within(hoursList).getAllByRole('listitem')).toHaveLength(15);
  });
});
