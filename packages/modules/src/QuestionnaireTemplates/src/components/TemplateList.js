// @flow
import classNames from 'classnames';
import { withNamespaces } from 'react-i18next';
import { formatDate } from '@kitman/common/src/utils';
import { Link } from '@kitman/components';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import ActivateButton from '../containers/ActivateButton';
import type { Template } from '../../types/__common';

type Props = {
  templates: Object,
  rename: (id: $PropertyType<Template, 'id'>) => void,
  duplicate: (id: $PropertyType<Template, 'id'>) => void,
  delete: (id: $PropertyType<Template, 'id'>) => void,
  onClickOpenSidePanel: (Template, orgTimeZone: string) => void,
};

const TemplateList = (props: I18nProps<Props>) => {
  const body = document.getElementsByTagName('body')[0];
  const orgTimeZone = body.dataset.timezone;

  const getTemplates = () => {
    const templates = props.templates;
    return Object.keys(props.templates).map((id) => (
      <tr key={id}>
        <td>
          <ActivateButton
            templateId={templates[id].id}
            isActive={templates[id].active}
          />
        </td>
        <td>
          <Link href={`${window.location.pathname}/${templates[id].id}`}>
            {templates[id].name}
          </Link>
        </td>
        <td>{templates[id].platforms.sort().reverse().join(', ')}</td>
        <td>
          {templates[id].last_edited_by
            ? `${props.t('{{date}} by ', {
                date: formatDate(templates[id].last_edited_at),
                interpolation: { escapeValue: false },
              })} ${templates[id].last_edited_by}`
            : null}
        </td>
        <td className="questionnaireTemplates__buttonsCell">
          {window.featureFlags['forms-scheduling'] && (
            <button
              type="button"
              onClick={() => {
                if (templates[id].active) {
                  props.onClickOpenSidePanel(templates[id], orgTimeZone);
                }
              }}
              className={classNames(
                'icon-calendar questionnaireTemplates__button',
                {
                  'questionnaireTemplates__button--active':
                    templates[id].active && templates[id].scheduled_time,
                  'questionnaireTemplates__button--disabled':
                    !templates[id].active,
                }
              )}
            />
          )}
          <button
            type="button"
            onClick={() => {
              props.rename(templates[id].id);
            }}
            className="icon-edit-name questionnaireTemplates__button"
          />
          <button
            type="button"
            onClick={() => {
              props.duplicate(templates[id].id);
            }}
            className="icon-duplicate questionnaireTemplates__button"
          />
          <div className="questionnaireTemplates__buttonContainer">
            <button
              type="button"
              onClick={() => {
                props.delete(templates[id].id);
              }}
              className={`
                icon-bin
                questionnaireTemplates__button
                ${
                  templates[id].active
                    ? 'questionnaireTemplates__button--disabled'
                    : ''
                }
              `}
              disabled={templates[id].active}
            />
          </div>
        </td>
      </tr>
    ));
  };

  return (
    <table className="table km-table">
      <thead>
        <tr>
          <th>{props.t('Active')}</th>
          <th width="28%">{props.t('Name')}</th>
          <th>{props.t('Question Type')}</th>
          <th>{props.t('Last Edit')}</th>
          <th />
        </tr>
      </thead>
      <tbody>{getTemplates()}</tbody>
    </table>
  );
};

export const TemplateListTranslated = withNamespaces()(TemplateList);
export default TemplateList;
