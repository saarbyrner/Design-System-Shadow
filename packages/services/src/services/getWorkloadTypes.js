// @flow
import $ from 'jquery';

export type WorkloadType = {
  id: number,
  name: string,
};
export type WorkloadsType = Array<WorkloadType>;

const getWorkloadTypes = (): Promise<WorkloadsType> => {
  return new Promise((resolve, reject) => {
    $.ajax({
      method: 'GET',
      url: '/workload_types',
    })
      .done(resolve)
      .fail(reject);
  });
};

export default getWorkloadTypes;
