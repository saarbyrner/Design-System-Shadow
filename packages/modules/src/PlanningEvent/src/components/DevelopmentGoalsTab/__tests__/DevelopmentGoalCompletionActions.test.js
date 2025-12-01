import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import useEventTracking from '@kitman/common/src/hooks/useEventTracking';
import DevelopmentGoalCompletionActions from '../DevelopmentGoalCompletionActions';

jest.mock('@kitman/common/src/hooks/useEventTracking');
const mockTrackEvent = jest.fn();

describe('<DevelopmentGoalCompletionActions />', () => {
  let user;
  const onSelect = jest.fn();
  const onClear = jest.fn();

  const baseProps = {
    event: { id: 1, type: 'training' },
    withCompletionTypes: true,
    developmentGoalCompletionTypes: [
      { id: 1, name: 'Coached' },
      { id: 2, name: 'Practised' },
    ],
    onSelect,
    onClear,
    t: i18nextTranslateStub(),
  };

  beforeEach(() => {
    user = userEvent.setup();
    onSelect.mockClear();
    onClear.mockClear();
    mockTrackEvent.mockClear();
    useEventTracking.mockReturnValue({ trackEvent: mockTrackEvent });
  });

  const renderComponent = (overrideProps = {}) => {
    return render(
      <DevelopmentGoalCompletionActions {...baseProps} {...overrideProps} />
    );
  };

  it('displays the correct actions when there are completion types', async () => {
    renderComponent();

    const menuButton = screen.getByRole('button', { name: 'Mark all' });
    await user.click(menuButton);

    const coachedAction = await screen.findByText('Coached');
    await user.click(coachedAction);
    expect(onSelect).toHaveBeenCalledWith(1);
    expect(mockTrackEvent).toHaveBeenCalledWith(
      'Calendar — Game details — Development goals — Check all'
    );

    // Re-open menu
    await user.click(menuButton);
    const practisedAction = await screen.findByText('Practised');
    await user.click(practisedAction);
    expect(onSelect).toHaveBeenCalledWith(2);

    // Re-open menu
    await user.click(menuButton);
    const clearAction = await screen.findByText('Clear all');
    await user.click(clearAction);
    expect(onClear).toHaveBeenCalled();
    expect(mockTrackEvent).toHaveBeenCalledWith(
      'Calendar — Game details — Development goals — Uncheck all'
    );
  });

  it('displays the default actions when there are no completion types', async () => {
    renderComponent({
      withCompletionTypes: false,
      developmentGoalCompletionTypes: [],
    });

    const menuButton = screen.getByRole('button', { name: 'Mark all' });
    await user.click(menuButton);

    const checkedAction = await screen.findByText('Checked');
    await user.click(checkedAction);
    expect(onSelect).toHaveBeenCalledWith(null);
    expect(mockTrackEvent).toHaveBeenCalledWith(
      'Calendar — Game details — Development goals — Check all'
    );

    // Re-open menu
    await user.click(menuButton);
    const uncheckedAction = await screen.findByText('Unchecked');
    await user.click(uncheckedAction);
    expect(onClear).toHaveBeenCalled();
    expect(mockTrackEvent).toHaveBeenCalledWith(
      'Calendar — Game details — Development goals — Uncheck all'
    );
  });
});
