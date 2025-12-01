// @flow
import type { ObjectStyle } from '@kitman/common/src/types/styles';

export default ({
  // `filter` is needed to make the text contrasting with the background. `color`
  // must also be defined and be equal to the background color.
  // `invert()` is needed to take a contrasting base color. `grayscale()` is
  // needed to make the text black-and-white (like the bottom bar color
  // inverting on iPhones), for the best results. `contrast()` is needed to
  // enhance the result.
  filter: 'invert(1) grayscale(1) brightness(1) contrast(9000)',
}: ObjectStyle);
