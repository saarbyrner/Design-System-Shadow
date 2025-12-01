// @flow
import type { ComponentType } from 'react';
import { AppStatus, ReactDataGrid } from '@kitman/components';
import type { HeaderData } from '@kitman/components/src/ReactDataGrid';
import { withNamespaces } from 'react-i18next';
import { useState, useEffect } from 'react';
import type { FormAnswersSetsFilter } from '@kitman/modules/src/Medical/shared/types/medical';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import style from '../../style';
import useConcussionFormAnswersSetsList from '../../../../hooks/useConcussionFormAnswersSetsList';

type Props = {
  athleteId?: number,
  tableHeaders: Array<HeaderData>,
};

const TestHistoryGrid = (props: I18nProps<Props>) => {
  const [filters, setFilters] = useState<FormAnswersSetsFilter>({
    athleteId: props.athleteId,
    category: 'concussion',
  });

  const { concussionSummaryList, requestStatus } =
    useConcussionFormAnswersSetsList(filters);

  const isLoading = requestStatus === 'PENDING';

  const renderTable = () => {
    return (
      <div data-testid="testHistoryList">
        {!isLoading &&
          concussionSummaryList.length > 0 &&
          props.tableHeaders.length > 0 && (
            <ReactDataGrid
              tableHeaderData={props.tableHeaders}
              tableBodyData={concussionSummaryList}
              tableStyling={{
                maxHeight: 450,
              }}
              tableGrow
              rowHeight={40}
            />
          )}
      </div>
    );
  };

  useEffect(() => {
    // This is needed for when using PlayerSelector as state doesn't update with change of athlete
    // Still persisting filters, so only athlete needs changing.
    // $FlowIgnore Constructing object to match initial filter
    setFilters((prevFilters) => ({
      ...prevFilters,
      athleteId: props.athleteId,
    }));
  }, [props.athleteId]);

  return (
    <div css={style.wrapper}>
      <div css={style.content}>
        <div css={style.sectionHeader}>
          <h2>{props.t('Test history')}</h2>
        </div>
        <div
          id="testHistoryList"
          css={
            concussionSummaryList.length
              ? style.concussionsList
              : style.concussionsListEmpty
          }
        >
          <div css={style.formsTable}>{renderTable()}</div>
        </div>
      </div>
      {requestStatus === 'PENDING' && (
        <div css={style.loader}>{props.t('Loading')} ...</div>
      )}
      {requestStatus === 'SUCCESS' && concussionSummaryList.length === 0 && (
        <div css={style.noFormsText}>{props.t('No tests completed yet')}</div>
      )}
      {requestStatus === 'FAILURE' && <AppStatus status="error" />}
    </div>
  );
};

export const TestHistoryGridTranslated: ComponentType<Props> =
  withNamespaces()(TestHistoryGrid);
export default TestHistoryGrid;
