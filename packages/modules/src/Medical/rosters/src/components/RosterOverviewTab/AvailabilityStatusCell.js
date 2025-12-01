// @flow
import { withNamespaces } from 'react-i18next';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { AvailabilityLabel } from '@kitman/components';
import type { AthleteAvailabilityRecord } from '@kitman/services/src/services/medical/getAthletesAvailabilities';
import { colors } from '@kitman/common/src/variables';
import type { AvailabilityStatus } from '@kitman/common/src/types/Athlete';
import { KitmanIcon, KITMAN_ICON_NAMES } from '@kitman/playbook/icons';
import { Chip } from '@kitman/playbook/components';

type BaseAvailability = {
  availability: AvailabilityStatus,
  unavailable_since: string,
};

type Props = {
  baseAvailabilityStatus: BaseAvailability,
  availabilityRecord?: ?AthleteAvailabilityRecord,
};

const style = {
  container: {
    marginTop: 4,
    marginBottom: 4,
  },
  unavailableSince: {
    fontSize: 12,
    color: colors.grey_100,
  },
  chip: {
    marginTop: 4,
  },
};

const AvailabilityStatusCell = ({
  baseAvailabilityStatus,
  availabilityRecord,
  t,
}: I18nProps<Props>) => {
  const record: ?AthleteAvailabilityRecord = availabilityRecord || null;
  const availabilityStatusProgressEnabled = window.getFlag(
    'availability-status-progress'
  );

  const statusToShow =
    record?.availability_status || baseAvailabilityStatus.availability;

  let daysText = null;
  if (statusToShow !== 'available') {
    if (record && record.days != null) {
      daysText =
        record.days === 1
          ? t('1 day')
          : t('{{count}} days', { count: record.days });
    } else if (baseAvailabilityStatus.availability !== 'available') {
      daysText = baseAvailabilityStatus.unavailable_since;
    }
  }

  const content = (
    <div>
      <AvailabilityLabel status={statusToShow} />
      {daysText ? <span css={style.unavailableSince}>{daysText}</span> : null}
    </div>
  );

  const showBadge =
    !!availabilityStatusProgressEnabled &&
    !!record &&
    record.processing_in_progress;

  return (
    <div css={style.container}>
      {content}
      {showBadge ? (
        <Chip
          icon={<KitmanIcon name={KITMAN_ICON_NAMES.AccessTime} />}
          label={t('Status in progress')}
          css={style.chip}
        />
      ) : null}
    </div>
  );
};

export const AvailabilityStatusCellTranslated = withNamespaces()(
  AvailabilityStatusCell
);
export default AvailabilityStatusCellTranslated;
