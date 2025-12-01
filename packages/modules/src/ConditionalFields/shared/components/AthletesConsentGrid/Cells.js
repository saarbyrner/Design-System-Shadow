// @flow
import type { Node } from 'react';
import moment from 'moment';
import { formatStandard } from '@kitman/common/src/utils/dateFormatter';
import type { Athlete } from '@kitman/common/src/types/Consent';
import {
  AvatarCell,
  TextCell,
} from '@kitman/modules/src/ConditionalFields/shared/components/Cells';
import { Chip } from '@kitman/playbook/components';
import { ROW_KEY } from '@kitman/modules/src/ConditionalFields/shared/types';
import { cellStyle } from '@kitman/modules/src/ConditionalFields/shared/components/CommonGridStyle';
import { CONSENT_STATUS } from '@kitman/common/src/types/Consent';
import { FALLBACK_DASH } from '@kitman/modules/src/LeagueOperations/shared/consts';
import { ActionsCellTranslated as ActionsCell } from '../Cells/ActionsCell';

const buildCellContent = ({
  rowKey,
  athlete,
}: {
  rowKey: string,
  athlete: Athlete,
}): Node | Array<Node> => {
  const getStatusColour = () => {
    switch (athlete.consent_status) {
      case CONSENT_STATUS.Consented:
        return 'success';
      case CONSENT_STATUS.Expired:
        return 'primary';
      default:
        return 'error';
    }
  };

  const getConsentDates = () => {
    const endDate =
      athlete.most_recent_consent?.archived_on ||
      athlete.most_recent_consent?.end_date;
    if (athlete.most_recent_consent) {
      return `${formatStandard({
        date: moment(athlete.most_recent_consent?.start_date),
      })} - ${formatStandard({
        date: moment(endDate),
      })}`;
    }
    return FALLBACK_DASH;
  };
  switch (rowKey) {
    case ROW_KEY.athlete:
      return (
        <AvatarCell
          avatar_url={athlete?.avatar_url}
          text={athlete.fullname}
          position={athlete.position}
        />
      );
    case ROW_KEY.squads:
      return (
        <TextCell
          text={athlete.athlete_squads.map((squad) => squad.name).join(', ')}
          wrapText
        />
      );
    case ROW_KEY.consent:
      return <Chip label={athlete.consent_status} color={getStatusColour()} />;
    case ROW_KEY.consent_date:
      return <TextCell text={getConsentDates()} />;

    case ROW_KEY.consent_actions:
      return (
        <ActionsCell
          athleteId={athlete.id}
          consentStatus={athlete.consent_status}
        />
      );
    default:
      // $FlowIgnoreMe[prop-missing]
      return <span css={cellStyle.textCell}>{athlete[rowKey]}</span>;
  }
};

export default buildCellContent;
