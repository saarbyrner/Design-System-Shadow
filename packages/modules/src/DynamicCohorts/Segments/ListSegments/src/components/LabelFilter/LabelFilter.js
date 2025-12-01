// @flow
import { withNamespaces } from 'react-i18next';
import type { Translation } from '@kitman/common/src/types/i18n';
import { setFilter } from '@kitman/modules/src/DynamicCohorts/Segments/ListSegments/redux/slices/manageSegmentsSlice';
import { Select } from '@kitman/components';
import { useGetAllLabelsQuery } from '@kitman/modules/src/OrganisationSettings/src/components/DynamicCohorts/ManageLabels/redux/services/labelsApi';
import { useFilter } from '@kitman/modules/src/DynamicCohorts/shared/utils/hooks/useFilter';
import { manageSegmentsStateKey } from '@kitman/modules/src/DynamicCohorts/shared/utils/consts';
import styles from '@kitman/modules/src/DynamicCohorts/shared/styles';

const LabelFilter = ({ t }: { t: Translation }) => {
  const { data: labelOptions = [], isFetching: isLabelQueryLoading } =
    useGetAllLabelsQuery();
  const { filter: labelsFilter, setFilter: setLabelsFilter } = useFilter(
    'labels',
    manageSegmentsStateKey,
    setFilter
  );

  return (
    <div css={styles.labelFilterLength}>
      <Select
        placeholder={t('Athlete labels')}
        options={labelOptions.map((label) => ({
          value: label.id,
          label: label.name,
        }))}
        value={labelsFilter}
        onChange={(selection) => setLabelsFilter(selection)}
        isLoading={isLabelQueryLoading}
        isMulti
      />
    </div>
  );
};
export const LabelFilterTranslated = withNamespaces()(LabelFilter);
export default LabelFilter;
