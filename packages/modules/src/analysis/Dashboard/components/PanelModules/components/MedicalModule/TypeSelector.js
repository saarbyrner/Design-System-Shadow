// @flow
import type { ComponentType } from 'react';
import { withNamespaces } from 'react-i18next';

import { SelectWrapper } from '@kitman/playbook/components';
import { SegmentedControl } from '@kitman/components';
import Panel from '@kitman/modules/src/analysis/Dashboard/components/TableWidget/components/Panel/index';

// Types
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { TableWidgetDataSource } from '@kitman/modules/src/analysis/Dashboard/components/TableWidget/types';

type Props = {
  selectedType: TableWidgetDataSource,
  setSelectedType: (selected: TableWidgetDataSource) => void,
  hideIllness?: boolean,
};

function TypeSelector({
  selectedType,
  setSelectedType,
  hideIllness,
  t,
}: I18nProps<Props>) {
  if (window.featureFlags['rep-medical-rehabs-source']) {
    const buttons = [{ value: 'MedicalInjury', label: t('Injuries') }];

    if (!hideIllness) {
      buttons.push({
        value: 'MedicalIllness',
        label: t('Illnesses'),
      });
    }

    buttons.push({
      value: 'RehabSessionExercise',
      label: t('Rehab exercises'),
    });

    return (
      <Panel.Field>
        <SelectWrapper
          label={t('Source')}
          onChange={(e) => {
            setSelectedType(e.target.value);
          }}
          options={buttons}
          value={selectedType}
        />
      </Panel.Field>
    );
  }

  const buttons = [{ value: 'MedicalInjury', name: t('Injuries') }];

  if (!hideIllness) {
    buttons.push({
      value: 'MedicalIllness',
      name: t('Illnesses'),
    });
  }
  return (
    <Panel.Field>
      <SegmentedControl
        data-testid="TypeSelector|SourceControl"
        label={t('Source')}
        selectedButton={selectedType}
        onClickButton={setSelectedType}
        width="inline"
        buttons={buttons}
      />
    </Panel.Field>
  );
}

export const TypeSelectorTranslated: ComponentType<Props> =
  withNamespaces()(TypeSelector);
export default TypeSelector;
