import { render, screen } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import i18n from '@kitman/common/src/utils/i18n';
import OwnGoalSwitch from '../OwnGoalSwitch';

describe('OwnGoalSwitch', () => {
  const defaultProps = {
    gameActivityEvent: { activityIndex: 0 },
    handleOwnGoal: jest.fn(),
    disabled: false,
    isOwnGoalCheckedForEvent: false,
    t: i18nextTranslateStub(),
  };

  const renderComponent = (props = defaultProps) =>
    render(
      <I18nextProvider i18n={i18n}>
        <OwnGoalSwitch {...props} />
      </I18nextProvider>
    );

  it('should render the switch component with the default props', () => {
    renderComponent();

    expect(screen.getByRole('checkbox')).toBeInTheDocument();
    expect(screen.getByText('Mark as own goal')).toBeInTheDocument();
  });

  it('should render the disabled switch component', () => {
    renderComponent({ ...defaultProps, disabled: true });

    const switchInput = screen.getByRole('checkbox');
    expect(switchInput).toBeDisabled();
  });

  it('should check the switch when `isOwnGoalCheckedForEvent` is `true`', () => {
    const { getByRole, rerender } = renderComponent();
    expect(getByRole('checkbox')).not.toBeChecked();

    // Simulate parent updating the prop
    rerender(
      <I18nextProvider i18n={i18n}>
        <OwnGoalSwitch {...defaultProps} isOwnGoalCheckedForEvent />
      </I18nextProvider>
    );
    expect(getByRole('checkbox')).toBeChecked();
  });

  it('should uncheck the switch when `isOwnGoalCheckedForEvent` is `false`', () => {
    const { getByRole, rerender } = renderComponent({
      ...defaultProps,
      isOwnGoalCheckedForEvent: true,
    });
    expect(getByRole('checkbox')).toBeChecked();

    // Simulate parent updating the prop
    rerender(
      <I18nextProvider i18n={i18n}>
        <OwnGoalSwitch {...defaultProps} isOwnGoalCheckedForEvent={false} />
      </I18nextProvider>
    );
    expect(getByRole('checkbox')).not.toBeChecked();
  });

  it('should call `handleOwnGoal` with correct arguments when toggled / untoggled', () => {
    const handleOwnGoal = jest.fn();

    const { getByRole, rerender } = render(
      <I18nextProvider i18n={i18n}>
        <OwnGoalSwitch {...defaultProps} handleOwnGoal={handleOwnGoal} />
      </I18nextProvider>
    );
    expect(getByRole('checkbox')).not.toBeChecked();

    // Simulate checking the switch
    getByRole('checkbox').click();
    expect(handleOwnGoal).toHaveBeenCalledWith(
      defaultProps.gameActivityEvent.activityIndex,
      true
    );

    rerender(
      <I18nextProvider i18n={i18n}>
        <OwnGoalSwitch
          {...defaultProps}
          handleOwnGoal={handleOwnGoal}
          isOwnGoalCheckedForEvent
        />
      </I18nextProvider>
    );
    expect(getByRole('checkbox')).toBeChecked();

    // Simulate unchecking the switch
    getByRole('checkbox').click();
    expect(handleOwnGoal).toHaveBeenCalledWith(
      defaultProps.gameActivityEvent.activityIndex,
      false
    );
  });

  it('should not call `handleOwnGoal` if `activityIndex` is undefined', () => {
    const handleOwnGoal = jest.fn();
    const props = {
      ...defaultProps,
      gameActivityEvent: {},
      handleOwnGoal,
    };
    renderComponent(props);

    screen.getByRole('checkbox').click();

    expect(screen.getByRole('checkbox')).not.toBeChecked();
    expect(handleOwnGoal).not.toHaveBeenCalled();
  });
});
