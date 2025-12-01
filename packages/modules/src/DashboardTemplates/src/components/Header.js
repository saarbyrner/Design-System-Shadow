// @flow
import {
  BreadCrumb,
  IconButton,
  InfoTooltip,
  PageHeader,
} from '@kitman/components';
import { withNamespaces } from 'react-i18next';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { Template } from '../types';

type Props = {
  templates: Array<Template>,
  addTemplate: () => void,
};

export const Header = (props: I18nProps<Props>) => {
  const maxNumberOfTemplate = 200;
  const maxNumberOfTemplateReached =
    props.templates.length >= maxNumberOfTemplate;

  return (
    <PageHeader className="dashboardTemplatesHeader">
      <div className="dashboardTemplatesHeader__inner">
        <BreadCrumb>
          <BreadCrumb.MenuLink
            label={
              window.featureFlags['side-nav-update']
                ? props.t('Athlete Metrics')
                : props.t('Dashboard')
            }
            url="/dashboards/show"
          />
          <BreadCrumb.MenuText
            label={
              window.featureFlags['side-nav-update']
                ? props.t('Settings')
                : props.t('Dashboard Manager')
            }
          />
        </BreadCrumb>
        <div className="dashboardTemplatesHeader__buttonContainer">
          <IconButton
            onClick={props.addTemplate}
            icon="icon-add"
            isDisabled={maxNumberOfTemplateReached}
            isSmall
          />
          {maxNumberOfTemplateReached && (
            <InfoTooltip
              placement="top"
              content={props.t('Maximum dashboards reached')}
            >
              <a className="dashboardTemplatesHeader__tooltipHotspot" href="#">
                &nbsp;
              </a>
            </InfoTooltip>
          )}
        </div>
      </div>
    </PageHeader>
  );
};

export default withNamespaces()(Header);
