// @flow
import useStyleOptions from '../hooks/useStyleOptions';

type Props = {
  kitmanDesignSystem?: boolean,
  isDisabled?: boolean,
};

const Menu = (props: Props) => {
  const { getInlineStyleOptions, getBlockStyleOptions } = useStyleOptions(
    props.kitmanDesignSystem || false,
    props.isDisabled || false
  );

  const inlineStyleOptions = getInlineStyleOptions();
  const blockStyleOptions = getBlockStyleOptions();

  return [inlineStyleOptions, blockStyleOptions];
};

export default Menu;
