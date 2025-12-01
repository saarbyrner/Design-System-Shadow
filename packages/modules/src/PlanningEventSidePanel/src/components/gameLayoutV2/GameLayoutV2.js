// @flow
import { useState, useEffect } from 'react';
import { withNamespaces } from 'react-i18next';

import { useGetActiveSquadQuery } from '@kitman/common/src/redux/global/services/globalApi';
import { colors } from '@kitman/common/src/variables';
import { Accordion, Checkbox, InputText } from '@kitman/components';
import { defaultMapToOptions } from '@kitman/components/src/Select/utils';
import type { Game } from '@kitman/common/src/types/Event';
import { type Squad } from '@kitman/services/src/services/getActiveSquad';
import type { StatusChangedCallback } from '@kitman/components/src/Select/hoc/withServiceSuppliedOptions';
import type { I18nProps } from '@kitman/common/src/types/i18n';

import { GameFieldsV2Translated as GameFieldsV2 } from './GameFieldsV2';
import CommonFieldsV2 from './CommonFieldsV2';
import type {
  EventGameFormData,
  EventGameFormValidity,
  EditEventPanelMode,
  EventFormData,
  EventSessionFormData,
  OnUpdateEventStartTime,
  OnUpdateEventDuration,
  OnUpdateEventDate,
  OnUpdateEventTimezone,
  OnUpdateEventTitle,
  OnUpdateEventDetails,
} from '../../types';
import style from './style';

export type SquadData = [
  {
    value: number,
    label: string,
    duration?: number,
    is_default?: number,
    created_by?: number,
    created: string,
    updated: string,
    sport_id?: number,
  }
];
const initialData = {
  value: 0,
  label: '',
  created: '',
  updated: '',
};
export type Props = {
  event: Game & EventGameFormData & EventFormData & EventSessionFormData,
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

const GameLayoutV2 = (props: I18nProps<Props>) => {
  const [squad, setSquad] = useState([initialData]);

  const {
    data: userCurrentSquad,
    isSuccess: isSquadQuerySuccess,
  }: { data: Squad, isSuccess: boolean } = useGetActiveSquadQuery();

  useEffect(() => {
    let mounted = true;
    if (mounted && isSquadQuerySuccess && userCurrentSquad) {
      setSquad(defaultMapToOptions([userCurrentSquad]));
    }

    return () => {
      mounted = false;
    };
  }, [userCurrentSquad, isSquadQuerySuccess]);

  return (
    <div>
      <div>
        <CommonFieldsV2
          event={props.event}
          panelMode={props.panelMode}
          eventValidity={props.eventValidity}
          onUpdateEventStartTime={props.onUpdateEventStartTime}
          onUpdateEventDuration={props.onUpdateEventDuration}
          onUpdateEventDate={props.onUpdateEventDate}
          onUpdateEventTimezone={props.onUpdateEventTimezone}
          onUpdateEventManualLocation={props.onUpdateEventTitle}
          onUpdateEventDetails={props.onUpdateEventDetails}
        />
      </div>

      <div css={style.separator} />
      <div css={style.singleColumnGrid}>
        <Accordion
          titleColour={colors.grey_200}
          isOpen
          title="Game details"
          iconAlign="right"
          content={
            <div>
              <GameFieldsV2
                event={props.event}
                eventValidity={props.eventValidity}
                onUpdateEventDetails={props.onUpdateEventDetails}
                onDataLoadingStatusChanged={props.onDataLoadingStatusChanged}
                squad={squad}
              />
            </div>
          }
        />
      </div>
      <div css={style.separator} />

      <div css={style.singleColumnGrid}>
        <Accordion
          isOpen
          title="Additional details"
          iconAlign="right"
          content={
            <div css={style.addTopMargin}>
              <div css={style.singleColumnGrid}>
                <Checkbox
                  name="createTurnaroundMarker"
                  id="createTurnaroundMarker"
                  label={props.t('Create Turnaround Marker')}
                  isChecked={props.event.turnaround_fixture ?? false}
                  kitmanDesignSystem
                  toggle={(data) => {
                    props.onUpdateEventDetails({
                      turnaround_fixture: data.checked,
                    });
                  }}
                  data-testid="GameFields|CreateTurnaroundMarker"
                />
              </div>
              <div css={style.additionalDetailsColumnGrid}>
                <div css={style.fullWidthRow}>
                  <InputText
                    placeholder={props.t('Turnaround prefix')}
                    onValidation={({ value }) => {
                      if (value !== props.event.turnaround_prefix) {
                        props.onUpdateEventDetails({
                          turnaround_prefix: value,
                        });
                      }
                    }}
                    value={props.event.turnaround_prefix || ''}
                    maxLength={2}
                    showRemainingChars={false}
                    showCharsLimitReached={false}
                    disabled={!props.event.turnaround_fixture}
                    kitmanDesignSystem
                    invalid={props.eventValidity.turnaround_prefix?.isInvalid}
                    data-testid="GameFields|TurnaroundPrefix"
                  />
                </div>
              </div>
            </div>
          }
        />
      </div>
    </div>
  );
};

export const GameLayoutV2Translated = withNamespaces()(GameLayoutV2);
export default GameLayoutV2;
