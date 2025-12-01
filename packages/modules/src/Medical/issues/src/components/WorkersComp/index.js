// @flow
import moment from 'moment';
import { formatShort } from '@kitman/common/src/utils/dateFormatter';
import { withNamespaces } from 'react-i18next';
import { TextButton, AppStatus } from '@kitman/components';
import { useDispatch, useSelector } from 'react-redux';
import { usePermissions } from '@kitman/common/src/contexts/PermissionsContext';
import { useEffect, useState } from 'react';
import { getClinicalImpressionsBodyAreas } from '@kitman/services';
import useDocuments from '@kitman/modules/src/Medical/shared/hooks/useDocuments';
import type { RequestStatus } from '@kitman/common/src/types';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { useIssue } from '../../../../shared/contexts/IssueContext';
import { getPathologyTitle } from '../../../../shared/utils';
import style from './style';
import {
  openWorkersCompSidePanel,
  printWorkersCompFromCard,
} from '../../../../shared/redux/actions';
import { useGetSidesQuery } from '../../../../shared/redux/services/medical';

type Props = {};

const WorkersComp = (props: I18nProps<Props>) => {
  const { issue } = useIssue();
  const dispatch = useDispatch();
  const { permissions } = usePermissions();
  const { documents, fetchDocuments } = useDocuments();
  const isDraft = issue.workers_comp?.status === 'draft';
  const showPrintPreview = useSelector(
    (state) => state.addWorkersCompSidePanel?.showPrintPreview.card
  );

  const [bodyAreaOptions, setBodyAreaOptions] = useState([]);
  const { data: sides = [] } = useGetSidesQuery(null);
  const [bodyAreasRequestStatus, setBodyAreasRequestStatus] =
    useState<RequestStatus>('PENDING');
  const [documentsRequestStatus, setDocumentsRequestStatus] =
    useState<RequestStatus>(null);

  const hasRequestFailed =
    bodyAreasRequestStatus === 'FAILURE' ||
    documentsRequestStatus === 'FAILURE';

  // Changing format of date from MM/DD/YYYY -> MM-DD-YYYY due to forward slash being illegal char in mac os
  // see here: https://stackoverflow.com/questions/13298434/colon-appears-as-forward-slash-when-creating-file-name
  const getFormattedWorkersTitle = (workersTitle: string): string => {
    return workersTitle.replace(/\//g, '-');
  };

  const getWorkersTitle = () => {
    let workersTitle = window.getFlag('pm-mls-emr-demo-froi')
      ? props.t('FROI')
      : props.t('WC');
    if (getPathologyTitle(issue)) {
      workersTitle = `${workersTitle} - ${getPathologyTitle(issue)}`;
    }
    if (issue?.occurrence_date) {
      workersTitle = `${workersTitle} - ${formatShort(
        moment(issue.occurrence_date)
      )}`;
    }
    return workersTitle;
  };

  const formattedWorkersTitle = getFormattedWorkersTitle(getWorkersTitle());

  useEffect(() => {
    getClinicalImpressionsBodyAreas()
      .then((data) => {
        setBodyAreaOptions(data);
        setBodyAreasRequestStatus('SUCCESS');
      })
      .catch(() => {
        setBodyAreasRequestStatus('FAILURE');
      });

    if (permissions.medical?.documents?.canView) {
      fetchDocuments(
        {
          athlete_id: issue.athlete_id,
          filename: '',
          document_date: null,
          document_category_ids: [13], // get only workers/osha's
          archived: false,
          issue_id: issue.id,
        },
        false
      )
        .then(() => setDocumentsRequestStatus('SUCCESS'))
        .catch(() => setDocumentsRequestStatus('FAILURE'));
    }
  }, []);

  const handleAfterPrint = () => {
    if (showPrintPreview) {
      dispatch(printWorkersCompFromCard(false));
    }
  };

  useEffect(() => {
    if (showPrintPreview) {
      window.print();
    }
  }, [showPrintPreview]);

  useEffect(() => {
    window.addEventListener('afterprint', handleAfterPrint());

    return () => {
      window.removeEventListener('afterprint', handleAfterPrint());
    };
  }, [showPrintPreview, handleAfterPrint]);

  return (
    <>
      <div css={style.wrapper} data-testid="WorkersComp|Container">
        <header css={style.header}>
          <h2 css={style.title}>
            {window.getFlag('pm-mls-emr-demo-froi')
              ? props.t('FROI')
              : props.t("Workers' comp claim")}
          </h2>
          <span
            css={style.pill}
            className={
              isDraft ? 'workersCompPill--draft' : 'workersCompPill--submitted'
            }
          >
            {isDraft ? props.t('Draft') : props.t('Submitted')}
          </span>

          {permissions.medical?.workersComp.canEdit && isDraft && (
            <TextButton
              text={props.t('Edit')}
              type="secondary"
              onClick={() => dispatch(openWorkersCompSidePanel())}
              kitmanDesignSystem
            />
          )}

          {!isDraft && (
            <TextButton
              text={props.t('Print')}
              type="secondary"
              onClick={() =>
                dispatch(
                  printWorkersCompFromCard(
                    true,
                    sides?.find(
                      (side) => side.id === issue.workers_comp?.side_id
                    )?.name,
                    bodyAreaOptions?.find(
                      (bodyArea) =>
                        bodyArea.id === issue.workers_comp?.body_area_id
                    )?.name
                  )
                )
              }
              kitmanDesignSystem
            />
          )}
        </header>
        <section css={style.line} data-testid="WorkersComp|Title">
          {permissions.medical?.documents?.canView &&
          documents.find(
            (document) => document?.attachment?.name === formattedWorkersTitle
          ) ? (
            <>
              <span
                className="icon-pdf"
                css={style.icon}
                data-testid="WorkersComp|Icon"
              />
              <a
                css={style.pdfLink}
                href={
                  documents.find(
                    (document) =>
                      document.attachment.name === formattedWorkersTitle
                  )?.attachment.url
                }
                target="_blank"
                rel="noreferrer"
              >{`${formattedWorkersTitle}.pdf`}</a>
            </>
          ) : (
            <span css={style.detailLabel}>{getWorkersTitle()}</span>
          )}
        </section>
        <section>
          <div css={style.line}>
            <span css={style.detailLabel}>
              {isDraft ? props.t('Last edited by:') : props.t('Submitted by:')}
            </span>{' '}
            {issue.workers_comp?.reporter_first_name}{' '}
            {issue.workers_comp?.reporter_last_name}
          </div>
          <div css={style.line}>
            <span css={style.detailLabel}>
              {isDraft ? props.t('Last edited on:') : props.t('Submitted on:')}
            </span>{' '}
            {formatShort(moment(issue.workers_comp?.updated_at))}
          </div>
        </section>
        {issue.workers_comp?.claim_number && (
          <section>
            <span css={style.detailLabel}>{props.t('Claim number:')}</span>{' '}
            {issue.workers_comp?.claim_number}
          </section>
        )}
      </div>

      {(bodyAreasRequestStatus !== 'SUCCESS' ||
        (!!documentsRequestStatus && documentsRequestStatus !== 'SUCCESS')) && (
        <AppStatus status={hasRequestFailed ? 'error' : 'loading'} />
      )}
    </>
  );
};

export const WorkersCompTranslated = withNamespaces()(WorkersComp);
export default WorkersComp;
