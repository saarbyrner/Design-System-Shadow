// @flow
import { css } from '@emotion/react';
import { colors } from '@kitman/common/src/variables';

export default {
  // VersionBuildViewTab
  contentContainer: css`
    background-color: ${colors.white};
    height: calc(100% - 50px - 60px);
    display: grid;
    grid-template-columns: 350px auto;
  `,
  left: css`
    background-color: ${colors.white};
    height: 100%;
    overflow-x: auto;
    border: 1px solid ${colors.neutral_300};
    border-right: none !important;
  `,
  right: css`
    background-color: ${colors.white};
    height: 100%;
    overflow: auto;
    border: 1px solid ${colors.neutral_300};
  `,

  // ConditionsListHeaderComponent
  conditionHeader: css`
    padding: 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex: 1;
  `,
  conditionHeaderTitle: css`
    color: ${colors.grey_300};
    font-weight: 600;
    font-size: 20px;
    line-height: 24px;
    margin: unset;
  `,

  //  ConditionCardComponent
  conditionCard: css`
    padding: 24px;
    color: ${colors.grey_300};
    border: 1px solid ${colors.neutral_300};
    display: flex;
    justify-content: space-between;
    align-items: center;
  `,
  notActiveConditionCard: css`
    cursor: pointer;
  `,
  activeConditionCard: css`
    border-left: 4px solid ${colors.grey_200};
    background: ${colors.neutral_200};
  `,
  conditionCardTitle: css`
    font-weight: 600;
    font-size: 16px;
    line-height: 18px;
    color: ${colors.grey_300};
  `,
  conditionCardName: css`
    font-weight: 600;
    font-size: 12px;
    line-height: 16px;
    color: ${colors.grey_100};
  `,
  addQuestionButton: css`
    margin: 24px;
  `,

  // ActiveConditionHeader
  conditionHeaderActions: css`
    display: flex;
    gap: 8px;
  `,
  loaderWrapper: css`
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 24px;
    height: 300px;
  `,

  // QuestionList
  hr: css`
    background-color: ${colors.neutral_300};
    grid-column: span 3;
    margin: 16px;
    opacity: 0.5;
  `,

  // QuestionsListHeaderComponent
  questionHeader: css`
    padding: 0px 0px 24px 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex: 1;
  `,

  // QuestionCard
  conditionForm: css`
    padding: 0px 24px;
    color: ${colors.grey_300};
    display: grid;
    grid-template-columns: 33% 33% 33%;
    gap: 8px;
  `,
  columnSpan2: css`
    grid-column: span 2;
  `,
  questionFormRow1: css`
    grid-row: 1;
  `,
  questionFormRow2: css`
    grid-row: 2;
    grid-column: span 3;
    gap: 8px;
    align-items: end;
  `,
  questionFormRow3: css`
    display: grid;
    grid-template-columns: 50% 50%;
    grid-row: 3;
    grid-column: span 3;
    gap: 8px;
    align-items: end;
  `,
  questionFormRow4: css`
    grid-row: 4;
    grid-column: span 3;
  `,
  questionFormRow5: css`
    grid-row: 5;
    grid-column: span 3;
    margin-top: 16px;
    margin-right: 24px;
    padding-left: 24px;
  `,
  questionFormRow6: css`
    grid-row: 6;
  `,
  dateTextPrompt: css`
    margin: 6px 0px;
    color: ${colors.grey_200};
    font-style: normal;
    font-weight: 400;
  `,
  questionOptionContainer: css`
    display: flex;
    flex-direction: column;
  `,
  questionOptionItem: css`
    flex: 1 1 auto;
    max-width: 35%;
  `,
  addMetaDataOptionButton: css`
    margin-top: 16px;
  `,

  // PredicateBuild
  conditionFormRow1: css`
    grid-row: 1;
  `,
  conditionFormRow2: css`
    grid-row: 2;
  `,
  conditionFormRow3: css`
    grid-row: 3;
    grid-column: span 3;
  `,
  conditionFormRow4: css`
    display: flex;
    grid-row: 4;
    grid-column: span 3;
    gap: 16px;
  `,
  conditionFormRow5: css`
    grid-row: 5;
    grid-column: span 3;
  `,
  inputAndTriggerContainer: css`
    display: grid;
    grid-template-columns: 3% 19% 17% 60%;
    gap: 8px;
    align-items: center;
    margin: 8px;
  `,
  hrWide: css`
    background-color: ${colors.neutral_300};
    grid-column: span 3;
    margin: 16px 0px;
    opacity: 0.5;
  `,
  prefixOperandCard: css`
    display: flex;
    align-self: center;
    justify-self: center;
    margin: 0;
    font-size: 13px;
    font-weight: 600;
    line-height: 22px;
    color: ${colors.grey_200};
  `,
  operatorText: css`
    margin: 0px 64px;
    font-size: 13px;
    font-weight: 600;
    line-height: 22px;
    color: ${colors.grey_200};
  `,

  // OperandList
  operandActions: css`
    display: flex;
    align-items: end;
    gap: 8px;
    margin: 8px 24px 0px;
  `,
  addAdditionalInputButton: css`
    width: fit-content;
    margin: 8px 0px;
  `,
  addGroupButton: css`
    margin-bottom: 8px;
  `,
  inputRelation: css`
    margin: 8px 0px;
  `,
  operandCardContainer: css`
    display: grid;
    grid-template-columns: 90% 10%;
    align-items: end;
    margin-left: 24px;
  `,
  operandBinButton: css`
    width: fit-content;
    margin-left: 16px;
    margin-bottom: 8px;
  `,
  inputTitle: css`
    color: ${colors.grey_100};
    margin-top: 4px;
  `,
  askTitle: css`
    color: ${colors.grey_100};
    margin-left: 24px;
  `,

  // FollowupQuestion
  followupQuestion: css`
    border-left: solid 4px ${colors.neutral_200};
    padding-left: 16px;
    color: ${colors.grey_300};
    display: grid;
    grid-template-columns: 33% 33% 33%;
    gap: 8px;
  `,
  followupQuestionHeader: css`
    margin: 4px 0px;
    padding-left: 8px;
  `,
  followupQuestionHeaderTitle: css`
    color: ${colors.grey_300};
    font-weight: 500;
    font-size: 18px;
    line-height: 22px;
    margin: unset;
  `,
  followupQuestionHeaderQuestion: css`
    font-weight: 400;
  `,
};
