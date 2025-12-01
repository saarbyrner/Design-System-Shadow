import $ from 'jquery';
import archiveMedication from '../archiveMedication';

describe('archiveMedication', () => {
  let archiveMedicationRequest;

  beforeEach(() => {
    const deferred = $.Deferred();
    archiveMedicationRequest = jest
      .spyOn($, 'ajax')
      .mockImplementation(() => deferred.resolve({}));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint', async () => {
    await archiveMedication(1, 2);

    expect(archiveMedicationRequest).toHaveBeenCalledTimes(1);
    expect(archiveMedicationRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'PATCH',
        url: '/ui/medical/medications/1/archive',
        contentType: 'application/json',
      })
    );
  });
});
