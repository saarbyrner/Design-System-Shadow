// @flow
import type { ComponentType } from 'react';

import { TextButton } from '@kitman/components';

type Props = { onClick: () => void, text: string };

const LocalTextButton: ComponentType<Props> = ({ onClick, text }: Props) => {
  return (
    <TextButton
      onClick={onClick}
      text={text}
      size="large"
      type="textOnly"
      kitmanDesignSystem
    />
  );
};

export default LocalTextButton;
