// @flow
import { useState, useMemo } from 'react';
import type { ComponentType } from 'react';
import uuid from 'uuid';
import { Checkbox } from '@kitman/components';
import { withNamespaces } from 'react-i18next';
import { saveRedoxReviewed } from '@kitman/services';
import {
  TextHeader,
  TextCell,
  TextCellTooltip,
} from '@kitman/components/src/TableCells';
import moment from 'moment';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import DataTable from '@kitman/modules/src/Medical/shared/components/DataTable';
import type { DiagnosticResultsBlock } from '@kitman/modules/src/Medical/shared/types';
import style from '@kitman/modules/src/Medical/diagnostics/src/components/DiagnosticOverviewTab/styles';
import PatientNotes from './components/PatientNotes';

type Props = {
  resultBlocks: DiagnosticResultsBlock,
  diagnosticId: number,
  setRequestStatus: Function,
};

const LabReport = (props: I18nProps<Props>) => {
  const {
    reviewed,
    result_group_id: resultGroupId,
    completed_at: completedAt,
    patient_notes: patientNotes,
  } = props.resultBlocks;

  const [isReviewed, setIsReviewed] = useState<boolean>(reviewed || false);

  const labsData = props.resultBlocks.results;

  const buildColumns = useMemo(() => {
    const columns = [
      {
        Header: () => <TextHeader key={uuid()} value={props.t('Test name')} />,
        accessor: 'testName',
        width: 310,
        Cell: ({ cell: { value } }) => (
          <TextCell
            key={uuid()}
            data-testid="LabReport|TestName"
            value={value}
          />
        ),
      },
      {
        Header: () => <TextHeader key={uuid()} value={props.t('Status')} />,
        accessor: 'status',
        width: 200,
        Cell: ({ cell: { value } }) => (
          <TextCell key={uuid()} data-testid="LabReport|Status" value={value} />
        ),
      },
      {
        Header: () => <TextHeader key={uuid()} value={props.t('Result')} />,
        accessor: 'result',
        width: 90,
        Cell: ({ cell: { value } }) => (
          <span css={style.resultCell}>
            <TextCell
              key={uuid()}
              data-testid="LabReport|Result"
              value={value}
            />
          </span>
        ),
      },
      {
        Header: () => <TextHeader key={uuid()} value={props.t('Flag')} />,
        accessor: 'flag',
        width: 210,
        Cell: ({ cell: { value } }) => (
          <TextCell key={uuid()} data-testid="LabReport|Flag" value={value} />
        ),
      },
      {
        Header: () => <TextHeader key={uuid()} value={props.t('Units')} />,
        accessor: 'units',
        width: 210,
        Cell: ({ cell: { value } }) => (
          <TextCell key={uuid()} data-testid="LabReport|Units" value={value} />
        ),
      },
      {
        Header: () => (
          <TextHeader key={uuid()} value={props.t('Reference interval')} />
        ),
        accessor: 'referenceInterval',
        width: 210,
        Cell: ({ cell: { value } }) => (
          <TextCell
            key={uuid()}
            data-testid="LabReport|ReferenceInterval"
            value={value}
          />
        ),
      },
      {
        Header: () => <TextHeader key={uuid()} value={props.t('Comment')} />,
        accessor: 'comment',
        width: 210,
        Cell: ({ cell: { value } }) =>
          value === '--' ? (
            <TextCell
              key={uuid()}
              data-testid="LabReport|ReferenceInterval"
              value={value}
            />
          ) : (
            <TextCellTooltip
              key={uuid()}
              longText={value}
              valueLimit={1}
              fileType="text/plain"
              onlyShowIcon
            />
          ),
      },
    ];

    return columns;
  }, [labsData]);

  const buildResult = (result, flag) => {
    return <span css={flag?.length && style.abnormalFlag}>{result}</span>;
  };

  const buildData = () => {
    return labsData.map((item) => {
      return {
        testName: item?.description || '--',
        status: item?.status || '--',
        result: buildResult(item?.value, item?.abnormal_flag),
        flag: item?.abnormal_flag || '--',
        units: item?.units || '--',
        referenceInterval: item?.reference || '--',
        comment: item?.notes || '--',
      };
    });
  };

  return (
    <section
      css={style.resultsSection}
      data-testid="DiagnosticOverviewTab|LabReport"
    >
      <div css={style.resultsSectionHeader}>
        <h2>
          {props.t('Results')}
          {completedAt ? ` - ${moment(completedAt).format('L hh:mm a')}` : null}
        </h2>
        <Checkbox
          id="LabReportReviewed"
          isChecked={isReviewed}
          label={props.t('Marked as reviewed')}
          toggle={() => {
            setIsReviewed(!isReviewed);
            saveRedoxReviewed(resultGroupId, props.diagnosticId, !isReviewed)
              .then(() => props.setRequestStatus('SUCCESS'))
              .catch((err) => {
                // eslint-disable-next-line no-console
                console.error(
                  'ERROR IN Lab Report saveRedoxReviewed catch: ',
                  err.responseText
                );
                // props.setRequestStatus('FAILURE');
              });
          }}
        />
      </div>

      {patientNotes?.length > 0 && (
        <PatientNotes {...props} patientNotes={patientNotes} />
      )}
      <DataTable columns={buildColumns} data={buildData()} />
    </section>
  );
};

export const LabReportTranslated: ComponentType<Props> =
  withNamespaces()(LabReport);
export default LabReport;
