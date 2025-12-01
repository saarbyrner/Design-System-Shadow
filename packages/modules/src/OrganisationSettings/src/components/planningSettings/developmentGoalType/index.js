// @flow
import getDevelopmentGoalTypes from '@kitman/modules/src/PlanningHub/src/services/getDevelopmentGoalTypes';
import saveDevelopmentGoalTypes from '@kitman/modules/src/PlanningHub/src/services/saveDevelopmentGoalTypes';
import type { Squads } from '@kitman/services/src/services/getSquads';
import { AppStatus } from '@kitman/components';
import { DevelopmentGoalTypeHeaderTranslated as DevelopmentGoalTypeHeader } from './DevelopmentGoalTypeHeader';
import { DevelopmentGoalTypeTableTranslated as DevelopmentGoalTypeTable } from './DevelopmentGoalTypeTable';
import { DevelopmentGoalTypeDeleteModalTranslated as DevelopmentGoalTypeDeleteModal } from './DevelopmentGoalTypeDeleteModal';
import useSettings from '../hooks/useSettings';
import styles from '../styles/sections';

type Props = { squads: Squads };

const DevelopmentGoalType = (props: Props) => {
  const {
    requestStatus: developmentGoalTypeRequestStatus,
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
    getRequest: getDevelopmentGoalTypes,
    postRequest: saveDevelopmentGoalTypes,
    withSquads: true,
  });

  return (
    <div
      css={styles.section}
      className="organisationPlanningSettings__section organisationPlanningSettings__section--developmentGoalType"
    >
      {developmentGoalTypeRequestStatus === 'FAILURE' ? (
        <AppStatus status="error" message={null} isEmbed />
      ) : (
        <>
          <DevelopmentGoalTypeHeader
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
          <DevelopmentGoalTypeTable
            isLoading={developmentGoalTypeRequestStatus === 'PENDING'}
            view={view}
            developmentGoalTypes={items}
            squads={props.squads}
            isValidationCheckAllowed={isValidationCheckAllowed}
            onChangeName={changeName}
            onChangeSquads={changeSquads}
            onAddNew={addNewItem}
            onDeleteNew={deleteNewItem}
            onDelete={showDeleteModal}
          />
          <DevelopmentGoalTypeDeleteModal
            isOpen={isDeleteModalOpen}
            onDelete={deleteItem}
            onClose={hideDeleteModal}
          />
        </>
      )}
    </div>
  );
};

export default DevelopmentGoalType;
