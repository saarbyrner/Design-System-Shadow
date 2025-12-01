// @flow
import { withNamespaces } from 'react-i18next';
import classnames from 'classnames';
import { formatDate } from '@kitman/common/src/utils';
import { DataGrid, Link, ToggleSwitch } from '@kitman/components';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { Template } from '../../types/__common';

type Props = {
  templates: Object,
  rename: (id: $PropertyType<Template, 'id'>) => void,
  duplicate: (id: $PropertyType<Template, 'id'>) => void,
  delete: (id: $PropertyType<Template, 'id'>) => void,
  toggleStatus: (template: Template) => void,
  onClickOpenSidePanel: (Template, orgTimeZone: string) => void,
  onClickColumnSorting: Function,
  column: string,
  direction: string,
};

const FormList = (props: I18nProps<Props>) => {
  const setDirection = (event) => {
    const column = event.column;

    if (column === props.column) {
      // Same column so flip the direction
      if (event.direction === 'asc') {
        props.onClickColumnSorting(column, 'desc');
      } else {
        props.onClickColumnSorting(column, 'asc');
      }
    } else {
      // Fresh column so order accordingly
      switch (column) {
        case 'status':
        default:
          props.onClickColumnSorting('status', 'desc');
          break;
        case 'name':
          props.onClickColumnSorting(column, 'desc');
          break;
        case 'last_edited':
          props.onClickColumnSorting(column, 'desc');
          break;
        case 'num_athletes':
          props.onClickColumnSorting(column, 'desc');
          break;
        case 'scheduled':
          props.onClickColumnSorting(column, 'desc');
          break;
      }
    }
  };

  const getRowActions = (template) => {
    const actions = [];
    const body = document.getElementsByTagName('body')[0];
    const orgTimeZone = body.dataset.timezone;

    actions.push({
      id: 'edit',
      text: props.t('Rename'),
      onCallAction: () => {
        props.rename(template.id);
      },
    });

    if (window.featureFlags['forms-scheduling']) {
      actions.push({
        id: 'schedule',
        text: props.t('Schedule'),
        onCallAction: () => {
          props.onClickOpenSidePanel(template, orgTimeZone);
        },
      });
    }

    actions.push({
      id: 'duplicate',
      text: props.t('Duplicate'),
      onCallAction: () => {
        props.duplicate(template.id);
      },
    });

    if (!template.active) {
      actions.push({
        id: 'delete',
        text: props.t('Delete'),
        onCallAction: () => {
          props.delete(template.id);
        },
      });
    }

    return actions;
  };

  const getTemplates = () => {
    const templates = props.templates;

    return Object.keys(props.templates).map((id) => ({
      id,
      cells: [
        {
          id: 'status',
          content: (
            <ToggleSwitch
              toggle={() => {
                props.toggleStatus(templates[id]);
              }}
              isSwitchedOn={templates[id].active}
              kitmanDesignSystem
            />
          ),
        },
        {
          id: 'name',
          content: (
            <Link href={`${window.location.pathname}/${templates[id].id}`}>
              {templates[id].name}
            </Link>
          ),
        },
        {
          id: 'last_edited',
          content: templates[id].last_edited_by
            ? `${props.t('{{date}} by ', {
                date: formatDate(templates[id].last_edited_at),
                interpolation: { escapeValue: false },
              })} ${templates[id].last_edited_by}`
            : null,
        },
        { id: 'num_athletes', content: templates[id].active_athlete_count },
        {
          id: 'scheduled',
          content:
            templates[id].scheduled_time == null ? (
              ''
            ) : (
              <span
                className={classnames(
                  'icon-check questionnaireTemplates__checkmark',
                  {
                    'questionnaireTemplates__checkmark--active':
                      templates[id].active,
                  }
                )}
              />
            ),
        },
      ],
      rowActions: getRowActions(templates[id]),
    }));
  };

  const columns = [
    { id: 'status', content: props.t('Status') },
    { id: 'name', content: props.t('Form name') },
    { id: 'last_edited', content: props.t('Last edited') },
    { id: 'num_athletes', content: props.t('Number of athletes') },
    { id: 'scheduled', content: props.t('Scheduled') },
  ];

  return (
    <DataGrid
      columns={columns}
      rows={getTemplates()}
      sortableColumns={[
        'status',
        'name',
        'last_edited',
        'num_athletes',
        'scheduled',
      ]}
      onClickColumnSorting={(e) => setDirection(e)}
      gridSorting={{
        column: props.column,
        order: props.direction === 'asc' ? 'ASCENDING' : 'DESCENDING',
      }}
    />
  );
};

export const FormListTranslated = withNamespaces()(FormList);
export default FormList;
