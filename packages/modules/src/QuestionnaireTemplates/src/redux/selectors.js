// @flow
import _filter from 'lodash/filter';
import _orderBy from 'lodash/orderBy';
import { formatDate } from '@kitman/common/src/utils';
import type { State } from '../../types/state';
import type { Template, Templates } from '../../types/__common';

type TemplateSelector = (State) => Templates;
const textCheck = (template: Template, text: string) => {
  if (typeof text !== 'undefined' && text.length > 0) {
    const loweredText = text.toLowerCase();
    const date = formatDate(template.last_edited_at);

    return (
      template.name.toLowerCase().includes(loweredText) ||
      template.last_edited_by.toLowerCase().includes(loweredText) ||
      date.toLowerCase().includes(loweredText)
    );
  }

  return true;
};

const statusCheck = (template: Template, status: string) => {
  if (typeof status === 'undefined' || status === '') {
    return true;
  }

  if (status === 'active' && template.active === true) {
    return true;
  }

  if (status === 'inactive' && template.active === false) {
    return true;
  }

  return false;
};

const scheduledCheck = (template: Template, scheduled: string) => {
  if (typeof scheduled === 'undefined' || scheduled === '') {
    return true;
  }

  if (scheduled === 'notScheduled' && template.scheduled_time === null) {
    return true;
  }

  if (scheduled === 'scheduled' && template.scheduled_time !== null) {
    return true;
  }

  return false;
};

const filterTemplateFactory = (
  text: string,
  status: string,
  scheduled: string
) => {
  return (template: Template) => {
    return (
      textCheck(template, text) &&
      statusCheck(template, status) &&
      scheduledCheck(template, scheduled)
    );
  };
};

export const getSearchText: (State) => string = (state: State) =>
  state.filters.searchText;

export const getSearchStatus: (State) => string = (state: State) =>
  state.filters.searchStatus;

export const getSearchScheduled: (State) => string = (state: State) =>
  state.filters.searchScheduled;

export const getSortingColumn: (State) => string = (state: State) =>
  state.sorting.column;

export const getSortingDirection: (State) => string = (state: State) =>
  state.sorting.direction;

const sortTemplates = (
  column: string,
  isAsc: boolean,
  templates: Array<Template>
) => {
  const direction = isAsc ? 'asc' : 'desc';
  switch (column) {
    case 'status':
    default:
      return _orderBy(templates, ['active', 'name'], [direction, 'asc']);
    case 'name':
      return _orderBy(templates, 'name', direction);
    case 'last_edited':
      return _orderBy(templates, 'last_edited_at', direction);
    case 'num_athletes':
      return _orderBy(templates, 'active_athlete_count', direction);
    case 'scheduled':
      return _orderBy(templates, 'scheduled_time', direction);
  }
};

export const getTemplates: TemplateSelector = (state: State) =>
  sortTemplates(
    getSortingColumn(state),
    getSortingDirection(state) === 'asc',
    _filter(
      state.templates,
      filterTemplateFactory(
        getSearchText(state),
        getSearchStatus(state),
        getSearchScheduled(state)
      )
    )
  );
