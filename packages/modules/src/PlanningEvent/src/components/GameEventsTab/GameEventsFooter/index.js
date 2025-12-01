// @flow

import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { ComponentType } from 'react';
import { withNamespaces } from 'react-i18next';
import { TextButton } from '@kitman/components';
import { Stack } from '@kitman/playbook/components';
import { KITMAN_ICON_NAMES, KitmanIcon } from '@kitman/playbook/icons';
import { usePreferences } from '@kitman/common/src/contexts/PreferenceContext/preferenceContext';

import styles, { importedGameFooter } from '../styles';

type FooterValidationChecks = {
  playersSelected: boolean,
  captainAssigned: boolean,
  lineupDone: boolean,
  subsSelected: boolean,
  staffSelected: boolean,
  physicianSelected: boolean,
};

type FooterValidationValues = {
  minNumberOfPlayersSelected: ?number,
  minNumberOfSubs: ?number,
  minNumberOfStaff: ?number,
  isPhysicianEnabled: boolean,
  isCaptainEnabled: boolean,
};

type Props = {
  isAutoSaveComplete?: boolean,
  isImportedGame: boolean,
  isMatchDayFlowLocked?: boolean,
  isMatchDayGameStartingPeriod?: boolean,
  pageRequestStatus?: string,
  footerValidationChecks?: FooterValidationChecks,
  footerValidationValues?: FooterValidationValues,
  hasPlayersBeenAssigned?: boolean,
  saveEnabled?: boolean,
  onFinishPeriod?: () => void,
  onSave?: () => Promise<void>,
};

const GameEventsFooter = (props: I18nProps<Props>) => {
  const { preferences } = usePreferences();

  const isMatchDayFlow = props?.isImportedGame && preferences?.league_game_team;

  const { footerValidationValues, footerValidationChecks } = props;

  const getBannerIcon = (validationCheck: boolean) =>
    validationCheck
      ? KITMAN_ICON_NAMES.CheckCircle
      : KITMAN_ICON_NAMES.InfoOutlined;

  const renderComplianceRule = (validationCheck: boolean, ruleText: string) => (
    <div css={styles.bannerInfoContainer}>
      <KitmanIcon name={getBannerIcon(validationCheck)} />
      <p>{ruleText}</p>
    </div>
  );
  const renderMinNumberOfSelectedAthletesCheck = () =>
    renderComplianceRule(
      !!footerValidationChecks?.playersSelected,
      props.t('Select players (min {{minNumberOfPlayers}})', {
        minNumberOfPlayers:
          +footerValidationValues?.minNumberOfPlayersSelected +
          +footerValidationValues?.minNumberOfSubs,
      })
    );

  const renderSelectCaptainCheck = () =>
    renderComplianceRule(
      !!footerValidationChecks?.captainAssigned,
      props.t('Select captain')
    );

  const renderStartingLineupCheck = () =>
    renderComplianceRule(
      !!footerValidationChecks?.lineupDone,
      props.t('Select starting {{startingLineupCount}}', {
        startingLineupCount: footerValidationValues?.minNumberOfPlayersSelected,
      })
    );

  const renderMinNumberOfSubsCheck = () =>
    renderComplianceRule(
      !!footerValidationChecks?.subsSelected,
      props.t('Substitutions (min {{minNumberOfSubs}})', {
        minNumberOfSubs: footerValidationValues?.minNumberOfSubs,
      })
    );

  const renderMinNumberOfStaffCheck = () =>
    renderComplianceRule(
      !!footerValidationChecks?.staffSelected,
      props.t('Select staff personnel (min {{minNumberOfStaff}})', {
        minNumberOfStaff: footerValidationValues?.minNumberOfStaff,
      })
    );

  const renderClubPhysicianCheck = () =>
    renderComplianceRule(
      !!footerValidationChecks?.physicianSelected,
      props.t('Select club physician')
    );

  const renderImportedGamesInfo = () => {
    if (isMatchDayFlow) {
      return (
        <div className="dmn-dmr-bar-info-bar">
          {renderMinNumberOfSelectedAthletesCheck()}

          {footerValidationValues?.isCaptainEnabled &&
            renderSelectCaptainCheck()}

          {renderStartingLineupCheck()}

          {!!footerValidationValues?.minNumberOfSubs &&
            renderMinNumberOfSubsCheck()}

          {!!footerValidationValues?.minNumberOfStaff &&
            renderMinNumberOfStaffCheck()}

          {footerValidationValues?.isPhysicianEnabled &&
            renderClubPhysicianCheck()}
        </div>
      );
    }

    return <div css={styles.bannerInfoContainer} />;
  };

  const renderShareWithOfficialsButton = () => (
    <TextButton
      onClick={props.onSave}
      text={props.t('Share with officials')}
      isDisabled={
        props.pageRequestStatus === 'LOADING' || !props.hasPlayersBeenAssigned
      }
      kitmanDesignSystem
      type="secondary"
    />
  );

  const renderFinishPeriodButton = () => (
    <TextButton
      onClick={props.onFinishPeriod}
      text={props.t('Finish period')}
      type="secondary"
      isDisabled={props.pageRequestStatus === 'LOADING'}
      kitmanDesignSystem
    />
  );

  const renderBulkSaveButton = () => (
    <TextButton
      onClick={props.onSave}
      text={props.t('Save progress')}
      type="primary"
      isDisabled={props.pageRequestStatus === 'LOADING'}
      kitmanDesignSystem
    />
  );

  const renderDefaultFooterButtons = () => (
    <>
      {props.hasPlayersBeenAssigned && renderFinishPeriodButton()}
      {props.saveEnabled && props?.isAutoSaveComplete && renderBulkSaveButton()}
    </>
  );

  const renderImportedGamesSaveButton = () => {
    const isPitchViewAutoSaveFlow =
      preferences?.league_game_team || window.getFlag('pitch-view-autosave');

    const isImportedManualSaveActive = props.onSave && !isPitchViewAutoSaveFlow;

    const renderDefaultImportedGameFooterButtons = () => (
      <Stack sx={{ display: 'flex', flexDirection: 'row' }}>
        {renderDefaultFooterButtons()}
      </Stack>
    );

    if (isImportedManualSaveActive) {
      return renderDefaultImportedGameFooterButtons();
    }

    if (
      props.isMatchDayGameStartingPeriod &&
      preferences?.league_game_match_report
    ) {
      return renderShareWithOfficialsButton();
    }

    if (
      props.isMatchDayGameStartingPeriod &&
      props.isMatchDayFlowLocked &&
      !!footerValidationChecks?.captainAssigned &&
      !!footerValidationChecks?.lineupDone
    ) {
      return renderFinishPeriodButton();
    }

    if (!props.isMatchDayGameStartingPeriod) {
      return renderDefaultImportedGameFooterButtons();
    }

    return null;
  };

  const renderImportedGamesFooter = () => (
    <div css={importedGameFooter}>
      {renderImportedGamesInfo()}
      {renderImportedGamesSaveButton()}
    </div>
  );

  const renderDefaultGameEventsFooter = () => (
    <div css={styles.saveFooter}>{renderDefaultFooterButtons()}</div>
  );

  return props.isImportedGame
    ? renderImportedGamesFooter()
    : renderDefaultGameEventsFooter();
};

export const GameEventsFooterTranslated: ComponentType<Props> =
  withNamespaces()(GameEventsFooter);

export default GameEventsFooter;
