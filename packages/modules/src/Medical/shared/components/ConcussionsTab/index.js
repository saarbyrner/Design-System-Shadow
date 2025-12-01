// @flow
import { useEffect, useState } from 'react';
import getConcussionTabTableHeaders from '@kitman/modules/src/Medical/shared/components/ConcussionsTab/getTableHeaders';
import type { ComponentType } from 'react';
import { withNamespaces } from 'react-i18next';
import { useGetConcussionFormTypesQuery } from '@kitman/modules/src/Medical/shared/redux/services/medical';
import { BaselineResultsGridTranslated as BaselineResultsGrid } from './components/BaselineResultsGrid';
import { TestHistoryGridTranslated as TestHistoryResultsGrid } from './components/TestHistoryResultsGrid';
import { ConcussionResultsGridTranslated as ConcussionsResultsGrid } from './components/ConcussionResultsGrid';
import { C3LogixIframeTranslated as C3LogixIframe } from './components/C3LogixIframe';

type Props = {
  athleteId?: number,
};

const ConcussionsTab = (props: Props) => {
  const tableHeaders = getConcussionTabTableHeaders({
    athleteId: props.athleteId,
  });
  const [baselineRosterHeaders, setBaselineRosterHeaders] = useState([]);

  const { data: tempBaselineRosterHeaders, isLoading: isFormTypesLoading } =
    useGetConcussionFormTypesQuery({
      category: 'concussion',
      key: 'baseline',
    });

  const buildBaselineRosterHeaders = () => {
    let baselineHeaders = tempBaselineRosterHeaders.map((baseline) => {
      const headerName = baseline.fullname.split(' - ')[0];
      return {
        key: baseline.group,
        name: headerName,
        formatter: tableHeaders.baselineStatusFormatter,
      };
    });
    baselineHeaders =
      tableHeaders.baselineHeadersRosterView.concat(baselineHeaders);
    setBaselineRosterHeaders(baselineHeaders);
  };

  const isC3LogixEnabled = window.getFlag('c3logix-concussion');

  useEffect(() => {
    if (!isFormTypesLoading) {
      buildBaselineRosterHeaders();
    }
  }, [isFormTypesLoading]);

  return (
    <>
      <ConcussionsResultsGrid
        athleteId={props.athleteId}
        tableHeaders={
          props.athleteId != null
            ? tableHeaders.concussionHeaders
            : tableHeaders.concussionHeadersRoster
        }
      />

      {!isC3LogixEnabled && (
        <BaselineResultsGrid
          athleteId={props.athleteId}
          tableHeaders={
            props.athleteId != null
              ? tableHeaders.baselineHeaders
              : baselineRosterHeaders
          }
        />
      )}
      {!isC3LogixEnabled && props.athleteId != null && (
        <TestHistoryResultsGrid
          athleteId={props.athleteId}
          tableHeaders={tableHeaders.testHistoryHeaders}
        />
      )}
      {isC3LogixEnabled && <C3LogixIframe athleteId={props.athleteId} />}
    </>
  );
};

export const ConcussionsTabTranslated: ComponentType<Props> =
  withNamespaces()(ConcussionsTab);
export default ConcussionsTab;
