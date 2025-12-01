// @flow
import { useMemo } from 'react';
import getDevelopmentGoalCompletionTypes from '@kitman/modules/src/PlanningHub/src/services/getDevelopmentGoalCompletionTypes';
import saveDevelopmentGoalCompletionTypes from '@kitman/modules/src/PlanningHub/src/services/saveDevelopmentGoalCompletionTypes';
import { AppStatus } from '@kitman/components';
import { DevelopmentGoalCompletionTypeHeaderTranslated as DevelopmentGoalCompletionTypeHeader } from './DevelopmentGoalCompletionTypeHeader';
import { DevelopmentGoalCompletionTypeTableTranslated as DevelopmentGoalCompletionTypeTable } from './DevelopmentGoalCompletionTypeTable';
import { DevelopmentGoalCompletionTypeArchiveModalTranslated as DevelopmentGoalCompletionTypeArchiveModal } from './DevelopmentGoalCompletionTypeArchiveModal';
import useSettings from '../hooks/useSettings';
import styles from '../styles/sections';

const DevelopmentGoalCompletionType = () => {
  const {
    requestStatus: developmentGoalCompletionTypeRequestStatus,
    items,
    view,
    isSavingAllowed,
    isValidationCheckAllowed,
    isArchiveModalOpen,
    changeView,
    changeName,
    cancelEdit,
    saveEdit,
    addNewItem,
    deleteNewItem,
    archiveItem,
    showArchiveModal,
    hideArchiveModal,
  } = useSettings({
    getRequest: getDevelopmentGoalCompletionTypes,
    postRequest: saveDevelopmentGoalCompletionTypes,
    withSquads: true,
  });

  const filteredDevelopmentGoalCompletionTypes = useMemo(
    () => ({
      archived: items.filter(
        (developmentGoalCompletionType) =>
          developmentGoalCompletionType.archived
      ),
      unarchived: items.filter(
        (developmentGoalCompletionType) =>
          !developmentGoalCompletionType.archived
      ),
    }),
    [items]
  );

  return (
    <div
      css={styles.section}
      className="organisationPlanningSettings__section organisationPlanningSettings__section--developmentGoalCompletionType"
    >
      {developmentGoalCompletionTypeRequestStatus === 'FAILURE' ? (
        <AppStatus status="error" message={null} isEmbed />
      ) : (
        <>
          <DevelopmentGoalCompletionTypeHeader
            view={view}
            isSavingAllowed={isSavingAllowed}
            onSaveEdit={saveEdit}
            onEditMode={() => changeView('EDIT')}
            onCancelEdit={cancelEdit}
            onAddNew={() => {
              changeView('EDIT');
              addNewItem();
            }}
            showArchiveModal={showArchiveModal}
          />
          <DevelopmentGoalCompletionTypeTable
            isLoading={developmentGoalCompletionTypeRequestStatus === 'PENDING'}
            view={view}
            developmentGoalCompletionTypes={
              filteredDevelopmentGoalCompletionTypes.unarchived
            }
            isValidationCheckAllowed={isValidationCheckAllowed}
            onChangeName={changeName}
            onAddNew={addNewItem}
            onDeleteNew={deleteNewItem}
            onArchive={(developmentGoalCompletionTypeId: number | string) =>
              archiveItem(developmentGoalCompletionTypeId, 'ARCHIVE')
            }
          />
          <DevelopmentGoalCompletionTypeArchiveModal
            isOpen={isArchiveModalOpen}
            developmentGoalCompletionTypes={
              filteredDevelopmentGoalCompletionTypes.archived
            }
            onUnarchive={(developmentGoalCompletionTypeId: number | string) =>
              archiveItem(developmentGoalCompletionTypeId, 'UNARCHIVE')
            }
            onClose={hideArchiveModal}
          />
        </>
      )}
    </div>
  );
};

export default DevelopmentGoalCompletionType;
