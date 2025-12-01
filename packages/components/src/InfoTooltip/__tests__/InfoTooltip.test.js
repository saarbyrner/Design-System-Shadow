import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import InfoTooltip from '../index';

describe('<InfoTooltip />', () => {
  let props;

  beforeEach(() => {
    props = {
      delay: 0,
      content: 'Tooltip content',
    };
  });

  it('renders the correct content', async () => {
    render(
      <InfoTooltip {...props}>
        <h1>Title</h1>
      </InfoTooltip>
    );

    await userEvent.hover(screen.getByRole('heading', { level: 1 }));
    expect(screen.getByText('Tooltip content')).toBeInTheDocument();
  });

  describe('when onVisibleChange is defined', () => {
    const onVisibleChangeMock = jest.fn();

    it('calls onVisibleChange when the tooltip is shown', async () => {
      render(
        <InfoTooltip {...props} onVisibleChange={onVisibleChangeMock}>
          <h1>Title</h1>
        </InfoTooltip>
      );

      await userEvent.hover(screen.getByRole('heading', { level: 1 }));
      expect(onVisibleChangeMock).toHaveBeenCalledTimes(1);
    });
  });
});
