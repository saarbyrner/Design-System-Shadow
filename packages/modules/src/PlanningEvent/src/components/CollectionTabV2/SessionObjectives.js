// @flow
import { useState, useEffect, useRef } from 'react';
import { withNamespaces } from 'react-i18next';
import { css } from '@emotion/react';
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
import type { RequestStatus } from '@kitman/common/src/types';
import type { ToastDispatch } from '@kitman/components/src/types';
import type { ToastAction } from '@kitman/components/src/Toast/KitmanDesignSystem/hooks/useToasts';
import type { Event } from '@kitman/common/src/types/Event';
import { EVENT_TYPES } from '@kitman/modules/src/PlanningEvent/src/constants/index';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import useEventTracking from '@kitman/common/src/hooks/useEventTracking';
import { getHumanReadableEventType } from '@kitman/common/src/utils/events';

import sharedStyle from './style';

const style = {
  header: css({
    marginBottom: '1rem',
  }),
};

type Props = {
  event: Event,
  toastAction: ToastDispatch<ToastAction>,
};

const SessionObjectives = (props: I18nProps<Props>) => {
  const { trackEvent } = useEventTracking();

  const [sessionObjectives, setSessionObjectives] = useState<?string>('');
  const [requestStatus, setRequestStatus] = useState<RequestStatus>(null);
  const sessionObjectivesEditor = useRef(null);
  const headerText = props.t('{{eventType}} objectives', {
    eventType: EVENT_TYPES[props.event.type],
  });

  useEffect(() => {
    let ignore = false;
    setRequestStatus('PENDING');
    getPlanningFreeTextValues(props.event.id, ['event_objectives']).then(
      (sessionObjectivesData) => {
        if (ignore) {
          return;
        }
        setRequestStatus('SUCCESS');
        const objectives = sessionObjectivesData.event_objectives;
        setSessionObjectives(objectives);
        if (sessionObjectivesEditor?.current) {
          sessionObjectivesEditor.current.update(
            EditorState.createWithContent(stateFromHTML(objectives ?? ''))
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

  const onSave = () => {
    setRequestStatus('PENDING');
    savePlanningFreeTextValues(props.event.id, [
      {
        name: 'event_objectives',
        value: sessionObjectives || '',
      },
    ]).then(
      () => {
        props.toastAction({
          type: 'UPDATE_TOAST',
          toast: {
            id: 1,
            title: props.t('Successfully updated {{eventType}} objectives', {
              eventType: EVENT_TYPES[props.event.type].toLowerCase(),
            }),
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
            title: props.t('Error updating {{eventType}} objectives', {
              eventType: EVENT_TYPES[props.event.type].toLowerCase(),
            }),
            status: 'ERROR',
          },
        });
      }
    );
    trackEvent(
      `Calendar — ${getHumanReadableEventType(
        props.event
      )} details — Collection tab — Session objectives — Save`
    );
  };

  return (
    <div css={sharedStyle.wrapper}>
      <header css={sharedStyle.headerWrapper}>
        <h3 css={style.header}>{headerText}</h3>
        <TextButton
          text={props.t('Save')}
          onClick={onSave}
          type="primary"
          kitmanDesignSystem
        />
      </header>
      <div css={sharedStyle.bodyWrapper}>
        <div css={sharedStyle.richTextDisplay}>
          <RichTextEditor
            onChange={setSessionObjectives}
            forwardedRef={sessionObjectivesEditor}
            value={sessionObjectives}
            isDisabled={requestStatus === 'PENDING'}
            kitmanDesignSystem
          />
        </div>
      </div>
    </div>
  );
};

export const SessionObjectivesTranslated = withNamespaces()(SessionObjectives);
export default SessionObjectives;
