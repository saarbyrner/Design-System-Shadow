// @flow
import type { ComponentType } from 'react';
import { AppStatus, ReactDataGrid } from '@kitman/components';
import { withNamespaces } from 'react-i18next';
import { useState, useEffect } from 'react';
import type { HeaderData } from '@kitman/components/src/ReactDataGrid';
import type { FormAnswersSetsFilter } from '@kitman/modules/src/Medical/shared/types/medical';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import style from '../../style';
import useConcussionFormAnswersSetsList from '../../../../hooks/useConcussionFormAnswersSetsList';

type Props = {
  athleteId?: number,
  tableHeaders: Array<HeaderData>,
};

const BaselineResultsGrid = (props: I18nProps<Props>) => {
  const [page, setPage] = useState<number>(1);
  const [filters, setFilters] = useState<FormAnswersSetsFilter>({
    athleteId: props.athleteId,
    category: 'concussion',
    formType: 'baseline',
  });

  const { concussionSummaryList, requestStatus, isLoading, isFullyLoaded } =
    useConcussionFormAnswersSetsList(filters);

  const isFirstValueLoading = requestStatus === 'PENDING';

  const fetchMoreData = () => {
    setPage((prevNum) => prevNum + 1);
  };

  useEffect(() => {
    // $FlowIgnore doesn't like the prevState syntax for some reason
    setFilters((prevFilters) => ({ ...prevFilters, page }));
  }, [page]);

  useEffect(() => {
    // This is needed for when using PlayerSelector as state doesn't update with change of athlete
    // Still persisting filters, so only athlete needs changing.
    // $FlowIgnore Constructing object to match initial filter
    setFilters((prevFilters) => ({
      ...prevFilters,
      athleteId: props.athleteId,
    }));
  }, [props.athleteId]);

  const isAtBottom = ({ currentTarget }: SyntheticUIEvent<HTMLDivElement>) => {
    return (
      currentTarget.scrollTop + 10 >=
      currentTarget.scrollHeight - currentTarget.clientHeight
    );
  };

  const handleScroll = (event: SyntheticUIEvent<HTMLDivElement>) => {
    if (!isAtBottom(event) || isLoading || isFullyLoaded) {
      return;
    }
    fetchMoreData();
  };

  const renderTable = () => {
    const rowHeight = props.athleteId ? 40 : 60;
    return (
      <div data-testid="baselineList">
        {!isFirstValueLoading &&
          concussionSummaryList.length > 0 &&
          props.tableHeaders.length > 0 && (
            <ReactDataGrid
              className="rdg-light"
              tableHeaderData={props.tableHeaders}
              tableBodyData={concussionSummaryList}
              tableStyling={{
                maxHeight: 500,
              }}
              tableGrow
              onScroll={!props.athleteId ? handleScroll : undefined}
              rowHeight={rowHeight}
            />
          )}
        {!isFirstValueLoading && isLoading && !props.athleteId && (
          <div css={style.tableLoading}>{props.t('Loading')} ...</div>
        )}
      </div>
    );
  };

  return (
    <div css={style.wrapper}>
      <div css={style.content}>
        <div css={style.sectionHeader}>
          <h2>{props.t('Baselines')}</h2>
        </div>
        <div
          id="baselineList"
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

export const BaselineResultsGridTranslated: ComponentType<Props> =
  withNamespaces()(BaselineResultsGrid);
export default BaselineResultsGrid;
