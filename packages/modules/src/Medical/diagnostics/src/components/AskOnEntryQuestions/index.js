// @flow
import moment from 'moment';
import type { ComponentType } from 'react';
import { withNamespaces } from 'react-i18next';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { useDiagnostic } from '@kitman/modules/src/Medical/shared/contexts/DiagnosticContext';

import style from './styles';

type Props = {};

const AskOnEntryQuestions = (props: I18nProps<Props>) => {
  const { diagnostic } = useDiagnostic();

  const renderMultiChoiceAnswer = (answer) => {
    const multiChoiceOption =
      answer?.diagnostic_type_question_choice?.name || '';

    const optionalText = answer.text ? `- ${answer.text}` : '';

    return `${multiChoiceOption} ${optionalText}`;
  };

  return (
    <div>
      <section
        css={[style.askOnEntrySection, style.section]}
        data-testid="AskOnEntryQuestions|AskOnEntryQuestionsSummary"
      >
        <header css={style.header}>
          <h2 className="kitmanHeading--L2">
            {props.t('Ask on entry questions:')}
          </h2>
        </header>

        <ul css={style.questionAnswerList}>
          {diagnostic.diagnostic_type_answers.map((answer) => {
            return (
              <div key={answer.id}>
                {(answer.datetime ||
                  answer.text ||
                  answer.diagnostic_type_question_choice) && (
                  <div key={answer.id} css={style.questionAnswerDetails}>
                    <li css={style.question}>
                      {props.t('{{question}}', {
                        question: answer.diagnostic_type_question.label,
                        interpolation: { escapeValue: false },
                      })}
                    </li>

                    <li>
                      {answer.diagnostic_type_question.question_type ===
                        'datetime' &&
                        answer.datetime &&
                        props.t('{{date}}', {
                          date:
                            moment(answer.datetime).format('MMM DD YYYY') ||
                            '--',
                        })}

                      {answer.diagnostic_type_question.question_type ===
                        'text' && answer.text}
                      {['choice', 'segmented_choice'].includes(
                        answer.diagnostic_type_question.question_type
                      ) && renderMultiChoiceAnswer(answer)}
                    </li>
                  </div>
                )}
              </div>
            );
          })}
        </ul>
      </section>
    </div>
  );
};

export const AskOnEntryQuestionsTranslated: ComponentType<Props> =
  withNamespaces()(AskOnEntryQuestions);
export default AskOnEntryQuestions;
