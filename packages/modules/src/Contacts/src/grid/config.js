// @flow

import i18n from '@kitman/common/src/utils/i18n';
import { GridColDef } from '@mui/x-data-grid-pro';
import { Stack, Chip, Tooltip } from '@kitman/playbook/components';
import FallbackCrest from '@kitman/modules/src/shared/FixtureScheduleView/FallbackCrest';

import { KITMAN_ICON_NAMES, KitmanIcon } from '@kitman/playbook/icons';
import { capitalize } from 'lodash';
import style from '../../style';
import { contactStatuses, mailingList } from '../../shared/constants';

export const commonColDef = {
  sortable: false,
  resizable: false,
};

export const columnHeaders: { [key: string]: GridColDef } = {
  name: {
    ...commonColDef,
    field: 'name',
    headerName: i18n.t('Name'),
    width: 220,
    renderCell: (params) => {
      return (
        <Tooltip title={params.row.name} placement="bottom-start">
          <Stack flexDirection="column">
            <span css={style.contactName}>{params.row.name}</span>
            <span css={style.contactTitle}>{params.row.title}</span>
          </Stack>
        </Tooltip>
      );
    },
  },
  organisation: {
    ...commonColDef,
    field: 'organisation',
    headerName: i18n.t('Owner'),
    width: 220,
    renderCell: (params) => {
      const imageSrc = params.row.organisation?.logo_full_path;

      return (
        <Stack direction="row" gap={1} alignItems="center">
          {imageSrc ? (
            <img
              css={style.flag}
              src={imageSrc}
              alt={`${params.row.organisation.name} flag`}
            />
          ) : (
            <FallbackCrest />
          )}
          <span css={style.organisation}>{params.row.organisation.name}</span>
        </Stack>
      );
    },
  },
  gameContactRoles: {
    ...commonColDef,
    field: 'gameContactRoles',
    headerName: i18n.t('Matchday Role'),
    width: 210,
    maxWidth: 210,
    renderCell: (params) => {
      const roles = params.row.gameContactRoles;

      if (roles.length > 1) {
        const additionalRolesText = roles
          .slice(1)
          .map((role) => role.name)
          .join();
        return (
          <Stack direction="row" width="100%" gap={1}>
            <Tooltip title={roles[0].name}>
              <Chip
                label={roles[0].name}
                size="small"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  maxWidth: 'calc(100% - 42px)',
                }}
              />
            </Tooltip>
            <Tooltip title={additionalRolesText}>
              <Chip
                key="more"
                label={roles.length - 1}
                size="small"
                icon={<KitmanIcon name={KITMAN_ICON_NAMES.Add} />}
              />
            </Tooltip>
          </Stack>
        );
      }

      return (
        <Stack direction="row" width="100%" gap={1}>
          {roles.map((role) => {
            return (
              <Tooltip title={role.name} key={role.id} placement="bottom-start">
                <Chip key={role.id} label={role.name} size="small" />
              </Tooltip>
            );
          })}
        </Stack>
      );
    },
  },
  phone: {
    ...commonColDef,
    field: 'phone',
    headerName: i18n.t('Phone'),
    width: 200,
    renderCell: (params) => {
      return (
        <Tooltip title={params.row.phone} placement="bottom-start">
          <Stack direction="row" width="100%" gap={1}>
            <KitmanIcon name={KITMAN_ICON_NAMES.PhoneOutlined} />
            <span>{params.row.phone}</span>
          </Stack>
        </Tooltip>
      );
    },
  },
  email: {
    ...commonColDef,
    field: 'email',
    headerName: i18n.t('Email'),
    width: 250,
    renderCell: (params) => {
      return (
        <Tooltip title={params.row.email} placement="bottom-start">
          <Stack direction="row" width="100%" gap={1}>
            <KitmanIcon name={KITMAN_ICON_NAMES.MailOutline} />
            <span>{params.row.email}</span>
          </Stack>
        </Tooltip>
      );
    },
  },
  list: {
    ...commonColDef,
    field: 'list',
    headerName: i18n.t('List'),
    width: 110,
    renderCell: (params) => {
      const lists = [];
      if (params.row.dmn) lists.push(mailingList.Dmn);
      if (params.row.dmr) lists.push(mailingList.Dmr);

      return (
        <Stack direction="row" gap={1}>
          {lists.map((list) => {
            return <Chip key={list} label={list.toUpperCase()} size="small" />;
          })}
        </Stack>
      );
    },
  },
  status: {
    ...commonColDef,
    field: 'status',
    headerName: i18n.t('Status'),
    width: 130,
    renderCell: (params) => {
      const status = capitalize(params.row.status);

      switch (params.row.status) {
        case contactStatuses.Pending:
          return (
            <Chip
              label={status}
              color="warning"
              icon={<KitmanIcon name={KITMAN_ICON_NAMES.AccessTime} />}
              size="small"
            />
          );
        case contactStatuses.Approved:
          return (
            <Chip
              label={status}
              color="success"
              icon={<KitmanIcon name={KITMAN_ICON_NAMES.Check} />}
              size="small"
            />
          );
        case contactStatuses.Rejected:
          return (
            <Chip
              label={status}
              color="error"
              icon={<KitmanIcon name={KITMAN_ICON_NAMES.Close} />}
              size="small"
            />
          );
        default:
          return <span>--</span>;
      }
    },
  },
};
