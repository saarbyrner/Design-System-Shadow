// @flow
import moment from 'moment-timezone';
import { useState, useEffect } from 'react';
import { withNamespaces } from 'react-i18next';
import { SegmentedControl, Select } from '@kitman/components';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import style from './AddIssueSidePanelStyle';
import getAthleteAssessments from '../../services/getAthleteAssessments';
import type { RequestStatus } from '../../../../shared/types';
import type { AthleteAssessment } from '../../services/getAthleteAssessments';

type Props = {
  athleteId: number,
  showAssessmentReportSelector: boolean,
  setShowAssessmentReportSelector: Function,
  invalidFields: Array<string>,
  onUpdateAttachedConcussionAssessments: Function,
  attachedConcussionAssessments: Array<number>,
};

const ConcussionAssessmentSection = (props: I18nProps<Props>) => {
  const [requestStatus, setRequestStatus] = useState<RequestStatus>('PENDING');
  const [assessmentOptions, setAssessmentOptions] = useState([]);

  const createAssessmentDropdownOptions = (
    fetchedAssessments: Array<AthleteAssessment>
  ) => {
    return fetchedAssessments.map((assessment) => {
      return {
        label: `${assessment.form.name} ${moment(assessment.date).format(
          'MMM DD, YYYY'
        )}`,
        value: assessment.id,
      };
    });
  };

  const fetchOptions = () => {
    setRequestStatus('PENDING');

    getAthleteAssessments(props.athleteId).then(
      (response) => {
        const transformedResponse = createAssessmentDropdownOptions(response);
        setAssessmentOptions(transformedResponse);
        setRequestStatus('SUCCESS');
      },
      () => setRequestStatus('FAILURE')
    );
  };

  useEffect(() => {
    setAssessmentOptions([]);
    if (props.showAssessmentReportSelector) {
      fetchOptions();
    }
  }, [props.showAssessmentReportSelector]);

  const handleYesNoClick = () => {
    if (!props.showAssessmentReportSelector) {
      fetchOptions();
    }
    props.setShowAssessmentReportSelector(!props.showAssessmentReportSelector);
  };

  return (
    <div css={style.section}>
      <div css={style.row}>
        <span>
          {props.t('Was a concussion assessment performed at the scene?')}
        </span>
        <div css={style.yesNoSelector}>
          <SegmentedControl
            buttons={[
              { name: props.t('Yes'), value: 'YES' },
              { name: props.t('No'), value: 'NO' },
            ]}
            maxWidth={130}
            onClickButton={() => handleYesNoClick()}
            selectedButton={props.showAssessmentReportSelector ? 'YES' : 'NO'}
          />
        </div>
      </div>
      {props.showAssessmentReportSelector && requestStatus === 'PENDING' && (
        <div css={style.loader}>{props.t('Loading')} ...</div>
      )}
      {props.showAssessmentReportSelector && requestStatus === 'FAILURE' && (
        <div>error</div>
      )}
      {props.showAssessmentReportSelector && requestStatus === 'SUCCESS' && (
        <div css={[style.row, style.rowIndented]}>
          <Select
            appendToBody
            value={props.attachedConcussionAssessments}
            invalid={props.invalidFields.includes(
              'attached_concussion_assessments'
            )}
            label={props.t('Attach report(s)')}
            options={assessmentOptions}
            onChange={(assessmentIds) =>
              props.onUpdateAttachedConcussionAssessments(assessmentIds)
            }
            isMulti
          />
        </div>
      )}
    </div>
  );
};

export const ConcussionAssessmentSectionTranslated = withNamespaces()(
  ConcussionAssessmentSection
);
export default ConcussionAssessmentSection;
