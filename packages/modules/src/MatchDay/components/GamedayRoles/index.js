// @flow
import { useState, useEffect, useCallback } from 'react';
import { withNamespaces } from 'react-i18next';
import {
  DataGrid as MuiDataGrid,
  FormControl,
  TextField,
  Autocomplete,
  Menu,
  MenuItem,
  Button,
  Stack,
} from '@kitman/playbook/components';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { useSelector } from 'react-redux';
import { getEventSelector } from '@kitman/modules/src/MatchDay/shared/selectors';
import {
  muiDataGridProps,
  dataGridCustomStyle,
} from '@kitman/modules/src/PlanningEvent/src/components/AthletesSelectionTab/gameEventSelectionGridConfig';
import useLeagueOperations from '@kitman/common/src/hooks/useLeagueOperations';
import { usePermissions } from '@kitman/common/src/contexts/PermissionsContext';
import { usePreferences } from '@kitman/common/src/contexts/PreferenceContext/preferenceContext';

import type { Option } from '@kitman/components/src/Select';
import { useGetContactRolesQuery } from '@kitman/modules/src/Contacts/src/redux/rtk/getContactRolesApi';
import {
  columnHeaders,
  commonColDef,
} from '@kitman/modules/src/MatchDay/shared/constants';
import {
  reorderRoles,
  transformGameContacts,
  transformContactRoles,
} from '@kitman/modules/src/MatchDay/shared/utils';
import { useGamedayRoles } from '@kitman/modules/src/MatchDay/shared/hooks';
import useLastPathSegment from '@kitman/common/src/hooks/useLastPathSegment';
import { useSearchContactsQuery } from '@kitman/modules/src/Contacts/src/redux/rtk/searchContactsApi';
import { defaultFilters } from '@kitman/modules/src/Contacts/shared/constants';
import getEventGameContacts from '@kitman/services/src/services/contacts/getEventGameContacts';
import { KITMAN_ICON_NAMES, KitmanIcon } from '@kitman/playbook/icons';
import type { EventGameContact } from '@kitman/services/src/services/contacts/getEventGameContacts';

import Card from '../Card';
import LockView from '../LockView';

type GamedayRolesProps = {};

const GamedayRoles = ({ t }: I18nProps<GamedayRolesProps>) => {
  const event = useSelector(getEventSelector);
  const homeOrgId = event?.squad?.owner_id;
  const awayOrgId = event?.opponent_squad?.owner_id;
  const eventId = useLastPathSegment();
  const { organisationId, isLeague, isLeagueStaffUser } = useLeagueOperations();
  const { permissions } = usePermissions();
  const { preferences } = usePreferences();

  const canManageGameInformation =
    isLeague && permissions?.leagueGame.manageGameInformation;

  const isGameDayRolesEnabled =
    preferences?.league_game_contacts && !isLeagueStaffUser;

  const [eventGameContacts, setEventGameContacts] = useState<
    Array<EventGameContact>
  >([]);

  const fetchEventGameContacts = useCallback(async () => {
    const response = await getEventGameContacts({ eventId });
    setEventGameContacts(response);
  }, [eventId]);

  useEffect(() => {
    fetchEventGameContacts();
  }, [fetchEventGameContacts]);

  const { data: contacts } = useSearchContactsQuery(
    {
      ...defaultFilters,
      organisationIds: [organisationId, homeOrgId, awayOrgId],
      paginate: false,
    },
    {
      selectFromResult: (result) => {
        const gameContacts = result?.data?.game_contacts ?? [];
        return {
          ...result,
          data: transformGameContacts(gameContacts),
        };
      },
    }
  );

  const { data: contactRoles = [] } = useGetContactRolesQuery(undefined, {
    selectFromResult: (data) => {
      return {
        ...data,
        data: transformContactRoles({
          contactRoles: data?.data ?? [],
          eventGameContacts,
        }),
      };
    },
  });

  const {
    readOnlyRoles,
    editOnlyRoles,
    optionalRoles,
    form,
    setForm,
    order,
    setOrder,
    isEditOpen,
    anchorEl,
    isSubmitting,
    onRemoveOptionalRole,
    onAddOptionalRole,
    onResetForm,
    onOpenOptionalRoles,
    onCloseOptionalRoles,
    onOpenEditForm,
    onSubmitForm,
  } = useGamedayRoles({
    t,
    eventId,
    contactRoles,
    eventGameContacts,
    fetchEventGameContacts,
  });

  const renderSelect = ({
    id,
    label,
    options,
  }: {
    id: number,
    label: string,
    options: Array<Option>,
  }) => {
    return (
      <FormControl>
        <Autocomplete
          id={`${id}-autocomplete`}
          options={options}
          renderInput={(params) => (
            <TextField
              {...params}
              label={label}
              // can't type space in the input, see: https://stackoverflow.com/a/71057085
              onKeyDown={(e) => e.stopPropagation()}
            />
          )}
          value={options.find((i) => i.value === form[id]?.value) ?? null}
          isOptionEqualToValue={(option, value) => option.value === value.value}
          onChange={(_, selectedValue) => {
            setForm((prev) => ({
              ...prev,
              [id]: selectedValue ?? null,
            }));
          }}
          getOptionLabel={(option) => {
            return option.label ?? '';
          }}
          getOptionKey={(option) => option.value}
          clearOnBlur
          clearOnEscape
          disableClearable={false}
        />
      </FormControl>
    );
  };

  const commonProps = {
    ...muiDataGridProps,
    unstable_cellSelectior: true,
    sx: dataGridCustomStyle,
    hideFooter: true,
    hideFooterRowCount: true,
  };

  const grid = (
    <MuiDataGrid
      {...commonProps}
      rows={readOnlyRoles ?? []}
      columns={Object.values(columnHeaders)}
    />
  );

  const editGrid = (
    <Stack direction="column" gap={2}>
      <MuiDataGrid
        {...commonProps}
        rows={editOnlyRoles}
        columns={Object.values({
          ...columnHeaders,
          name: {
            ...columnHeaders.name,
            renderCell: (params) => {
              const assignedContacts = {};

              Object.keys(form).forEach((key) => {
                const roleId = +key;
                const contact = form[roleId];
                if (contact && roleId !== params.row.id) {
                  assignedContacts[contact.value] = { roleId };
                }
              });

              // when the role is league_contact we display contacts that have their org id equal to the organisationId
              // when the role is home_contact/away_contact we display contacts that have their org id equal to row org id
              // in addition to the above we only display contacts that are not already assigned to another role
              const filteredContacts = contacts.filter((contact) => {
                const {
                  organisationId: contactOrgId,
                  roleIds,
                  value,
                } = contact;

                const isLeagueContact =
                  params.row.kind === 'league_contact' &&
                  contactOrgId === organisationId;
                const isHomeOrAwayTeamContact = [homeOrgId, awayOrgId].includes(
                  contactOrgId
                );
                const isRelevantOrg =
                  isLeagueContact || isHomeOrAwayTeamContact;

                if (!isRelevantOrg) return false;

                const isAssignedToCurrentRole =
                  assignedContacts[value]?.roleId === params.row.id;
                const isRoleMatch = roleIds.includes(params.row.id);

                return isAssignedToCurrentRole || isRoleMatch;
              });

              return renderSelect({
                id: params.row.id,
                label: t('Name'),
                options: filteredContacts,
              });
            },
          },
          phone: {
            ...columnHeaders.phone,
            renderCell: (params) => {
              return <span>{form[params.row.id]?.phone ?? '-'}</span>;
            },
          },
          email: {
            ...columnHeaders.email,
            renderCell: (params) => {
              return <span>{form[params.row.id]?.email ?? '-'}</span>;
            },
          },
          delete: {
            ...commonColDef,
            width: 100,
            renderCell: (params) => {
              if (params.row.required) return null;

              return (
                <KitmanIcon
                  name={KITMAN_ICON_NAMES.RemoveCircle}
                  sx={{ cursor: 'pointer' }}
                  onClick={() => onRemoveOptionalRole(params.row.id)}
                />
              );
            },
          },
        })}
        rowReordering
        onRowOrderChange={({ oldIndex, targetIndex }) => {
          const newOrder = reorderRoles({
            order,
            orderedRoles: editOnlyRoles,
            oldIndex,
            targetIndex,
          });

          setOrder(newOrder);
        }}
      />

      {!!optionalRoles.length && (
        <div>
          <Button
            endIcon={<KitmanIcon name={KITMAN_ICON_NAMES.Add} />}
            color="secondary"
            onClick={onOpenOptionalRoles}
          >
            Add
          </Button>
          <Menu
            anchorEl={anchorEl}
            open={isEditOpen}
            onClick={onCloseOptionalRoles}
            onClose={onCloseOptionalRoles}
          >
            {optionalRoles.map((item) => {
              return (
                <MenuItem key={item.id} onClick={() => onAddOptionalRole(item)}>
                  {item.role}
                </MenuItem>
              );
            })}
          </Menu>
        </div>
      )}
    </Stack>
  );

  return (
    <LockView
      isEnabled={isGameDayRolesEnabled && !event?.dmn_notification_status}
    >
      <Card
        title={t('Matchday Roles')}
        isSubmitting={isSubmitting}
        isFormValid
        editForm={editGrid}
        isFormEditable={canManageGameInformation}
        onSubmitForm={onSubmitForm}
        onOpenEdit={onOpenEditForm}
        onCloseEdit={onResetForm}
      >
        {grid}
      </Card>
    </LockView>
  );
};

export default withNamespaces()(GamedayRoles);
