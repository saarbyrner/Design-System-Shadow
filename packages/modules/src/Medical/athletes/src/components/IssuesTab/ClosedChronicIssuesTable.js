// @flow
import { withNamespaces } from 'react-i18next';
import { useMemo } from 'react';
import type { ChronicIssue } from '@kitman/services/src/services/medical/getAthleteChronicIssues';
import { DataGrid } from '@kitman/components';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import generateRows from './utils';
import styles from './styles';

type Props = {
  athleteId: string,
  issues: Array<ChronicIssue>,
  isPastAthlete: boolean,
};

const ClosedChronicIssuesTable = (props: I18nProps<Props>) => {
  const columns = [
    {
      id: 'occurrenceDate',
      content: props.t('Onset Date'),
      isHeader: true,
    },
    {
      id: 'type',
      content: props.t('Type'),
      isHeader: true,
    },
    {
      id: 'title',
      content: props.t('Title'),
      isHeader: true,
    },
    {
      id: 'status',
      content: props.t('Date of resolution'),
      isHeader: true,
    },
  ];

  const rows = useMemo(() => {
    return generateRows(
      props.issues,
      props.athleteId,
      props.t,
      styles,
      props.isPastAthlete,
      true
    );
  }, [props.athleteId, props.issues, props]);

  return (
    <div css={styles.table}>
      <h3 css={styles.tableTitle}>{props.t('Prior Chronic Conditions')}</h3>
      <DataGrid
        columns={columns}
        rows={rows}
        isTableEmpty={props.issues.length === 0}
        emptyTableText={props.t('No prior chronic condition added')}
        scrollOnBody
      />
    </div>
  );
};

export const ClosedChronicIssuesTableTranslated = withNamespaces()(
  ClosedChronicIssuesTable
);
export default ClosedChronicIssuesTable;
