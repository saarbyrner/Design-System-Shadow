/* eslint-disable jest/no-mocks-import */

import {
  mockedAttachments,
  createActionsMock,
} from '../__mocks__/helpers.mock';
import { createRows } from '../helpers';

describe('createRows', () => {
  it('should transform the attachments to rows properly', () => {
    const rows = createRows({
      attachments: mockedAttachments,
      createActionsParams: createActionsMock,
    });

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const mockAttachment = mockedAttachments[i];
      expect(row.categories).toEqual(
        mockAttachment.event_attachment_categories
      );
      expect(row.url).toEqual(mockAttachment.attachment.download_url);
      expect(row.id).toEqual(mockAttachment.attachment.id);
      expect(row.titlename).toEqual(mockAttachment.attachment.name);
      expect(row.filename).toEqual(mockAttachment.attachment.filename);
      expect(row.filetype).toEqual(mockAttachment.attachment.filetype);
      expect(row.date_uploaded).toEqual(
        mockAttachment.attachment.attachment_date
      );
    }
  });
});
