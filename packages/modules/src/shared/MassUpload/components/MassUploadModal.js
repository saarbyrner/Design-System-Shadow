// @flow
import { useMemo, useCallback, useState, useEffect } from 'react';
import { withNamespaces } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { TextButton, Modal, TabBar, AppStatus } from '@kitman/components';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import {
  openMassUploadModal,
  closeMassUploadModal,
} from '@kitman/modules/src/shared/MassUpload/redux/massUploadSlice';
import { add } from '@kitman/modules/src/Toasts/toastsSlice';
import RegistrationGrid from '@kitman/modules/src/LeagueOperations/technicalDebt/components/RegistrationGrid';
import { PARSE_STATE } from '@kitman/modules/src/shared/MassUpload/utils/consts';

import useParseCSV from '../hooks/useParseCSV';
import Ruleset from './Ruleset';
import ErrorState from './ErrorState';
import DormantState from './DormantState';
import style from './style';
import type { PapaParseConfig, UserTypes } from '../types';

type Props = {
  title: string,
  buttonText?: string,
  hideButton?: boolean,
  useGrid: Function,
  onProcessCSV: Function,
  expectedHeaders: Array<string>,
  optionalExpectedHeaders: Array<string>,
  config: PapaParseConfig,
  userType?: UserTypes,
  mustShowOnlyRowsWithErrorsOnParseStateComplete?: boolean,
};

const MassUploadModal = (props: I18nProps<Props>) => {
  const dispatch = useDispatch();
  const isOpen = useSelector(
    (state) => state.massUploadSlice.massUploadModal.isOpen
  );

  const [hasFilePondErrored, setHasFilePondErrored] = useState<boolean>(false);
  const [hasFilePondProcessed, setHasFilePondProcessed] =
    useState<boolean>(false);

  const {
    onRemoveCSV,
    onHandleParseCSV,
    queueState,
    parseResult,
    setParseState,
    parseState,
    isDisabled,
  } = useParseCSV({
    expectedHeaders: props.expectedHeaders,
    optionalExpectedHeaders: props.optionalExpectedHeaders,
    config: props.config,
    hasFilePondErrored,
    hasFilePondProcessed,
    allowReUpload: false,
    importType: props.userType,
  });

  const { grid, ruleset, isLoading, isError } = props.useGrid({
    parsedCsv: parseResult.data || [],
    userType: props.userType,
  });

  const clearUploadState = () => {
    onRemoveCSV();
    setHasFilePondProcessed(false);
    setHasFilePondErrored(false);
  };

  useEffect(() => {
    if (parseState === PARSE_STATE.FilePondError) {
      clearUploadState();
    }
  }, [parseState, onRemoveCSV]);

  const onCancel = () => {
    onRemoveCSV();
    dispatch(closeMassUploadModal());
  };

  const renderStatus = useCallback(() => {
    switch (parseState) {
      case PARSE_STATE.Dormant:
        return (
          <DormantState
            onRemoveCSV={onRemoveCSV}
            onParseCSV={onHandleParseCSV}
            queueState={queueState}
            userType={props.userType}
            setHasFilePondErrored={setHasFilePondErrored}
            setHasFilePondProcessed={setHasFilePondProcessed}
          />
        );
      case PARSE_STATE.Error:
        return (
          <ErrorState
            expectedFields={props.expectedHeaders}
            providedFields={parseResult?.meta?.fields || []}
            userType={props.userType}
            mustCheckExpectedHeadersOnly={
              props.optionalExpectedHeaders &&
              props.optionalExpectedHeaders.length > 0
            }
          />
        );
      case PARSE_STATE.Processing:
        return (
          <AppStatus
            message={props.t('Processing...')}
            status="loading"
            isEmbed
          />
        );
      case PARSE_STATE.Success:
        return (
          <AppStatus message={props.t('Success')} status="success" isEmbed />
        );
      case PARSE_STATE.Complete: {
        let rows = grid.rows;
        if (props.mustShowOnlyRowsWithErrorsOnParseStateComplete) {
          rows = rows.filter(({ classnames }) => classnames.is__error);
        }
        return (
          <div css={style.container}>
            <RegistrationGrid
              grid={{
                columns: grid.columns,
                rows,
              }}
              gridId={grid.id}
              isFullyLoaded
              emptyTableText={grid.emptyTableText}
              rowActions={null}
              isLoading={isLoading}
              gridHeight="35vh"
              mustShowOnlyRowsWithErrorsOnParseStateComplete={
                props.mustShowOnlyRowsWithErrorsOnParseStateComplete
              }
            />
          </div>
        );
      }
      default:
        return null;
    }
  }, [
    grid,
    parseState,
    props,
    parseResult,
    onRemoveCSV,
    onHandleParseCSV,
    queueState,
    isLoading,
  ]);

  const tabs = useMemo(
    () =>
      [
        {
          title: props.t('Instructions'),
          content: <Ruleset ruleset={ruleset} />,
        },
        {
          title: props.t('Upload'),
          content: renderStatus(),
        },
      ].map((tab, index) => ({ ...tab, tabKey: index.toString() })),
    [props, renderStatus, ruleset]
  );

  const onHandleProcessCSV = async () => {
    const csvHasBeenProcessed = await props.onProcessCSV(queueState.attachment);
    // Handles an instances where onProcessCsv does not return anything in file: CSVImporter
    if (
      (typeof csvHasBeenProcessed === 'boolean' && csvHasBeenProcessed) ||
      csvHasBeenProcessed === undefined
    ) {
      setParseState(PARSE_STATE.Success);
      if (csvHasBeenProcessed) {
        dispatch(
          add({
            status: 'SUCCESS',
            title: props.t('Import successful'),
            description: queueState?.attachment?.filename,
          })
        );
      }
    } else if (
      typeof csvHasBeenProcessed === 'boolean' &&
      !csvHasBeenProcessed
    ) {
      setParseState(PARSE_STATE.Error);
      dispatch(
        add({
          status: 'ERROR',
          title: props.t('Import failed'),
          description: queueState?.attachment?.filename,
        })
      );
    }

    setTimeout(() => {
      dispatch(closeMassUploadModal());
      clearUploadState();
    }, 2000);
  };

  return (
    <>
      {!props.hideButton && (
        <TextButton
          text={props.buttonText || props.title}
          type="primary"
          kitmanDesignSystem
          onClick={() => dispatch(openMassUploadModal())}
        />
      )}
      <Modal
        isOpen={isOpen}
        width="x-large"
        onPressEscape={onCancel}
        onClose={onCancel}
        additionalStyle={style.modalAdditionalStyle}
      >
        <Modal.Header>
          <Modal.Title>{props.title}</Modal.Title>
        </Modal.Header>

        <Modal.Content>
          <TabBar
            customStyles={style.tabCustomStyle}
            tabPanes={tabs.map((tabPane) => ({
              title: tabPane.title,
              content: tabPane.content,
            }))}
            initialTab="0"
            kitmanDesignSystem
          />
        </Modal.Content>

        <Modal.Footer
          showBorder={
            props.userType === 'growth_and_maturation' ||
            props.userType === 'baselines' ||
            props.userType === 'league_benchmarking'
          }
        >
          {parseResult.data?.length > 0 && (
            <TextButton
              text={props.t('Clear')}
              onClick={onRemoveCSV}
              type="primaryDestruct"
              isDisabled={false}
              kitmanDesignSystem
            />
          )}
          <TextButton
            text={props.t('Cancel')}
            onClick={onCancel}
            type="secondary"
            isDisabled={false}
            kitmanDesignSystem
          />
          <TextButton
            text={props.t('Upload')}
            type="primary"
            onClick={onHandleProcessCSV}
            kitmanDesignSystem
            isDisabled={isDisabled || isError}
          />
        </Modal.Footer>
      </Modal>
    </>
  );
};

export const MassUploadModalTranslated = withNamespaces()(MassUploadModal);
export default MassUploadModal;
