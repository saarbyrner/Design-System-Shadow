// @flow

type Props = {
  type: 'ALL_CHECKED' | 'PARTIALLY_CHECKED' | 'EMPTY',
  onClick: Function,
};

const MultipleCheckboxChecker = (props: Props) => {
  let chekboxClassModifier;

  switch (props.type) {
    case 'ALL_CHECKED':
      chekboxClassModifier = 'multipleCheckboxChecker--checked';
      break;
    case 'PARTIALLY_CHECKED':
      chekboxClassModifier = 'multipleCheckboxChecker--minus';
      break;
    default:
      chekboxClassModifier = '';
      break;
  }

  return (
    <div
      data-testid="MultipleCheckboxChecker"
      className={`multipleCheckboxChecker ${chekboxClassModifier}`}
      onClick={props.onClick}
    />
  );
};

MultipleCheckboxChecker.defaultProps = {
  type: 'EMPTY',
};

export default MultipleCheckboxChecker;
