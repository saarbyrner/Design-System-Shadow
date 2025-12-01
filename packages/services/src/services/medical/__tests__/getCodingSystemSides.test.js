import { axios } from '@kitman/common/src/utils/services';
import { data as mockCodingSystemSides } from '@kitman/services/src/mocks/handlers/medical/getCodingSystemSides';
import getCodingSystemSides from '../getCodingSystemSides';

describe('getCodingSystemSides', () => {
  beforeEach(() => {
    jest.spyOn(axios, 'get').mockImplementation(() => ({
      data: mockCodingSystemSides,
    }));
  });

  it('should fetch coding system sides', async () => {
    const codingSystemKey = 'osiics_15';
    const includeBlank = true;
    const result = await getCodingSystemSides(codingSystemKey, includeBlank);

    expect(axios.get).toHaveBeenCalledWith(
      '/emr/coding_system_sides?coding_system=OSIICS-15&include_blank=true'
    );
    expect(result).toEqual(mockCodingSystemSides);
  });

  it('forms URL paramaters correctly', async () => {
    const codingSystemKey = 'BLaH_-_d33';
    const includeBlank = false;
    const result = await getCodingSystemSides(codingSystemKey, includeBlank);

    expect(axios.get).toHaveBeenCalledWith(
      '/emr/coding_system_sides?coding_system=BLAH---D33&include_blank=false'
    );
    expect(result).toEqual(mockCodingSystemSides);
  });

  it('does not make the request if no coding system key passed', async () => {
    const codingSystemKey = undefined;
    const includeBlank = false;
    const result = await getCodingSystemSides(codingSystemKey, includeBlank);

    expect(axios.get).not.toHaveBeenCalled();
    expect(result).toEqual([]);
  });

  it('should handle an empty coding system key', async () => {
    const codingSystemKey = undefined;
    const includeBlank = false;
    const result = await getCodingSystemSides(codingSystemKey, includeBlank);
    expect(result).toEqual([]);
  });
});
