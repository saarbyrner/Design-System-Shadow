// @flow
import { withNamespaces } from 'react-i18next';
import type { Translation } from '@kitman/common/src/types/i18n';
import { useDispatch } from 'react-redux';
import { useGetPermissionsQuery } from '@kitman/common/src/redux/global/services/globalApi';
import { manageLabelsStateKey } from '@kitman/modules/src/DynamicCohorts/shared/utils/consts';
import { FiltersTranslated as SharedFilters } from '@kitman/modules/src/DynamicCohorts/shared/components/Filters';
import { LabelModalTranslated as LabelModal } from '@kitman/modules/src/DynamicCohorts/Labels/ListLabels/src/components/LabelModal';
import { LabelsGridTranslated as LabelsGrid } from '@kitman/modules/src/DynamicCohorts/Labels/ListLabels/src/components/LabelsGrid';
import {
  onOpenLabelModal,
  setFilter,
} from '@kitman/modules/src/DynamicCohorts/Labels/ListLabels/redux/slices/manageLabelsSlice';
import { HeaderTranslated as Header } from '@kitman/modules/src/DynamicCohorts/shared/components/Header';
import styles from '@kitman/modules/src/DynamicCohorts/shared/styles';

const ListLabelsApp = ({ t }: { t: Translation }) => {
  const dispatch = useDispatch();
  const { data: permissions, isSuccess: isPermissionsSuccess } =
    useGetPermissionsQuery();

  if (isPermissionsSuccess && permissions.settings.canViewLabels) {
    return (
      <div css={styles.container}>
        <Header
          pageTitle={t('Athlete Labels')}
          buttonTitle={t('Create athlete label')}
          canCreate={permissions.settings.isLabelsAdmin}
          onClickCreate={() => {
            dispatch(onOpenLabelModal());
          }}
        />
        <SharedFilters stateKey={manageLabelsStateKey} setFilter={setFilter} />
        <LabelsGrid isLabelsAdmin={permissions.settings.isLabelsAdmin} />
        <LabelModal />
      </div>
    );
  }
  return <></>;
};

export const ListLabelsAppTranslated = withNamespaces()(ListLabelsApp);
export default ListLabelsApp;
