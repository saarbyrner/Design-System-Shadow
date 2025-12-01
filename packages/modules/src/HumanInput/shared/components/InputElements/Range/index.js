// @flow

import type { HumanInputFormElement } from '@kitman/modules/src/HumanInput/types/forms';

import RatingSelector from '@kitman/modules/src/HumanInput/shared/components/InputElements/Range/components/Rating';
import SliderSelector from '@kitman/modules/src/HumanInput/shared/components/InputElements/Range/components/Slider';

type Props = {
  element: HumanInputFormElement,
  value: string,
  onChange: Function,
};

const Range = (props: Props) => {
  const { element, value, onChange } = props;
  const { custom_params: customParams } = element.config;

  switch (customParams?.style) {
    case 'rating':
      return (
        <RatingSelector element={element} value={value} onChange={onChange} />
      );

    default:
      return (
        <SliderSelector element={element} value={value} onChange={onChange} />
      );
  }
};

export default Range;
