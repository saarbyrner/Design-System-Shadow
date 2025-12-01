// @flow
import { withNamespaces } from 'react-i18next';
import { useState, useEffect, useRef } from 'react';
import { stateFromHTML } from 'draft-js-import-html';
import {
  EditorState,
  // $FlowFixMe Draft JS issue with flow https://github.com/facebook/draft-js/issues/1974
} from 'draft-js';

import { RichTextEditor, TextButton } from '@kitman/components';
import {
  getPlanningFreeTextValues,
  savePlanningFreeTextValues,
} from '@kitman/services/src/services/planning';
import { type RequestStatus } from '@kitman/common/src/types';
import { type ToastDispatch } from '@kitman/components/src/types';
import { type ToastAction } from '@kitman/components/src/Toast/KitmanDesignSystem/hooks/useToasts';
import { type Event } from '@kitman/common/src/types/Event';
import { EVENT_TYPES } from '@kitman/modules/src/PlanningEvent/src/constants/index';
import { type I18nProps } from '@kitman/common/src/types/i18n';
import useEventTracking from '@kitman/common/src/hooks/useEventTracking';
import { getHumanReadableEventType } from '@kitman/common/src/utils/events';

import style from './style';

type Props = {
  event: Event,
  toastAction: ToastDispatch<ToastAction>,
};

const SessionEvaluation = (props: I18nProps<Props>) => {
  const { trackEvent } = useEventTracking();

  const [sessionEvaluationFeedback, setSessionEvaluationFeedback] = useState({
    eventEvaluationWentWell: '',
    eventEvaluationWentWrong: '',
  });
  const [requestStatus, setRequestStatus] = useState<RequestStatus>(null);
  const sessionEvaluationEditorWell = useRef(null);
  const sessionEvaluationEditorWrong = useRef(null);
  const eventType = EVENT_TYPES[props.event.type].toLowerCase();
  const headerText = props.t('{{eventType}} evaluation', {
    eventType: EVENT_TYPES[props.event.type],
  });

  useEffect(() => {
    let ignore = false;
    setRequestStatus('PENDING');
    getPlanningFreeTextValues(props.event.id, [
      'event_evaluation_went_well',
      'event_evaluation_went_wrong',
    ]).then(
      (sessionEvaluationData) => {
        if (ignore) {
          return;
        }
        setRequestStatus('SUCCESS');
        setSessionEvaluationFeedback({
          eventEvaluationWentWell:
            sessionEvaluationData.event_evaluation_went_well,
          eventEvaluationWentWrong:
            sessionEvaluationData.event_evaluation_went_wrong,
        });
        if (sessionEvaluationEditorWell.current) {
          sessionEvaluationEditorWell.current?.update(
            EditorState.createWithContent(
              stateFromHTML(
                sessionEvaluationData.event_evaluation_went_well || ''
              )
            )
          );
          sessionEvaluationEditorWrong.current?.update(
            EditorState.createWithContent(
              stateFromHTML(
                sessionEvaluationData.event_evaluation_went_wrong || ''
              )
            )
          );
        }
      },
      () => {
        setRequestStatus('FAILURE');
      }
    );
    return () => {
      ignore = true;
    };
  }, [props.event.id]);

  return (
    <div css={style.wrapper}>
      <header css={style.headerWrapper}>
        <h3>{headerText}</h3>
        <TextButton
          text={props.t('Save')}
          onClick={() => {
            setRequestStatus('PENDING');
            savePlanningFreeTextValues(props.event.id, [
              {
                name: 'event_evaluation_went_well',
                value: sessionEvaluationFeedback.eventEvaluationWentWell,
              },
              {
                name: 'event_evaluation_went_wrong',
                value: sessionEvaluationFeedback.eventEvaluationWentWrong,
              },
            ]).then(
              () => {
                props.toastAction({
                  type: 'UPDATE_TOAST',
                  toast: {
                    id: 1,
                    title: props.t(
                      'Successfully updated {{eventType}} evaluation',
                      { eventType }
                    ),
                    status: 'SUCCESS',
                  },
                });
                setRequestStatus('SUCCESS');
              },
              () => {
                props.toastAction({
                  type: 'UPDATE_TOAST',
                  toast: {
                    id: 1,
                    title: props.t('Error updating {{eventType}} evaluation', {
                      eventType,
                    }),
                    status: 'ERROR',
                  },
                });
              }
            );
            trackEvent(
              `Calendar — ${getHumanReadableEventType(
                props.event
              )} details — Collection tab — Session evaluation — Save`
            );
          }}
          type="primary"
          kitmanDesignSystem
        />
      </header>
      <div css={style.bodyWrapper}>
        <div css={style.richTextDisplay}>
          <RichTextEditor
            label={props.t('What did you do well in this {{eventType}}?', {
              eventType,
            })}
            onChange={(comment) => {
              setSessionEvaluationFeedback((prev) => {
                return {
                  ...prev,
                  eventEvaluationWentWell: comment,
                };
              });
            }}
            forwardedRef={sessionEvaluationEditorWell}
            value={sessionEvaluationFeedback.eventEvaluationWentWell}
            isDisabled={requestStatus === 'PENDING'}
            kitmanDesignSystem
          />
        </div>
        <div css={style.richTextDisplay}>
          <RichTextEditor
            label={props.t('What would you do differently next time?')}
            onChange={(comment) => {
              setSessionEvaluationFeedback((prev) => {
                return {
                  ...prev,
                  eventEvaluationWentWrong: comment,
                };
              });
            }}
            forwardedRef={sessionEvaluationEditorWrong}
            value={sessionEvaluationFeedback.eventEvaluationWentWrong}
            isDisabled={requestStatus === 'PENDING'}
            kitmanDesignSystem
          />
        </div>
      </div>
    </div>
  );
};

export const SessionEvaluationTranslated = withNamespaces()(SessionEvaluation);
export default SessionEvaluation;
