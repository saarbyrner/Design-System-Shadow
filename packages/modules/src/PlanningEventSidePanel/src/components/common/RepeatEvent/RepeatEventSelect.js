// @flow
import moment from 'moment-timezone';
import { withNamespaces } from 'react-i18next';
import { useMemo, useEffect, type ComponentType, useState } from 'react';
import { type RRule } from 'rrule';

import { Select } from '@kitman/components';
import { fullWidthMenuCustomStyles } from '@kitman/components/src/Select';
import { type I18nProps } from '@kitman/common/src/types/i18n';
import { eventTypePermaIds } from '@kitman/services/src/services/planning/getEventLocations';
import { type EventType } from '@kitman/modules/src/CalendarPage/src/types';
import { type RecurrencePreferencesOptions } from '@kitman/services/src/services/planning/getRecurrencePreferences';
import { getHumanReadableEventType } from '@kitman/common/src/utils/events';
import { type CalendarEventsPanelMode } from '@kitman/modules/src/CalendarPage/src/components/CalendarEventsPanel/types';

import {
  getOptions,
  transformCustomRRuleToItsNonCustomEquivalent,
} from './utils/options-helpers';
import { customOptionValue, defaultOptionValue } from './utils/consts';
import { RepeatEventCustomConfigModalTranslated as RepeatEventCustomConfigModal } from './RepeatEventCustomConfigModal';
import { isRRuleCustom } from './RepeatEventCustomConfigModal/utils/config-helpers';
import RepeatEventRepeatableList from './RepeatEventRepeatableList';

type Props = {
  eventDate: typeof moment,
  onChange: (selectedRule: RRule) => void,
  updateRecurrencePreferences: (
    selectedRecurrencePreferences: ?RecurrencePreferencesOptions
  ) => void,
  value?: RRule,
  selectedRecurrencePreferences: ?RecurrencePreferencesOptions,
  eventType: EventType,
  isParentEvent: boolean,
  hasAthletes: boolean,
  panelMode: CalendarEventsPanelMode,
};

export type TranslatedProps = I18nProps<Props>;

const RepeatEventSelect = ({
  t,
  value,
  onChange,
  updateRecurrencePreferences,
  eventDate,
  selectedRecurrencePreferences,
  eventType,
  isParentEvent,
  hasAthletes,
  panelMode,
}: TranslatedProps) => {
  const [isCustomConfigModalOpen, setIsCustomConfigModalOpen] = useState(false);
  const [customConfigRRule, setCustomConfigRRule] = useState<RRule | null>(
    null
  );
  const options = useMemo(
    // Date needs to be in UTC for RRule to function properly
    // https://github.com/jkbrzt/rrule?tab=readme-ov-file#important-use-utc-dates
    () => getOptions(eventDate, t, customConfigRRule),
    [t, eventDate, customConfigRRule]
  );

  useEffect(() => {
    if (
      value?.origOptions &&
      value !== customOptionValue &&
      isRRuleCustom(value, t, eventDate)
    ) {
      setCustomConfigRRule(value);
    }
  }, [value, t]);

  return (
    <>
      <RepeatEventCustomConfigModal
        onDone={(selectedCustomConfigRRule) => {
          if (isRRuleCustom(selectedCustomConfigRRule, t, eventDate)) {
            setCustomConfigRRule(selectedCustomConfigRRule);
            onChange(selectedCustomConfigRRule);
          } else {
            const transformedRRule =
              transformCustomRRuleToItsNonCustomEquivalent(
                selectedCustomConfigRRule,
                t,
                eventDate
              );
            onChange(transformedRRule);
          }
        }}
        isOpen={isCustomConfigModalOpen}
        onClose={() => setIsCustomConfigModalOpen(false)}
        eventDate={eventDate}
        previousConfigRRule={
          value === customOptionValue ? null : customConfigRRule
        }
        isParentEvent={isParentEvent}
        panelMode={panelMode}
      />
      <Select
        label={t('Repeats')}
        value={value ?? defaultOptionValue}
        options={options}
        customSelectStyles={fullWidthMenuCustomStyles}
        dataAttribute={`RepeatEventSelect|Repeat ${getHumanReadableEventType(
          eventType
        )}`}
        onChange={(option) => {
          if (
            option === customOptionValue ||
            (option === customConfigRRule && customConfigRRule !== null)
          ) {
            setIsCustomConfigModalOpen(true);
          }
          onChange(option);
        }}
      />
      {eventType === eventTypePermaIds.session.type && value && (
        <RepeatEventRepeatableList
          selectedRecurrencePreferences={selectedRecurrencePreferences}
          updateRecurrencePreferences={updateRecurrencePreferences}
          eventDate={eventDate}
          hasAthletes={hasAthletes}
          panelMode={panelMode}
        />
      )}
    </>
  );
};

export const RepeatEventSelectTranslated: ComponentType<Props> =
  withNamespaces()(RepeatEventSelect);
export default RepeatEventSelect;
