// @flow
import getActivityTypes from '@kitman/modules/src/PlanningHub/src/services/getActivityTypes';
import getActivityTypeDeletionAvailability from '@kitman/modules/src/PlanningHub/src/services/getActivityTypeDeletionAvailability';
import type { Squads } from '@kitman/services/src/services/getSquads';
import { AppStatus } from '@kitman/components';
import saveActivityTypes from '@kitman/modules/src/PlanningHub/src/services/saveActivityTypes';
import type { ActivityTypeCategories } from '@kitman/services/src/services/getActivityTypeCategories';
import { ActivityTypeHeaderTranslated as ActivityTypeHeader } from './ActivityTypeHeader';
import { ActivityTypeTableTranslated as ActivityTypeTable } from './ActivityTypeTable';
import { ActivityTypeDeleteModalTranslated as ActivityTypeDeleteModal } from './ActivityTypeDeleteModal';
import useSettings from '../hooks/useSettings';
import useDeletionAvailability from '../hooks/useDeletionAvailability';
import styles from '../styles/sections';

type Props = {
  activityTypeCategoriesEnabled: boolean,
  activityTypeCategories: ?ActivityTypeCategories,
  squads: Squads,
};

const ActivityType = (props: Props) => {
  const {
    requestStatus: activityTypeRequestStatus,
    items,
    view,
    isSavingAllowed,
    isValidationCheckAllowed,
    isDeleteModalOpen,
    changeActivityCategory,
    changeView,
    changeName,
    changeSquads,
    cancelEdit,
    saveEdit,
    deleteItem,
    addNewItem,
    deleteNewItem,
    showDeleteModal,
    hideDeleteModal,
  } = useSettings({
    activityTypeCategoriesEnabled: props.activityTypeCategoriesEnabled,
    getRequest: getActivityTypes,
    postRequest: saveActivityTypes,
    withSquads: true,
  });

  const {
    requestStatus: deletionAvailabilityRequestStatus,
    deletableItemId: deletableActivityTypeId,
    deletionAvailability,
    getDeletionAvailability,
  } = useDeletionAvailability();

  return (
    <div
      css={styles.section}
      className="organisationPlanningSettings__section organisationPlanningSettings__section--activityType"
    >
      {activityTypeRequestStatus === 'FAILURE' ||
      deletionAvailabilityRequestStatus === 'FAILURE' ? (
        <AppStatus status="error" message={null} isEmbed />
      ) : (
        <>
          <ActivityTypeHeader
            view={view}
            isSavingAllowed={isSavingAllowed}
            onSaveEdit={saveEdit}
            onEditMode={() => changeView('EDIT')}
            onCancelEdit={cancelEdit}
            onAddNew={() => {
              changeView('EDIT');
              addNewItem();
            }}
          />
          <ActivityTypeTable
            isLoading={activityTypeRequestStatus === 'PENDING'}
            view={view}
            activityTypes={items}
            activityTypeCategoriesEnabled={props.activityTypeCategoriesEnabled}
            activityTypeCategories={props.activityTypeCategories}
            squads={props.squads}
            isValidationCheckAllowed={isValidationCheckAllowed}
            onChangeActivityCategory={changeActivityCategory}
            onChangeName={changeName}
            onChangeSquads={changeSquads}
            onAddNew={addNewItem}
            onDeleteNew={deleteNewItem}
            onDelete={(activityTypeId) => {
              getDeletionAvailability(
                getActivityTypeDeletionAvailability,
                activityTypeId
              ).then(showDeleteModal);
            }}
          />
          <ActivityTypeDeleteModal
            isOpen={isDeleteModalOpen}
            deletionAvailability={deletionAvailability}
            onDelete={() => deleteItem(deletableActivityTypeId)}
            onClose={hideDeleteModal}
          />
        </>
      )}
    </div>
  );
};

export default ActivityType;
