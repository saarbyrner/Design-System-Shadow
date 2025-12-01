// @flow
import { css } from '@emotion/react';
import { colors } from '@kitman/common/src/variables';
import { TextTag } from '@kitman/components';
import { withNamespaces } from 'react-i18next';
import moment from 'moment';
import { formatStandard } from '@kitman/common/src/utils/dateFormatter';
import type { I18nProps, Translation } from '@kitman/common/src/types/i18n';
import type { CardiacScreening } from '../../../types';

type Props = {
  cardiacStatus: CardiacScreening,
};

const getCardiacStatus = (cardiacStatus: CardiacScreening, t: Translation) => {
  const cardiacScreeningText = {
    statusBackgroundColor: '',
    statusIconColor: '',
    status: '',
    statusText: '',
  };

  if (!cardiacStatus) {
    cardiacScreeningText.statusBackgroundColor = colors.red_100_20;
    cardiacScreeningText.statusIconColor = colors.red_200;
    cardiacScreeningText.status = t('Outstanding');
    return cardiacScreeningText;
  }

  switch (cardiacStatus.status.value) {
    case 'outstanding':
      cardiacScreeningText.status = t('Outstanding');
      cardiacScreeningText.statusBackgroundColor = colors.red_100_20;
      cardiacScreeningText.statusIconColor = colors.red_200;
      break;
    case 'expired':
      cardiacScreeningText.status = t('Expired');
      cardiacScreeningText.statusText = cardiacStatus.expiration_date
        ? formatStandard({ date: moment(cardiacStatus.expiration_date) })
        : '';
      cardiacScreeningText.statusBackgroundColor = colors.orange_100_20;
      cardiacScreeningText.statusIconColor = colors.orange_200;
      break;
    case 'follow_up_required':
      cardiacScreeningText.status = t('Follow up required');
      cardiacScreeningText.statusBackgroundColor = colors.orange_100_20;
      cardiacScreeningText.statusIconColor = colors.orange_200;
      break;
    case 'expiring':
      cardiacScreeningText.status = t('Expiring');
      // eslint-disable-next-line no-nested-ternary
      cardiacScreeningText.statusText = cardiacStatus.expiration_days
        ? cardiacStatus.expiration_days === 1
          ? t('1 day')
          : t('{{count}} days', { count: cardiacStatus.expiration_days })
        : '';
      cardiacScreeningText.statusBackgroundColor = colors.yellow_200;
      cardiacScreeningText.statusIconColor = colors.yellow_100;
      break;
    case 'complete':
      cardiacScreeningText.status = t('Complete');
      cardiacScreeningText.statusText = cardiacStatus.completion_date
        ? formatStandard({
            date: moment(cardiacStatus.completion_date),
          })
        : '';
      cardiacScreeningText.statusBackgroundColor = colors.neutral_300;
      cardiacScreeningText.statusIconColor = colors.grey_300;
      break;
    default:
  }

  return cardiacScreeningText;
};

const CardiacStatus = (props: I18nProps<Props>) => {
  const { statusBackgroundColor, statusIconColor, status, statusText } =
    getCardiacStatus(props.cardiacStatus, props.t);

  const cardiacScreeningtext = statusText
    ? props.t('{{status}} - {{statusText}}', { status, statusText })
    : status;

  const style = {
    CardiacScreeningCell: css`
      display: flex;
      flex-direction: column;
      i {
        &.icon-tick-active {
          font-size: 14px;
        }
        &.icon-warning-active {
          font-size: 12px;
          color: ${statusIconColor};
        }
      }
    `,
    textTagWrapper: css`
      align-self: flex-start;
      border-radius: 10px;
      gap: 2px;
      padding: 0px 6px 0px 4px;
    `,
    statusText: css`
      font-size: 14px;
      font-style: normal;
      font-weight: 400;
      line-height: 20px;
    `,
  };

  const activeIcon =
    props.cardiacStatus && props.cardiacStatus.status.value === 'complete'
      ? 'icon-tick-active'
      : 'icon-warning-active';

  return (
    <div css={style.CardiacScreeningCell} data-testid="CardiacStatus|TextTag">
      <TextTag
        content=""
        wrapperCustomStyles={style.textTagWrapper}
        backgroundColor={statusBackgroundColor}
      >
        <i data-testid="CardiacStatus|Icon" className={activeIcon} />
        <span css={style.statusText}>{cardiacScreeningtext}</span>
      </TextTag>
    </div>
  );
};

export const CardiacStatusTranslated = withNamespaces()(CardiacStatus);
export default CardiacStatus;
