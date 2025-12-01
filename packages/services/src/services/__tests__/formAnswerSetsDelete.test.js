import { axios } from '@kitman/common/src/utils/services';
import formAnswerSetsDelete from '../formAnswerSetsDelete';

describe('formAnswerSetsDelete', () => {
  let deleteActivityDrillRequest;

  beforeEach(() => {
    deleteActivityDrillRequest = jest
      .spyOn(axios, 'delete')
      .mockResolvedValue({});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint', async () => {
    await formAnswerSetsDelete(1);

    expect(deleteActivityDrillRequest).toHaveBeenCalledWith(
      '/ui/concussion/form_answers_sets/1'
    );
  });
});
