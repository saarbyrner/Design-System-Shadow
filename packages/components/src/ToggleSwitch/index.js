// @flow
import classNames from 'classnames';

type Props = {
  isDisabled?: boolean,
  isSwitchedOn: boolean,
  label?: string,
  labelPlacement?: string,
  toggle: Function,
  kitmanDesignSystem?: boolean,
};

function ToggleSwitch(props: Props) {
  const classes = classNames('toggleSwitch', {
    'toggleSwitch--labelRight': props.labelPlacement === 'right',
    'toggleSwitch--disabled': props.isDisabled,
    'toggleSwitch--kitmanDesignSystem': props.kitmanDesignSystem,
  });

  return (
    <div className={classes}>
      {props.label && (
        <label className="toggleSwitch__label">{props.label}</label>
      )}
      <label className="toggleSwitch__switch">
        <input
          role="switch"
          aria-checked={props.isSwitchedOn}
          type="checkbox"
          className="toggleSwitch__input"
          checked={props.isSwitchedOn}
          disabled={props.isDisabled}
          onChange={props.toggle}
        />
        <span className="toggleSwitch__slider" />
      </label>
    </div>
  );
}

ToggleSwitch.defaultProps = {
  isDisabled: false,
  isSwitchedOn: false,
  label: '',
  labelPlacement: 'left',
  toggle: () => {},
};

export default ToggleSwitch;
