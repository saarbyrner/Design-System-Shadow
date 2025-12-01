// @flow
import { useCallback } from 'react';
import type { ComponentType } from 'react';
import { useDispatch } from 'react-redux';
import moment from 'moment';
import { css } from '@emotion/react';
import i18n from '@kitman/common/src/utils/i18n';
import { TextButton } from '@kitman/components';
import type { MedicalHistories } from '@kitman/services/src/services/getAthleteMedicalHistory';
import { withNamespaces } from 'react-i18next';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { openAddVaccinationSidePanel } from '../../redux/actions';
import MedicalHistorySection from './MedicalHistorySection';
import MedicalHistoryTable from './MedicalHistoryTable';
import AddVaccinationSidePanel from '../../containers/AddVaccinationSidePanel';
import { ADD_VACCINATION_BUTTON } from '../../constants/elementTags';

const styles = {
  table: css`
    .column-0 {
      width: 300px;
    }
    .column-1,
    .column-2,
    .column-3,
    .column-5 {
      width: 125px;
    }
    .column-6 {
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
    Header: i18n.t('Current Vaccination'),
    accessor: (row) => row.medical_meta.medical_name,
  },
  {
    Header: i18n.t('Issue Date'),
    accessor: 'date',
    Cell: ({ value }) => <span>{moment(value).format('MMM D, YYYY')}</span>,
  },
  {
    Header: i18n.t('Batch number'),
    accessor: (row) => row.medical_meta.batch_number,
    id: 'batchNumber',
  },
  {
    Header: i18n.t('Expiry'),
    accessor: (row) => row.medical_meta.expiration_date,
    id: 'expiry',
    Cell: ({ value }) => <span>{moment(value).format('MMM D, YYYY')}</span>,
  },
  {
    Header: i18n.t('Notes'),
    accessor: 'note',
  },
  {
    Header: i18n.t('Renewal'),
    accessor: (row) => row.medical_meta.renewal_date,
    id: 'renewal',
    Cell: ({ value }) => <span>{moment(value).format('MMM D, YYYY')}</span>,
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

type VaccinationsHistoryProps = {
  athleteId: number,
  data: MedicalHistories,
  permissions: {
    canCreate: boolean,
    canView: boolean,
  },
  hiddenFilters: Array<string>,
};

const VaccinationsHistory = ({
  t,
  athleteId,
  data,
  permissions,
  hiddenFilters,
}: I18nProps<VaccinationsHistoryProps>) => {
  const dispatch = useDispatch();

  const onOpenSidePanel = useCallback(() => {
    dispatch(openAddVaccinationSidePanel({ isAthleteSelectable: false }));
  }, [dispatch]);

  if (!permissions.canView) {
    return null;
  }

  const renderAddVaccinationButton = () => {
    if (hiddenFilters?.includes(ADD_VACCINATION_BUTTON)) return null;
    return (
      permissions.canCreate && (
        <TextButton
          text={i18n.t('Add vaccination')}
          type="secondary"
          kitmanDesignSystem
          onClick={onOpenSidePanel}
        />
      )
    );
  };

  return (
    <div data-testid="VaccinationsHistory">
      <MedicalHistorySection>
        <MedicalHistorySection.Header>
          <MedicalHistorySection.Title>
            {t('Vaccinations')}
          </MedicalHistorySection.Title>
          {renderAddVaccinationButton()}
        </MedicalHistorySection.Header>

        <MedicalHistorySection.Content>
          <MedicalHistoryTable
            columns={columns}
            data={data}
            tableCss={styles.table}
          />
        </MedicalHistorySection.Content>
      </MedicalHistorySection>
      <AddVaccinationSidePanel athleteId={athleteId} />
    </div>
  );
};

const VaccinationsHistoryTranslated: ComponentType<VaccinationsHistoryProps> =
  withNamespaces()(VaccinationsHistory);

export default VaccinationsHistoryTranslated;
