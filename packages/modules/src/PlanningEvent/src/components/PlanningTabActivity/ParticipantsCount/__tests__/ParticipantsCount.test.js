import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { KITMAN_ICON_NAMES } from '@kitman/playbook/icons';

import { ParticipantsCount } from '../ParticipantsCount';

describe('<ParticipantsCount />', () => {
  it('shows loader if there is no `available` prop', () => {
    render(<ParticipantsCount total={1} />);

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('shows loader if there is no `total` prop', () => {
    render(<ParticipantsCount available={1} />);

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('shows an icon if there are `available` and `total` props', () => {
    const props = {
      available: 1,
      total: 1,
    };
    render(<ParticipantsCount {...props} />);

    expect(
      screen.getByText(`${props.available}/${props.total}`)
    ).toBeInTheDocument();
  });

  it('shows an icon if there are `icon`, `available` and `total` props', () => {
    const props = {
      icon: KITMAN_ICON_NAMES.RecordVoiceOverOutlinedIcon,
      available: 1,
      total: 1,
    };
    render(<ParticipantsCount {...props} />);

    expect(screen.getByTestId(props.icon)).toBeInTheDocument();
  });

  it('shows a tooltip if there are `tooltip`, `icon`, `available` and `total` props', async () => {
    const user = userEvent.setup();
    const props = {
      icon: KITMAN_ICON_NAMES.RecordVoiceOverOutlinedIcon,
      tooltip: 'tooltip',
      available: 1,
      total: 1,
    };
    render(<ParticipantsCount {...props} />);

    await user.hover(screen.getByTestId(props.icon));
    expect(await screen.findByText(props.tooltip)).toBeInTheDocument();
  });

  it('calls `onClick` on click if there are `onClick`, `available` and `total` props', async () => {
    const user = userEvent.setup();
    const props = {
      onClick: jest.fn(),
      available: 1,
      total: 1,
    };
    render(<ParticipantsCount {...props} />);

    await user.click(screen.getByRole('button'));

    expect(props.onClick).toHaveBeenCalled();
  });
});
