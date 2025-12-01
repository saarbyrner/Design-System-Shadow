import { useSelector, useDispatch } from 'react-redux';
import { ActionsWidgetModalTranslated as ActionsWidgetModal } from '../components/ActionsWidgetModal';
import {
  closeActionsWidgetModal,
  selectAnnotationType,
  unselectAnnotationType,
  setPopulation,
  saveActionsWidget,
  editActionsWidget,
  closeActionsWidgetAppStatus,
  setHiddenColumns,
} from '../redux/actions/actionsWidgetModal';

export default (props) => {
  const dispatch = useDispatch();
  const isOpen = useSelector((state) => state.actionsWidgetModal.isOpen);
  const selectedAnnotationTypes = useSelector(
    (state) => state.actionsWidgetModal.organisation_annotation_type_ids
  );
  const selectedPopulation = useSelector(
    (state) => state.actionsWidgetModal.population
  );
  const selectedHiddenColumns = useSelector(
    (state) => state.actionsWidgetModal.hidden_columns
  );
  const widgetId = useSelector((state) => state.actionsWidgetModal.widgetId);
  const status = useSelector((state) => state.actionsWidgetModal.status);

  return (
    <ActionsWidgetModal
      isOpen={isOpen}
      selectedAnnotationTypes={selectedAnnotationTypes}
      selectedPopulation={selectedPopulation}
      selectedHiddenColumns={selectedHiddenColumns}
      onClickCloseModal={() => {
        dispatch(closeActionsWidgetModal());
      }}
      onSelectAnnotationType={(annotationTypeId) => {
        dispatch(selectAnnotationType(annotationTypeId));
      }}
      onUnselectAnnotationType={(annotationTypeId) => {
        dispatch(unselectAnnotationType(annotationTypeId));
      }}
      onSetPopulation={(population) => {
        dispatch(setPopulation(population));
      }}
      onHiddenColumnsChange={(hiddenColumns) =>
        dispatch(setHiddenColumns(hiddenColumns))
      }
      onClickSaveActionsWidget={() => {
        if (widgetId !== null) {
          dispatch(editActionsWidget(widgetId));
        } else {
          dispatch(saveActionsWidget());
        }
      }}
      status={status}
      onClickCloseAppStatus={() => {
        dispatch(closeActionsWidgetAppStatus());
      }}
      {...props}
    />
  );
};
