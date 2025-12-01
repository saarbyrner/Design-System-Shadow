// @flow
import { useCallback, useEffect, useState } from 'react';
import { withNamespaces } from 'react-i18next';

import { TextButton, Checkbox } from '@kitman/components';

import { DateRangeModuleTranslated as DateRangeModule } from '@kitman/modules/src/analysis/Dashboard/components/PanelModules/components/DateRangeModule';
import { isDateRangeValid } from '@kitman/modules/src/analysis/Dashboard/components/PanelModules/utils';
import Panel from '@kitman/modules/src/analysis/Dashboard/components/TableWidget/components/Panel';

// Types
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { DateRange } from '@kitman/common/src/types';

type Props = {
  onApply: Function,
  dateRange: ?DateRange,
  onSetDateRange: Function,
  onSetTimePeriod: Function,
  onSetTimePeriodLength: Function,
  onSetTimePeriodLengthOffset: Function,
  timePeriod: string,
  timePeriodLength: ?number,
  timePeriodLengthOffset: ?number,
  isLoading: boolean,
  isEditMode: boolean,
  isOpen: boolean,
};

function LongitudinalPanel(props: I18nProps<Props>) {
  const canApply = useCallback(() => {
    return (
      !props.isLoading &&
      isDateRangeValid(
        props.timePeriod,
        props.dateRange,
        props.timePeriodLength
      )
    );
  }, [
    props.isLoading,
    props.timePeriod,
    props.dateRange,
    props.timePeriodLength,
  ]);
  const [addAnother, setAddAnother] = useState(false);

  const onKeyDown = useCallback(
    ({ keyCode }) => {
      const RIGHT_ARROW_KEY_CODE = 39;

      if (keyCode === RIGHT_ARROW_KEY_CODE && canApply()) {
        props.onApply(addAnother);
      }
    },
    [props.onApply, addAnother, canApply]
  );

  useEffect(() => {
    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [props.isOpen, onKeyDown]);

  return (
    <Panel>
      <Panel.Content>
        <DateRangeModule
          data-testid="LongitudinalPanel|DateRangeModule"
          dateRange={props.dateRange}
          onSetDateRange={props.onSetDateRange}
          onSetTimePeriod={props.onSetTimePeriod}
          onSetTimePeriodLength={props.onSetTimePeriodLength}
          onSetTimePeriodLengthOffset={props.onSetTimePeriodLengthOffset}
          timePeriod={props.timePeriod}
          timePeriodLength={props.timePeriodLength}
          timePeriodLengthOffset={props.timePeriodLengthOffset}
        />
      </Panel.Content>
      <Panel.Loading isLoading={props.isLoading} />
      <Panel.Actions>
        {!props.isEditMode && (
          <Checkbox
            data-testid="LongitudinalPanel|AddAnother"
            id="add-another"
            name="add-another"
            isChecked={addAnother}
            toggle={() => setAddAnother(!addAnother)}
            label={props.t('Add another')}
            isLabelPositionedOnTheLeft
            kitmanDesignSystem
          />
        )}
        <TextButton
          data-testid="LongitudinalPanel|Apply"
          onClick={() => props.onApply(addAnother)}
          isDisabled={!canApply()}
          type="primary"
          text={props.t('Apply')}
          kitmanDesignSystem
        />
      </Panel.Actions>
    </Panel>
  );
}

export const LongitudinalPanelTranslated = withNamespaces()(LongitudinalPanel);
export default LongitudinalPanel;
