// @flow
import { withNamespaces } from 'react-i18next';

import { BreadCrumb } from '@kitman/components';
import type { Dashboard } from '@kitman/modules/src/analysis/shared/types';
import type { I18nProps } from '@kitman/common/src/types/i18n';

type Props = {
  isEditingDashboard: boolean,
  isEditingGraph: boolean,
  currentDashboard: Dashboard,
};

const Breadcrumb = (props: I18nProps<Props>) => {
  const breadCrumbLinks = [];

  if (props?.isEditingDashboard) {
    breadCrumbLinks.push(
      <BreadCrumb.MenuLink
        label={props?.currentDashboard?.name}
        url={`/analysis/dashboard/${props?.currentDashboard?.id}`}
        key="graphDashboard"
      />
    );
  }

  if (props.isEditingGraph) {
    breadCrumbLinks.push(
      <BreadCrumb.MenuText label={props.t('Edit Graph')} key="editGraph" />
    );
  } else {
    breadCrumbLinks.push(
      <BreadCrumb.MenuText label={props.t('New Graph')} key="newGraph" />
    );
  }

  return <BreadCrumb>{breadCrumbLinks}</BreadCrumb>;
};

export const BreadcrumbTranslated = withNamespaces()(Breadcrumb);
export default Breadcrumb;
