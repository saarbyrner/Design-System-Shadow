// @flow
import { useState } from 'react';
import { saveIssue } from '@kitman/services/src/services/medical';
import { getAthleteIssue } from '@kitman/services';
import type { IssueOccurrenceRequested } from '@kitman/common/src/types/Issues';
import type { ComponentType } from 'react';
import moment from 'moment';
import { TextLink, TextButton, Select } from '@kitman/components';
import { withNamespaces } from 'react-i18next';
import * as DateFormatter from '@kitman/common/src/utils/dateFormatter';
import useConcussionInjuryResults from '@kitman/modules/src/Medical/shared/hooks/useConcussionInjuryResults';
import type { FormAnswersSetsFilter } from '@kitman/modules/src/Medical/shared/types/medical';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { RequestStatus } from '@kitman/modules/src/Medical/shared/types';
import type {
  InjuryIllnessSummary,
  FormInfo,
} from '@kitman/modules/src/Medical/shared/types/medical/QuestionTypes';
import { getPathologyName } from '@kitman/modules/src/Medical/shared/utils';
import style from './style';

type Props = {
  formId: number,
  formInfo: FormInfo,
  concussionLoading: RequestStatus,
  linkedInjuriesIllnesses: Array<InjuryIllnessSummary>,
  updateForms: Function,
};

const FormLinkedIssueSection = (props: I18nProps<Props>) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [concussionInjury, setConcussionInjury] = useState(
    props.linkedInjuriesIllnesses[0]
      ? props.linkedInjuriesIllnesses[0].occurrence_id
      : null
  );

  const [selectedConcussionInjuryId, setSelectedConcussionInjuryId] = useState<
    number | null
  >(null);

  // eslint-disable-next-line no-unused-vars
  const [filters, setFilters] = useState<FormAnswersSetsFilter>({
    athleteId: props.formInfo.athlete.id,
  });

  const { concussionSelectOptions, requestStatus, setRequestStatus } =
    useConcussionInjuryResults(filters);

  // eslint-disable-next-line no-unused-vars
  const [issue, setIssue] = useState<IssueOccurrenceRequested>({});

  const updateIssueConcussionAssessments = async (
    injuryDetails: any,
    deletingConcussionAssessment: boolean
  ) => {
    const newIssueData = injuryDetails;
    if (deletingConcussionAssessment) {
      const formIndex = newIssueData.concussion_assessments?.indexOf(
        props.formId
      );
      if (formIndex !== -1 && newIssueData.concussion_assessments) {
        newIssueData.concussion_assessments.splice(formIndex, 1);
      }
    } else {
      newIssueData.concussion_assessments?.push(props.formId);
    }
    await saveIssue('Injury', newIssueData, {
      concussion_assessments: newIssueData.concussion_assessments,
    })
      .then((data) => {
        if (!deletingConcussionAssessment) {
          setConcussionInjury(data.id);
        }
      })
      .catch(() => setRequestStatus('FAILURE'));
  };

  const onClickSave = async () => {
    setRequestStatus('PENDING');
    if (
      concussionInjury &&
      selectedConcussionInjuryId &&
      concussionInjury !== selectedConcussionInjuryId
    ) {
      const newInjuryDetails = await getAthleteIssue(
        props.formInfo.athlete.id,
        selectedConcussionInjuryId,
        'Injury'
      );
      const oldInjuryDetails = await getAthleteIssue(
        props.formInfo.athlete.id,
        concussionInjury,
        'Injury'
      );
      await updateIssueConcussionAssessments(oldInjuryDetails, true);
      await updateIssueConcussionAssessments(newInjuryDetails, false).then(
        () => {
          setRequestStatus('SUCCESS');
          props.updateForms();
          setIsFormOpen(false);
        }
      );
    } else if (selectedConcussionInjuryId) {
      const newInjuryDetails = await getAthleteIssue(
        props.formInfo.athlete.id,
        selectedConcussionInjuryId,
        'Injury'
      );
      await updateIssueConcussionAssessments(newInjuryDetails, false).then(
        () => {
          setRequestStatus('SUCCESS');
          props.updateForms();
          setIsFormOpen(false);
        }
      );
    }
  };

  const getActionButtons = () => {
    return !isFormOpen ? (
      <TextButton
        text={
          props.linkedInjuriesIllnesses.length > 0
            ? props.t('Edit')
            : props.t('Add')
        }
        type="secondary"
        onClick={() => {
          setIsFormOpen(true);
          setSelectedConcussionInjuryId(null);
        }}
        kitmanDesignSystem
      />
    ) : (
      <div css={style.actions} data-testid="AddAvailabilityEventsForm|Actions">
        <TextButton
          text={props.t('Discard changes')}
          type="subtle"
          onClick={() => {
            setIsFormOpen(false);
          }}
          isDisabled={requestStatus === 'PENDING'}
          kitmanDesignSystem
        />
        <TextButton
          text={props.t('Save')}
          type="primary"
          onClick={() => onClickSave()}
          isDisabled={
            requestStatus === 'PENDING' || !selectedConcussionInjuryId
          }
          kitmanDesignSystem
        />
      </div>
    );
  };

  return (
    <div
      css={style.section}
      data-testid="FormLinkedIssue|FormLinkedIssueSection"
    >
      <header css={style.header}>
        <h2 className="kitmanHeading--L2">{props.t('Linked Injury')}</h2>
        {getActionButtons()}
      </header>
      <table css={style.issueList}>
        <tbody>
          {isFormOpen && props.concussionLoading !== 'PENDING' && (
            <tr>
              <td className="issueSelect">
                <Select
                  value={
                    concussionInjury && !selectedConcussionInjuryId
                      ? concussionInjury
                      : selectedConcussionInjuryId
                  }
                  label={props.t('Injuries')}
                  options={concussionSelectOptions}
                  onChange={(concussionId) =>
                    setSelectedConcussionInjuryId(concussionId)
                  }
                />
              </td>
            </tr>
          )}
          {!isFormOpen &&
            props.concussionLoading !== 'PENDING' &&
            props.linkedInjuriesIllnesses.map((inj) => (
              <tr key={`${inj.type}_${inj.occurrence_id}`}>
                <td css={style.dateLabel}>
                  {DateFormatter.formatStandard({
                    date: moment(inj.occurrence_date),
                    showTime: false,
                    displayLongDate: true,
                  })}
                </td>
                <td>
                  <TextLink
                    href={`/medical/athletes/${inj.athlete_id}/${
                      inj.type === 'injury' ? 'injuries' : 'illnesses'
                    }/${inj.occurrence_id}`}
                    text={getPathologyName(inj)}
                    kitmanDesignSystem
                  />
                </td>
              </tr>
            ))}
          {props.concussionLoading === 'PENDING' && (
            <tr css={style.loader}>
              <td>{props.t('Loading')} ...</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export const FormLinkedIssueSectionTranslated: ComponentType<Props> =
  withNamespaces()(FormLinkedIssueSection);

export default FormLinkedIssueSection;
