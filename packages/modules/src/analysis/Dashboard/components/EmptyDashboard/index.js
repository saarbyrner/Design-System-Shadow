// @flow
import i18n from '@kitman/common/src/utils/i18n';
import { withNamespaces } from 'react-i18next';
import type { Dashboard } from '@kitman/modules/src/analysis/shared/types';
import AddWidgetDropdown from '../../containers/AddWidgetDropdown';
import type { ContainerType } from '../../types';

type Props = {
  containerType: ContainerType,
  dashboard: Dashboard,
  isDashboardManager: boolean,
  canViewNotes: boolean,
  hasDevelopmentGoalsModule: boolean,
  isGraphBuilder?: boolean,
  createGraphUrl: string,
  annotationTypes: Array<Object>,
  customTitle?: string,
  onClickAddActionsWidget: Function,
  onClickOpenHeaderWidgetModal: Function,
  onClickOpenProfileWidgetModal: Function,
  onClickOpenNotesWidgetSettingsModal: Function,
  onClickAddDevelopmentGoalWidget: Function,
  onClickOpenTableWidgetModal: Function,
};

function EmptyDashboard(props: Props) {
  const getContent = (
    containerType,
    dashboard,
    createGraphUrl,
    onClickAddActionsWidget,
    onClickOpenHeaderWidgetModal,
    onClickOpenProfileWidgetModal,
    onClickOpenNotesWidgetSettingsModal,
    onClickOpenTableWidgetModal,
    onClickAddDevelopmentGoalWidget
  ) => {
    return (
      <>
        <AddWidgetDropdown
          containerType={containerType}
          dashboard={dashboard}
          isGraphBuilder={props.isGraphBuilder || false}
          onClickAddActionsWidget={onClickAddActionsWidget}
          onClickOpenHeaderWidgetModal={onClickOpenHeaderWidgetModal}
          onClickOpenProfileWidgetModal={onClickOpenProfileWidgetModal}
          onClickOpenNotesWidgetSettingsModal={
            onClickOpenNotesWidgetSettingsModal
          }
          onClickOpenTableWidgetModal={onClickOpenTableWidgetModal}
          onClickAddDevelopmentGoalWidget={onClickAddDevelopmentGoalWidget}
          canViewNotes={props.canViewNotes}
          hasDevelopmentGoalsModule={props.hasDevelopmentGoalsModule}
          annotationTypes={props.annotationTypes}
        />
      </>
    );
  };

  const defaultTitle =
    props.containerType === 'HomeDashboard'
      ? i18n.t('Start customising your home page by adding a widget')
      : i18n.t('There are no widgets on this dashboard');

  return (
    <div className="graphComposer__emptyDashboard">
      <p>{props.customTitle ?? defaultTitle}</p>
      {props.isGraphBuilder && props.isDashboardManager
        ? getContent(
            props.containerType,
            props.dashboard,
            props.createGraphUrl,
            props.onClickAddActionsWidget,
            props.onClickOpenHeaderWidgetModal,
            props.onClickOpenProfileWidgetModal,
            props.onClickOpenNotesWidgetSettingsModal,
            props.onClickOpenTableWidgetModal,
            props.onClickAddDevelopmentGoalWidget
          )
        : null}
    </div>
  );
}

export default EmptyDashboard;
export const EmptyDashboardTranslated = withNamespaces()(EmptyDashboard);
