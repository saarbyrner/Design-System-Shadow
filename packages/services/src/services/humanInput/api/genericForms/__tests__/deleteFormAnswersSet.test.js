import { axios } from '@kitman/common/src/utils/services';

import deleteFormAnswersSet, {
  generateDeleteFormAnswersSetUrl,
} from '../deleteFormAnswersSet';

describe('deleteFormAnswersSet', () => {
  let deleteFormAnswersSetRequest;

  beforeEach(() => {
    deleteFormAnswersSetRequest = jest.spyOn(axios, 'delete');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint', async () => {
    const formAnswersSetId = 1;
    await deleteFormAnswersSet(formAnswersSetId);

    expect(deleteFormAnswersSetRequest).toHaveBeenCalledTimes(1);
    expect(deleteFormAnswersSetRequest).toHaveBeenCalledWith(
      generateDeleteFormAnswersSetUrl(formAnswersSetId)
    );
  });
});
