// @flow
import { useRef, useState, useEffect } from 'react';
import type { ComponentType } from 'react';
import type { SelectOption as Option } from '@kitman/components/src/types';
import { colors } from '@kitman/common/src/variables';
import { css } from '@emotion/react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { withNamespaces } from 'react-i18next';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { TreatmentSession } from '../../../../types';
import TreatmentCard from '../../../../containers/TreatmentCard';
import EditTreatmentCard from '../../../../containers/EditTreatmentCard';

type Props = {
  initialiseState: Function,
  isLoading: boolean,
  isReviewMode: boolean,
  onReachingEnd: Function,
  removeSelectedAthlete: Function,
  selectedAthletes: Array<number>,
  showAthleteInformation: boolean,
  staffUsers: Array<Option>,
  treatmentSessions: Array<TreatmentSession>,
};

const TreatmentsCardList = (props: I18nProps<Props>) => {
  const [treatmentToReplicate, setTreatmentToReplicate] =
    useState<TreatmentSession>({});
  const treatmentCardListRef = useRef();

  const style = {
    loadingText: css`
      color: ${colors.neutral_300};
      font-size: 14px;
      font-weight: normal;
      line-height: 20px;
      margin-top: 24px;
      text-align: center;
    `,
    treatmentCardList: css`
      height: calc(
        100vh - ${treatmentCardListRef.current?.getBoundingClientRect().y}px -
          20px
      );
      overflow-y: scroll;
    `,
    treatmentCardListEmpty: css`
      height: auto;
    `,
  };

  useEffect(() => {
    // once we are in review mode props.selectedAthletes can only decrease in length
    // so here initialise the state when we go into review mode
    if (props.selectedAthletes && props.isReviewMode) {
      props.initialiseState(props.selectedAthletes, treatmentToReplicate);
    }
  }, [props.isReviewMode]);

  const getTreatmentListContent = () => {
    if (props.isReviewMode) {
      return (
        props.selectedAthletes.length > 0 &&
        props.selectedAthletes.map((athlete) => (
          <EditTreatmentCard
            athleteId={athlete}
            isDeleteAthleteDisabled={props.selectedAthletes.length === 1}
            key={athlete}
            onClickRemoveAthlete={props.removeSelectedAthlete}
            staffUsers={props.staffUsers}
          />
        ))
      );
    }

    return (
      props.treatmentSessions.length > 0 &&
      props.treatmentSessions.map((treatment) => {
        return (
          <TreatmentCard
            key={treatment.id}
            onClickReplicateTreatment={(selectedTreatment) => {
              setTreatmentToReplicate(selectedTreatment);
            }}
            treatment={treatment}
            showAthleteInformation={props.showAthleteInformation}
          />
        );
      })
    );
  };

  return (
    <div
      id="treatmentCardList"
      // $FlowFixMe .getBoundingClientRect().y is a valid property
      ref={treatmentCardListRef}
      css={
        props.treatmentSessions.length
          ? style.treatmentCardList
          : style.treatmentCardListEmpty
      }
    >
      <InfiniteScroll
        dataLength={props.treatmentSessions.length}
        next={props.onReachingEnd}
        hasMore={props.isLoading}
        loader={<div css={style.loadingText}>{props.t('Loading')} ...</div>}
        scrollableTarget="treatmentCardList"
      >
        {getTreatmentListContent()}
      </InfiniteScroll>
    </div>
  );
};

export const TreatmentsCardListTranslated: ComponentType<Props> =
  withNamespaces()(TreatmentsCardList);
export default TreatmentsCardList;
