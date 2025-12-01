// @flow
import { useState, useEffect } from 'react';
import { withNamespaces } from 'react-i18next';
import { css } from '@emotion/react';
import { colors } from '@kitman/common/src/variables';
import {
  AppStatus,
  DataGrid,
  DelayedLoadingFeedback,
  EditableInput,
} from '@kitman/components';
import { getTerminologies } from '@kitman/services';
import type { Terminologies } from '@kitman/services/src/services/getTerminologies';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import saveTerminology from './services/saveTerminology';

const styles = {
  section: css`
    background: ${colors.p06};
    border: 1px solid ${colors.s13};
    padding: 24px;
  `,
  header: css`
    align-items: center;
    display: flex;
    justify-content: space-between;
  `,
  table: css`
    margin-top: 48px;
  `,
};

type RequestStatus = 'LOADING' | 'FAILURE' | null;

type Props = {};

const TerminologySettings = (props: I18nProps<Props>) => {
  const [initialDataRequestStatus, setInitialDataRequestStatus] =
    useState<RequestStatus>('LOADING');
  const [saveRequestStatus, setSaveRequestStatus] =
    useState<RequestStatus>(null);
  const [terminologies, setTerminologies] = useState<Terminologies>([]);

  useEffect(() => {
    getTerminologies().then(
      (response) => {
        setTerminologies(response);
        setInitialDataRequestStatus(null);
      },
      () => setInitialDataRequestStatus('FAILURE')
    );
  }, []);

  const onSubmitTerminology = (editedTerminology) => {
    setSaveRequestStatus('LOADING');

    saveTerminology(editedTerminology).then(
      () => {
        setTerminologies((prevTerminologies) =>
          prevTerminologies.map((terminology) =>
            terminology.key === editedTerminology.key
              ? {
                  ...terminology,
                  customName: editedTerminology.value,
                }
              : terminology
          )
        );
        setSaveRequestStatus(null);
      },
      () => setSaveRequestStatus('FAILURE')
    );
  };

  if (
    initialDataRequestStatus === 'FAILURE' ||
    saveRequestStatus === 'FAILURE'
  ) {
    return <AppStatus status="error" />;
  }

  if (initialDataRequestStatus === 'LOADING') {
    return <DelayedLoadingFeedback />;
  }

  return (
    <section css={styles.section}>
      <header css={styles.header}>
        <h3 className="kitmanHeading--L2">{props.t('Terminology')}</h3>
      </header>
      <div css={styles.table}>
        <DataGrid
          columns={[
            {
              id: 'original_name_colummn',
              content: props.t('Original name'),
              isHeader: true,
            },
            {
              id: 'custom_name_colummn',
              content: props.t('Custom name'),
              isHeader: true,
            },
          ]}
          rows={terminologies.map((terminology, index) => ({
            id: index,
            cells: [
              {
                id: 'original_name_cell',
                content: terminology.originalName,
              },
              {
                id: 'custom_name_row',
                content: (
                  <EditableInput
                    value={terminology.customName || ''}
                    onSubmit={(value) =>
                      onSubmitTerminology({
                        key: terminology.key,
                        value,
                      })
                    }
                    isDisabled={saveRequestStatus === 'LOADING'}
                    maxWidth={200}
                  />
                ),
              },
            ],
          }))}
        />
      </div>
    </section>
  );
};

export const TerminologySettingsTranslated =
  withNamespaces()(TerminologySettings);
export default TerminologySettings;
