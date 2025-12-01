// @flow
import { withNamespaces } from 'react-i18next';
import { useMemo, type ComponentType } from 'react';
import moment from 'moment-timezone';

import CheckboxList, {
  type CheckboxListItem,
} from '@kitman/components/src/CheckboxList';
import { type I18nProps } from '@kitman/common/src/types/i18n';
import { type CalendarEventsPanelMode } from '@kitman/modules/src/CalendarPage/src/components/CalendarEventsPanel/types';

import styles, { checkboxLiStyleOverride } from './utils/styles';
import { getRepeatOnTranslations } from './utils/helpers';
import { type RepeatOnDays, type ItemValueArray } from './utils/types';
import { getDayString } from './utils/config-helpers';

type CheckboxListItems = Array<CheckboxListItem>;

const {
  repeatOn: { container, text },
} = styles;

type Props = {
  repeatOnDays: RepeatOnDays,
  onChangeDays: (chosenDays: ItemValueArray) => void,
  eventDate: typeof moment,
  isParentEvent: boolean,
  panelMode: CalendarEventsPanelMode,
};

const RepeatOn = ({
  t,
  repeatOnDays,
  onChangeDays,
  eventDate,
  isParentEvent,
  panelMode,
}: I18nProps<Props>) => {
  const { repeatOn, ...restOfDaysTranslations } = useMemo(
    () => getRepeatOnTranslations(t),
    [t]
  );

  const options: CheckboxListItems = Object.entries(restOfDaysTranslations).map(
    ([dayKey, dayTranslation]): CheckboxListItem => ({
      // $FlowIgnore[incompatible-use]: dayTranslation is always a string, but flow thinks it's 'mixed'
      label: dayTranslation.at(0), // only the first letter
      value: dayKey,
      // Disabling checkbox when:
      // - Day is day of event creation AND
      // - Editing the first recurrence
      // - OR creating a new event from tooltip menu or from the calendar
      isDisabled:
        ((panelMode === 'EDIT' && isParentEvent) ||
          panelMode === 'CREATE' ||
          panelMode === 'VIEW_TEMPLATES') &&
        dayKey === getDayString(eventDate),
    })
  );

  const values: ItemValueArray = Object.entries(repeatOnDays).reduce(
    (prevArr, [dayKey, isDaySelected]) => {
      if (isDaySelected || dayKey === getDayString(eventDate)) {
        return [...prevArr, dayKey];
      }
      return prevArr;
    },
    []
  );

  return (
    <div css={container}>
      <p css={text}>{repeatOn}</p>
      <CheckboxList
        items={options}
        values={values}
        kitmanDesignSystem
        onChange={onChangeDays}
        liStyleOverride={checkboxLiStyleOverride}
      />
    </div>
  );
};

export const RepeatOnTranslated: ComponentType<Props> =
  withNamespaces()(RepeatOn);
export default RepeatOn;
