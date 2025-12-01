// @flow
import type { AttachedFile } from '@kitman/common/src/utils/fileHelper';

export const mockFilePondFiles: Array<AttachedFile> = [
  {
    filename: 'foobar.pdf',
    fileType: 'application/pdf',
    fileSize: 5000,
    file: new File(['foobar'], 'foobar.pdf', {
      type: 'application/pdf',
    }),
    fileTitle: 'Custom Title',
    id: 'abc123',
    filenameWithoutExtension: 'foobar',
  },
  {
    filename: 'foo.png',
    fileType: 'image/png',
    fileSize: 2000,
    file: new File(['foo'], 'foo.png', {
      type: 'image/png',
    }),
    id: 'def456',
    filenameWithoutExtension: 'foo',
  },
  {
    filename: 'bar.jpg',
    fileType: 'image/jpg',
    fileSize: 1000,
    file: new File(['bar'], 'bar.jpg', {
      type: 'image/jpg',
    }),
    id: 'ghi789',
    filenameWithoutExtension: 'bar',
  },
  {
    filename: 'baz.jpg',
    fileType: 'image/jpg',
    fileSize: 1000,
    file: new File(['baz'], 'baz.jpg', {
      type: 'image/jpg',
    }),
    id: 'jkl891',
    filenameWithoutExtension: 'baz',
  },
];
