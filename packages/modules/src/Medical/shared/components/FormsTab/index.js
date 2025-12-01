// @flow
import { useState, useEffect } from 'react';
import type { ComponentType } from 'react';
import { withNamespaces } from 'react-i18next';
import { AppStatus } from '@kitman/components';
import { FormsListTranslated as FormsList } from '@kitman/modules/src/Medical/shared/components/FormsTab/components/FormsList';
import useConcussionFormAnswersSetsList from '@kitman/modules/src/Medical/shared/hooks/useConcussionFormAnswersSetsList';
import FormsFilters from '@kitman/modules/src/Medical/shared/containers/FormFilters';
import style from '@kitman/modules/src/Medical/shared/components/FormsTab/style';

// Types:
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { FormAnswersSetsFilters } from '@kitman/services/src/services/formAnswerSets/api/types';
import type { FormAnswersSetsFilter } from '../../types/medical';

type Props = {
  reloadData: boolean,
  athleteId?: number,
  chronicIssueId?: number,
  injuryOccurenceId?: number,
  illnessOccurenceId?: number,
  showAvatar?: boolean,
};

const getDefaultGroupFilter = (): string => {
  if (window.featureFlags['show-pl-forms-in-emr']) {
    return 'pl';
  }
  if (window.featureFlags['show-isu-registration-forms-in-emr']) {
    return 'isu';
  }
  if (window.featureFlags['nba-show-demo']) {
    return 'nba';
  }
  return 'pac_12';
};

const FormsTab = (props: I18nProps<Props>) => {
  const [filters, setFilters] = useState<FormAnswersSetsFilter>({
    athleteId: props.athleteId,
    category: window.featureFlags['show-isu-registration-forms-in-emr']
      ? 'legal'
      : 'medical',
    group: getDefaultGroupFilter(),
    chronicIssueId: props.chronicIssueId,
    injuryOccurenceId: props.injuryOccurenceId,
    illnessOccurenceId: props.illnessOccurenceId,
  });

  const { concussionSummaryList, requestStatus } =
    useConcussionFormAnswersSetsList(filters);

  const buildForms = () => {};

  useEffect(() => {
    if (!props.reloadData) {
      return;
    }
    buildForms();
  }, [props.reloadData]);

  useEffect(() => {
    // This is needed for when using PlayerSelector as filters don't update with change of athlete
    // or issue. Still persisting filters, so only athlete and issue needs changing.
    // $FlowIgnore Constructing object to match initial filter
    setFilters((prevFilters) => ({
      ...prevFilters,
      athleteId: props.athleteId,
      chronicIssueId: props.chronicIssueId,
      injuryOccurenceId: props.injuryOccurenceId,
      illnessOccurenceId: props.illnessOccurenceId,
    }));
  }, [
    props.athleteId,
    props.chronicIssueId,
    props.injuryOccurenceId,
    props.illnessOccurenceId,
  ]);

  return (
    <div css={style.wrapper}>
      <div css={style.content}>
        <div css={style.sectionHeader}>
          <h2 css={style.title}>{props.t('All forms')}</h2>
        </div>

        <FormsFilters
          category={
            window.featureFlags['show-isu-registration-forms-in-emr']
              ? 'legal'
              : 'medical'
          }
          athleteId={props.athleteId}
          onChangeFilter={(alteredFilter: FormAnswersSetsFilters) => {
            setFilters(
              (prev: FormAnswersSetsFilter): FormAnswersSetsFilter => ({
                ...prev,
                formType: alteredFilter.form_type,
              })
            );
          }}
        />
        <FormsList
          forms={concussionSummaryList}
          isLoading={requestStatus === 'PENDING'}
          showAthleteInformation={!props.athleteId}
          showAvatar={props.showAvatar}
          athleteId={props.athleteId}
        />
        {requestStatus === 'PENDING' && (
          <div css={style.loader}>{props.t('Loading')} ...</div>
        )}
      </div>
      {requestStatus === 'SUCCESS' && concussionSummaryList.length === 0 && (
        <div css={style.noFormsText}>{props.t('No forms completed yet')}</div>
      )}
      {requestStatus === 'FAILURE' && <AppStatus status="error" />}
    </div>
  );
};

export const FormsTabTranslated: ComponentType<Props> =
  withNamespaces()(FormsTab);
export default FormsTab;
