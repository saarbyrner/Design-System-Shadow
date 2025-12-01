// @flow
import { useContext } from 'react';
import { withNamespaces } from 'react-i18next';
import { TrackEvent } from '@kitman/common/src/utils';
import { TabBar } from '@kitman/components';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import PermissionsContext from '../contexts/PermissionsContext';

import type { AssessmentTemplate, ViewType } from '../types';

type Props = {
  onClickViewTypeTab: Function,
  assessmentTemplates: Array<AssessmentTemplate>,
};

const AppHeader = (props: I18nProps<Props>) => {
  const permissions = useContext(PermissionsContext);

  const squadHasNoTemplate = props.assessmentTemplates.length === 0;

  const isTemplateTabDisplayed =
    permissions.manageAssessmentTemplate && !squadHasNoTemplate;

  const defaultTabs = [
    { title: props.t('Athlete'), content: <></> },
    { title: props.t('Group'), content: <></> },
    { title: props.t('Templates'), content: <></> },
  ];

  const tabs = isTemplateTabDisplayed ? defaultTabs : defaultTabs.slice(0, 2);

  const setViewType = (viewType: ViewType) => {
    props.onClickViewTypeTab(viewType);
    TrackEvent('assessments', 'click', `manage ${viewType.toLowerCase()} view`);
  };

  const onClickTab = (tabKey) => {
    switch (tabKey) {
      case '0':
      default: {
        setViewType('LIST');
        break;
      }
      case '1': {
        setViewType('GRID');
        break;
      }
      case '2': {
        setViewType('TEMPLATE');
        break;
      }
    }
  };

  return (
    <div className="assessmentsAppHeader">
      <TabBar tabPanes={tabs} onClickTab={onClickTab} />
    </div>
  );
};

export default AppHeader;
export const AppHeaderTranslated = withNamespaces()(AppHeader);
