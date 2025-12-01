// @flow
import type { ComponentType } from 'react';
import moment from 'moment';
import { withNamespaces } from 'react-i18next';
import { formatStandard } from '@kitman/common/src/utils/dateFormatter';
import {
  DataGrid,
  TextLink,
  UserAvatar,
  TextTag,
  Checkbox,
} from '@kitman/components';
import colors from '@kitman/common/src/variables/colors';
import { ExportSidePanelTranslated as ExportSidePanel } from '@kitman/modules/src/HumanInput/shared/components/ExportSidePanel';
import useExportSidePanel from '@kitman/modules/src/HumanInput/hooks/useExportSidePanel';
import { useGetPermissionsQuery } from '@kitman/common/src/redux/global/services/globalApi';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { useManageAthletes } from '../contexts/manageAthletesContext';
import styles from './styles';

type Props = {};

const AthletesTable = (props: I18nProps<Props>) => {
  const {
    athletes,
    requestStatus,
    athletesPage,
    fetchMoreAthletes,
    viewType,
    selectedAthleteIds,
    toggleSingleAthleteSelection,
  } = useManageAthletes();
  const { isExportSidePanelOpen, handleCloseExportSidePanel } =
    useExportSidePanel();
  const { data: permissions, isSuccess } = useGetPermissionsQuery();
  const canAssignLabels =
    isSuccess &&
    permissions.settings.canAssignLabels &&
    window.getFlag('labels-and-groups');
  const canViewLabels =
    isSuccess &&
    permissions.settings.canViewLabels &&
    window.getFlag('labels-and-groups');

  const columns = [
    ...(canAssignLabels ? [{ id: 'bulkActions', content: '' }] : []),
    {
      id: 'name',
      content: props.t('Athlete'),
    },
    {
      id: 'username',
      content: props.t('Username'),
    },
    {
      id: 'position',
      content: props.t('Position'),
    },
    {
      id: 'squads',
      content: props.t('Squads'),
    },
    {
      id: 'created',
      content: props.t('Creation Date'),
    },
    ...(canViewLabels
      ? [
          {
            id: 'labels',
            content: props.t('Labels'),
          },
        ]
      : []),
  ];

  const rows = athletes.map((athlete) => ({
    id: athlete.id,
    cells: [
      ...(canAssignLabels
        ? [
            {
              id: `bulkActions_${athlete.id}`,
              content: (
                <Checkbox
                  id={athlete.id.toString()}
                  isChecked={
                    !!selectedAthleteIds?.find((id) => id === athlete.id)
                  }
                  toggle={({ checked }) =>
                    toggleSingleAthleteSelection?.(athlete.id, checked)
                  }
                  kitmanDesignSystem
                  data-testid={`BulkActions|Child|${athlete.id}`}
                />
              ),
            },
          ]
        : []),
      {
        id: `athlete_${athlete.id}`,
        content: (
          <div css={styles.athleteCell}>
            <UserAvatar
              url={athlete.avatar}
              firstname={athlete.name}
              size="EXTRA_SMALL"
              displayInitialsAsFallback={false}
            />
            <TextLink
              text={athlete.name}
              href={
                window.featureFlags['form-based-athlete-profile']
                  ? `/athletes/${athlete.id}/profile`
                  : `/settings/athletes/${athlete.id}/edit`
              }
            />
          </div>
        ),
      },
      {
        id: `username_${athlete.id}`,
        content: <>{athlete.username}</>,
      },
      {
        id: `position_${athlete.id}`,
        content: <>{athlete.position}</>,
      },
      {
        id: `squads_${athlete.id}`,
        content: <>{athlete.squads}</>,
      },
      {
        id: `creation_${athlete.id}`,
        content: (
          <>
            {formatStandard({
              date: moment(athlete.created),
              displayLongDate: true,
            })}
          </>
        ),
      },
      ...(canViewLabels
        ? [
            {
              id: `labels_${athlete.id}`,
              content: athlete.labels?.map((label) => (
                <div key={label.id}>
                  <TextTag
                    content={label.name || ''}
                    backgroundColor={label.color || ''}
                    textColor={colors.white}
                    fontSize={12}
                    wrapperCustomStyles={styles.labelTag}
                  />
                </div>
              )),
            },
          ]
        : []),
    ],
  }));

  const isLoading = requestStatus === 'PENDING';
  const emptyTableText =
    viewType === 'INACTIVE'
      ? props.t('No inactive athletes found')
      : props.t('No active athletes found');

  return (
    <div css={styles.table}>
      <DataGrid
        columns={columns}
        rows={rows}
        isLoading={isLoading}
        isFullyLoaded={!athletesPage && !isLoading}
        fetchMoreData={fetchMoreAthletes}
        isTableEmpty={athletes.length === 0}
        emptyTableText={emptyTableText}
        scrollOnBody
      />
      {window.featureFlags['form-based-athlete-profile'] && (
        <ExportSidePanel
          isOpen={isExportSidePanelOpen}
          onClose={handleCloseExportSidePanel}
        />
      )}
    </div>
  );
};

export const AthletesTableTranslated: ComponentType<Props> =
  withNamespaces()(AthletesTable);
export default AthletesTable;
