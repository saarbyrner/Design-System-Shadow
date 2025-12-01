// @flow
import { useState, useEffect, useMemo } from 'react';
import type { ComponentType } from 'react';
import { withNamespaces } from 'react-i18next';
import { AppStatus } from '@kitman/components';
import { Pagination } from '@kitman/playbook/components';
import { useSearchFormAnswerSetsQuery } from '@kitman/services/src/services/formAnswerSets';
import { FormsListTranslated as FormsList } from '@kitman/modules/src/Medical/shared/components/FormsTab/components/FormsList';
import FormsFilters from '@kitman/modules/src/Medical/shared/containers/FormFilters';
import style from '@kitman/modules/src/Medical/shared/components/FormsTab/style';

// Types:
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { FormAnswersSetsFilters } from '@kitman/services/src/services/formAnswerSets/api/types';
import type {
  FormSummary,
  AnswerSet,
} from '@kitman/modules/src/Medical/shared/types/medical';

type Props = {
  reloadData: boolean,
  formCategory: string,
  athleteId?: number,
  showAvatar?: boolean,
};

export const convertFormAnswerSetToSummary = (
  answerSet: AnswerSet
): FormSummary => ({
  id: answerSet.id,
  formType: answerSet.form.name,
  formTypeFullName: answerSet.form.fullname,
  status: answerSet.status,
  completionDate: answerSet.date,
  editorFullName: answerSet.editor.fullname,
  concussionDiagnosed: answerSet.concussion_diagnosed,
  linkedIssue: answerSet.concussion_injury,
  expiryDate: answerSet.expiry_date,
  athlete: answerSet.athlete,
});

const FormsTabUpdated = (props: I18nProps<Props>) => {
  const [filters, setFilters] = useState<FormAnswersSetsFilters>({
    category: props.formCategory,
    athlete_id: props.athleteId,
  });

  const [page, setPage] = useState(1);

  const {
    refetch,
    data: { data: results, meta: pagination } = {},
    error,
    isLoading,
  } = useSearchFormAnswerSetsQuery({
    ...filters,
    pagination: {
      page,
      per_page: 30,
    },
  });

  const success = !error && !isLoading;

  const formSummaryList = useMemo(() => {
    if (results) {
      return results.map((answerSet) =>
        convertFormAnswerSetToSummary(answerSet)
      );
    }

    return [];
  }, [results]);

  useEffect(() => {
    if (!props.reloadData) {
      return;
    }
    setPage(1);
    refetch();
  }, [props.reloadData]);

  const handlePaginationChange = (event, value) => {
    setPage(value);
  };

  return (
    <div css={style.wrapper}>
      <div css={style.content}>
        <div css={style.sectionHeader}>
          <h2 css={style.title}>{props.t('All forms')}</h2>
        </div>
        <FormsFilters
          category={props.formCategory}
          athleteId={props.athleteId}
          onChangeFilter={(alteredFilter: FormAnswersSetsFilters) => {
            setPage(1);
            setFilters(alteredFilter);
          }}
        />
        <FormsList
          forms={formSummaryList}
          isLoading={isLoading}
          showAthleteInformation={!props.athleteId}
          showAvatar={props.showAvatar}
          athleteId={props.athleteId}
        />
        {isLoading && <div css={style.loader}>{props.t('Loading')}...</div>}
      </div>
      <div css={style.footer}>
        <Pagination
          count={pagination?.totalPages || 0}
          page={page}
          onChange={handlePaginationChange}
          disabled={isLoading}
        />
      </div>
      {success && formSummaryList.length === 0 && (
        <div css={style.noFormsText}>{props.t('No forms completed yet')}</div>
      )}
      {error && <AppStatus status="error" />}
    </div>
  );
};

export const FormsTabUpdatedTranslated: ComponentType<Props> =
  withNamespaces()(FormsTabUpdated);
export default FormsTabUpdated;
