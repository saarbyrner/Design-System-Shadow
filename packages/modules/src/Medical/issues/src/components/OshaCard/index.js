// @flow
import { useEffect, useState } from 'react';
import { withNamespaces } from 'react-i18next';
import { TextButton, AppStatus } from '@kitman/components';
import { formatShort } from '@kitman/common/src/utils/dateFormatter';
import moment from 'moment';
import { usePermissions } from '@kitman/common/src/contexts/PermissionsContext';
import { useDispatch, useSelector } from 'react-redux';
import useDocuments from '@kitman/modules/src/Medical/shared/hooks/useDocuments';
import type { RequestStatus } from '@kitman/common/src/types';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { useIssue } from '../../../../shared/contexts/IssueContext';
import style from './style';
import { getPathologyTitle } from '../../../../shared/utils';
import {
  openOshaFormSidePanel,
  printOshaFormFromCard,
} from '../../../../shared/redux/actions';

type Props = {};

const OshaCard = (props: I18nProps<Props>) => {
  const { issue } = useIssue();
  const { permissions } = usePermissions();
  const { documents, fetchDocuments } = useDocuments();
  const dispatch = useDispatch();
  const isDraft = issue.osha?.status === 'draft';
  const showPrintPreview = useSelector(
    (state) => state.addOshaFormSidePanel?.showPrintPreview.card
  );
  const [documentsRequestStatus, setDocumentsRequestStatus] =
    useState<RequestStatus>(null);

  const getOshaTitle = () => {
    let oshaTitle = props.t('OSHA');
    if (getPathologyTitle(issue)) {
      oshaTitle = `${oshaTitle} - ${getPathologyTitle(issue)}`;
    }
    if (issue?.occurrence_date) {
      oshaTitle = `${oshaTitle} - ${formatShort(
        moment(issue.occurrence_date)
      )}`;
    }
    return oshaTitle;
  };

  // Changing format of date from MM/DD/YYYY -> MM-DD-YYYY due to forward slash being illegal char in mac os
  // see here: https://stackoverflow.com/questions/13298434/colon-appears-as-forward-slash-when-creating-file-name
  const getFormattedOshaTitle = (oshaTitle: string): string => {
    return oshaTitle.replace(/\//g, '-');
  };

  const formattedOshaTitle = getFormattedOshaTitle(getOshaTitle());

  useEffect(() => {
    if (showPrintPreview) {
      window.print();
    }
  }, [showPrintPreview]);

  const handleAfterPrint = () => {
    if (showPrintPreview) {
      dispatch(printOshaFormFromCard(false));
    }
  };

  useEffect(() => {
    window.addEventListener('afterprint', handleAfterPrint());

    return () => {
      window.removeEventListener('afterprint', handleAfterPrint());
    };
  }, [showPrintPreview, handleAfterPrint]);

  useEffect(() => {
    if (permissions.medical?.documents?.canView) {
      setDocumentsRequestStatus('PENDING');
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

  return (
    <>
      <div css={style.wrapper} data-testid="OshaCard|Container">
        <header css={style.header}>
          <h2 css={style.title}>{props.t('OSHA')}</h2>
          <span
            css={style.pill}
            className={isDraft ? 'oshaPill--draft' : 'oshaPill--saved'}
          >
            {isDraft ? props.t('In progress') : props.t('Saved')}
          </span>

          {permissions.medical?.osha?.canEdit && isDraft && (
            <TextButton
              text={props.t('Edit')}
              type="secondary"
              onClick={() => {
                dispatch(openOshaFormSidePanel());
              }}
              kitmanDesignSystem
            />
          )}

          {!isDraft && (
            <TextButton
              text={props.t('Print')}
              type="secondary"
              onClick={() => {
                dispatch(printOshaFormFromCard(true));
              }}
              kitmanDesignSystem
            />
          )}
        </header>
        <section data-testid="OshaCard|Title">
          <div css={style.line}>
            {permissions.medical?.documents?.canView &&
            documents.find(
              (document) => document?.attachment?.name === formattedOshaTitle
            ) ? (
              <>
                <span
                  className="icon-pdf"
                  css={style.icon}
                  data-testid="OshaCard|Icon"
                />
                <a
                  css={style.pdfLink}
                  href={
                    documents.find(
                      (document) =>
                        document.attachment.name === formattedOshaTitle
                    )?.attachment.url
                  }
                  target="_blank"
                  rel="noreferrer"
                >{`${formattedOshaTitle}.pdf`}</a>
              </>
            ) : (
              <span css={style.detailLabel}>{getOshaTitle()}</span>
            )}
          </div>
        </section>
        <section>
          <div css={style.line}>
            <span css={style.detailLabel}>{props.t('Last edited by:')}</span>{' '}
            {issue.osha?.reporter_full_name}
          </div>
          <div css={style.line}>
            <span css={style.detailLabel}>{props.t('Last edited on:')}</span>{' '}
            {formatShort(moment(issue.osha?.updated_at))}
          </div>
        </section>
      </div>

      {!!documentsRequestStatus && documentsRequestStatus !== 'SUCCESS' && (
        <AppStatus
          status={documentsRequestStatus === 'FAILURE' ? 'error' : 'loading'}
          message="Loading"
        />
      )}
    </>
  );
};

export const OshaCardTranslated = withNamespaces()(OshaCard);
export default OshaCard;
