// @flow
import { useState } from 'react';
import { convertBlobToFile } from '@kitman/common/src/utils/fileHelper';

// Types
import type { AttachedFile } from '@kitman/common/src/utils/fileHelper';

export const FileUploadFieldTranslated = ({
  updateFiles,
}: {
  updateFiles?: (Array<AttachedFile>) => void,
}) => {
  const [selectedFile, setSelectedFile] = useState('');

  const changeHandler = (event) => {
    setSelectedFile(event.target.files[0].name);
    updateFiles?.(
      convertBlobToFile([
        {
          file: event.target.files[0],
          source: { size: event.target.files[0].size },
          filenameWithoutExtension: event.target.files[0].name.split('.')[0],
        },
      ])
    );
  };

  return (
    <div>
      <input
        type="file"
        name="file"
        onChange={changeHandler}
        data-testid="file-input-mock"
      />
      <p>{selectedFile}</p>
    </div>
  );
};
