// @flow
import moment from 'moment';
import type { Node } from 'react';
import {
  TextCell,
  AvatarCell,
} from '@kitman/modules/src/LeagueOperations/technicalDebt/components/Cells';
import { Link } from '@kitman/components';
import { formatStandard } from '@kitman/common/src/utils/dateFormatter';
import { cellStyle } from '@kitman/modules/src/LeagueOperations/technicalDebt/components/CommonGridStyle';
import type { SettingsPermissions } from '@kitman/common/src/contexts/PermissionsContext/settings/types';
import { parseUserType } from '@kitman/modules/src/AdditionalUsers/shared/utils';

import type {
  AdditionalUser,
  AdditionalUserTypes,
} from '@kitman/modules/src/AdditionalUsers/shared/types';

const buildCellContent = (
  { row_key: rowKey }: { row_key: string },
  additionalUser: AdditionalUser,
  permissions: SettingsPermissions
): Node | Array<Node> => {
  const canEditUser = (type: AdditionalUserTypes) => {
    const lowerCaseType = type.toLowerCase();
    if (lowerCaseType === 'scout') {
      return permissions.canManageScouts;
    }
    if (lowerCaseType === 'official') {
      return permissions.canManageOfficials;
    }
    if (lowerCaseType === 'matchdirector') {
      return permissions.canManageMatchDirectors;
    }
    if (lowerCaseType === 'matchmonitor') {
      return permissions.canManageMatchMonitors;
    }
    return false;
  };

  const additionalUserUrl = (id: number, type: AdditionalUserTypes) => {
    if (canEditUser(type)) {
      const lowerCaseType = type.toLowerCase();
      if (lowerCaseType === 'scout') {
        return `/administration/additional_users/scout/${id}/edit`;
      }
      if (lowerCaseType === 'official') {
        return `/administration/additional_users/official/${id}/edit`;
      }
      if (lowerCaseType === 'matchdirector') {
        return `/administration/additional_users/match_director/${id}/edit`;
      }
      if (lowerCaseType === 'matchmonitor') {
        return `/administration/additional_users/match_monitor/${id}/edit`;
      }
      return '';
    }
    return '';
  };

  switch (rowKey) {
    case 'fullname':
      return (
        <AvatarCell
          text={additionalUser.fullname}
          avatar_url={additionalUser.avatar_url}
          href={additionalUserUrl(additionalUser.id, additionalUser.type)}
        />
      );
    case 'username':
      return <TextCell text={additionalUser.username} />;
    case 'email':
      return <TextCell text={additionalUser.email} />;
    case 'type':
      return <TextCell text={parseUserType(additionalUser.type)} />;
    case 'created_at':
      return (
        <TextCell
          text={formatStandard({
            date: moment(additionalUser.created_at),
            displayLongDate: true,
          })}
        />
      );
    case 'edit':
      return (
        canEditUser(additionalUser.type) && (
          <Link
            href={additionalUserUrl(additionalUser.id, additionalUser.type)}
          >
            <i className="users__userTableEdit icon-edit" />
          </Link>
        )
      );
    default:
      return <span css={cellStyle.textCell}>{additionalUser[rowKey]}</span>;
  }
};

export default buildCellContent;
