// @flow
import type { ComponentType } from 'react';
import { css } from '@emotion/react';
import { useState, useEffect } from 'react';
import { withNamespaces } from 'react-i18next';
import { SegmentedControl, Select } from '@kitman/components';
import useAthletesIssues from '@kitman/modules/src/Medical/shared/hooks/useAthletesIssues';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import style from '../AddIssueSidePanelStyle';

type Props = {
  selectedIssueType: string,
  selectedAthlete: number,

  // Chronic issues
  relatedChronicIssues: Array<string>,
  onSelectRelatedChronicIssues: Function,
};

function ChronicIssueQuestions(props: I18nProps<Props>) {
  const [showOpenClosedIssues, setShowOpenClosedIssues] = useState(
    props.relatedChronicIssues.length > 0
  );

  const isChronicIllness = !!(
    window.featureFlags['chronic-injury-illness'] &&
    props.selectedIssueType === 'CHRONIC_ILLNESS'
  );
  const isChronicCondition =
    window.featureFlags['chronic-injury-illness'] &&
    props.selectedIssueType === 'CHRONIC_INJURY';

  const { athleteIssues, fetchAthleteIssues, requestStatus } =
    useAthletesIssues(
      isChronicIllness && showOpenClosedIssues ? props.selectedAthlete : null
    );

  useEffect(() => {
    if (
      !props.selectedAthlete ||
      !showOpenClosedIssues ||
      athleteIssues.length ||
      requestStatus === 'PENDING'
    ) {
      return;
    }

    fetchAthleteIssues(props.selectedAthlete);
  }, [props.selectedAthlete, showOpenClosedIssues]);

  const handleYesNoClick = () => {
    setShowOpenClosedIssues(!showOpenClosedIssues);
  };

  return (
    <div css={style.section}>
      <div
        css={[
          style.row,
          css`
            margin-bottom: 16px;
          `,
        ]}
      >
        <span css={style.chronicQuestion}>
          {props.t(
            'Are there injury/ illness documented related to this chronic condition?'
          )}
        </span>
        <div css={style.yesNoSelector}>
          <SegmentedControl
            buttons={[
              { name: props.t('Yes'), value: 'YES' },
              { name: props.t('No'), value: 'NO' },
            ]}
            maxWidth={130}
            onClickButton={(value) => {
              handleYesNoClick();

              if (value === 'NO') {
                // clear any previously selected related chronic issues
                props.onSelectRelatedChronicIssues([]);
              }
            }}
            selectedButton={showOpenClosedIssues ? 'YES' : 'NO'}
          />
        </div>
      </div>
      {isChronicCondition && showOpenClosedIssues && (
        <div css={[style.row, style.rowIndentedNoMargin]}>
          <div
            data-testid="ChronicIssueQuestions|SelectIssue"
            css={[
              css`
                .kitmanReactSelect {
                  width: 385px;
                }
              `,
            ]}
          >
            <Select
              appendToBody
              menuPosition="fixed"
              value={props.relatedChronicIssues}
              label={props.t('Select injury/ illness')}
              options={athleteIssues}
              onChange={(issueIds) => {
                props.onSelectRelatedChronicIssues(issueIds);
              }}
              isMulti
            />
          </div>
        </div>
      )}
    </div>
  );
}

ChronicIssueQuestions.defaultProps = {
  relatedChronicIssues: [],
};

export const ChronicIssueQuestionsTranslated: ComponentType<Props> =
  withNamespaces()(ChronicIssueQuestions);
export default ChronicIssueQuestions;
