// @flow
import { withNamespaces } from 'react-i18next';
import { useRef, useState, useEffect } from 'react';
import isEqual from 'lodash/isEqual';
import { useDispatch } from 'react-redux';

import type { AttachedFile } from '@kitman/common/src/utils/fileHelper';
import { MassUploadModalTranslated as MassUploadModal } from '@kitman/modules/src/shared/MassUpload/components/MassUploadModal';
import { GRID_CONFIG } from '@kitman/modules/src/shared/MassUpload/utils';
import useGrowthAndMaturationUploadGrid from '@kitman/modules/src/GrowthAndMaturation/src/hooks/useGrowthAndMaturationUploadGrid';
import useBaselinesUploadGrid from '@kitman/modules/src/GrowthAndMaturation/src/hooks/useBaselinesUploadGrid';
import massUpload from '@kitman/modules/src/shared/MassUpload/services/massUpload';
import uploadAttachment from '@kitman/services/src/services/uploadAttachment';
import { add } from '@kitman/modules/src/Toasts/toastsSlice';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { IMPORT_TYPES } from '@kitman/modules/src/shared/MassUpload/New/utils/consts';
import getExpectedHeaders from '@kitman/modules/src/shared/MassUpload/New/utils/getExpectedHeaders';

type Props = {
  type: $Values<typeof IMPORT_TYPES>,
};

const CSVImporter = (props: I18nProps<Props>) => {
  const [uploadedFile, setUploadedFile] = useState(null);
  const prevCountRef = useRef(null);
  const dispatch = useDispatch();

  const dispatchToast = (status: string, title: string, fileName: string) => {
    dispatch(
      add({
        status,
        title,
        description: fileName,
      })
    );
  };

  const onUploadCSV = (formAttachment: AttachedFile): any => {
    const file = formAttachment.file;
    uploadAttachment(file, formAttachment.filename)
      .then((response) => {
        massUpload(response.attachment_id, `${props.type}_import`).catch(() => {
          dispatchToast('ERROR', 'Import failed', formAttachment.filename);
        });
      })
      .catch(() => {
        dispatchToast('ERROR', 'Import failed', formAttachment.filename);
      });
  };

  useEffect(() => {
    if (uploadedFile && !isEqual(prevCountRef.current, uploadedFile)) {
      prevCountRef.current = uploadedFile;
      onUploadCSV(uploadedFile);
    }
  }, [uploadedFile]);

  const getTypeProperties = () => {
    switch (props.type) {
      case IMPORT_TYPES.GrowthAndMaturation:
        return {
          title: props.t('Import a growth and maturation assessment file'),
          gridHook: useGrowthAndMaturationUploadGrid,
          userType: 'growth_and_maturation',
        };
      case IMPORT_TYPES.Baselines:
      default:
        return {
          title: props.t('Import a Khamis-Roche baseline file'),
          gridHook: useBaselinesUploadGrid,
          userType: 'baselines',
        };
    }
  };

  return (
    <MassUploadModal
      hideButton
      buttonText={props.t('Import a CSV file')}
      title={getTypeProperties().title}
      useGrid={getTypeProperties().gridHook}
      userType={getTypeProperties().userType}
      onProcessCSV={(file) => {
        setUploadedFile(file);
      }}
      expectedHeaders={getExpectedHeaders(props.type)}
      config={GRID_CONFIG}
    />
  );
};

export const CSVImporterTranslated = withNamespaces()(CSVImporter);
export default CSVImporter;
