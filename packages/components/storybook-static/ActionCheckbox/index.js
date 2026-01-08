// @flow
import classNames from 'classnames';

type Props = {
  id: string,
  isChecked: boolean,
  isDisabled?: boolean,
  onToggle: Function,
  kitmanDesignSystem?: boolean,
};

function ActionCheckbox(props: Props) {
  const toggle = () => {
    if (props.isDisabled) {
      return;
    }

    const newState = {
      id: props.id,
      checked: !props.isChecked,
    };

    props.onToggle(newState);
  };

  const baseClass = props.kitmanDesignSystem
    ? 'actionCheckbox--kitmanDesignSystem'
    : 'actionCheckbox';

  const classes = classNames(baseClass, {
    [`${baseClass}--checked`]: props.isChecked,
    [`${baseClass}--disabled`]: props.isDisabled,
    'icon-tick-active': props.isChecked,
    'icon-tick': !props.isChecked && !props.kitmanDesignSystem,
    'icon-circle-border': !props.isChecked && props.kitmanDesignSystem,
  });

  return (
    <i
      className={classes}
      onClick={toggle}
      aria-checked={props.isChecked}
      tabIndex={0}
      role="checkbox"
    />
  );
}

export default ActionCheckbox;
