// @flow
import classNames from 'classnames';

type Props = {
  isActive: boolean,
  toggleActive: () => void,
  disabled: boolean,
};

const ActivateButton = (props: Props) => {
  const classes = classNames('questionnaireTemplates__activateButton', {
    'questionnaireTemplates__activateButton--active': props.isActive,
    'questionnaireTemplates__activateButton--disabled': props.disabled,
    'icon-tick': !props.isActive,
    'icon-tick-active': props.isActive,
  });

  return (
    <button
      type="button"
      className={classes}
      onClick={() => {
        if (!props.disabled) {
          props.toggleActive();
        }
      }}
    />
  );
};

export default ActivateButton;
