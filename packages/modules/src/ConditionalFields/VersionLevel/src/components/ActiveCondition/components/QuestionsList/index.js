// @flow
import { Fragment } from 'react';
import { useSelector } from 'react-redux';
import type {
  ActiveCondition,
  RequiredFieldsAndValues,
} from '@kitman/modules/src/ConditionalFields/shared/types';
import { QuestionsListHeaderTranslated as QuestionsListHeader } from '../QuestionsListHeader';
import { QuestionCardTranslated as QuestionCard } from '../QuestionCard';
import { selectActiveCondition } from '../../../../../../shared/redux/selectors/conditionBuildView';

import styles from '../../../VersionBuildViewTab/styles';

type Props = {
  isPublished: boolean,
  requiredFieldsAndValues: RequiredFieldsAndValues,
  setRequiredFieldsAndValues: (
    value:
      | RequiredFieldsAndValues
      | ((prev: RequiredFieldsAndValues) => RequiredFieldsAndValues)
  ) => void,
};

const QuestionsListComponent = ({
  isPublished,
  requiredFieldsAndValues,
  setRequiredFieldsAndValues,
}: Props) => {
  const { questions }: ActiveCondition = useSelector(selectActiveCondition);

  return (
    <div>
      {questions?.length &&
        questions?.map((question, index) => {
          // question is nested if coming from BE
          const nestedQuestion =
            typeof question.question === 'object' ? question.question : null;
          return (
            <Fragment key={`Question_${question.order}`}>
              <QuestionsListHeader order={index + 1} />
              <QuestionCard
                question={nestedQuestion || question}
                index={index}
                isPublished={isPublished}
                requiredFieldsAndValues={requiredFieldsAndValues}
                setRequiredFieldsAndValues={setRequiredFieldsAndValues}
              />
              <hr css={styles.hr} />
            </Fragment>
          );
        })}
    </div>
  );
};

export default QuestionsListComponent;
