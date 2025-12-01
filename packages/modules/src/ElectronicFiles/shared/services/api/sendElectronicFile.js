// @flow
import { axios } from '@kitman/common/src/utils/services';
import type { NewContact } from '@kitman/modules/src/ElectronicFiles/shared/types';

export const endpoint = '/efax/outbound_messages';

export type SendElectronicFileRequestBody = {
  subject: string,
  message: string,
  include_cover_page: boolean,
  contacts_attributes: Array<NewContact>,
  attachment_ids: Array<number>,
  medical_document_ids: Array<number>,
};

export type SendElectronicFileResponse = {
  id: number,
  subject: string,
  message: string,
  status: string,
  include_cover_page: boolean,
};

const sendElectronicFile = async (
  electronicFile: SendElectronicFileRequestBody
): Promise<SendElectronicFileResponse> => {
  const { data } = await axios.post(endpoint, electronicFile);

  return data;
};

export default sendElectronicFile;
