// @flow
import { memo } from 'react';
import { withNamespaces } from 'react-i18next';
import { useDndContext } from '@dnd-kit/core';

import type { EventActivity } from '@kitman/common/src/types/Event';
import type { PrincipleId } from '@kitman/common/src/types/Principles';
import type { ActivityType } from '@kitman/modules/src/PlanningHub/src/services/getActivityTypes';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import {
  EditableInput,
  LineLoader,
  Select,
  TooltipMenu,
} from '@kitman/components';
import { CoachingPrinciplesCellTranslated as CoachingPrinciplesCell } from '../CoachingPrinciplesCell';

type GetActivityTypeSelectItems = Array<{
  value: number | string,
  label?: string,
}>;

const getActivityTypeSelectItems = (
  activityTypes: Array<ActivityType>
): GetActivityTypeSelectItems => {
  return activityTypes.map((item) => ({
    value: item.id,
    label: item.name,
  }));
};

export type ActivityProps = {
  className?: string,
  updatedActivityId: number | null,
  index: number,
  itemCount?: number,
  isLoading?: boolean,
  isActivityPresent?: boolean,
  overlay?: boolean,
  areCoachingPrinciplesEnabled?: boolean,
  isDraggingPrinciple?: boolean,
  DragHandle?: any,
  style?: Object,
  activity: EventActivity,
  activityTypes: Array<ActivityType> | null,
  showPrinciplesPanel: (activityId: number) => void,
  onDropPrinciple: (activityId: number) => void,
  onDeletePrinciple: (activityId: number, principleId: PrincipleId) => void,
  onClickDeleteActivity: (activityId: number) => void,
  onUpdateActivityDuration: (activityId: number, duration: string) => void,
  onUpdateActivityType: (activityId: number, activityTypeId: number) => void,
  renderDisplayedDrills: (activity: EventActivity) => any,
  onClickAthleteParticipation: () => void,
};

const Activity = ({
  style = {},
  activity,
  overlay,
  itemCount,
  isDraggingPrinciple,
  index,
  isLoading,
  updatedActivityId,
  activityTypes,
  areCoachingPrinciplesEnabled,
  isActivityPresent,
  DragHandle,
  className,
  onUpdateActivityType,
  renderDisplayedDrills,
  onDropPrinciple,
  showPrinciplesPanel,
  onDeletePrinciple,
  onUpdateActivityDuration,
  onClickDeleteActivity,
  t,
  onClickAthleteParticipation,
}: I18nProps<ActivityProps>) => {
  const dndContext = useDndContext();
  const isActive = dndContext?.active?.id === activity.id;
  const isOverlay = isActive && overlay;
  const isUnderlay = isActive && !overlay;
  const isLastItem = itemCount === index + 1;

  return (
    <div
      className={className}
      onMouseUp={() => onDropPrinciple(activity.id)}
      css={[
        style.row,
        isOverlay && style.draggingRow,
        isUnderlay && style.underlayRow,
        isLastItem && style.lastRow,
      ]}
    >
      {DragHandle}
      {isLoading && updatedActivityId === activity.id && (
        <div css={style.activityLoader}>
          <LineLoader />
          <LineLoader direction="left" />
        </div>
      )}
      {isDraggingPrinciple && <div css={style.rowVeil} />}
      <div
        className="sessionPlanningGrid__cell sessionPlanningGrid__cell--activity"
        css={style.cell}
      >
        <div>
          <span css={style.mobileHeading}>{t('Activity')}</span>
          <span css={style.activityCounter}>{index + 1}</span>
        </div>
        {activityTypes && (
          <div css={style.activityTypeSelect}>
            <Select
              options={getActivityTypeSelectItems(activityTypes)}
              onChange={(selectedOption) =>
                onUpdateActivityType(activity.id, selectedOption)
              }
              value={activity.event_activity_type?.id || ''}
              showAutoWidthDropdown
              appendToBody
            />
          </div>
        )}
      </div>

      {areCoachingPrinciplesEnabled && (
        <CoachingPrinciplesCell
          principles={activity.principles}
          activityId={activity.id}
          isDisabled={!isActivityPresent}
          showPrinciplesPanel={showPrinciplesPanel}
          onDeletePrinciple={onDeletePrinciple}
        />
      )}

      {window.getFlag('session-planning-tab-adding-drills-to-activites') && (
        <div
          className="sessionPlanningGrid__cell sessionPlanningGrid__cell--drills"
          css={style.cell}
        >
          <span css={style.mobileHeading}>{t('Drills')}</span>
          {renderDisplayedDrills(activity)}
        </div>
      )}

      <div
        className="sessionPlanningGrid__cell sessionPlanningGrid__cell--duration"
        css={style.cell}
      >
        <span css={style.mobileHeading}>{t('Minutes')}</span>
        <EditableInput
          value={`${activity.duration || ''}`}
          allowOnlyNumbers
          allowSavingEmpty
          maxLength={3}
          onSubmit={(value) => onUpdateActivityDuration(activity.id, value)}
          renderContent={({ value, onClick, isEditing }) => (
            <div
              onClick={onClick}
              css={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <span>{value}</span>
              {!isEditing && <div className="icon-edit" />}
            </div>
          )}
        />
      </div>

      <div
        className="sessionPlanningGrid__cell sessionPlanningGrid__cell--athletes"
        css={style.cell}
        onClick={onClickAthleteParticipation}
      >
        <span css={style.mobileHeading}>{t('Athlete')}</span>
        <div
          css={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <span>{activity.athletes?.length}</span>
          <div className="icon-edit" />
        </div>
      </div>

      <div
        className="sessionPlanningGrid__cell sessionPlanningGrid__cell--menu"
        css={style.cell}
      >
        <TooltipMenu
          placement="bottom-end"
          offset={[0, 5]}
          menuItems={[
            {
              description: t('Delete'),
              onClick: () => onClickDeleteActivity(activity.id),
            },
          ]}
          tooltipTriggerElement={
            <button
              type="button"
              className="sessionPlanningGrid__menuTrigger"
              css={style.menuTrigger}
            >
              <i className="icon-more" />
            </button>
          }
          kitmanDesignSystem
        />
      </div>
    </div>
  );
};

export default memo<
  $Diff<
    ActivityProps,
    {
      t: *,
    }
  >
>(withNamespaces()(Activity));
