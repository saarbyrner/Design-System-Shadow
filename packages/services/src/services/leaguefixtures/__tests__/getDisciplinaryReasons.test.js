import getDisciplinaryReasons from '../getDisciplinaryReasons';
import { data } from '../../../mocks/handlers/leaguefixtures/getDisciplinaryReasonsHandler';

describe('getDisciplinaryReasons', () => {
  it('returns the relevant disciplinary reasons from getDisciplinaryReasons', async () => {
    expect(await getDisciplinaryReasons()).toEqual(data);
  });
});
