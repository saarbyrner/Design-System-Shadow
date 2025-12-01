// @flow
import { useState, useMemo } from 'react';
import { withNamespaces } from 'react-i18next';
import { EditEventPanelTranslated as EventSidePanel } from '@kitman/modules/src/PlanningEventSidePanel';
import { TextButton, TooltipMenu } from '@kitman/components';
import { TrackEvent } from '@kitman/common/src/utils';
import type { EventConditions } from '@kitman/services/src/services/getEventConditions';
import { useDispatch } from 'react-redux';
import { add, remove } from '@kitman/modules/src/Toasts/toastsSlice';
import type { TooltipItem } from '@kitman/components/src/TooltipMenu/index';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { PreferenceType } from '@kitman/common/src/contexts/PreferenceContext/types';

type Props = {
  isGamesAdmin: boolean,
  canCreateGames: boolean,
  isTrainingSessionsAdmin: boolean,
  canManageWorkload: boolean,
  eventConditions: EventConditions,
  onEventFiltersChange: Function,
  preferences: PreferenceType,
};

const AppHeader = (props: I18nProps<Props>) => {
  const dispatch = useDispatch();

  const isMatchDayFlow = props.preferences?.league_game_schedule;

  const [isGameModalOpen, setIsGameModalOpen] = useState(false);
  const [isSessionModalOpen, setIsSessionModalOpen] = useState(false);

  const menuItems = useMemo(() => {
    const items: Array<TooltipItem> = [];

    if (props.canCreateGames) {
      items.push({
        description: props.t('Game'),
        onClick: () => {
          TrackEvent('Planning Area', 'Add', 'Game');
          setIsGameModalOpen(true);
        },
      });
    }

    if (props.isTrainingSessionsAdmin) {
      items.push({
        description: props.t('Session'),
        onClick: () => {
          TrackEvent('Planning Area', 'Add', 'Session');
          setIsSessionModalOpen(true);
        },
      });
    }

    if (props.canCreateGames) {
      items.push({
        description: props.t('Turnaround'),
        onClick: () => {
          window.location.assign('/fixtures/new');
          TrackEvent('Planning Area', 'Add', 'Cycle');
        },
      });
    }

    return items;
  }, [props.isGamesAdmin, props.canCreateGames, props.isTrainingSessionsAdmin]);

  return (
    <>
      <header className="planning__header">
        <h2 className="planning__title">
          {window.getFlag('planning-session-planning')
            ? props.t('Schedule')
            : props.t('Planning')}
        </h2>
        <div className="planning__headerMenu">
          {!isMatchDayFlow && menuItems.length > 0 && (
            <TooltipMenu
              placement="bottom-start"
              tooltipTriggerElement={
                <TextButton
                  text={props.t('Add')}
                  iconAfter="icon-chevron-down"
                  type="primary"
                  kitmanDesignSystem
                />
              }
              menuItems={menuItems}
              kitmanDesignSystem
            />
          )}
        </div>
      </header>

      <EventSidePanel
        isOpen={isGameModalOpen || isSessionModalOpen}
        panelType="SLIDING"
        panelMode="CREATE"
        createNewEventType={isGameModalOpen ? 'game_event' : 'session_event'}
        canManageWorkload={props.canManageWorkload}
        onClose={() => {
          if (isGameModalOpen) {
            setIsGameModalOpen(false);
          } else {
            setIsSessionModalOpen(false);
          }
        }}
        redirectToEventOnClose={!window.featureFlags['event-attachments']}
        onSaveEventSuccess={() => {
          if (window.featureFlags['event-attachments']) {
            props.onEventFiltersChange();
          }
        }}
        eventConditions={props.eventConditions}
        onFileUploadStart={(id, filename) =>
          dispatch(
            add({
              id,
              status: 'LOADING',
              title: props.t('Uploading {{filename}}...', {
                filename,
              }),
            })
          )
        }
        onFileUploadSuccess={(filename) =>
          dispatch(
            add({
              status: 'SUCCESS',
              title: props.t('{{filename}} uploaded successfully', {
                filename,
              }),
            })
          )
        }
        onFileUploadFailure={(filename) =>
          dispatch(
            add({
              title: props.t('{{filename}} upload failed', {
                filename,
              }),
              status: 'ERROR',
            })
          )
        }
        removeFileUploadToast={(id) => dispatch(remove(id))}
      />
    </>
  );
};

export const AppHeaderTranslated = withNamespaces()(AppHeader);
export default AppHeader;
