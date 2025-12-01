// @flow
import { withNamespaces } from 'react-i18next';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { AvailabilityStatus } from '@kitman/common/src/types/Athlete';
import { colors } from '@kitman/common/src/variables';
import getAthleteAvailabilityStyles from '@kitman/common/src/utils/getAthleteAvailabilityStyles';

const style = {
  availabilityContainer: {
    display: 'flex',
    flexDirection: 'column',
    width: 160,
  },
  availabilityLabelContainer: {
    fontSize: 14,
    minHeight: 16,
    minWidth: 16,
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  availabilityIndicator: {
    height: 8,
    width: 8,
    borderRadius: 4,
  },
  injured: {
    backgroundColor: getAthleteAvailabilityStyles('injured').color,
  },
  returning: {
    backgroundColor: getAthleteAvailabilityStyles('returning').color,
  },
  available: {
    backgroundColor: getAthleteAvailabilityStyles('available').color,
  },
  unavailable: {
    backgroundColor: getAthleteAvailabilityStyles('unavailable').color,
  },
  labelSubText: {
    fontSize: 12,
    color: colors.grey_100,
  },
};

type Props = {
  status: AvailabilityStatus,
  displayText?: boolean,
};

const AvailabilityLabel = (props: I18nProps<Props>) => {
  const getStatusText = () => {
    switch (props.status) {
      case 'unavailable':
        return props.t('Unavailable');
      case 'absent':
        return props.t('Absent');
      default:
        return props.t('Available');
    }
  };

  const getStatusSubText = () => {
    switch (props.status) {
      case 'injured':
      case 'ill':
        return props.t('Injured/Ill');
      case 'returning':
        return props.t('Returning from injury/illness');
      default:
        return '';
    }
  };

  const renderAvailabilityIndicator = () => {
    switch (props.status) {
      case 'unavailable':
      case 'absent':
        return (
          <div
            data-testid={`${props.status}-indicator`}
            css={[style.availabilityIndicator, style.unavailable]}
          />
        );
      case 'ill':
      case 'injured':
        return (
          <div
            data-testid={`${props.status}-indicator`}
            css={[style.availabilityIndicator, style.injured]}
          />
        );
      case 'returning':
        return (
          <div
            data-testid={`${props.status}-indicator`}
            css={[style.availabilityIndicator, style.returning]}
          />
        );
      case 'available':
        return (
          <div
            data-testid={`${props.status}-indicator`}
            css={[style.availabilityIndicator, style.available]}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div css={style.availabilityContainer}>
      <div
        aria-label={
          props.displayText ? '' : `${getStatusText()} ${getStatusSubText()}`
        }
        css={style.availabilityLabelContainer}
      >
        {renderAvailabilityIndicator()}
        {props.displayText === false ? null : <span>{getStatusText()}</span>}
      </div>
      {props.displayText === false ? null : (
        <span css={style.labelSubText}>{getStatusSubText()}</span>
      )}
    </div>
  );
};

export default AvailabilityLabel;
export const AvailabilityLabelTranslated = withNamespaces()(AvailabilityLabel);
