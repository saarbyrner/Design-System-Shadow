// @flow
import { AppStatus } from '@kitman/components';
import getPrincipleDeletionAvailability from '@kitman/modules/src/PlanningHub/src/services/getPrincipleDeletionAvailability';
import type { Squads } from '@kitman/services/src/services/getSquads';
import { CategoriesSidePanelTranslated as CategoriesSidePanel } from './CategoriesSidePanel';
import { PrinciplesHeaderTranslated as PrinciplesHeader } from './PrinciplesHeader';
import { PrinciplesFiltersTranslated as PrinciplesFilters } from './PrinciplesFilters';
import { PrinciplesTableTranslated as PrinciplesTable } from './PrinciplesTable';
import { PrinciplesDeleteModalTranslated as PrinciplesDeleteModal } from './PrinciplesDeleteModal';
import useCategories from '../hooks/useCategories';
import usePrinciples from '../hooks/usePrinciples';
import usePhases from '../hooks/usePhases';
import useTypes from '../hooks/useTypes';
import useDeletionAvailability from '../hooks/useDeletionAvailability';
import styles from '../styles/sections';

type Props = { squads: Squads };

const Principles = (props: Props) => {
  const {
    requestStatus: categoriesRequestStatus,
    categories,
    isCategoriesValidationCheckAllowed,
    isCategoriesSavingAllowed,
    isCategoriesSidePanelOpen,
    showCategoriesSidePanel,
    hideCategoriesSidePanel,
    addCategory,
    editCategory,
    deleteCategory,
    saveCategories,
  } = useCategories();

  const {
    requestStatus: principlesRequestStatus,
    fetchPrinciples,
    view,
    principles,
    shouldFiltersEmptied,
    isValidationCheckAllowed,
    isSavingAllowed,
    isDeleteModalOpen,
    changeView,
    showDeleteModal,
    hideDeleteModal,
    searchFilterChars,
    filterPrinciplesByItem,
    filterPrinciplesBySearch,
    onCreatePrinciple,
    onCancelPrinciplesEdit,
    addPrinciple,
    deleteNewPrinciple,
    onDeletePrinciple,
    updatePrincipleItems,
    updatePrincipleItemById,
    changePrincipleName,
    onSavePrinciples,
  } = usePrinciples();

  const { requestStatus: phasesRequestStatus, phases } = usePhases();
  const { requestStatus: typesRequestStatus, types } = useTypes();

  const {
    requestStatus: deletionAvailabilityRequestStatus,
    deletableItemId: deletablePrincipleId,
    deletionAvailability,
    getDeletionAvailability,
  } = useDeletionAvailability();

  const isFeedbackErrorShown = [
    principlesRequestStatus,
    categoriesRequestStatus,
    phasesRequestStatus,
    typesRequestStatus,
    deletionAvailabilityRequestStatus,
  ].some((requestStatus) => requestStatus === 'FAILURE');

  return (
    <div
      css={styles.section}
      className="organisationPlanningSettings__section organisationPlanningSettings__section--principles"
    >
      {isFeedbackErrorShown ? (
        <AppStatus status="error" isEmbed />
      ) : (
        <>
          <CategoriesSidePanel
            isOpen={isCategoriesSidePanelOpen}
            categories={categories}
            isValidationCheckAllowed={isCategoriesValidationCheckAllowed}
            isSavingAllowed={isCategoriesSavingAllowed}
            onClose={hideCategoriesSidePanel}
            onAdd={addCategory}
            onEdit={editCategory}
            onDelete={deleteCategory}
            onSave={() => saveCategories().then(fetchPrinciples)}
          />
          <PrinciplesHeader
            view={view}
            onCreatePrinciple={onCreatePrinciple}
            onSavePrinciples={onSavePrinciples}
            onCancelEdit={onCancelPrinciplesEdit}
            showCategoriesSidePanel={showCategoriesSidePanel}
            onChangeView={(newView) => changeView(newView)}
            isSavingAllowed={isSavingAllowed}
          />
          <PrinciplesFilters
            view={view}
            categories={categories}
            types={types}
            squads={props.squads}
            phases={phases}
            shouldFiltersEmptied={shouldFiltersEmptied}
            searchFilterChars={searchFilterChars}
            onFilterByItem={filterPrinciplesByItem}
            onFilterBySearch={filterPrinciplesBySearch}
          />
          <PrinciplesTable
            isLoading={principlesRequestStatus === 'PENDING'}
            view={view}
            categories={categories}
            types={types}
            squads={props.squads}
            phases={phases}
            principles={principles}
            isValidationCheckAllowed={isValidationCheckAllowed}
            onAdd={addPrinciple}
            onDeleteNew={deleteNewPrinciple}
            onDeletePrinciple={(principleId) => {
              getDeletionAvailability(
                getPrincipleDeletionAvailability,
                principleId
              ).then(showDeleteModal);
            }}
            updatePrincipleItems={updatePrincipleItems}
            updatePrincipleItemById={updatePrincipleItemById}
            changePrincipleName={changePrincipleName}
          />
          <PrinciplesDeleteModal
            deletionAvailability={deletionAvailability}
            isOpen={isDeleteModalOpen}
            onDelete={() => onDeletePrinciple(deletablePrincipleId)}
            onClose={hideDeleteModal}
          />
        </>
      )}
    </div>
  );
};

export default Principles;
