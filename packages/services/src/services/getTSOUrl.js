// @flow
import { axios } from '@kitman/common/src/utils/services';

const getTSOUrl = async (url: ?string) => {
  const { data } = await axios.get('/symbiosis_link', {
    params: {
      page_url: url,
    },
  });

  return data;
};

export default getTSOUrl;
