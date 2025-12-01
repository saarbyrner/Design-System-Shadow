// @flow
import { colors } from '@kitman/common/src/variables';

import { InfoTooltip } from '@kitman/components';

const VALUE_LENGTH_LIMIT = 23;

const style = {
  cell: {
    display: 'flex',
    alignItems: 'center',
    color: colors.grey_300,
    fontSize: '14px',
    fontWeight: 400,
    lineHeight: '20px',
    background: colors.white,
  },
};

type Props = {
  value: string,
};

const TooltipCell = (props: Props) => {
  const value =
    props.value.length > VALUE_LENGTH_LIMIT
      ? `${props.value.substring(0, VALUE_LENGTH_LIMIT - 1)} ...`
      : props.value;

  return (
    <InfoTooltip content={props.value}>
      <div data-testid="TooltipCell|Value" css={style.cell}>
        {value}
      </div>
    </InfoTooltip>
  );
};

export default TooltipCell;
