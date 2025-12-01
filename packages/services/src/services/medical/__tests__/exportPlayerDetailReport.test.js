import { axios } from '@kitman/common/src/utils/services';
import { data } from '../../../mocks/handlers/medical/exportPlayerDetailReport';
import exportPlayerDetailReport, {
  EXPORT_PLAYER_DETAIL_REPORT_URL,
} from '../exportPlayerDetailReport';

describe('exportPlayerDetailReport', () => {
  const populations = { squads: [1] };
  const columns = ['name', 'squad'];
  const filters = {};
  const includePastPlayers = false;
  const format = 'csv';

  it('calls the correct endpoint and returns the correct value', async () => {
    const returnedData = await exportPlayerDetailReport(
      populations,
      columns,
      filters,
      includePastPlayers,
      format
    );
    expect(returnedData).toEqual(data);
  });

  describe('Mock axios', () => {
    let request;
    beforeEach(() => {
      request = jest.spyOn(axios, 'post');
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('calls the correct endpoint with correct body data in the request', async () => {
      await exportPlayerDetailReport(
        populations,
        columns,
        filters,
        includePastPlayers,
        format
      );
      expect(request).toHaveBeenCalledTimes(1);
      expect(request).toHaveBeenCalledWith(EXPORT_PLAYER_DETAIL_REPORT_URL, {
        populations,
        columns,
        filters,
        include_past_players: includePastPlayers,
        format,
      });
    });

    it('calls the correct endpoint with different populations and columns', async () => {
      const newPopulations = { athletes: [10, 20] };
      const newColumns = ['dob', 'email'];

      await exportPlayerDetailReport(
        newPopulations,
        newColumns,
        filters,
        includePastPlayers,
        format
      );
      expect(request).toHaveBeenCalledTimes(1);
      expect(request).toHaveBeenCalledWith(EXPORT_PLAYER_DETAIL_REPORT_URL, {
        populations: newPopulations,
        columns: newColumns,
        filters,
        include_past_players: includePastPlayers,
        format,
      });
    });

    it('calls the correct endpoint with includePastPlayers set to true', async () => {
      const newPopulations = { squads: [1] };
      const newColumns = ['name'];
      const newIncludePastPlayers = true;

      await exportPlayerDetailReport(
        newPopulations,
        newColumns,
        filters,
        newIncludePastPlayers,
        format
      );
      expect(request).toHaveBeenCalledTimes(1);
      expect(request).toHaveBeenCalledWith(EXPORT_PLAYER_DETAIL_REPORT_URL, {
        populations: newPopulations,
        columns: newColumns,
        filters,
        include_past_players: newIncludePastPlayers,
        format,
      });
    });

    it('calls the correct endpoint with a different export format', async () => {
      const newPopulations = { squads: [1] };
      const newColumns = ['name'];
      const newFormat = 'xlsx';

      await exportPlayerDetailReport(
        newPopulations,
        newColumns,
        filters,
        includePastPlayers,
        newFormat
      );
      expect(request).toHaveBeenCalledTimes(1);
      expect(request).toHaveBeenCalledWith(EXPORT_PLAYER_DETAIL_REPORT_URL, {
        populations: newPopulations,
        columns: newColumns,
        filters,
        include_past_players: includePastPlayers,
        format: newFormat,
      });
    });

    it('handles API error gracefully', async () => {
      const errorMessage = 'Network Error';

      request.mockRejectedValue(new Error(errorMessage));

      await expect(
        exportPlayerDetailReport(
          populations,
          columns,
          filters,
          includePastPlayers,
          format
        )
      ).rejects.toThrow(errorMessage);

      expect(request).toHaveBeenCalledTimes(1);
      expect(request).toHaveBeenCalledWith(EXPORT_PLAYER_DETAIL_REPORT_URL, {
        populations,
        columns,
        filters,
        include_past_players: includePastPlayers,
        format,
      });
    });
  });
});
