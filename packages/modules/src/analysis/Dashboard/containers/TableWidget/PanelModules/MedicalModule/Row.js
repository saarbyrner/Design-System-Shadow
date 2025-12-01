// @flow
import { useSelector, useDispatch } from 'react-redux';
import { useOrganisation } from '@kitman/common/src/contexts/OrganisationContext';
import codingSystemKeys from '@kitman/common/src/variables/codingSystemKeys';
import { MedicalDataTranslated as MedicalDataComponent } from '@kitman/modules/src/analysis/Dashboard/components/PanelModules/components//MedicalModule/MedicalData';
import { TypeSelectorTranslated as TypeSelector } from '@kitman/modules/src/analysis/Dashboard/components/PanelModules/components/MedicalModule/TypeSelector';

import {
  setTableRowDataSourceType,
  setTableRowTitle,
  setTableRowSubtype,
} from '@kitman/modules/src/analysis/Dashboard/redux/actions/tableWidget/panel';
import { setTableElementFilter } from '@kitman/modules/src/analysis/Dashboard/redux/actions/tableWidget';

export const MedicalData = () => {
  const dispatch = useDispatch();
  const {
    dataSource: { type, name, subtypes },
    filters,
  } = useSelector((state) => state.tableWidget.rowPanel);

  return (
    <MedicalDataComponent
      title={name}
      type={type}
      onSetColumnTitle={(newTitle) => dispatch(setTableRowTitle(newTitle))}
      onChangeSubType={(subtypeKey, value) =>
        dispatch(setTableRowSubtype(subtypeKey, value))
      }
      onChangeFilterSubType={(subtypeKey, value) => {
        dispatch(setTableElementFilter('row', subtypeKey, value));
      }}
      filterSubTypes={filters}
      subtypes={subtypes || {}}
      direction="row"
    />
  );
};

export default () => {
  const dispatch = useDispatch();
  const { type } = useSelector(
    (state) => state.tableWidget.rowPanel.dataSource
  );
  const { organisation } = useOrganisation();
  const isCI =
    organisation.coding_system_key === codingSystemKeys.CLINICAL_IMPRESSIONS;

  return (
    <TypeSelector
      selectedType={type}
      setSelectedType={(newType) =>
        dispatch(setTableRowDataSourceType(newType))
      }
      hideIllness={isCI}
    />
  );
};
