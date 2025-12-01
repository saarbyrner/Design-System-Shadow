// @flow
import { axios } from '@kitman/common/src/utils/services';

type ContainerType = 'AnalyticalDashboard' | 'HomeDashboard';
type ContainerId = number;
type WidgetContent = {
  type: 'chart' | 'action', // TODO more types here
};
type AddWidgetConfig = {
  widgetId: number,
  containerType: ContainerType,
  containerId: ContainerId,
  widget: WidgetContent,
};

const updateWidget = async ({
  widgetId,
  containerType,
  containerId,
  widget,
}: AddWidgetConfig) => {
  const response = await axios.put(`/widgets/${widgetId}`, {
    container_type: containerType,
    container_id: containerId,
    widget,
  });

  return response.data;
};

export default updateWidget;
