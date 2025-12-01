// @flow
import { useState } from 'react';
import { withNamespaces } from 'react-i18next';
import type {
  GameScores,
  GamePeriod,
} from '@kitman/common/src/types/GameEvent';
import type { Game } from '@kitman/common/src/types/Event';
import { TextButton, Scoreline } from '@kitman/components';
import { css } from '@emotion/react';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import useGameEventsModal from '@kitman/modules/src/PlanningEvent/src/hooks/useGameEventsModal';
import styles from './styles';
import { CustomPeriodsModalTranslated as CustomPeriodsModal } from '../../CustomPeriodsModal';

type Props = {
  setSelectedView: (string) => void,
  currentView: string,
  setCurrentView: (string) => void,
  gameEvent: Game,
  gameViews: Object,
  gameScores: GameScores,
  eventPeriods: Array<GamePeriod>,
  setGameScores: Function,
  isAddPeriodDisabled: boolean,
  onAddPeriod: Function,
  hasUnsavedChanges: boolean,
  setShowPrompt: Function,
  hasAPeriodStarted: boolean,
  isCustomPeriods: boolean,
  setIsFormationEditorOpen: (open: boolean) => void,
};

const GameEventsHeader = (props: I18nProps<Props>) => {
  const {
    currentView,
    setCurrentView,
    setSelectedView,
    gameEvent,
    gameViews,
    gameScores,
    setGameScores,
    isAddPeriodDisabled,
    onAddPeriod,
    hasUnsavedChanges,
    setShowPrompt,
    hasAPeriodStarted,
    isCustomPeriods,
  } = props;

  const [showAddCustomPeriodsModal, setShowAddCustomPeriodsModal] =
    useState(false);

  const modal = useGameEventsModal();

  const renderAddPeriodModal = () => {
    modal.show({
      title: props.t(`Add Period`),
      content: props.t(
        'By adding another period you may remove events from previous periods that will be moved out of scope!'
      ),
      onConfirm: () => {
        onAddPeriod();
        modal.hide();
      },
    });
  };

  return (
    <>
      <div
        css={styles.gameEventsHeaderContainer}
        data-testid="GameEventsHeader"
      >
        <div css={styles.buttonContainer}>
          <TextButton
            onClick={() => setCurrentView(gameViews.pitch)}
            text={props.t('Pitch view')}
            type={currentView === gameViews.pitch ? 'primary' : 'secondary'}
            kitmanDesignSystem
          />
          <TextButton
            onClick={() => {
              if (hasUnsavedChanges) {
                setShowPrompt(true);
                setSelectedView(gameViews.list);
              } else {
                setCurrentView(gameViews.list);
              }
            }}
            text={props.t('List view')}
            type={currentView === gameViews.list ? 'primary' : 'secondary'}
            kitmanDesignSystem
          />
        </div>
        <Scoreline
          gameEvent={gameEvent}
          gameScores={gameScores}
          setGameScores={setGameScores}
        />
        <div>
          {window.featureFlags['game-formations-editor'] && (
            <TextButton
              onClick={() => props.setIsFormationEditorOpen(true)}
              text={props.t('Edit formations')}
              type="secondary"
              kitmanDesignSystem
              css={css`
                margin-right: 12px;
              `}
            />
          )}
          <TextButton
            onClick={() => {
              if (isCustomPeriods) setShowAddCustomPeriodsModal(true);
              else if (hasAPeriodStarted) renderAddPeriodModal();
              else onAddPeriod();
            }}
            text={props.t('Add period')}
            type="secondary"
            isDisabled={isAddPeriodDisabled}
            kitmanDesignSystem
          />
        </div>
      </div>
      {modal.renderModal()}
      <CustomPeriodsModal
        isOpen={showAddCustomPeriodsModal}
        onClose={() => setShowAddCustomPeriodsModal(false)}
        onConfirm={(updatedPeriods) => {
          onAddPeriod(updatedPeriods);
          setShowAddCustomPeriodsModal(false);
        }}
        eventPeriods={props.eventPeriods}
      />
    </>
  );
};

export const GameEventsHeaderTranslated = withNamespaces()(GameEventsHeader);
export default GameEventsHeader;
