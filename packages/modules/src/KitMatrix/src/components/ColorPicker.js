// @flow
import { useEffect, useState } from 'react';
import { Box } from '@kitman/playbook/components';
import style from '@kitman/modules/src/KitMatrix/style';

type Props = {
  color?: string,
  onChange: (color: string) => void,
};

const ColorPicker = ({ color = '', onChange }: Props) => {
  const [localColor, setLocalColor] = useState(color);

  useEffect(() => {
    setLocalColor(color);
  }, [color]);

  const onColorChange = (e) => {
    onChange(e.target.value);
  };

  return (
    <div data-testid="color-picker">
      <input
        type="color"
        css={style.nativeColorPicker}
        onChange={onColorChange}
      />
      <Box
        data-testid="custom-color-picker"
        css={style.customColorPicker}
        sx={{
          backgroundColor: localColor,
        }}
      />
    </div>
  );
};

export default ColorPicker;
