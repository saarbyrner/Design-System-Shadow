/* eslint-disable max-depth */
// @flow
import { useState } from 'react';
import classNames from 'classnames';
import type { Event } from '@kitman/common/src/types/Event';
import { withNamespaces } from 'react-i18next';
import {
  EditableInput,
  EllipsisTooltipText,
  InfoTooltip,
  Select,
  ToggleSwitch,
  TooltipMenu,
  UserAvatar,
} from '@kitman/components';
import type { Option } from '@kitman/components/src/Select';
import { TrackEvent } from '@kitman/common/src/utils';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import updateAttributes from '../../services/updateAttributes';
import { BulkEditTooltipTranslated as BulkEditTooltip } from '../GridComponents/BulkEditTooltip';
import { PlanningGridTranslated as PlanningGrid } from '../GridComponents/PlanningGrid';
import type { AthleteFilter, GridData, ParticipationLevel } from '../../../types';
import { ParticipationLevelReasonTranslated as ParticipationLevelReason } from './ParticipationLevelReason';

type Props = {
  athletesGrid: GridData,
  fetchMoreData: Function,
  isLoading: boolean,
  participationLevels: Array<ParticipationLevel>,
  participationLevelReasons: Array<Option>,
  event: Event,
  athleteFilter: AthleteFilter,
  onAttributesUpdate: Function,
  onAttributesBulkUpdate: Function,
  onClickDeleteColumn: Function,
  canEditEvent: boolean,
  canViewAvailabilities: boolean,
};

const ATHLETE_NAME_LIMIT = 23;

const AthletesTabGrid = (props: I18nProps<Props>) => {
  const [disabledRows, setDisabledRows] = useState([]);
  const [hasRequestFailed, setHasRequestFailed] = useState(false);
  const [isTriggerVisible, setIsTriggerVisible] = useState(false);

  const isParticipationNone = (participationId) => {
    return (
      props.participationLevels.find(({ value }) => value === participationId)
        ?.canonical_participation_level === 'none'
    );
  };

  const isParticipationFull = (participationId) => {
    return (
      props.participationLevels.find(({ value }) => value === participationId)
        ?.canonical_participation_level === 'full'
    );
  };

  const updateAttribute = (attributes, rowData) => {
    const isSingleRowEdit = Boolean(rowData);

    // Disable the rows that we are going to be updated
    setDisabledRows((prevDisabledRows) =>
      isSingleRowEdit
        ? [...prevDisabledRows, rowData?.id]
        : props.athletesGrid.rows.map((row) => row.id)
    );

    updateAttributes({
      eventId: props.event.id,
      attributes,
      athleteId: isSingleRowEdit ? rowData?.athlete?.id : null,
      filters: props.athleteFilter,
      tab: 'athletes_tab',
    }).then(
      // Update succeed
      (athletesGrid) => {
        // re-enable the rows
        setDisabledRows((prevDisabledRows) =>
          isSingleRowEdit
            ? prevDisabledRows.filter((rowId) => rowId !== rowData?.id)
            : []
        );

        // Update the grid data
        if (isSingleRowEdit) {
          props.onAttributesUpdate(
            athletesGrid.rows.find((row) => row.id === rowData?.id),
            rowData?.id
          );
        } else {
          props.onAttributesBulkUpdate(athletesGrid);
        }
      },
      // Update fails
      () => setHasRequestFailed(true)
    );
  };

  const getStatusColumnHeaderCell = (id, rowKey, name) => {
    return {
      id: rowKey,
      content: (
        <InfoTooltip content={name}>
          <div
            className={classNames(
              'planningEventGridTab__headerCell',
              `planningEventGridTab__headerCell--${rowKey}`
            )}
            onMouseLeave={() => setIsTriggerVisible(false)}
          >
            {props.canEditEvent ? (
              <div>
                <button
                  className="planningEventGridTab__headerCellMenuDisplayer"
                  type="button"
                  onMouseEnter={() => setIsTriggerVisible(true)}
                >
                  {name}
                </button>
                <TooltipMenu
                  placement="bottom-end"
                  offset={[0, 5]}
                  menuItems={[
                    {
                      description: props.t('Delete'),
                      onClick: () => {
                        props.onClickDeleteColumn(id);
                        TrackEvent('Collection', 'Delete', 'Columns');
                      },
                    },
                  ]}
                  onVisibleChange={(isVisible) => {
                    setIsTriggerVisible(isVisible);
                  }}
                  tooltipTriggerElement={
                    <button
                      type="button"
                      className={classNames(
                        'planningEventGridTab__headerCellMenuTrigger',
                        {
                          'planningEventGridTab__headerCellMenuTrigger--visible':
                            isTriggerVisible,
                        }
                      )}
                    >
                      <i className="icon-more" />
                    </button>
                  }
                  kitmanDesignSystem
                />
              </div>
            ) : (
              name
            )}
          </div>
        </InfoTooltip>
      ),
      isHeader: true,
    };
  };

  const getDefaultHeaderCell = (column) => {
    switch (column.row_key) {
      case 'participation_level':
        return {
          id: column.row_key,
          content: (
            <div
              className={`planningEventGridTab__headerCell--${column.row_key}`}
            >
              {props.canEditEvent ? (
                <BulkEditTooltip
                  type="SELECT"
                  options={props.participationLevels}
                  columnName={column.name}
                  onApply={(value) =>
                    updateAttribute({
                      participation_level: value,
                    })
                  }
                />
              ) : (
                column.name
              )}
            </div>
          ),
          isHeader: true,
        };
      case 'include_in_group_calculations':
        return {
          id: column.row_key,
          content: (
            <div
              className={`planningEventGridTab__headerCell--${column.row_key}`}
            >
              {props.canEditEvent ? (
                <BulkEditTooltip
                  type="TOGGLE"
                  columnName={column.name}
                  onApply={(value) =>
                    updateAttribute({ include_in_group_calculations: value })
                  }
                />
              ) : (
                column.name
              )}
            </div>
          ),
          isHeader: true,
        };
      default:
        return {
          id: column.row_key,
          content: (
            <div
              className={`planningEventGridTab__headerCell--${column.row_key}`}
            >
              {column.name}
            </div>
          ),
          isHeader: true,
        };
    }
  };

  const getHeaderCell = (column) => {
    if (column.default) {
      return getDefaultHeaderCell(column);
    }
    return getStatusColumnHeaderCell(column.id, column.row_key, column.name);
  };

  const getCellContent = ({ row_key: rowKey }, rowData) => {
    const athleteName =
      rowData.athlete.fullname.length > ATHLETE_NAME_LIMIT
        ? `${rowData.athlete.fullname.substring(0, 22)} ...`
        : rowData.athlete.fullname;

    switch (rowKey) {
      case 'athlete':
        return (
          <InfoTooltip content={rowData.athlete.fullname}>
            <div className="planningEventGridTab__athleteCell">
              <UserAvatar
                url={rowData.athlete.avatar_url}
                firstname={rowData.athlete.fullname}
                displayInitialsAsFallback
                availability={
                  props.canViewAvailabilities
                    ? rowData.athlete.availability
                    : ''
                }
                size="EXTRA_SMALL"
              />
              {athleteName}
            </div>
          </InfoTooltip>
        );
      case 'participation_level': {
        if (!props.canEditEvent) {
          return props.participationLevels.find(
            (participation) =>
              rowData.participation_level === participation.value
          )?.label;
        }

        return (
          <Select
            options={props.participationLevels}
            onChange={(value) =>
              updateAttribute(
                {
                  participation_level: value,
                },
                rowData
              )
            }
            value={rowData.participation_level}
            placeholder={props.t('Participation')}
            isDisabled={disabledRows.includes(rowData.id)}
            appendToBody
          />
        );
      }
      case 'participation_level_reason': {
        if (isParticipationFull(rowData.participation_level)) {
          return '';
        }

        if (!props.canEditEvent) {
          if (rowData.participation_level_reason != null) {
            const currentPLR = props.participationLevelReasons.find(
              (participationReason) =>
                rowData.participation_level_reason === participationReason.value
            );
            if (currentPLR) {
              if (rowData.related_issues) {
                const relatedIssuePathologies = rowData.related_issues.map(
                  ({ code, pathology }) =>
                    code ? pathology : props.t('Preliminary Injury')
                );
                let relatedIssueLabel =
                  relatedIssuePathologies.length > 1
                    ? `${relatedIssuePathologies.length} - `
                    : '';

                relatedIssueLabel += `${
                  currentPLR.label
                }: ${relatedIssuePathologies.join(', ')}`;

                return (
                  <EllipsisTooltipText
                    content={relatedIssueLabel}
                    displayEllipsisWidth={200}
                  />
                );
              }
              return currentPLR?.label;
            }
          }
          return '';
        }

        return (
          <ParticipationLevelReason
            updateAttribute={updateAttribute}
            rowData={rowData}
            participationLevelReasons={props.participationLevelReasons}
            disabledRows={disabledRows}
          />
        );
      }
      case 'free_note': {
        const participationLevelReason = props.participationLevelReasons.find(
          (option) => option.value === rowData.participation_level_reason
        );

        if (!props.canEditEvent) {
          if (participationLevelReason?.label !== 'Other') {
            return '';
          }
        }

        const onSubmitFn = (value) => {
          updateAttribute(
            {
              free_note: value,
            },
            rowData
          );
        };

        if (
          participationLevelReason?.label === 'Other' &&
          !isParticipationFull(rowData.participation_level)
        ) {
          return (
            <EditableInput
              value={rowData.free_note?.value || ''}
              onSubmit={onSubmitFn}
              isDisabled={!props.canEditEvent}
              allowSavingEmpty
            />
          );
        }
        return '';
      }
      case 'include_in_group_calculations': {
        if (!props.canEditEvent) {
          return rowData.include_in_group_calculations
            ? props.t('Yes')
            : props.t('No');
        }

        return (
          <ToggleSwitch
            isSwitchedOn={rowData.include_in_group_calculations}
            toggle={() =>
              updateAttribute(
                {
                  include_in_group_calculations:
                    !rowData.include_in_group_calculations,
                },
                rowData
              )
            }
            isDisabled={
              isParticipationNone(rowData.participation_level) ||
              disabledRows.includes(rowData.id)
            }
          />
        );
      }
      case 'squads': {
        const squadNames = rowData.squads
          .map((squad) => (squad.primary ? `${squad.name}*` : squad.name))
          .join(', ');
        return (
          <EllipsisTooltipText
            content={squadNames}
            displayEllipsisWidth={280}
          />
        );
      }
      default:
        return rowData[rowKey];
    }
  };

  return (
    <PlanningGrid
      grid={props.athletesGrid}
      canDeleteColumn={props.canEditEvent}
      getHeaderCell={getHeaderCell}
      emptyText={props.t('There are no athletes')}
      fetchMoreData={props.fetchMoreData}
      hasRequestFailed={hasRequestFailed}
      isFullyLoaded={!props.isLoading && !props.athletesGrid.next_id}
      isLoading={props.isLoading}
      allowOverflow={(column) => column === 'participation_level'}
      onClickDeleteColumn={props.onClickDeleteColumn}
      getCellContent={getCellContent}
    />
  );
};

export const AthletesTabGridTranslated = withNamespaces()(AthletesTabGrid);
export default AthletesTabGrid;
