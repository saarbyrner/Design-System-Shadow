// @flow
import { useEffect, useRef } from 'react';
import { withNamespaces } from 'react-i18next';

import { InputTextField } from '@kitman/components';
import Panel from '@kitman/modules/src/analysis/Dashboard/components/TableWidget/components/Panel/index';
import { FiltersTranslated as Filters } from '@kitman/modules/src/analysis/Dashboard/components/PanelModules/components/MedicalModule/Filters';

// Types:
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type {
  TableWidgetDataSource,
  TableWidgetSourceSubtypes,
  TableElementFilters,
} from '@kitman/modules/src/analysis/Dashboard/components/TableWidget/types';

type Props = {
  title: string,
  type: TableWidgetDataSource,
  subtypes: TableWidgetSourceSubtypes,
  filterSubTypes: TableElementFilters,
  onChangeSubType: (subtypeKey: string, value: Array<string>) => void,
  onChangeFilterSubType: (subtypeKey: string, value: Array<number>) => void,
  onSetColumnTitle: (updatedTile: string) => void,
  direction: 'column' | 'row',
};
function MedicalData({
  t,
  type,
  title,
  onSetColumnTitle,
  ...props
}: I18nProps<Props>) {
  const previousTypeRef = useRef(type);

  useEffect(() => {
    if (type !== previousTypeRef.current || title === '' || !title) {
      previousTypeRef.current = type;

      const titleLookup = (dataSource): string => {
        switch (dataSource) {
          case 'MedicalIllness':
            return t('Illnesses');
          case 'MedicalInjury':
            return t('Injuries');
          case 'RehabSessionExercise':
            return t('Rehab exercises');
          default:
            return t('Title');
        }
      };

      onSetColumnTitle(titleLookup(type));
    }
  }, [type, title, t, onSetColumnTitle]);

  return (
    <>
      <Filters
        selectedType={type}
        direction={props.direction}
        subtypes={props.subtypes}
        onChangeSubType={props.onChangeSubType}
        onChangeFilterSubType={props.onChangeFilterSubType}
        filterSubTypes={props.filterSubTypes}
      />
      <Panel.Divider />
      <Panel.Field>
        <InputTextField
          data-testid="MedicalData|ColumnTitle"
          label={props.direction === 'row' ? t('Row Title') : t('Column Title')}
          inputType="text"
          value={title}
          onChange={(e) => onSetColumnTitle(e.currentTarget.value)}
          kitmanDesignSystem
        />
      </Panel.Field>
    </>
  );
}

export const MedicalDataTranslated = withNamespaces()(MedicalData);
export default MedicalData;
