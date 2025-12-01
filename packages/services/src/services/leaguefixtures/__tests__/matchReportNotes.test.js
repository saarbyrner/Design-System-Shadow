import { axios } from '@kitman/common/src/utils/services';
import { getMatchReportNotes, saveMatchReportNotes } from '../matchReportNotes';

describe('matchReportNotes', () => {
  it('returns the relevant event_notes from getMatchReportNotes', async () => {
    jest
      .spyOn(axios, 'get')
      .mockResolvedValue({ data: { event_notes: 'Test note' } });
    expect(await getMatchReportNotes({ eventId: 1111 })).toEqual({
      event_notes: 'Test note',
    });
    expect(axios.get).toHaveBeenCalledWith(
      '/planning_hub/events/1111/freetext_values?freetext_component_names[]=event_notes'
    );
  });

  it('returns the relevant event_notes from getMatchReportNotes as supervisor view', async () => {
    jest
      .spyOn(axios, 'get')
      .mockResolvedValue({ data: { event_notes: 'Test note' } });
    expect(
      await getMatchReportNotes({ eventId: 1111, supervisorView: true })
    ).toEqual({
      event_notes: 'Test note',
    });
    expect(axios.get).toHaveBeenCalledWith(
      '/planning_hub/events/1111/freetext_values?freetext_component_names[]=event_notes&supervisor_view=true'
    );
  });

  it('uses saveMatchReportNotes to send and save the relevant data', async () => {
    const updatedText = { event_notes: 'TEST TEXT RIGHT HERE' };
    jest.spyOn(axios, 'post').mockResolvedValue({ data: updatedText });
    expect(await saveMatchReportNotes(1111, updatedText.event_notes)).toEqual(
      updatedText
    );
    expect(axios.post).toHaveBeenCalledWith(
      '/planning_hub/events/1111/freetext_values',
      {
        freetext_components: [
          { name: 'event_notes', value: 'TEST TEXT RIGHT HERE' },
        ],
      }
    );
  });
});
