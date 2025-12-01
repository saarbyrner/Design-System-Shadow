// @flow
import { withNamespaces } from 'react-i18next';
import type { Translation } from '@kitman/common/src/types/i18n';
import { useGetPermissionsQuery } from '@kitman/common/src/redux/global/services/globalApi';
import useLocationAssign from '@kitman/common/src/hooks/useLocationAssign';
import { HeaderTranslated as Header } from '@kitman/modules/src/DynamicCohorts/shared/components/Header';
import styles from '@kitman/modules/src/DynamicCohorts/shared/styles';
import { setFilter } from '@kitman/modules/src/DynamicCohorts/Segments/ListSegments/redux/slices/manageSegmentsSlice';
import { FiltersTranslated as CommonFilters } from '@kitman/modules/src/DynamicCohorts/shared/components/Filters';
import { SegmentsGridTranslated as SegmentsGrid } from './components/SegmentsGrid/SegmentsGrid';
import { manageSegmentsStateKey } from '../../../shared/utils/consts';
import { LabelFilterTranslated as LabelsFilter } from './components/LabelFilter/LabelFilter';

const ListSegmentsApp = ({ t }: { t: Translation }) => {
  const { data: permissions, isSuccess } = useGetPermissionsQuery();
  const locationAssign = useLocationAssign();

  if (isSuccess && permissions.settings.canViewSegments) {
    return (
      <div css={styles.container}>
        <Header
          pageTitle={t('Athlete Groups')}
          buttonTitle={t('Create athlete group')}
          canCreate={permissions.settings.isSegmentsAdmin}
          onClickCreate={() => locationAssign('/administration/groups/new')}
        />
        <div css={styles.filterContainer} data-testid="AllFilters">
          <CommonFilters
            stateKey={manageSegmentsStateKey}
            setFilter={setFilter}
          />
          {isSuccess && permissions.settings.canViewLabels && <LabelsFilter />}
        </div>
        <SegmentsGrid canEditSegment={permissions.settings.isSegmentsAdmin} />
      </div>
    );
  }
  return null;
};

export const ListSegmentsAppTranslated = withNamespaces()(ListSegmentsApp);
export default ListSegmentsApp;
