// @flow
import { axios } from '@kitman/common/src/utils/services';

const uploadAttachment = async (
  file: File,
  fileTitle?: string,
  organisationId?: number
): Promise<any> => {
  const formData = new FormData();

  formData.append('attachment', file);
  if (fileTitle) formData.append('attachment_name', fileTitle);

  const config = {
    headers: {
      'content-type': 'multipart/form-data',
    },
  };

  const params = new URLSearchParams();

  if (organisationId) params.append('organisation_id', `${organisationId}`);

  const formattedParams = params.toString();
  const url = `/attachments${formattedParams ? '?' : ''}${formattedParams}`;

  try {
    const { data } = await axios.post(url, formData, config);
    return data;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
    throw err;
  }
};

export default uploadAttachment;
