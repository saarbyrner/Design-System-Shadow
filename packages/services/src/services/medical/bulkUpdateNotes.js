// @flow
import { axios } from '@kitman/common/src/utils/services';

export type Annotation = {
  id: number,
  created_by: number,
  allow_list: Array<number>,
};

export type Annotations = {
  annotations: Array<Annotation>,
};

export type BulkUpdateNotesResponse = {
  id: number,
  attachments: [],
  allow_list: [
    {
      id: number,
      fullname: string,
    }
  ],
};

const bulkUpdateNotes = async (
  notes: Annotations
): Promise<Array<BulkUpdateNotesResponse>> => {
  const { data } = await axios.post('/medical/notes/update_bulk', notes);

  return data;
};

export default bulkUpdateNotes;
