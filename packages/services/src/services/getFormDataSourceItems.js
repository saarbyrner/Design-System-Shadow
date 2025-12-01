// @flow
import { axios } from '@kitman/common/src/utils/services';

export type DataSourceEntry = {
  value: string,
  label: string,
  children?: Array<DataSourceEntry>,
};

/*
NOTE: dataSources are added to on backend adHoc when forms are created.
The currently known values are listed here for reference but strict flow typing would not be suitable:
'countries', 'timezones', 'footwears', 'medical_document_categories', 'game_events', 'footwear_v2s'
*/

const getFormDataSourceItems = async (
  dataSource: string
): Promise<Array<DataSourceEntry>> => {
  const { data } = await axios.get(
    `/forms/form_elements/data_source_items?data_source=${dataSource}`
  );
  return data;
};

export default getFormDataSourceItems;
