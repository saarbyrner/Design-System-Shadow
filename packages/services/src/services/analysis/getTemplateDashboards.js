// @flow
import { axios } from '@kitman/common/src/utils/services';

type TemplateDashboard = {
  id: string,
  name: string,
  mobile: Boolean,
};

const getTemplateDashboards = async (): Promise<TemplateDashboard> => {
  const { data } = await axios.get('/reporting/template_dashboards');

  return data;
};

export default getTemplateDashboards;
