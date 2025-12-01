// @flow
import { Fragment } from 'react';
import { useDispatch } from 'react-redux';
import { withNamespaces } from 'react-i18next';

import {
  AppStatus,
  DatePicker,
  Select,
  SlidingPanelResponsive,
} from '@kitman/components';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { add } from '@kitman/modules/src/Toasts/toastsSlice';
import { ActionsTranslated as Actions } from './Actions';

import useCreateSquad from '../../SquadManagement/src/shared/hooks/useCreateSquad';

type Props = {
  reset: boolean,
  onSaveSuccess: Function,
};

const style = {
  row: {
    mb: '16px',
  },
};

const Form = (props: I18nProps<Props>) => {
  const {
    isLoading,
    isError,
    isFormCompleted,
    formState,
    teamNameOptions,
    divisionOptions,
    conferenceDivisionOptions,
    selectedDivisionId,
    onSelectDivision,
    onSelectConferenceDivision,
    onUpdateFormState,
    onSave,
  } = useCreateSquad({ reset: props.reset });
  const dispatch = useDispatch();

  const handleSave = () =>
    onSave().then(() => {
      dispatch(
        add({
          status: 'SUCCESS',
          title: props.t('Team created'),
        })
      );
      props.onSaveSuccess();
    });

  if (isLoading)
    return <AppStatus status="loading" isEmbed message={props.t('Loading')} />;
  if (isError) return <AppStatus status="error" isEmbed />;

  const renderDivisionSelect = () => {
    return (
      <>
        <div css={style.row}>
          <Select
            label={props.t('Division')}
            options={divisionOptions}
            onChange={onSelectDivision}
            value={selectedDivisionId}
          />
        </div>
        {conferenceDivisionOptions.length > 0 && (
          <div css={style.row}>
            <Select
              label={props.t('Conference')}
              options={conferenceDivisionOptions}
              onChange={onSelectConferenceDivision}
              value={formState.division_id}
            />
          </div>
        )}
      </>
    );
  };

  return (
    <Fragment>
      <SlidingPanelResponsive.Content>
        {renderDivisionSelect()}
        <div css={style.row}>
          <Select
            label={props.t('Team name')}
            options={teamNameOptions}
            onChange={(value) => {
              onUpdateFormState({
                name: value,
              });
            }}
            isDisabled={!formState.division_id}
            value={formState.name}
          />
        </div>
        <div css={style.row}>
          <DatePicker
            label={props.t('Start date')}
            value={formState.start_season}
            disabled
            kitmanDesignSystem
          />
        </div>
        <div css={style.row}>
          <DatePicker
            label={props.t('End date')}
            value={formState.end_season}
            disabled
            kitmanDesignSystem
          />
        </div>
      </SlidingPanelResponsive.Content>
      <SlidingPanelResponsive.Actions>
        <Actions onSave={handleSave} isDisabled={!isFormCompleted} />
      </SlidingPanelResponsive.Actions>
    </Fragment>
  );
};

export const FormTranslated = withNamespaces()(Form);
export default Form;
