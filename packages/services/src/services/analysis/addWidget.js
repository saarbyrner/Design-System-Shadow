// @flow
import { axios } from '@kitman/common/src/utils/services';

type ContainerType = 'AnalyticalDashboard' | 'HomeDashboard';
type ContainerId = number;
type WidgetContent = {
  type: 'chart' | 'action', // TODO more types here
};
type AddWidgetConfig = {
  containerType: ContainerType,
  containerId: ContainerId,
  widget: WidgetContent,
};

const addWidget = async ({
  containerType,
  containerId,
  widget,
}: AddWidgetConfig) => {
  const response = await axios.post('/widgets', {
    container_type: containerType,
    container_id: containerId,
    widget,
  });

  return response.data;
};

export default addWidget;
