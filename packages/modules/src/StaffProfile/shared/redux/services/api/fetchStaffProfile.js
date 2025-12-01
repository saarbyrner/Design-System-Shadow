// @flow
import { axios } from '@kitman/common/src/utils/services';
import { data } from '@kitman/modules/src/StaffProfile/shared/redux/services/mocks/data/fetchStaffProfile';
import type { HumanInputForm } from '@kitman/modules/src/HumanInput/types/forms';

const fetchStaffProfile = async (staffId: ?number): Promise<HumanInputForm> => {
  let requestUrl = '/administration/staff/new';

  if (staffId) {
    requestUrl = `/administration/staff/${staffId}/edit`;
  }

  try {
    const { data: staffForm } = await axios.get(requestUrl, {
      headers: {
        'content-type': 'application/json',
        Accept: 'application/json',
      },
    });

    return staffForm;
  } catch (error) {
    console.error(error);
    return data;
  }
};

export default fetchStaffProfile;
