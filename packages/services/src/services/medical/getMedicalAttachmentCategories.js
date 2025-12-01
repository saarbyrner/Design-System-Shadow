// @flow
import { axios } from '@kitman/common/src/utils/services';
import type { MedicalAttachmentCategory } from '@kitman/modules/src/Medical/shared/types/medical';

const getMedicalAttachmentCategories = async (): Promise<
  Array<MedicalAttachmentCategory>
> => {
  const { data } = await axios.get('/ui/medical_attachment_categories');
  return data.medical_attachment_categories;
};

export default getMedicalAttachmentCategories;
