// @flow
import { useEffect } from 'react';
import { withNamespaces } from 'react-i18next';

import { useShowToasts } from '@kitman/common/src/hooks';
import useIsMountedCheck from '@kitman/common/src/hooks/useIsMountedCheck';
import {
  Dropdown,
  Link,
  RadioList,
  ToggleSwitch,
  FilterInput,
} from '@kitman/components';
import groupByOptions from '@kitman/common/src/utils/groupByOptions';
import { useGetActiveSquadQuery } from '@kitman/common/src/redux/global/services/globalApi';
import { type Squad as ActiveSquad } from '@kitman/services/src/services/getActiveSquad';
import type { RadioOption } from '@kitman/components/src/InputRadio/types';
import type { PlatformType } from '@kitman/common/src/types/__common';
import type { GroupBy } from '@kitman/common/src/types';
import type { I18nProps } from '@kitman/common/src/types/i18n';

type Props = {
  templateName: string,
  searchTerm: string,
  setFilter: (string) => void,
  clearFilter: () => void,
  groupBy: GroupBy,
  setGroupBy: (string) => void,
  platform: PlatformType,
  platformOptions: Array<RadioOption>,
  selectedSquad: string,
  setShowWarningMessage: (boolean) => void,
  showWarningMessage: boolean,
  squadOptions: Array<{ id: string, title: PlatformType }>,
  setPlatform: (string) => void,
  setSquadFilter: (number) => void,
  isMassInput: boolean,
  setMassInput: (boolean) => void,
  setSquadFilterLocalState: (number) => void,
  localSquadFilter: number | null,
};

const GET_ACTIVE_SQUAD_ERROR = 'GET_ACTIVE_SQUAD_ERROR';

const Controls = (props: I18nProps<Props>) => {
  const getIsMounted = useIsMountedCheck();

  const { showErrorToast } = useShowToasts({
    errorToastId: GET_ACTIVE_SQUAD_ERROR,
    successToastId: 'GET_ACTIVE_SQUAD_SUCCESS',
  });

  const {
    data: userCurrentSquad,
    isSuccess: isSquadQuerySuccess,
    isLoading: isSquadQueryLoading,
    isError: isSquadQueryError,
  }: {
    data: ActiveSquad,
    isSuccess: boolean,
    isLoading: boolean,
    isError: boolean,
  } = useGetActiveSquadQuery();

  useEffect(() => {
    const isMounted = getIsMounted();
    const canUseCurrentSquad = isSquadQuerySuccess && !!userCurrentSquad;
    if (
      isMounted &&
      canUseCurrentSquad &&
      window.featureFlags['manage-forms-default-to-current-squad']
    ) {
      props.setSquadFilter(userCurrentSquad.id);
    }
  }, [
    getIsMounted,
    isSquadQuerySuccess,
    userCurrentSquad,
    props.setSquadFilter,
  ]);

  useEffect(() => {
    if (isSquadQueryError) {
      showErrorToast({
        translatedTitle: props.t('Error getting active squad'),
      });
    }
  }, [isSquadQueryError, showErrorToast, props.t]);

  // deep copy of squad options for the dropdown
  const squadOptions = JSON.parse(JSON.stringify(props.squadOptions));
  const radioList =
    props.platformOptions.length > 1 ? (
      <RadioList
        radioName="platform_type"
        label={props.t('Filter Form By')}
        value={props.platform}
        options={props.platformOptions}
        change={props.setPlatform}
      />
    ) : null;

  return (
    <div className="questionnaireManagerControls">
      <div className="row" style={{ marginBottom: 5 }}>
        <div className="col-md-12">
          <div className="questionnaireManagerControls__toggles">
            <ToggleSwitch
              label={props.t('Mass Input:')}
              isSwitchedOn={props.isMassInput}
              toggle={() => props.setMassInput(!props.isMassInput)}
            />
            {window.featureFlags['warning-answer'] ? (
              <ToggleSwitch
                label={props.t('Show Warning Message:')}
                isSwitchedOn={props.showWarningMessage}
                toggle={() =>
                  props.setShowWarningMessage(!props.showWarningMessage)
                }
              />
            ) : null}
          </div>
          <div className="questionnaireManagerControls__breadcrumb">
            <Link href="/settings/questionnaire_templates">
              &lt;&ensp;
              {props.t('Back to the list')}
            </Link>
          </div>
          <h3>{props.templateName}</h3>
        </div>
      </div>
      <div className="row">
        <div className="col-md-6 col-lg-3">
          <div className="questionnaireManagerControls__label">
            {props.t('#sport_specific__Search_for_an_Athlete')}
          </div>
          <FilterInput
            tabIndex={0}
            value={props.searchTerm}
            placeHolder=""
            setFilter={props.setFilter}
            clearFilter={props.clearFilter}
          />
        </div>
        {/* We add an 'All Squads' option the squads, so then length needs to be greater than 2 */}
        {props.squadOptions.length > 2 ? (
          <div className="col-md-6 col-lg-3">
            <div className="questionnaireManagerControls__label">
              {props.t('#sport_specific__Filter_By_Squad')}
            </div>
            <Dropdown
              value={
                // State does not update until the BE request returns
                window.featureFlags['manage-forms-default-to-current-squad']
                  ? props.localSquadFilter ?? props.selectedSquad
                  : props.selectedSquad
              }
              onChange={(optionId) => {
                props.setSquadFilter(optionId);
                if (
                  window.featureFlags['manage-forms-default-to-current-squad']
                ) {
                  props.setSquadFilterLocalState(optionId);
                }
              }}
              items={squadOptions}
              isDisabled={isSquadQueryLoading}
            />
          </div>
        ) : null}
        <div className="col-md-6 col-lg-2">
          <div className="questionnaireManagerControls__label">
            {props.t('Group By')}
          </div>
          <Dropdown
            value={props.groupBy}
            onChange={(optionId) => {
              props.setGroupBy(optionId);
            }}
            items={groupByOptions()}
          />
        </div>
        <div className="questionnaireManagerControls__platform col-md-12 col-lg-4">
          {radioList}
        </div>
      </div>
    </div>
  );
};

export const ControlsTranslated = withNamespaces()(Controls);
export default Controls;
