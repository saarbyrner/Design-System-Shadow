// @flow
import { Frequency, RRule } from 'rrule';
import { withNamespaces } from 'react-i18next';
import {
  useState,
  type ComponentType,
  useCallback,
  useMemo,
  useEffect,
} from 'react';
import moment from 'moment-timezone';

import { Modal, TextButton } from '@kitman/components';
import { type I18nProps } from '@kitman/common/src/types/i18n';
import { type CalendarEventsPanelMode } from '@kitman/modules/src/CalendarPage/src/components/CalendarEventsPanel/types';

import {
  getModalBaseTranslations,
  isInvalidNumberForNumericInput,
  isInvalidRepeatOnConfig,
} from './utils/helpers';
import styles from './utils/styles';
import { RepeatEveryTranslated as RepeatEvery } from './RepeatEvery';
import { RepeatOnTranslated as RepeatOn } from './RepeatOn';
import { EndsTranslated as Ends } from './Ends/index';
import {
  getDefaultCustomConfig,
  createRRuleFromModalConfig,
  createModalConfigFromRRule,
} from './utils/config-helpers';
import {
  type ItemValueArray,
  type RepeatOnDays,
  type CustomConfig,
  type EndsConfig,
} from './utils/types';

type Props = {
  eventDate: typeof moment,
  onDone: (rrule: RRule) => void,
  onClose: () => void,
  isOpen: boolean,
  previousConfigRRule: RRule | null,
  isParentEvent: boolean,
  panelMode: CalendarEventsPanelMode,
};

export type TranslatedProps = I18nProps<Props>;

const RepeatEventCustomConfigModal = ({
  t,
  eventDate,
  isOpen,
  onClose,
  onDone,
  previousConfigRRule,
  isParentEvent,
  panelMode,
}: TranslatedProps) => {
  const defaultCustomConfig = useMemo(
    () => getDefaultCustomConfig(eventDate),
    [eventDate]
  );
  const initialCustomConfig = useMemo(() => {
    if (previousConfigRRule) {
      return createModalConfigFromRRule(previousConfigRRule);
    }
    return defaultCustomConfig;
  }, [defaultCustomConfig, previousConfigRRule]);

  const [customConfig, setCustomConfig] = useState(initialCustomConfig);

  useEffect(() => {
    if (previousConfigRRule) {
      setCustomConfig(createModalConfigFromRRule(previousConfigRRule));
    } else setCustomConfig(defaultCustomConfig);
  }, [previousConfigRRule, defaultCustomConfig]);

  const closeModal = () => {
    onClose();
    setCustomConfig(defaultCustomConfig);
  };

  const translations = getModalBaseTranslations(t);

  const onChangeDays = useCallback((chosenDays: ItemValueArray) => {
    setCustomConfig((prev) => {
      const { repeatOnDays, ...rest }: CustomConfig = { ...prev };
      const newRepeatOnDays = Object.keys(repeatOnDays).reduce(
        (prevRepeatOnDays, dayKey) => {
          const isDaySelected = chosenDays.includes(dayKey);
          const localPrevRepeatOnDays = { ...prevRepeatOnDays };
          localPrevRepeatOnDays[dayKey] = isDaySelected;
          return localPrevRepeatOnDays;
        },
        ({}: RepeatOnDays)
      );
      return { ...rest, repeatOnDays: newRepeatOnDays };
    });
  }, []);

  const isFormInvalid = useMemo(() => {
    const after = customConfig.ends.after;
    const numberOfOccurrences = after.numberOfOccurrences;
    if (
      isInvalidNumberForNumericInput(customConfig.repeatEvery.interval) ||
      (after.isSelected &&
        numberOfOccurrences !== null &&
        isInvalidNumberForNumericInput(numberOfOccurrences))
    ) {
      return true;
    }
    if (
      customConfig.repeatEvery.frequency === Frequency.WEEKLY &&
      isInvalidRepeatOnConfig(customConfig.repeatOnDays)
    ) {
      return true;
    }
    return false;
  }, [customConfig]);

  return (
    <Modal
      isOpen={isOpen}
      onPressEscape={closeModal}
      width="small"
      additionalStyle={styles.modal}
      overlapSidePanel
    >
      <Modal.Title>{translations.title}</Modal.Title>
      <Modal.Content additionalStyle={styles.content}>
        <RepeatEvery
          repeatEveryConfig={customConfig.repeatEvery}
          onChangeInterval={(newIntervalString: string) =>
            setCustomConfig((prev) => {
              const localPrev: CustomConfig = { ...prev };

              const isNewIntervalStringValid = [
                newIntervalString === '',
                /^\d+$/.test(newIntervalString),
              ].some(Boolean);
              if (!isNewIntervalStringValid) return localPrev;

              localPrev.repeatEvery.interval = newIntervalString;
              return localPrev;
            })
          }
          onChangeFrequency={(newFrequency: Frequency) =>
            setCustomConfig((prev) => {
              const localPrev: CustomConfig = { ...prev };
              const currentFrequency = localPrev.repeatEvery.frequency;
              if (
                currentFrequency === Frequency.WEEKLY &&
                newFrequency !== Frequency.WEEKLY
              ) {
                localPrev.repeatOnDays = initialCustomConfig.repeatOnDays;
              }
              localPrev.repeatEvery.frequency = newFrequency;
              return localPrev;
            })
          }
        />
        {customConfig.repeatEvery.frequency === Frequency.WEEKLY && (
          <RepeatOn
            repeatOnDays={customConfig.repeatOnDays}
            onChangeDays={onChangeDays}
            eventDate={eventDate}
            isParentEvent={isParentEvent}
            panelMode={panelMode}
          />
        )}
        <Ends
          endsConfig={customConfig.ends}
          onChange={(newEndsConfig: EndsConfig) =>
            setCustomConfig((prev) => {
              const { ends, ...rest }: CustomConfig = { ...prev };
              return { ...rest, ends: newEndsConfig };
            })
          }
          eventDate={eventDate}
        />
      </Modal.Content>
      <Modal.Footer>
        <TextButton
          text={translations.cancel}
          kitmanDesignSystem
          onClick={closeModal}
          type="subtle"
        />
        <TextButton
          text={translations.done}
          kitmanDesignSystem
          onClick={() => {
            onDone(createRRuleFromModalConfig(customConfig, eventDate));
            closeModal();
          }}
          type="primary"
          isDisabled={isFormInvalid}
        />
      </Modal.Footer>
    </Modal>
  );
};

export const RepeatEventCustomConfigModalTranslated: ComponentType<Props> =
  withNamespaces()(RepeatEventCustomConfigModal);
export default RepeatEventCustomConfigModal;
