// @flow
import { withNamespaces } from 'react-i18next';
import { useMemo } from 'react';
import type { ComponentType } from 'react';

import {
  Checkbox,
  Select,
  withSelectServiceSuppliedOptions,
} from '@kitman/components';
import { getTeams, getVenueTypes } from '@kitman/services';
import type { StatusChangedCallback } from '@kitman/components/src/Select/hoc/withServiceSuppliedOptions';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { SetState } from '@kitman/common/src/types/react';
import type { AdditionalMixpanelSessionData } from '@kitman/common/src/utils/TrackingData/src/types/calendar';

import { SessionFieldsTranslated as SessionFields } from './SessionFields';
import { CommonFieldsTranslated as CommonFields } from '../common/CommonFields';
import { OrgCustomFieldsTranslated as OrgCustomFields } from '../common/OrgCustomFields';
import { EventConditionFieldsTranslated as EventConditionFields } from '../common/EventConditionFields';
import { DescriptionFieldTranslated as DescriptionField } from '../common/DescriptionField';
import WorkloadUnitFields from '../common/WorkloadUnitFields';
import { GameDaySelectTranslated as GameDaySelect } from './GameDaySelect';
import SectionHeading from '../common/SectionHeading';
import style from '../../style';
import type {
  EventSessionFormData,
  EventSessionFormValidity,
  EditEventPanelMode,
  OnUpdateEventStartTime,
  OnUpdateEventDuration,
  OnUpdateEventDate,
  OnUpdateEventTimezone,
  OnUpdateEventTitle,
  OnUpdateEventDetails,
} from '../../types';

export type Props = {
  event: EventSessionFormData,
  panelMode: EditEventPanelMode,
  eventValidity: EventSessionFormValidity,
  canManageWorkload: boolean,
  onUpdateEventStartTime: OnUpdateEventStartTime,
  onUpdateEventDuration: OnUpdateEventDuration,
  onUpdateEventDate: OnUpdateEventDate,
  onUpdateEventTimezone: OnUpdateEventTimezone,
  onUpdateEventTitle: OnUpdateEventTitle,
  onUpdateEventDetails: OnUpdateEventDetails,
  onDataLoadingStatusChanged: StatusChangedCallback,
  setAdditionalMixpanelSessionData: SetState<AdditionalMixpanelSessionData>,
  isOpen: boolean,
};

const SessionLayout = (props: I18nProps<Props>) => {
  const isPlanDuplicationAllowed =
    props.panelMode === 'DUPLICATE' &&
    !(
      window.getFlag('planning-tab-sessions') &&
      window.getFlag('selection-tab-displaying-in-session')
    ) &&
    !window.getFlag('pac-event-sidepanel-sessions-games-show-athlete-dropdown');

  const OppositionSelect = useMemo(
    () =>
      withSelectServiceSuppliedOptions(Select, getTeams, {
        dataId: 'team_id',
        onStatusChangedCallback: props.onDataLoadingStatusChanged,
      }),
    [props.onDataLoadingStatusChanged]
  );

  const VenueSelect = useMemo(
    () =>
      withSelectServiceSuppliedOptions(Select, () => getVenueTypes(true), {
        dataId: 'venue_type_id',
        onStatusChangedCallback: props.onDataLoadingStatusChanged,
      }),
    []
  );

  const createDuplicateLabel = () => {
    let participantLabel = '';
    if (props.event.athlete_events_count != null) {
      participantLabel = `(${props.event.athlete_events_count})`;
    }
    return `${props.t('Duplicate participant list')} ${participantLabel}`;
  };

  return (
    <div>
      <div css={style.singleColumnGrid}>
        <SessionFields
          event={props.event}
          eventValidity={props.eventValidity}
          panelMode={props.panelMode}
          canManageWorkload={props.canManageWorkload}
          onUpdateEventDetails={props.onUpdateEventDetails}
          onUpdateEventTitle={props.onUpdateEventTitle}
          onDataLoadingStatusChanged={props.onDataLoadingStatusChanged}
          setAdditionalMixpanelSessionData={
            props.setAdditionalMixpanelSessionData
          }
        />
      </div>
      <div css={style.threeColumnGrid}>
        <CommonFields
          event={props.event}
          panelMode={props.panelMode}
          eventValidity={props.eventValidity}
          allowEditTitle
          onUpdateEventStartTime={props.onUpdateEventStartTime}
          onUpdateEventDuration={props.onUpdateEventDuration}
          onUpdateEventDate={props.onUpdateEventDate}
          onUpdateEventTimezone={props.onUpdateEventTimezone}
          onUpdateEventTitle={props.onUpdateEventTitle}
          onUpdateEventDetails={props.onUpdateEventDetails}
          onDataLoadingStatusChanged={props.onDataLoadingStatusChanged}
        />
      </div>
      {window.getFlag(
        'event-collection-show-sports-specific-workload-units'
      ) && (
        <div
          css={style.threeColumnGrid}
          data-testid="SessionLayout|WorkloadUnitFields"
        >
          <WorkloadUnitFields
            event={props.event}
            onUpdateEventDetails={props.onUpdateEventDetails}
            onDataLoadingStatusChanged={props.onDataLoadingStatusChanged}
          />
        </div>
      )}

      <div
        css={style.singleColumnGrid}
        data-testid="SessionLayout|DescriptionField"
      >
        <DescriptionField
          description={props.event.description}
          onUpdateEventDetails={props.onUpdateEventDetails}
          maxLength={250}
        />
      </div>
      {isPlanDuplicationAllowed && (
        <div
          css={style.duplicateParticipants}
          data-testid="duplicateParticipants"
        >
          <Checkbox
            name="duplicateParticipants"
            id="duplicateParticipants"
            label={createDuplicateLabel()}
            isChecked={props.event.are_participants_duplicated || false}
            kitmanDesignSystem
            toggle={({ checked }) => {
              props.onUpdateEventDetails({
                are_participants_duplicated: checked,
              });
            }}
          />
        </div>
      )}
      <div css={style.singleColumnGrid}>
        <div css={style.separator} />
      </div>
      <div css={style.twoColumnGrid}>
        <SectionHeading
          text={props.t('Additional details')}
          secondaryText={
            window.getFlag('planning-custom-org-event-details') ||
            window.getFlag('surface-type-mandatory-sessions')
              ? null
              : `(${props.t('Optional')})`
          }
        />

        {!window.featureFlags['calendar-hide-gameday-field'] && (
          <GameDaySelect
            gameDayMinus={props.event.game_day_minus}
            gameDayPlus={props.event.game_day_plus}
            onUpdateEventDetails={props.onUpdateEventDetails}
          />
        )}
        {window.getFlag('planning-custom-org-event-details') && (
          <>
            <OrgCustomFields
              event={props.event}
              eventValidity={props.eventValidity}
              onUpdateEventDetails={props.onUpdateEventDetails}
              onDataLoadingStatusChanged={props.onDataLoadingStatusChanged}
              isOpen={props.isOpen}
            />
            {props.event.session_type?.isJointSessionType && (
              <>
                <OppositionSelect
                  label={props.t('Opposition')}
                  onChange={(value) => {
                    props.onUpdateEventDetails({ team_id: value });
                  }}
                  value={props.event.team_id}
                  invalid={props.eventValidity.team_id?.isInvalid}
                  data-testid="SessionLayout|Opposition"
                />
                {window.featureFlags['nfl-2024-new-questions'] && (
                  <VenueSelect
                    label={props.t('Home or Away')}
                    onChange={(value) => {
                      props.onUpdateEventDetails({ venue_type_id: value });
                    }}
                    invalid={props.eventValidity.venue_type_id?.isInvalid}
                    value={props.event.venue_type_id}
                    data-testid="SessionLayout|VenueType"
                    menuPlacement="top"
                  />
                )}
              </>
            )}
          </>
        )}
        {window.featureFlags['mls-emr-advanced-options'] && (
          <EventConditionFields
            event={props.event}
            eventValidity={props.eventValidity}
            onUpdateEventDetails={props.onUpdateEventDetails}
            onDataLoadingStatusChanged={props.onDataLoadingStatusChanged}
          />
        )}
      </div>
    </div>
  );
};

export default SessionLayout;
export const SessionLayoutTranslated: ComponentType<Props> =
  withNamespaces()(SessionLayout);
