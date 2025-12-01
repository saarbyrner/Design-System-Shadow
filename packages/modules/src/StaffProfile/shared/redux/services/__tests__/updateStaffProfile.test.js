import { data } from '@kitman/modules/src/StaffProfile/shared/redux/services/mocks/data/fetchStaffProfile';
import { axios } from '@kitman/common/src/utils/services';
import updateStaffProfile from '@kitman/modules/src/StaffProfile/shared/redux/services/api/updateStaffProfile';

describe('updateStaffProfile', () => {
  let updateFormRequest;

  beforeEach(() => {
    updateFormRequest = jest.spyOn(axios, 'put');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint', async () => {
    const props = {
      staffId: 1,
      requestBody: {
        form_answers_set: {
          id: 1,
        },
        answers: [
          {
            form_element_id: 1,
            value: 123,
          },
          {
            form_element_id: 2,
            value: 'test',
          },
          {
            form_element_id: 3,
            value: true,
          },
        ],
      },
    };

    const returnedData = await updateStaffProfile(props);

    expect(returnedData).toEqual(data);
    expect(updateFormRequest).toHaveBeenCalledTimes(1);
    expect(updateFormRequest).toHaveBeenCalledWith(
      `/administration/staff/${props.staffId}`,
      props.requestBody
    );
  });
});
