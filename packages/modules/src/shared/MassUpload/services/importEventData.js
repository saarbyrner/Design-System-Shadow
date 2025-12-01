// @flow
import objectToFormData from 'object-to-formdata';

import { axios } from '@kitman/common/src/utils/services';
import { transformSourceDataRequest } from '@kitman/modules/src/ImportWorkflow/src/utils';
import {
  type Event,
  type SourceData,
} from '@kitman/modules/src/ImportWorkflow/src/types';

const importEventData = async ({
  event,
  sourceData,
}: {
  event: Event,
  sourceData: SourceData,
}) => {
  const payload = objectToFormData({
    event_attributes: {
      id: event.id,
      event_type: 'Event',
    },
    source_data: transformSourceDataRequest(sourceData, event),
  });

  const { data } = await axios.post(
    '/workloads/import_workflow/perform',
    payload
  );
  return data;
};

export default importEventData;
