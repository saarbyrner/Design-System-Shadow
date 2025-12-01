// @flow
import style from './style';

export const tooltipSlotProps = {
  popper: {
    modifiers: [
      {
        name: 'offset',
        options: { offset: [18, 0] },
      },
    ],
    sx: style.tooltip,
  },
};
