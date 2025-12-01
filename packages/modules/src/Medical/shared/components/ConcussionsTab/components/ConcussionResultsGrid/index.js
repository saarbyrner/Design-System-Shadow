// @flow
import type { ComponentType } from 'react';
import { AppStatus, ReactDataGrid } from '@kitman/components';
import { withNamespaces } from 'react-i18next';
import { useState, useEffect } from 'react';
import type { HeaderData } from '@kitman/components/src/ReactDataGrid';
import type { FormAnswersSetsFilter } from '@kitman/modules/src/Medical/shared/types/medical';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import style from '../../style';
import useConcussionInjuryResults from '../../../../hooks/useConcussionInjuryResults';

type Props = {
  athleteId?: number,
  tableHeaders: Array<HeaderData>,
};

const ConcussionResultsGrid = (props: I18nProps<Props>) => {
  const [filters, setFilters] = useState<FormAnswersSetsFilter>({
    athleteId: props.athleteId,
  });

  const { concussionInjurySummaryList, requestStatus } =
    useConcussionInjuryResults(filters);

  const isLoading = requestStatus === 'PENDING';

  const renderTable = () => {
    const rowHeight = props.athleteId ? 40 : 54;
    return (
      <div data-testid="concussionList">
        {!isLoading &&
          concussionInjurySummaryList.length > 0 &&
          props.tableHeaders.length > 0 && (
            <ReactDataGrid
              tableHeaderData={props.tableHeaders}
              tableBodyData={concussionInjurySummaryList}
              tableStyling={{
                maxHeight: 500,
              }}
              tableGrow
              rowHeight={rowHeight}
              headerRowHeight={36}
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
          <h2>
            {`${props.t('Concussions')}`}
            {props.athleteId != null &&
              (concussionInjurySummaryList.length > 0
                ? ` (${concussionInjurySummaryList.length})`
                : '')}
          </h2>
        </div>
        <div
          id="concussionList"
          css={
            concussionInjurySummaryList.length
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
      {requestStatus === 'SUCCESS' &&
        concussionInjurySummaryList.length === 0 && (
          <div css={style.noFormsText}>{props.t('No tests completed yet')}</div>
        )}
      {requestStatus === 'FAILURE' && <AppStatus status="error" />}
    </div>
  );
};

export const ConcussionResultsGridTranslated: ComponentType<Props> =
  withNamespaces()(ConcussionResultsGrid);
export default ConcussionResultsGrid;
