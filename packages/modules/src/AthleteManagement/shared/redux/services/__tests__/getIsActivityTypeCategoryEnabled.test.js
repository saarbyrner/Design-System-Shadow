import { server } from '@kitman/services/src/mocks/server';
import {
  handler,
  data,
} from '../mocks/handlers/getIsActivityTypeCategoryEnabled';
import getIsActivityTypeCategoryEnabled from '../api/getIsActivityTypeCategoryEnabled';

describe('getIsActivityTypeCategoryEnabled', () => {
  beforeEach(() => server.use(handler));

  it('calls the correct endpoint and returns the correct value', async () => {
    const returnedData = await getIsActivityTypeCategoryEnabled();
    expect(returnedData).toEqual(data);
  });
});
