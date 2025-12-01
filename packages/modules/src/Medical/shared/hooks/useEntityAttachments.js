// @flow
import { useState, useRef, useEffect } from 'react';
import { searchMedicalEntityAttachments } from '@kitman/services';
import type { EntityAttachmentSearchResponse } from '@kitman/services/src/services/medical/searchMedicalEntityAttachments';
import type {
  EntityAttachmentFilters,
  EntityAttachment,
} from '@kitman/modules/src/Medical/shared/types/medical';

const useEntityAttachments = () => {
  const [attachments, setAttachments] = useState<Array<EntityAttachment>>([]);
  const [nextPageToken, setNextPageToken] = useState<?string>(null);
  const abortControllerRef = useRef(null);

  const fetchAttachments = async (
    filters: EntityAttachmentFilters,
    resetList: boolean
  ) => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();
    const { signal } = abortControllerRef.current;

    const response: EntityAttachmentSearchResponse =
      await searchMedicalEntityAttachments(
        filters,
        resetList ? null : nextPageToken,
        signal
      );

    setAttachments((prev) =>
      resetList
        ? response.entity_attachments
        : [...prev, ...response.entity_attachments]
    );

    setNextPageToken(response.meta?.pagination.next_token);
  };

  const resetAttachments = () => setAttachments([]);
  const resetNextPageToken = () => setNextPageToken(null);

  useEffect(() => {
    // Cleanup function to abort the request if the component unmounts
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    attachments,
    fetchAttachments,
    resetAttachments,
    resetNextPageToken,
    nextPageToken,
  };
};

export default useEntityAttachments;
