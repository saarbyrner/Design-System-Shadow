// @flow
import { axios } from '@kitman/common/src/utils/services';

export type DocumentNoteCategory = {
  created_at: string,
  id: number,
  name: string,
  updated_at: string,
};

const getDocumentNoteCategories = async (): Promise<
  Array<DocumentNoteCategory>
> => {
  const { data } = await axios.get('/ui/document_note_categories');

  return data;
};

export default getDocumentNoteCategories;
