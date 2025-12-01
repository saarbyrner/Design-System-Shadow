// @flow
import { useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import { AppStatus } from '@kitman/components';
import { TabBar } from '@kitman/playbook/components';
import {
  getAthleteData,
  getMedicalDocument,
  searchMedicalEntityAttachments,
} from '@kitman/services';
import type { AthleteData } from '@kitman/services/src/services/getAthleteData';
import { usePermissions } from '@kitman/common/src/contexts/PermissionsContext';
import type {
  DocumentRequestResponse,
  LegalDocument,
} from '@kitman/modules/src/Medical/shared/types/medical';
import useLocationSearch from '@kitman/common/src/hooks/useLocationSearch';
import type { EntityAttachmentSearchResponse } from '@kitman/services/src/services/medical/searchMedicalEntityAttachments';
import { setRequestDocumentData } from '@kitman/modules/src/Medical/document/src/redux/documentSlice';
import type { RequestStatus } from '@kitman/modules/src/Medical/shared/types';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import tabHashes from '@kitman/modules/src/Medical/shared/constants/tabHashes';
import { AppHeaderTranslated as AppHeader } from './AppHeader';
import { DocumentsTabTranslated as DocumentsTab } from './Document';
import style from './style';
import PrintView from './PrintView';

type Props = {
  documentId: number,
};

const App = (props: I18nProps<Props>) => {
  const { permissions } = usePermissions();
  const [requestStatus, setRequestStatus] = useState<RequestStatus>('PENDING');
  const [athleteData, setAthleteData] = useState<AthleteData>({});
  const [document, setDocument] = useState<?LegalDocument>(null);

  const dispatch = useDispatch();
  const shouldRequestDocumentData = useSelector(
    (state) => state.medicalDocument.requestDocumentData
  );

  const urlParams = useLocationSearch();
  const isV2Document = urlParams?.get('isV2Document') === 'true';

  const loadAthleteData = async (athleteId: number) => {
    try {
      const fetchedAthleteData = await getAthleteData(athleteId);
      setAthleteData(fetchedAthleteData);
      setRequestStatus('SUCCESS');
    } catch (err) {
      setRequestStatus('FAILURE');
    }
  };

  const getAttachmentData = async () => {
    try {
      const getAttachmentResp: EntityAttachmentSearchResponse =
        await searchMedicalEntityAttachments({
          id: props.documentId,
          entity_athlete_id: null,
          file_types: [],
          issue_occurrence: null,
        });

      const medicalAttachment = getAttachmentResp.entity_attachments[0];

      loadAthleteData(medicalAttachment.entity.athlete.id);
      setDocument(medicalAttachment);
    } catch (err) {
      setRequestStatus('FAILURE');
    }
  };

  const getDocumentData = async () => {
    try {
      const getDocumentResp: DocumentRequestResponse = await getMedicalDocument(
        props.documentId
      );

      loadAthleteData(getDocumentResp.document.athlete.id);
      setDocument(getDocumentResp.document);
    } catch (err) {
      setRequestStatus('FAILURE');
    }
  };

  useEffect(() => {
    if (isV2Document) {
      getDocumentData();
    } else {
      getAttachmentData();
    }
  }, [props.documentId]);

  useEffect(() => {
    if (shouldRequestDocumentData) {
      setRequestStatus('PENDING');
      if (isV2Document) {
        getDocumentData();
      } else {
        getAttachmentData();
      }
      dispatch(setRequestDocumentData(false));
    }
  }, [shouldRequestDocumentData]);

  const tabPanes = useMemo(
    () =>
      [
        {
          title: props.t('Document Overview'),
          content: <DocumentsTab document={document} />,
          tabHash: tabHashes.DOCUMENT,
          visible: permissions.medical.documents.canView,
        },
      ]
        .filter((tab) => tab.visible)
        .map((tab, index) => ({ ...tab, tabKey: index.toString() })),
    [athleteData, permissions, props, requestStatus]
  );

  if (requestStatus === 'PENDING') {
    return <AppStatus status="loading" message={props.t('Loading...')} />;
  }

  if (requestStatus === 'FAILURE') {
    return <AppStatus status="error" />;
  }

  return (
    <>
      {document && <PrintView document={document} athleteData={athleteData} />}
      <div css={style.gridLayout}>
        <div className="athleteMedicalProfile" css={style.content}>
          <AppHeader athleteData={athleteData} />
          <TabBar
            variant="scrollable"
            tabs={tabPanes}
            value={tabPanes[0]?.tabHash}
          />
        </div>
      </div>
    </>
  );
};

export const AppTranslated = withNamespaces()(App);
export default App;
