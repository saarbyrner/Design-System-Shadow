// @flow
import { useState, useEffect, useRef, useMemo, Fragment } from 'react';
import orderBy from 'lodash/orderBy';
import { withNamespaces } from 'react-i18next';
import {
  Box,
  FormControl,
  Autocomplete,
  TextField,
} from '@kitman/playbook/components';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { useSelector, useDispatch } from 'react-redux';
import { getEventSelector } from '@kitman/modules/src/MatchDay/shared/selectors';
import {
  useGetGameOfficialsQuery,
  useGetOfficialUsersQuery,
  useSetGameOfficialsMutation,
} from '@kitman/modules/src/PlanningEvent/src/redux/reducers/rtk/officialsApi';
import { add } from '@kitman/modules/src/Toasts/toastsSlice';
import { toastStatusEnumLike } from '@kitman/components/src/Toast/enum-likes';
import {
  getTranslations,
  getHasDuplicateOfficials,
} from '@kitman/modules/src/MatchDay/shared/utils';
import { officialRoleEnumLike } from '@kitman/modules/src/MatchDay/shared/constants';
import type {
  OfficialRole,
  MatchOfficialsForm,
} from '@kitman/modules/src/MatchDay/shared/types';
import useLeagueOperations from '@kitman/common/src/hooks/useLeagueOperations';
import { usePermissions } from '@kitman/common/src/contexts/PermissionsContext';
import { usePreferences } from '@kitman/common/src/contexts/PreferenceContext/preferenceContext';
import chunk from 'lodash/chunk';

import { dismissToasts } from '@kitman/modules/src/AthleteReviews/src/shared/utils';

import Card from '../Card';
import Col from '../Col';
import InformationRow from '../InformationRow';
import LockView from '../LockView';
import DuplicateOfficialsAlert from '../DuplicateOfficialsAlert';

const styles = {
  columns: (columnsCount: number) => ({
    display: 'grid',
    gap: 3,
    gridTemplateColumns: `repeat(${columnsCount}, 1fr)`,
  }),
};

type Props = {};

const MatchOfficials = ({ t }: I18nProps<Props>) => {
  const dispatch = useDispatch();
  const event = useSelector(getEventSelector);
  const { data: gameOfficials } = useGetGameOfficialsQuery(
    { eventId: event?.id },
    { skip: !event?.id }
  );
  const { isLeague, isLeagueStaffUser } = useLeagueOperations();
  const { permissions } = usePermissions();
  const { preferences } = usePreferences();

  const [form, setForm] = useState<MatchOfficialsForm>({});
  const formRef = useRef({});

  const canManageGameInformation =
    isLeague && permissions?.leagueGame.manageGameInformation;

  const isViewLocked = !isLeagueStaffUser && !event?.dmn_notification_status;

  const getOfficialUsersQuery = useGetOfficialUsersQuery({
    divisionId: event?.squad?.division?.[0]?.id,
  });
  const [setGameOfficials, { isLoading: isSaving }] =
    useSetGameOfficialsMutation();

  const textEnum = getTranslations(t);

  const enabledFields = useMemo(() => {
    const AR1Label = t('AR{{number}}', {
      number: 1,
      context: 'Assistant Referee',
    });
    const AR2Label = t('AR{{number}}', {
      number: 2,
      context: 'Assistant Referee',
    });
    const VARLabel = t('VAR', {
      context: 'Video Assistant Referee',
    });
    const AVARLabel = t('AVAR', {
      context: 'Assistant Video Assistant Referee',
    });

    const officialFieldsConfig = [
      {
        key: officialRoleEnumLike.Referee,
        label: t('Referee'),
        required: true,
        enabled: true,
      },
      {
        key: officialRoleEnumLike.AssistantReferee1,
        label: AR1Label,
        required: true,
        enabled: true,
      },
      {
        key: officialRoleEnumLike.AssistantReferee2,
        label: AR2Label,
        required: true,
        enabled: true,
      },
      {
        key: officialRoleEnumLike.FourthReferee,
        label: t('4th Official'),
        required: true,
        enabled: true,
      },
      {
        key: officialRoleEnumLike.ReserveAR,
        label: t('Reserve AR'),
        required: false,
        enabled: preferences?.enable_reserve_ar,
      },
      {
        key: officialRoleEnumLike.Var,
        label: VARLabel,
        required: true,
        enabled: true,
      },
      {
        key: officialRoleEnumLike.Avar,
        label: AVARLabel,
        required: true,
        enabled: true,
      },
    ];
    return officialFieldsConfig.filter((field) => field.enabled);
  }, [preferences?.enable_reserve_ar, t]);

  useEffect(() => {
    const formValues = enabledFields.reduce((enabledOfficials, field) => {
      // eslint-disable-next-line no-param-reassign
      enabledOfficials[field.key] = gameOfficials?.[field.key]?.official?.id;
      return enabledOfficials;
    }, {});

    setForm(formValues);
    formRef.current = formValues;
  }, [gameOfficials, enabledFields]);

  const officials = useMemo(
    () => orderBy(getOfficialUsersQuery?.data ?? [], ['fullname'], ['asc']),
    [getOfficialUsersQuery?.data]
  );

  const officialsIds = enabledFields
    .map((field) => form[field.key])
    .filter(Number);

  // $FlowIgnore[incompatible-call] officialsIds can only be an array of numbers or an empty array
  const hasDuplicateOfficials = getHasDuplicateOfficials(officialsIds);
  const requiredFields = enabledFields.filter((field) => field.required);
  const isFormValid =
    !hasDuplicateOfficials && requiredFields.every((field) => form[field.key]);

  if (!event) {
    return null;
  }

  const renderInformation = (value?: string | number) => {
    return `${value ?? '--'}`;
  };

  const renderSelectOfficial = ({
    name,
    label,
  }: {
    name: string,
    label: string,
  }) => {
    return (
      <FormControl>
        <Autocomplete
          id={`${name.toLowerCase()}-autocomplete`}
          options={officials}
          renderInput={(params) => <TextField {...params} label={label} />}
          value={officials.find((i) => i.id === form[name]) ?? null}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          onChange={(_, selectedValue) => {
            setForm((prev) => ({ ...prev, [name]: selectedValue?.id ?? null }));
          }}
          getOptionLabel={(option) => option.fullname}
          getOptionKey={(option) => option.id}
          clearOnBlur
          clearOnEscape
          disableClearable={false}
        />
      </FormControl>
    );
  };

  const renderInformationRow = ({
    name,
    label,
  }: {
    name: OfficialRole,
    label: string,
  }) => {
    return (
      <InformationRow
        label={`${label}:`}
        value={renderInformation(gameOfficials?.[name]?.official?.fullname)}
        hideInfo={isViewLocked}
      />
    );
  };

  const onSaveGameOfficials = async () => {
    try {
      const updates = Object.entries(form).map(([role, id]) => ({
        role,
        official_id: id,
      }));
      // $FlowIgnore[incompatible-call] Object.entries returning a mixed interfer the updates object who has the expected shape
      await setGameOfficials({ eventId: event.id, updates }).unwrap();
    } catch {
      dispatch(
        add({
          status: toastStatusEnumLike.Error,
          title: textEnum.officialsSavedError,
        })
      );
      setTimeout(() => dismissToasts(dispatch), 2500);
      return;
    }

    dispatch(
      add({
        status: toastStatusEnumLike.Success,
        title: textEnum.officialsSavedSuccess,
      })
    );
  };

  const getMatchOfficialsFieldsPartedByColumn = (): Array<
    Array<{
      key: OfficialRole,
      label: string,
      enabled: boolean,
    }>
  > => {
    return chunk(enabledFields, Math.ceil(enabledFields.length / 2));
  };

  const renderEditForm = () => {
    return (
      <div>
        <DuplicateOfficialsAlert officialsIds={officialsIds} />
        <Box sx={styles.columns(2)}>
          {getMatchOfficialsFieldsPartedByColumn().map(
            (partition, columnIndex) => (
              // eslint-disable-next-line react/no-array-index-key
              <Col key={columnIndex}>
                {partition.map((field, fieldIndex) => (
                  // eslint-disable-next-line react/no-array-index-key
                  <Fragment key={fieldIndex}>
                    {renderSelectOfficial({
                      name: field.key,
                      label: field.label,
                    })}
                  </Fragment>
                ))}
              </Col>
            )
          )}
        </Box>
      </div>
    );
  };

  return (
    <LockView isEnabled={isViewLocked}>
      <Card
        title={t('Match Officials')}
        editForm={renderEditForm()}
        isFormValid={isFormValid}
        onSubmitForm={onSaveGameOfficials}
        isSubmitting={isSaving}
        isFormEditable={canManageGameInformation}
        onResetForm={() => setForm(formRef.current)}
      >
        <DuplicateOfficialsAlert officialsIds={officialsIds} />
        <Box sx={styles.columns(2)}>
          {getMatchOfficialsFieldsPartedByColumn().map(
            (partition, columnIndex) => (
              // eslint-disable-next-line react/no-array-index-key
              <Col key={columnIndex}>
                {partition.map((field, fieldIndex) => (
                  // eslint-disable-next-line react/no-array-index-key
                  <Fragment key={fieldIndex}>
                    {renderInformationRow({
                      name: field.key,
                      label: field.label,
                    })}
                  </Fragment>
                ))}
              </Col>
            )
          )}
        </Box>
      </Card>
    </LockView>
  );
};

export default withNamespaces()(MatchOfficials);
