// @flow
import { withNamespaces } from 'react-i18next';
import type { ComponentType } from 'react';

import { Checkbox } from '@kitman/components';
import type { StatusChangedCallback } from '@kitman/components/src/Select/hoc/withServiceSuppliedOptions';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { GameFieldsTranslated as GameFields } from './GameFields';
import { CommonFieldsTranslated as CommonFields } from '../common/CommonFields';
import { OrgCustomFieldsTranslated as OrgCustomFields } from '../common/OrgCustomFields';
import WorkloadUnitFields from '../common/WorkloadUnitFields';
import { EventConditionFieldsTranslated as EventConditionFields } from '../common/EventConditionFields';
import { DescriptionFieldTranslated as DescriptionField } from '../common/DescriptionField';
import SectionHeading from '../common/SectionHeading';
import style from '../../style';
import type {
  EventGameFormData,
  EventGameFormValidity,
  EditEventPanelMode,
  OnUpdateEventStartTime,
  OnUpdateEventDuration,
  OnUpdateEventDate,
  OnUpdateEventTimezone,
  OnUpdateEventTitle,
  OnUpdateEventDetails,
} from '../../types';

export type Props = {
  event: EventGameFormData,
  panelMode: EditEventPanelMode,
  eventValidity: EventGameFormValidity,
  onUpdateEventStartTime: OnUpdateEventStartTime,
  onUpdateEventDuration: OnUpdateEventDuration,
  onUpdateEventDate: OnUpdateEventDate,
  onUpdateEventTimezone: OnUpdateEventTimezone,
  onUpdateEventTitle: OnUpdateEventTitle,
  onUpdateEventDetails: OnUpdateEventDetails,
  onDataLoadingStatusChanged: StatusChangedCallback,
};

const GameLayout = (props: I18nProps<Props>) => {
  return (
    <div>
      <div css={style.threeColumnGrid}>
        <CommonFields
          event={props.event}
          panelMode={props.panelMode}
          eventValidity={props.eventValidity}
          onUpdateEventStartTime={props.onUpdateEventStartTime}
          onUpdateEventDuration={props.onUpdateEventDuration}
          onUpdateEventDate={props.onUpdateEventDate}
          onUpdateEventTimezone={props.onUpdateEventTimezone}
          onUpdateEventTitle={props.onUpdateEventTitle}
          onUpdateEventDetails={props.onUpdateEventDetails}
          onDataLoadingStatusChanged={props.onDataLoadingStatusChanged}
        />
      </div>
      <div css={style.singleColumnGrid}>
        <GameFields
          event={props.event}
          eventValidity={props.eventValidity}
          onUpdateEventDetails={props.onUpdateEventDetails}
          onDataLoadingStatusChanged={props.onDataLoadingStatusChanged}
        />
      </div>
      {window.getFlag(
        'event-collection-show-sports-specific-workload-units'
      ) && (
        <div
          css={style.threeColumnGrid}
          data-testid="GameLayout|WorkloadUnitFields"
        >
          <WorkloadUnitFields
            event={props.event}
            onUpdateEventDetails={props.onUpdateEventDetails}
            onDataLoadingStatusChanged={props.onDataLoadingStatusChanged}
          />
        </div>
      )}

      {props.panelMode === 'DUPLICATE' && (
        <div css={style.duplicateParticipants}>
          <Checkbox
            name="duplicateParticipants"
            id="duplicateParticipants"
            label={props.t('Duplicate participants')}
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
      {(window.getFlag('planning-custom-org-event-details') ||
        window.featureFlags['mls-emr-advanced-options']) && (
        <div css={style.twoColumnGrid}>
          <SectionHeading
            text={props.t('Additional details')}
            secondaryText={
              window.getFlag('planning-custom-org-event-details')
                ? null
                : `(${props.t('Optional')})`
            }
          />
          {window.getFlag('planning-custom-org-event-details') && (
            <OrgCustomFields
              event={props.event}
              eventValidity={props.eventValidity}
              onUpdateEventDetails={props.onUpdateEventDetails}
              onDataLoadingStatusChanged={props.onDataLoadingStatusChanged}
            />
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
      )}
      <div
        css={style.singleColumnGrid}
        data-testid="GameLayout|DescriptionField"
      >
        <DescriptionField
          description={props.event.description}
          onUpdateEventDetails={props.onUpdateEventDetails}
          maxLength={250}
        />
      </div>
    </div>
  );
};

export default GameLayout;
export const GameLayoutTranslated: ComponentType<Props> =
  withNamespaces()(GameLayout);
