// @flow
import type { Node } from 'react';
import {
  Link,
  Avatar,
  Typography,
  Tooltip,
  AvatarGroup,
  Stack,
} from '@kitman/playbook/components';
import {
  FALLBACK_DASH,
  FALLBACK_USER_LOCALE,
  DESIGNATION,
} from '@kitman/modules/src/LeagueOperations/shared/consts';
import { colors } from '@kitman/common/src/variables';
import {
  RegistrationStatusEnum,
  type RegistrationStatus,
  type PlayerType,
  type RegistrationSystemStatus,
  type RegistrationStatusReason,
  type Label,
  type HomegrownDocument,
} from '@kitman/modules/src/LeagueOperations/shared/types/common';
import type { DisciplinaryStatus } from '@kitman/modules/src/LeagueOperations/shared/types/discipline';
import type { StatusPermissions } from '@kitman/modules/src/LeagueOperations/shared/types/permissions';

import {
  renderStatusChip,
  renderDisciplinaryStatusChip,
  renderRegistrationSystemStatusChip,
  getStatusTooltip,
} from '@kitman/modules/src/LeagueOperations/shared/utils/index';
import { KitmanIcon, KITMAN_ICON_NAMES } from '@kitman/playbook/icons';
import type { AvatarCell, LinkedCell } from '../types';
import LimitedChips from '../../LimitedChips';

export const formatAvatarCell = (items: Array<AvatarCell>): Node => {
  const renderAvatar = (src: string, text: string, id: number) => {
    return (
      <Avatar
        alt={text}
        src={src}
        key={id}
        sx={{
          width: 27,
          height: 27,
          '.MuiAvatar-img': {
            objectFit: 'contain',
          },
        }}
      />
    );
  };

  if (!items) return <></>;
  if (items.length === 1) {
    const { text, avatar_src: avatarSrc, href, id } = items[0];
    return (
      <>
        {renderAvatar(avatarSrc, text, id)}

        {href ? (
          <Link underline="none" href={href} sx={{ ml: 1 }}>
            <Typography
              variant="subtitle"
              sx={{ color: colors.grey_200, fontWeight: '500' }}
            >
              {text}
            </Typography>
          </Link>
        ) : (
          <Typography variant="subtitle" sx={{ color: colors.grey_200, ml: 1 }}>
            {text}
          </Typography>
        )}
      </>
    );
  }
  return (
    <AvatarGroup
      max={4}
      sx={{
        '.MuiAvatar-root': {
          border: `2px solid ${colors.colour_warm_light_grey}`,
          background: colors.white,
        },
      }}
    >
      {items.map((item) => {
        return renderAvatar(item.avatar_src, item.text, item.id);
      })}
    </AvatarGroup>
  );
};

export const formatCurrencyCell = ({
  currency,
  userLocale,
  value,
}: {
  userLocale: ?string,
  currency: string,
  value: number,
}): Node => {
  const getValue = () => {
    return new Intl.NumberFormat(userLocale || FALLBACK_USER_LOCALE, {
      style: 'currency',
      currency,
    }).format(value);
  };
  return <Typography variant="subtitle">{getValue()}</Typography>;
};

export const formatAddressCell = ({
  address,
}: {
  address: Array<string>,
}): Node => {
  if (address.length === 0) return FALLBACK_DASH;

  return <Typography variant="subtitle">{address.join(' ')}</Typography>;
};

export const formatRegistrationStatusCell = ({
  registrationStatus,
  registrationSystemStatus,
  useRegistrationSystemStatus = false,
  registrationStatusReason = undefined,
  withTooltip = true,
  statusPermissions,
}: {
  registrationStatus: ?RegistrationStatus,
  registrationSystemStatus: ?RegistrationSystemStatus,
  registrationStatusReason?: ?RegistrationStatusReason,
  useRegistrationSystemStatus: boolean,
  withTooltip: boolean,
  statusPermissions?: StatusPermissions,
}): Node => {
  if (
    (useRegistrationSystemStatus && !registrationSystemStatus) ||
    (!useRegistrationSystemStatus && !registrationStatus)
  ) {
    return FALLBACK_DASH;
  }

  const statusChip = useRegistrationSystemStatus
    ? renderRegistrationSystemStatusChip(registrationSystemStatus)
    : renderStatusChip(registrationStatus);

  const tooltipText = useRegistrationSystemStatus
    ? getStatusTooltip(
        registrationSystemStatus?.type ?? RegistrationStatusEnum.INCOMPLETE
      )
    : getStatusTooltip(registrationStatus ?? RegistrationStatusEnum.INCOMPLETE);

  const tooltipTitle = statusPermissions?.canManageUnapprove
    ? registrationStatusReason?.name ?? tooltipText
    : tooltipText;

  if (withTooltip) {
    return (
      <Tooltip title={tooltipTitle} placement="left">
        {statusChip}
      </Tooltip>
    );
  }

  return statusChip;
};

export const formatLabelStatusCell = ({
  labels,
}: {
  labels: ?Array<Label>,
}): Node => {
  return <LimitedChips items={labels} />;
};

export const formatDisciplinaryStatusCell = ({
  status,
}: {
  status: DisciplinaryStatus,
}): Node => {
  if (!status) return FALLBACK_DASH;

  return renderDisciplinaryStatusChip(status);
};

export const formatDesignationCell = ({
  designation,
}: {
  designation: PlayerType,
}): Node => {
  if (!designation) return FALLBACK_DASH;

  return <Typography variant="subtitle">{DESIGNATION[designation]}</Typography>;
};

export const formatLinkCell = ({ text, href }: LinkedCell): Node => {
  if (href) {
    return (
      <Link underline="none" href={href} sx={{ ml: 1 }}>
        <Typography
          variant="subtitle"
          sx={{ color: colors.grey_200, fontWeight: '600' }}
        >
          {text}
        </Typography>
      </Link>
    );
  }
  return (
    <Typography variant="subtitle" sx={{ color: colors.grey_200 }}>
      {text}
    </Typography>
  );
};

export const formatActionableCell = ({
  text,
  isActionable,
}: {
  text: string,
  isActionable: boolean,
}): Node => {
  return (
    <Typography
      variant="subtitle"
      sx={{
        fontWeight: isActionable ? '600' : '400',
        cursor: isActionable ? 'pointer' : 'normal',
      }}
    >
      {text}
    </Typography>
  );
};

export const formatDocumentsCell = (documents: Array<HomegrownDocument>) => {
  return (
    <Stack direction="row" gap={2} justifyContent="space-between" width="100%">
      {documents.map((document) => (
        <Link
          key={document.id}
          download
          underline="none"
          href={document?.attachment?.download_url}
        >
          <Stack
            key={document.id}
            direction="row"
            gap={0.5}
            alignItems="center"
          >
            <KitmanIcon
              sx={{ color: colors.grey_200 }}
              name={KITMAN_ICON_NAMES.AttachFileOutlined}
            />
            <Typography variant="subtitle" sx={{ color: colors.grey_200 }}>
              {document.title}
            </Typography>
          </Stack>
        </Link>
      ))}
    </Stack>
  );
};
