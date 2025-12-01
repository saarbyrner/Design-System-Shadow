import { rest } from 'msw';
import { entityAttachmentSearchResponse } from './mocks/entityAttachments.mock';

const handler = rest.post(
  `/medical/entity_attachments/search`,
  async (req, res, ctx) => {
    const requestData = await req.json();
    const issueOccurrence = requestData.filters.issue_occurrence;

    if (issueOccurrence?.type.toLowerCase() === 'illness') {
      const attachments = entityAttachmentSearchResponse.entity_attachments;
      const entityAttachments = attachments.filter(
        (entry) =>
          entry.entity.illness_occurrences.length > 0 &&
          entry.entity.illness_occurrences.find(
            (occurrence) =>
              occurrence.id === issueOccurrence.id &&
              occurrence.issue_type.toLowerCase() === 'illness'
          )
      );
      return res(
        ctx.json({
          entity_attachments: entityAttachments,
          meta: {
            pagination: {
              next_token: 'sometoken',
            },
          },
        })
      );
    }
    if (issueOccurrence?.type.toLowerCase() === 'injury') {
      const attachments = entityAttachmentSearchResponse.entity_attachments;
      const entityAttachments = attachments.filter(
        (entry) =>
          entry.entity.injury_occurrences.length > 0 &&
          entry.entity.injury_occurrences.find(
            (occurrence) =>
              occurrence.id === issueOccurrence.id &&
              occurrence.issue_type.toLowerCase() === 'injury'
          )
      );
      return res(
        ctx.json({
          entity_attachments: entityAttachments,
          meta: {
            pagination: {
              next_token: 'sometoken',
            },
          },
        })
      );
    }

    return res(ctx.json(entityAttachmentSearchResponse));
  }
);

export { handler, entityAttachmentSearchResponse };
