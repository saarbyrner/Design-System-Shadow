import 'core-js/stable/structured-clone';

import { axios } from '@kitman/common/src/utils/services';
import { saveEvent, componentRender } from './testHelpers';
// eslint-disable-next-line jest/no-mocks-import
import {
  commonProps,
  savedGameEvent,
  gameEvent,
  undefinedFields,
} from '../../__mocks__/PlanningEventSidePanel';

describe('common logic for all types', () => {
  const saveNewGameEventRequest = jest
    .spyOn(axios, 'post')
    .mockImplementation(() => {
      return { data: savedGameEvent };
    });

  const saveGameEventRequest = jest
    .spyOn(axios, 'patch')
    .mockImplementation(() => {
      return { data: savedGameEvent };
    });

  describe('Attachments', () => {
    beforeEach(() => {
      window.featureFlags['event-attachments'] = true;
    });
    afterEach(() => {
      window.featureFlags['event-attachments'] = false;
    });

    const fileSize = 3746284;
    const fileType = 'file type';
    const fileTitle = 'my custom title';
    const filename = 'filename.jpg';
    const eventAttachmentCategoryIds = [1, 34];
    const unUploadedFiles = [
      {
        filename,
        fileType,
        fileSize,
        fileTitle,
        id: 3,
        filenameWithoutExtension: 'filename',
        file: { file: { size: fileSize } },
        event_attachment_category_ids: eventAttachmentCategoryIds,
      },
    ];

    const attachmentsAttributes = [
      {
        attachment: {
          filesize: fileSize,
          filetype: fileType,
          name: fileTitle,
          original_filename: filename,
        },
        event_attachment_category_ids: eventAttachmentCategoryIds,
      },
    ];

    const linkTitle = 'my custom title';
    const uri = 'https://www.google.com/maps';
    const eventAttachmentLinkCategoryIds = [12, 45, 888];
    const unUploadedLinks = [
      {
        title: linkTitle,
        uri,
        event_attachment_category_ids: eventAttachmentLinkCategoryIds,
      },
    ];

    const attachedLinksAttributes = [
      {
        attached_link: {
          title: linkTitle,
          uri,
        },
        event_attached_link_category_ids: eventAttachmentLinkCategoryIds,
      },
    ];

    const competitionId = 2;
    const gameId = gameEvent.id;

    const postUrl = '/planning_hub/events';
    const patchUrl = `/planning_hub/events/${gameId}`;

    const commonFields = {
      competition: {
        competition_categories: [],
        id: competitionId,
        name: 'Cup',
      },
      league_setup: false,
      competition_id: competitionId,
      custom_periods: [],
      duration: 60,
      editable: false,
      event_collection_complete: false,
      local_timezone: 'Europe/Dublin',
      number_of_periods: 2,
      opponent_score: 2,
      opponent_team: { id: 76, name: 'Australia' },
      organisation_team_id: 1479,
      score: 5,
      start_time: '2021-07-12T10:00:16+00:00',
      team_id: 76,
      turnaround_fixture: true,
      turnaround_prefix: '',
      type: 'game_event',
      venue_type_id: 2,
      custom_opposition_name: '',
      custom_period_duration_enabled: false,
      send_notifications: false,
    };

    it('adds transformed files to create payload when they exist and FF is on', async () => {
      await componentRender('SLIDING', {
        ...gameEvent,
        id: undefined,
        unUploadedFiles,
      });

      await saveEvent();
      expect(saveNewGameEventRequest).toHaveBeenCalledWith(
        postUrl,
        {
          ...undefinedFields,
          ...commonFields,
          attachments_attributes: attachmentsAttributes,
          unUploadedFiles,
        },
        { params: {} }
      );
    });
    it('adds attached links to create payload when they exist and FF is on', async () => {
      await componentRender('SLIDING', {
        ...gameEvent,
        id: undefined,
        unUploadedLinks,
      });

      await saveEvent();
      expect(saveNewGameEventRequest).toHaveBeenCalledWith(
        postUrl,
        {
          ...undefinedFields,
          ...commonFields,
          attached_links_attributes: attachedLinksAttributes,
          event_collection_complete: false,
        },
        { params: {} }
      );
    });

    it('adds transformed files to update payload when they exist and FF is on', async () => {
      await componentRender(
        'SLIDING',
        {
          ...gameEvent,
          competition_id: competitionId,
          unUploadedFiles,
        },
        'EDIT'
      );

      await saveEvent();
      expect(saveGameEventRequest).toHaveBeenCalledWith(
        patchUrl,
        {
          ...undefinedFields,
          ...commonFields,
          attachments_attributes: attachmentsAttributes,
          id: gameId,
          unUploadedFiles,
        },
        { params: {} }
      );
    });
    it('adds attached links to update payload when they exist and FF is on', async () => {
      await componentRender(
        'SLIDING',
        {
          ...gameEvent,
          competition_id: competitionId,
          unUploadedLinks,
        },
        'EDIT'
      );

      await saveEvent();
      expect(saveGameEventRequest).toHaveBeenCalledWith(
        patchUrl,
        {
          ...undefinedFields,
          ...commonFields,
          attached_links_attributes: attachedLinksAttributes,
          id: gameId,
        },
        { params: {} }
      );
    });

    it('calls file upload start when files exist', async () => {
      await componentRender(
        'SLIDING',
        {
          ...gameEvent,
          unUploadedFiles,
        },
        'EDIT'
      );

      await saveEvent();
      expect(commonProps.onFileUploadStart).toHaveBeenCalled();
      // this is what is coming back in the attachment on the mocked save event response
      expect(commonProps.onFileUploadStart).toHaveBeenCalledWith(
        10,
        'test name'
      );
    });

    it('calls on save event success if it exists', async () => {
      await componentRender(
        'SLIDING',
        {
          ...gameEvent,
          unUploadedFiles,
        },
        'EDIT'
      );

      await saveEvent();
      expect(commonProps.onSaveEventSuccess).toHaveBeenCalled();
    });
  });
});
