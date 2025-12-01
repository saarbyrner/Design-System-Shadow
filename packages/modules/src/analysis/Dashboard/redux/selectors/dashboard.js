// @flow
import _property from 'lodash/property';
import _get from 'lodash/get';
import _find from 'lodash/find';

export const getDashboard = _property('dashboard');

export const getWidgets = (state: Object) =>
  _get(state, 'dashboard.widgets', {});

export const getWidgetById = (state: Object, id: number) => {
  const widgets = getWidgets(state);

  return _find(widgets, { id }) || { id: -1, widget_render: { name: '' } };
};
