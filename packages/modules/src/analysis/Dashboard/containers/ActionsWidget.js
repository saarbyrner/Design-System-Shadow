import { useDispatch, useSelector } from 'react-redux';
import { ErrorBoundary } from '@kitman/components';
import { ActionsWidgetTranslated as ActionsWidget } from '../components/ActionsWidget';
import { openActionsWidgetModal } from '../redux/actions/actionsWidgetModal';
import { fetchActions } from '../redux/actions/actionsWidget';
import { clickActionCheckbox } from '../redux/actions/notesWidget';
import {
  openNoteDetailModal,
  fetchNoteDetail,
} from '../redux/actions/noteDetailModal';

export default (props) => {
  const dispatch = useDispatch();
  const containerType = useSelector((state) => state.staticData.containerType);
  const canEditNotes = useSelector((state) => state.staticData.canEditNotes);
  const canManageDashboard = useSelector(
    (state) => state.staticData.canManageDashboard
  );

  return (
    <ErrorBoundary>
      <ActionsWidget
        onClickActionCheckbox={(action) =>
          dispatch(clickActionCheckbox(action))
        }
        onClickWidgetSettings={(
          widgetId,
          selectedAnnotationTypes,
          selectedPopulation,
          selectedHiddenColumns
        ) => {
          dispatch(
            openActionsWidgetModal(
              widgetId,
              selectedAnnotationTypes,
              selectedPopulation,
              selectedHiddenColumns
            )
          );
        }}
        fetchActions={(widgetId, options, reset) => {
          dispatch(fetchActions(widgetId, options, reset));
        }}
        onClickActionText={(annotationId) => {
          dispatch(openNoteDetailModal());
          dispatch(fetchNoteDetail(annotationId));
        }}
        containerType={containerType}
        canEditNotes={canEditNotes}
        canManageDashboard={canManageDashboard}
        {...props}
      />
    </ErrorBoundary>
  );
};
