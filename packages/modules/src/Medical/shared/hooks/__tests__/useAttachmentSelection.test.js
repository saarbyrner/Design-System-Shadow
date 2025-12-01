import { renderHook } from '@testing-library/react-hooks';
import TestRenderer from 'react-test-renderer';
import useAttachmentSelection from '../useAttachmentSelection';

describe('useAttachmentSelection hook', () => {
  const { act } = TestRenderer;
  const documents = [
    { attachment: { id: 123, filetype: 'pdf', filename: 'some_doc.pdf' } },
    { attachment: { id: 567, filetype: 'movie', filename: 'some_media.mov' } },
    { attachment: { id: 987, filetype: 'png', filename: 'some_image.jpg' } },
  ];
  it('returns the initial data properly', () => {
    const { result } = renderHook(() => useAttachmentSelection());

    expect(result.current).toHaveProperty('allAttachmentsChecked');
    expect(result.current).toHaveProperty('exportAttachments');
    expect(result.current).toHaveProperty('updateSingleAttachment');
    expect(result.current).toHaveProperty('updateAllAttachments');

    expect(result.current.allAttachmentsChecked).toEqual(false);
    expect(result.current.exportAttachments).toEqual([]);
  });

  it('updates one attachment properly', () => {
    const { result } = renderHook(() => useAttachmentSelection());

    act(() => {
      result.current.updateSingleAttachment(
        123,
        true,
        'pdf',
        'some_doc.pdf',
        documents
      );
    });

    expect(result.current.exportAttachments.length).toEqual(1);
    expect(result.current.exportAttachments).toEqual([
      { id: 123, filetype: 'pdf', filename: 'some_doc.pdf' },
    ]);

    act(() => {
      result.current.updateSingleAttachment(
        123,
        false,
        'pdf',
        'some_doc.pdf',
        documents
      );
    });

    expect(result.current.exportAttachments.length).toEqual(0);
  });

  it('single attachment that selects all updates values accordingly', () => {
    const { result } = renderHook(() => useAttachmentSelection());

    act(() => {
      result.current.updateSingleAttachment(
        123,
        true,
        'pdf',
        'some_doc.pdf',
        documents
      );
    });
    expect(result.current.exportAttachments.length).toEqual(1);
    expect(result.current.exportAttachments).toEqual([
      { id: 123, filetype: 'pdf', filename: 'some_doc.pdf' },
    ]);
    expect(result.current.allAttachmentsChecked).toEqual(false);

    act(() => {
      result.current.updateSingleAttachment(
        567,
        true,
        'movie',
        'some_media.mov',
        documents
      );
    });
    expect(result.current.exportAttachments.length).toEqual(2);
    expect(result.current.exportAttachments).toEqual([
      { id: 123, filetype: 'pdf', filename: 'some_doc.pdf' },
      { id: 567, filetype: 'movie', filename: 'some_media.mov' },
    ]);
    expect(result.current.allAttachmentsChecked).toEqual(false);

    act(() => {
      result.current.updateSingleAttachment(
        987,
        true,
        'png',
        'some_image.jpg',
        documents
      );
    });
    expect(result.current.exportAttachments.length).toEqual(3);
    expect(result.current.exportAttachments).toEqual([
      { id: 123, filetype: 'pdf', filename: 'some_doc.pdf' },
      { id: 567, filetype: 'movie', filename: 'some_media.mov' },
      { id: 987, filetype: 'png', filename: 'some_image.jpg' },
    ]);
    expect(result.current.allAttachmentsChecked).toEqual(true);

    act(() => {
      result.current.updateSingleAttachment(
        567,
        false,
        'movie',
        'some_media.mov',
        documents
      );
    });
    expect(result.current.exportAttachments.length).toEqual(2);
    expect(result.current.exportAttachments).toEqual([
      { id: 123, filetype: 'pdf', filename: 'some_doc.pdf' },
      { id: 987, filetype: 'png', filename: 'some_image.jpg' },
    ]);
    expect(result.current.allAttachmentsChecked).toEqual(false);
  });

  it('updates all attachments properly', () => {
    const { result } = renderHook(() => useAttachmentSelection());

    act(() => {
      result.current.updateAllAttachments(true, documents);
    });
    expect(result.current.exportAttachments.length).toEqual(3);
    expect(result.current.exportAttachments).toEqual([
      { id: 123, filetype: 'pdf', filename: 'some_doc.pdf' },
      { id: 567, filetype: 'movie', filename: 'some_media.mov' },
      { id: 987, filetype: 'png', filename: 'some_image.jpg' },
    ]);
    expect(result.current.allAttachmentsChecked).toEqual(true);

    act(() => {
      result.current.updateAllAttachments(false, documents);
    });
    expect(result.current.exportAttachments.length).toEqual(0);
    expect(result.current.allAttachmentsChecked).toEqual(false);
  });
});
