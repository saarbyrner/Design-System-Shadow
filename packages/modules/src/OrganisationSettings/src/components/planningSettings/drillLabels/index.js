// @flow
import getDrillLabels from '@kitman/modules/src/PlanningHub/src/services/getDrillLabels';
import saveDrillLabels from '@kitman/modules/src/PlanningHub/src/services/saveDrillLabels';
import type { Squads } from '@kitman/services/src/services/getSquads';
import getDrillLabelDeletionAvailability from '@kitman/modules/src/PlanningHub/src/services/getDrillLabelDeletionAvailability';
import { AppStatus } from '@kitman/components';
import { DrillLabelsHeaderTranslated as DrillLabelsHeader } from './DrillLabelsHeader';
import { DrillLabelsTableTranslated as DrillLabelsTable } from './DrillLabelsTable';
import { DrillLabelsDeleteModalTranslated as DrillLabelsDeleteModal } from './DrillLabelsDeleteModal';
import useSettings from '../hooks/useSettings';
import useDeletionAvailability from '../hooks/useDeletionAvailability';
import styles from '../styles/sections';

type Props = { squads: Squads };

const DrillLabels = (props: Props) => {
  const {
    requestStatus: drillLabelsRequestStatus,
    items,
    view,
    isSavingAllowed,
    isValidationCheckAllowed,
    isDeleteModalOpen,
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
    getRequest: getDrillLabels,
    postRequest: saveDrillLabels,
    withSquads: true,
  });

  const {
    requestStatus: deletionAvailabilityRequestStatus,
    deletableItemId: deletableDrillLabelId,
    deletionAvailability,
    getDeletionAvailability,
  } = useDeletionAvailability();

  return (
    <div
      css={styles.section}
      className="organisationPlanningSettings__section organisationPlanningSettings__section--drillLabels"
    >
      {drillLabelsRequestStatus === 'FAILURE' ||
      deletionAvailabilityRequestStatus === 'FAILURE' ? (
        <AppStatus status="error" message={null} isEmbed />
      ) : (
        <>
          <DrillLabelsHeader
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
          <DrillLabelsTable
            isLoading={drillLabelsRequestStatus === 'PENDING'}
            view={view}
            drillLabels={items}
            squads={props.squads}
            isValidationCheckAllowed={isValidationCheckAllowed}
            onChangeName={changeName}
            onChangeSquads={changeSquads}
            onAddNew={addNewItem}
            onDeleteNew={deleteNewItem}
            onDelete={(drillLabelId) => {
              getDeletionAvailability(
                getDrillLabelDeletionAvailability,
                drillLabelId
              ).then(showDeleteModal);
            }}
          />
          <DrillLabelsDeleteModal
            isOpen={isDeleteModalOpen}
            deletionAvailability={deletionAvailability}
            onDelete={() => deleteItem(deletableDrillLabelId)}
            onClose={hideDeleteModal}
          />
        </>
      )}
    </div>
  );
};

export default DrillLabels;
