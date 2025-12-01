// @flow
import { withNamespaces } from 'react-i18next';
import moment from 'moment';
import { useRef, useState } from 'react';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { Drawer } from '@kitman/playbook/components';
import { drawerMixin } from '@kitman/modules/src/UserMovement/shared/mixins';
import { useTheme } from '@kitman/playbook/hooks';
import { useSelector, useDispatch } from 'react-redux';
import {
  getIsPanelOpen,
  getGameId,
} from '@kitman/modules/src/LeagueFixtures/src/redux/selectors/externalAccessSelectors';
import SidePanelSectionLayout from '@kitman/modules/src/LeagueFixtures/src/shared/layouts/SidePanelSectionLayout';
import type { Game } from '@kitman/common/src/types/Event';

import { toastStatusEnumLike } from '@kitman/components/src/Toast/enum-likes';
import { add } from '@kitman/modules/src/Toasts/toastsSlice';

import { MAX_NUM_OF_REQUESTS_PER_GAME } from '@kitman/modules/src/LeagueFixtures/src/shared/consts';

import saveExternalAccessForm from '../../services/saveExternalAccessForm';
import { ActionsTranslated as Actions } from './components/Actions';
import useExternalAccess from './hooks/useExternalAccess';
import ExternalAccessForm, {
  type FormReference,
  type externalAccessForm,
} from '../../components/ExternalAccessForm';

type ExternalAccessSidePanelProps = {
  fixtures: Array<Game>,
};

const ExternalAccessSidePanel = (
  props: I18nProps<ExternalAccessSidePanelProps>
) => {
  const theme = useTheme();
  const isOpen = useSelector(getIsPanelOpen);
  const gameId = useSelector(getGameId);

  const [requests, setRequests] = useState<Array<externalAccessForm>>([]);

  const requestStatus = [];

  const dispatch = useDispatch();

  const { handleOnToggle } = useExternalAccess();

  const externalAccessFormRef = useRef<FormReference>(null);

  const requestsUpdated = (updatedRequests) => {
    setRequests([...updatedRequests]);
  };

  const handleSaveExternalAccessRequestApi = async (request) => {
    try {
      await saveExternalAccessForm(request, gameId);
      requestStatus.push('SUCCESS');
    } catch (e) {
      console.warn(e);
      requestStatus.push('ERROR');
    }
  };

  const handlingSaveItterable = async () => {
    await Promise.all(
      requests.map(async (request) => {
        await handleSaveExternalAccessRequestApi(request);
      })
    );

    if (requestStatus.every((status) => status === 'SUCCESS')) {
      handleOnToggle(false); // close side panel
      dispatch(
        add({
          status: toastStatusEnumLike.Success,
          title: props.t(
            'Request sent. If access is approved, the approval email will allow access to fixture.'
          ),
        })
      );
    } else {
      dispatch(
        add({
          status: toastStatusEnumLike.Error,
          title: props.t('Something went wrong on our end. Please try again.'),
        })
      );
    }
  };
  const handleOnSubmit = () => {
    if (externalAccessFormRef?.current) {
      const isFormValid = externalAccessFormRef?.current.checkFormValidation();
      if (isFormValid && requests?.length) {
        // functionality for submitting the form
        // TEMPORARY until backend make bulk save for array of requests
        handlingSaveItterable();
      }
    }
  };

  const renderContent = () => {
    if (!isOpen) return null;

    const game = props.fixtures?.find((fixture) => fixture.id === gameId);
    const gameStartDate = game
      ? `${moment(game.start_date).format('D MMM YYYY, hh:mm a')}`
      : '';
    const gameWeekday = game ? `${moment(game.start_date).format('dddd')}` : '';
    const opponentName = game?.opponent_squad
      ? game.opponent_squad.owner_name
      : '';

    return (
      game && (
        <SidePanelSectionLayout>
          <SidePanelSectionLayout.Title
            title={props.t(
              'Request access to {{ownerName}} vs {{opponentName}}',
              {
                ownerName: game.squad?.owner_name,
                opponentName,
                interpolation: { escapeValue: false },
              }
            )}
            date={`${gameWeekday}, ${gameStartDate}`}
            text={props.t(
              'Maximum number of requests per game: {{MAX_NUM_OF_REQUESTS_PER_GAME}}',
              {
                MAX_NUM_OF_REQUESTS_PER_GAME,
              }
            )}
            onClose={() => handleOnToggle(false)}
          />
          <SidePanelSectionLayout.Content>
            <ExternalAccessForm
              t={props.t}
              ref={externalAccessFormRef}
              onFormChange={(updatedRequests) =>
                requestsUpdated(updatedRequests)
              }
            />
          </SidePanelSectionLayout.Content>
          <SidePanelSectionLayout.Actions>
            <Actions onSubmit={() => handleOnSubmit()} />
          </SidePanelSectionLayout.Actions>
        </SidePanelSectionLayout>
      )
    );
  };

  return (
    <Drawer
      open={isOpen}
      anchor="right"
      onClose={() => {}}
      sx={drawerMixin({ theme, isOpen })}
    >
      {renderContent()}
    </Drawer>
  );
};

export default withNamespaces()(ExternalAccessSidePanel);
