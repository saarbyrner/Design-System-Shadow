// @flow
import moment from 'moment';
import { formatStandard } from '@kitman/common/src/utils/dateFormatter';
import { KITMAN_ICON_NAMES, KitmanIcon } from '@kitman/playbook/icons';
import style from '@kitman/modules/src/Medical/shared/components/PresentationViewItem/style';

type Props = {
  label: string,
  value: ?string | number,
  highlightEmptyFields?: boolean,
};

const PresentationViewItem = ({
  label,
  value,
  highlightEmptyFields,
}: Props) => {
  const labelStyles = [
    style.label,
    !value && (highlightEmptyFields || false) && style.valueRequired,
  ];

  let displayValue = value;
  if (
    typeof value === 'string' &&
    moment(value, 'YYYY-MM-DD', true).isValid()
  ) {
    displayValue = formatStandard({ date: moment(value) });
  }

  return (
    <div css={style.container}>
      <span css={labelStyles}>{label}:</span>
      {displayValue ||
        (highlightEmptyFields && (
          <KitmanIcon name={KITMAN_ICON_NAMES.ErrorOutline} sx={style.icon} />
        )) ||
        ''}
    </div>
  );
};

export default PresentationViewItem;
