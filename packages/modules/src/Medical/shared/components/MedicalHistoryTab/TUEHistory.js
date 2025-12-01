// @flow
import { useCallback } from 'react';
import type { ComponentType } from 'react';
import { useDispatch } from 'react-redux';
import moment from 'moment';
import { css } from '@emotion/react';
import i18n from '@kitman/common/src/utils/i18n';
import { TextButton } from '@kitman/components';
import { withNamespaces } from 'react-i18next';
import type { MedicalHistories } from '@kitman/services/src/services/getAthleteMedicalHistory';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { openAddTUESidePanel } from '../../redux/actions';
import MedicalHistorySection from './MedicalHistorySection';
import MedicalHistoryTable from './MedicalHistoryTable';
import AddTUESidePanel from '../../containers/AddTUESidePanel';
import { ADD_TUE_BUTTON } from '../../constants/elementTags';

const styles = {
  table: css`
    .column-0,
    .column-1 {
      width: 125px;
    }
    .column-2 {
      width: 300px;
    }
    .column-4 {
      width: 250px;
    }
  `,
  attachmentCell: css`
    display: flex;
    flex-wrap: wrap;
  `,
  attachment: css`
    font-family: 'Open Sans';
    font-style: normal;
    font-weight: 600;
    font-size: 14px;
    line-height: 20px;
    margin-right: 10px;
    a {
      color: #3b4960;
    }
  `,
};

const columns = [
  {
    Header: i18n.t('Issue Date'),
    accessor: 'date',
    Cell: ({ value }) => <span>{moment(value).format('MMM D, YYYY')}</span>,
  },
  {
    Header: i18n.t('Expiry'),
    accessor: (row) => row.medical_meta.expiration_date,
    id: 'expiry',
    Cell: ({ value }) => <span>{moment(value).format('MMM D, YYYY')}</span>,
  },
  {
    Header: i18n.t('TUE name'),
    accessor: (row) => row.medical_meta.medical_name,
    id: 'tueName',
  },
  {
    Header: i18n.t('Notes'),
    accessor: 'note',
  },
  {
    Header: i18n.t('Attachment'),
    accessor: 'attachments',
    Cell: ({ value }) => {
      return (
        <div css={styles.attachmentCell}>
          {value.map((attachment) => (
            <p
              key={attachment.url + attachment.filename}
              css={styles.attachment}
            >
              <a href={attachment.url} target="_blank" rel="noreferrer">
                {attachment.filename}
              </a>
            </p>
          ))}
        </div>
      );
    },
  },
];

type TUEHistoryProps = {
  athleteId: number,
  data: MedicalHistories,
  permissions: {
    canCreate: boolean,
    canView: boolean,
  },
  hiddenFilters: Array<string>,
};

const TUEHistory = ({
  athleteId,
  permissions,
  data,
  t,
  hiddenFilters,
}: I18nProps<TUEHistoryProps>) => {
  const dispatch = useDispatch();

  const onOpenSidePanel = useCallback(() => {
    dispatch(openAddTUESidePanel({ isAthleteSelectable: false }));
  }, [dispatch]);

  if (!permissions.canView) {
    return null;
  }

  const renderAddTUEButton = () => {
    if (hiddenFilters?.includes(ADD_TUE_BUTTON)) return false;
    return (
      permissions.canCreate && window.getFlag('pm-show-tue') && (
        <TextButton
          text={t('Add therapeutic use exemptions')}
          type="secondary"
          kitmanDesignSystem
          onClick={onOpenSidePanel}
        />
      )
    );
  };

  return (
    <div data-testid="TUEHistory">
      <MedicalHistorySection>
        <MedicalHistorySection.Header>
          <MedicalHistorySection.Title>
            {t('Therapeutic use exemptions')}
          </MedicalHistorySection.Title>

          {renderAddTUEButton()}
        </MedicalHistorySection.Header>

        <MedicalHistorySection.Content>
          <MedicalHistoryTable
            columns={columns}
            data={data}
            tableCss={styles.table}
          />
        </MedicalHistorySection.Content>
      </MedicalHistorySection>
      {window.getFlag('pm-show-tue') && (
        <AddTUESidePanel athleteId={athleteId} />
      )}
    </div>
  );
};

const TUEHistoryTranslated: ComponentType<TUEHistoryProps> =
  withNamespaces()(TUEHistory);

export default TUEHistoryTranslated;
