// @flow
import { InfoTooltip, Link } from '@kitman/components';
import { withNamespaces } from 'react-i18next';
import { formatDate } from '@kitman/common/src/utils';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { useBrowserTabTitle } from '@kitman/common/src/hooks';

import type { Template } from '../types';

type Props = {
  templates: Array<Template>,
  delete: (template: Template) => void,
  duplicate: (template: Template) => void,
  rename: (template: Template) => void,
};

export const TemplateList = (props: I18nProps<Props>) => {
  useBrowserTabTitle(props.t('Dashboard Manager'));

  const getTemplates = () => {
    const onlyOneTemplate = props.templates.length === 1;
    props.templates.sort((template1, template2) =>
      template1.name.localeCompare(template2.name)
    );
    return props.templates.map((template) => (
      <tr key={template.id}>
        <td className="dashboardTemplates__nameCell">
          <Link href={`/dashboards/${template.id}/edit`}>{template.name}</Link>
        </td>
        <td>
          {`${props.t('{{date}} by {{author}}', {
            date: formatDate(template.updated_at),
            author: `${template.editor.firstname} ${template.editor.lastname}`,
            interpolation: { escapeValue: false },
          })}`}
        </td>
        <td className="dashboardTemplates__buttonsCell">
          <div className="dashboardTemplates__buttonContainer">
            <button
              type="button"
              onClick={() => {
                props.rename(template);
              }}
              className="icon-edit-name dashboardTemplates__button"
            />
            <button
              type="button"
              onClick={() => {
                props.duplicate(template);
              }}
              className="icon-duplicate dashboardTemplates__button"
            />
            <button
              type="button"
              onClick={() => {
                props.delete(template);
              }}
              className={`icon-bin dashboardTemplates__button${
                onlyOneTemplate ? '--disabled' : ''
              }`}
              disabled={onlyOneTemplate}
            />
            {onlyOneTemplate && (
              <InfoTooltip
                placement="top"
                content={props.t(
                  'You must have at least one dashboard template'
                )}
              >
                <a className="dashboardTemplates__tooltipHotspot" href="#">
                  &nbsp;
                </a>
              </InfoTooltip>
            )}
          </div>
        </td>
      </tr>
    ));
  };

  return (
    <table className="table km-table dashboardTemplates">
      <thead>
        <tr>
          <th>{props.t('Name')}</th>
          <th>{props.t('Last Edit')}</th>
          <th />
        </tr>
      </thead>
      <tbody>{getTemplates()}</tbody>
    </table>
  );
};

export default withNamespaces()(TemplateList);
