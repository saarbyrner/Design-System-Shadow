// @flow
import i18n from '@kitman/common/src/utils/i18n';
import type { Node } from 'react';
import * as DateFormatter from '@kitman/common/src/utils/dateFormatter';
import moment from 'moment';
import { KITMAN_ICON_NAMES, KitmanIcon } from '@kitman/playbook/icons';
import { Chip } from '@kitman/playbook/components';
import type {
  Address,
  Organisation,
  Squad,
  MultiRegistration,
  RegistrationSystemStatus,
} from '@kitman/modules/src/LeagueOperations/shared/types/common';
import {
  RegistrationStatusEnum,
  type RegistrationStatus,
} from '../types/common';
import type { DisciplinaryStatus } from '../types/discipline';
import {
  ELIGIBLE,
  FALLBACK_DASH,
  SUSPENDED,
  DISCIPLINARY_STATUS_VALUE,
} from '../consts';

const getStatusIconName = (status: RegistrationStatus) => {
  switch (status) {
    case RegistrationStatusEnum.REJECTED_ORGANISATION:
    case RegistrationStatusEnum.REJECTED_ASSOCIATION:
      return KITMAN_ICON_NAMES.Error;
    case RegistrationStatusEnum.APPROVED:
      return KITMAN_ICON_NAMES.CheckCircle;
    case RegistrationStatusEnum.PENDING_ORGANISATION:
    case RegistrationStatusEnum.PENDING_ASSOCIATION:
    case RegistrationStatusEnum.PENDING_PAYMENT:
    case RegistrationStatusEnum.UNAPPROVED:
    default:
      return KITMAN_ICON_NAMES.PendingOutlined;
  }
};

const getStatusColor = (status: RegistrationStatus) => {
  switch (status) {
    case RegistrationStatusEnum.PENDING_ORGANISATION:
    case RegistrationStatusEnum.PENDING_ASSOCIATION:
    case RegistrationStatusEnum.PENDING_PAYMENT:
    case RegistrationStatusEnum.UNAPPROVED:
      return 'warning';
    case RegistrationStatusEnum.REJECTED_ORGANISATION:
    case RegistrationStatusEnum.REJECTED_ASSOCIATION:
      return 'error';
    case RegistrationStatusEnum.APPROVED:
      return 'success';
    default:
      return 'default';
  }
};

export const renderStatusChip = (value: ?RegistrationStatus): Node | string => {
  if (!value) {
    return FALLBACK_DASH;
  }

  const getLabel = (status: RegistrationStatus) => {
    switch (status) {
      case RegistrationStatusEnum.PENDING_ORGANISATION:
        return i18n.t('Pending (Club approval)');
      case RegistrationStatusEnum.PENDING_ASSOCIATION:
        return i18n.t('Pending (League approval)');
      case RegistrationStatusEnum.PENDING_PAYMENT:
        return i18n.t('Pending (Payment)');
      case RegistrationStatusEnum.REJECTED_ORGANISATION:
        return i18n.t('Rejected (Club)');
      case RegistrationStatusEnum.REJECTED_ASSOCIATION:
        return i18n.t('Rejected (League)');
      case RegistrationStatusEnum.APPROVED:
        return i18n.t('Approved');
      case RegistrationStatusEnum.UNAPPROVED:
        return i18n.t('Unapproved');
      default:
        return i18n.t('Incomplete');
    }
  };

  return (
    <Chip
      icon={<KitmanIcon name={getStatusIconName(value)} />}
      label={getLabel(value)}
      color={getStatusColor(value)}
      size="small"
    />
  );
};

export const renderRegistrationSystemStatusChip = (
  status: ?RegistrationSystemStatus
): Node | string => {
  if (!status) {
    return FALLBACK_DASH;
  }

  return (
    <Chip
      icon={<KitmanIcon name={getStatusIconName(status.type)} />}
      label={status.name}
      color={getStatusColor(status.type)}
      size="small"
    />
  );
};

export const renderDisciplinaryStatusChip = (
  value: DisciplinaryStatus
): Node | string => {
  if (!value) {
    return FALLBACK_DASH;
  }

  const getIconName = (status: DisciplinaryStatus) => {
    switch (status) {
      case SUSPENDED:
        return KITMAN_ICON_NAMES.Error;
      case ELIGIBLE:
        return KITMAN_ICON_NAMES.CheckCircle;
      default:
        return KITMAN_ICON_NAMES.PendingOutlined;
    }
  };

  const getColor = (status: DisciplinaryStatus) => {
    switch (status) {
      case SUSPENDED:
        return 'error';
      case ELIGIBLE:
        return 'success';
      default:
        return 'default';
    }
  };

  return (
    <Chip
      icon={<KitmanIcon name={getIconName(value)} />}
      label={DISCIPLINARY_STATUS_VALUE[value]}
      color={getColor(value)}
      size="small"
      sx={{ textTransform: 'capitalize' }}
    />
  );
};

export const getStatusTooltip = (status: RegistrationStatus) => {
  if (!status) {
    return null;
  }

  return {
    incomplete: i18n.t('Registration has missing requirements.'),
    pending_organisation: i18n.t(
      'Requirements have been submitted and are awaiting club approval.'
    ),
    pending_association: i18n.t(
      'Requirements have been submitted and are awaiting league approval.'
    ),
    rejected_organisation: i18n.t(
      'One or more requirements have been rejected by the club admin.'
    ),
    rejected_association: i18n.t(
      'One or more requirements have been rejected by a league admin.'
    ),
    pending_payment: i18n.t(
      'Registration is complete and awaiting club payment.'
    ),
    approved: i18n.t('Registration and payment complete.'),
    unapproved: i18n.t(
      'User has been unapproved. Reach out to league admin for further details.'
    ),
  }[status];
};

export const getDateOrFallback = (date: ?string, format?: string) => {
  return date
    ? DateFormatter.formatStandard({ date: moment(date, format) })
    : FALLBACK_DASH;
};

export const getAddressOrFallback = (address: ?Address) => {
  return address ? [address?.city, '/', address?.state] : [FALLBACK_DASH];
};

export const getCountryOrFallback = (address: ?Address) => {
  return address ? address?.country?.name : FALLBACK_DASH;
};

export const getAgeOrFallback = (date: ?string) => {
  return date
    ? moment().diff(moment(date, 'DD MMMM YYYY'), 'years')
    : FALLBACK_DASH;
};

export const getClubAvatar = (
  club: Organisation,
  removeLink: boolean = false
) => ({
  id: club.id,
  text: club.name,
  avatar_src: club.logo_full_path ?? '',
  ...(removeLink
    ? {}
    : {
        href: `/registration/organisations?id=${club.id}`,
      }),
});

export const displayRegistrationStatus = (
  registrations: Array<MultiRegistration>
) => {
  if (registrations?.length > 1) return null;
  return registrations.length === 1 ? registrations[0].status : 'incomplete';
};

export const showRegistrationStatus = (
  registrationSystemStatus: ?RegistrationSystemStatus
) => {
  return registrationSystemStatus !== null
    ? registrationSystemStatus?.type
    : RegistrationStatusEnum.INCOMPLETE;
};

export const getLeagueText = (registrations: Array<MultiRegistration>) => {
  if (registrations?.length > 1) return i18n.t('Multiple');
  return registrations.length === 1
    ? registrations[0].division.name
    : FALLBACK_DASH;
};
export const getSquadText = (squads: Array<Squad>) => {
  if (squads?.length > 1) return { text: i18n.t('Multiple') };
  return squads.length === 1
    ? { text: squads[0].name, href: `/registration/squads?id=${squads[0].id}` }
    : FALLBACK_DASH;
};

export const checkUrlParams = (urlParams: URLSearchParams): boolean => {
  return (urlParams && Array.from(urlParams.entries())?.length > 0) || false;
};

export const MOCK_ORGANISATION = {
  id: 115,
  avatar_src:
    'https://s3:9000/injpro-staging-public/kitman-stock-assets/test.png',
  text: 'Kitman Labs',
};

export const buildAddress = ({
  line1,
  line2,
  line3,
  state,
  zipcode,
  country,
}: Address) => {
  return [line1, line2, line3, state, zipcode, country?.name]
    .filter(Boolean)
    .join(', ');
};

export const getSquadNumbers = (squadNumbers: Array<number>) => {
  return squadNumbers?.length > 0 ? squadNumbers : FALLBACK_DASH;
};

export const mapDateToServerFormant = (date: string | null): string | null => {
  if (!date) {
    return null;
  }

  return moment(date).format('YYYY-MM-DD');
};
