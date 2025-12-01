import { axios } from '@kitman/common/src/utils/services';
import { server, rest } from '@kitman/services/src/mocks/server';
import saveReviewedDiagnostics from '../saveReviewedDiagnostics';

describe('saveReviewedDiagnostics', () => {
  let axiosPost;

  beforeEach(() => {
    axiosPost = jest.spyOn(axios, 'post').mockResolvedValue({});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint with the provided data', async () => {
    const redoxResults = [
      { diagnostic_id: 123, reviewed: true },
      { diagnostic_id: 456, reviewed: false },
    ];

    server.use(
      rest.post(
        '/medical/diagnostics/redox-results/bulk_reviewed',
        (req, res, ctx) => {
          expect(req.body.redox_results).toEqual(redoxResults);

          return res(ctx.status(200));
        }
      )
    );

    await saveReviewedDiagnostics(redoxResults);
  });

  it('handles errors correctly', async () => {
    axiosPost.mockRejectedValue(new Error('Failed to save'));

    const redoxResults = [
      { diagnostic_id: 123, reviewed: true },
      { diagnostic_id: 456, reviewed: false },
    ];

    await expect(saveReviewedDiagnostics(redoxResults)).rejects.toThrow(
      'Failed to save'
    );
  });
});
