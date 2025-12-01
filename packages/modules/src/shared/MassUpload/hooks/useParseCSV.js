// @flow
import Papa from 'papaparse';
import isEqual from 'lodash/isEqual';
import { useState, useRef, useEffect, useCallback } from 'react';

import type { AttachedFile } from '@kitman/common/src/utils/fileHelper';
import { PARSE_STATE } from '@kitman/modules/src/shared/MassUpload/utils/consts';
import useEventTracking from '@kitman/common/src/hooks/useEventTracking';
import { IMPORT_TYPES } from '@kitman/modules/src/shared/MassUpload/New/utils/consts';
import pacEventNames from '@kitman/common/src/utils/TrackingData/src/eventNames/performanceAndCoaching';
import { getMassUploadParseCSVData } from '@kitman/common/src/utils/TrackingData/src/data/shared/getSharedEventData';

import i18n from '@kitman/common/src/utils/i18n';
import { type SetState } from '@kitman/common/src/types/react';

import type {
  ParseState,
  PapaParseConfig,
  UploadQueue,
  ReturnType,
  ParseResult,
} from '../types';

const initialQueueState: UploadQueue = {
  attachment: null,
};

const initialParseState: ParseState = PARSE_STATE.Dormant;

const initialParseResult: ParseResult = {
  data: [],
  errors: [],
  meta: null,
};

const useParseCSV = ({
  expectedHeaders,
  optionalExpectedHeaders = [],
  allowAdditionalHeaders = false,
  config,
  hasFilePondProcessed,
  hasFilePondErrored,
  allowReUpload,
  importType,
  vendor,
  setCustomErrors,
}: {
  expectedHeaders: Array<string>,
  optionalExpectedHeaders: Array<string>,
  allowAdditionalHeaders?: boolean,
  config: PapaParseConfig,
  hasFilePondProcessed: boolean,
  hasFilePondErrored: boolean,
  allowReUpload: boolean,
  importType?: $Values<typeof IMPORT_TYPES>,
  vendor?: string,
  setCustomErrors?: SetState<{
    errors: Array<string>,
    isSuccess: boolean,
  } | null>,
}): ReturnType => {
  const [queueState, setQueueState] = useState<UploadQueue>(initialQueueState);
  const [parseState, setParseState] = useState<ParseState>(initialParseState);
  const [parseResult, setParseResult] = useState(initialParseResult);
  const prevAttachment = useRef(null);
  const { trackEvent } = useEventTracking();

  const areParseHeadersCorrect = useCallback(
    (parsedHeaders: Array<string>): boolean => {
      const doParsedHeadersIncludeAllExpectedHeaders = expectedHeaders.every(
        (item) => parsedHeaders.includes(item)
      );
      const doExpectedHeadersIncludeAllParsedHeaders = parsedHeaders.every(
        (item) =>
          [...expectedHeaders, ...optionalExpectedHeaders].includes(item)
      );

      if (allowAdditionalHeaders) {
        return doParsedHeadersIncludeAllExpectedHeaders;
      }

      return (
        doParsedHeadersIncludeAllExpectedHeaders &&
        doExpectedHeadersIncludeAllParsedHeaders
      );
    },
    [expectedHeaders]
  );

  const parseCSVFile = useCallback(
    (attachment: AttachedFile): Promise<any> => {
      return new Promise((resolve, reject) => {
        Papa.parse(attachment.file, {
          ...config,
          header: true,
          complete: (result) => {
            if (result.errors.length > 0) {
              if (result.errors.some((e) => e.code === 'TooFewFields')) {
                reject(
                  new Error(
                    i18n.t(
                      'It looks like row(s) in your CSV file are not formatted correctly. Please check row(s) {{rows}} for issues and try again.',
                      { rows: result.errors.map((e) => e.row + 1).join(', ') }
                    )
                  )
                );
              } else {
                reject(result.errors.map((e) => new Error(e.message)));
              }
            }
            resolve(result);
          },
          error(err) {
            reject(new Error(err));
          },
        });
      });
    },
    [config]
  );

  useEffect(() => {
    if (hasFilePondProcessed) {
      if (hasFilePondErrored) {
        setParseState(PARSE_STATE.FilePondError);
        return;
      }

      if (
        queueState?.attachment &&
        (allowReUpload || !isEqual(prevAttachment.current, queueState))
      ) {
        setParseState(PARSE_STATE.Processing);
        prevAttachment.current = queueState;
        // $FlowIgnore We have an attachment at this stage
        parseCSVFile(queueState.attachment)
          .then((result) => {
            const headers = result?.meta?.fields;
            const preParseValidation = areParseHeadersCorrect(headers);
            setParseResult(result);
            setParseState(
              preParseValidation ? PARSE_STATE.Complete : PARSE_STATE.Error
            );
            trackEvent(
              pacEventNames.massUploadCSVParsed,
              getMassUploadParseCSVData({
                importType: importType || '',
                columnCount: result?.meta?.fields?.length || 0,
                rowCount: result?.data?.length || 0,
                vendor: vendor || null,
              })
            );
          })
          .catch((error) => {
            setParseState(PARSE_STATE.Error);
            setCustomErrors?.({
              errors: Array.isArray(error)
                ? error.map((e) => e.message)
                : [error.message],
              isSuccess: true,
            });
          });
      }
    }
  }, [
    queueState,
    parseCSVFile,
    areParseHeadersCorrect,
    hasFilePondProcessed,
    hasFilePondErrored,
    allowReUpload,
  ]);

  const onHandleParseCSV = (value: Array<AttachedFile>) => {
    setParseState(PARSE_STATE.Dormant);
    setQueueState({ attachment: value[0] });
  };

  const onRemoveCSV = () => {
    setParseState(PARSE_STATE.Dormant);
    setParseResult(initialParseResult);
    setQueueState({ attachment: null });
  };

  const isDisabled = () => {
    return parseResult?.data.length === 0 || parseState === PARSE_STATE.Error;
  };

  return {
    onHandleParseCSV,
    onRemoveCSV,
    setParseState,
    queueState,
    parseResult,
    parseState,
    isDisabled: isDisabled(),
  };
};

export default useParseCSV;
