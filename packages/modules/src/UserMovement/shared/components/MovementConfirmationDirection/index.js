/* eslint-disable camelcase, max-statements */
// @flow
import moment from 'moment';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { KITMAN_ICON_NAMES, KitmanIcon } from '@kitman/playbook/icons';
import type { Node } from 'react';
import { withNamespaces } from 'react-i18next';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import {
  getFormState,
  getMovingToOrganisationFactory,
} from '@kitman/modules/src/UserMovement/shared/redux/selectors/createMovementSelectors';
import { useSearchMovementOrganisationsListQuery } from '@kitman/modules/src/UserMovement/shared/redux/services';
import { getOrganisation } from '@kitman/common/src/redux/global/selectors';
import {
  getMovementFromOrganisationFactory,
  getUserProfile,
} from '@kitman/modules/src/UserMovement/shared/redux/selectors/movementProfileSelectors';
import type { UserData } from '@kitman/services/src/services/fetchUserData';
import { Typography, Stack, Box } from '@kitman/playbook/components';
import {
  getTitle,
  getTradeDateLabel,
  getCreateRecordQueryParams,
} from '../../config';
import {
  MEDICAL_TRIAL,
  RELEASE,
  RETIRE,
  TRADE,
  MULTI_ASSIGN,
} from '../../constants';
import MovementDirectionItem from '../MovementDirectionItem';

type Item = {
  label: string,
  value: string | number,
};

// this will be configurable on an association level. For now, it's 3
const PRESET_SHARING_DURATION = 3;

const MovementConfirmationDirection = (props: I18nProps<{}>): Node => {
  const { user_id, transfer_type, leave_organisation_ids, joined_at } =
    useSelector(getFormState);

  const profile: UserData = useSelector(
    getUserProfile({
      userId: user_id,
      include_athlete: true,
    })
  );

  const { data: movementOrganisationOptions } =
    useSearchMovementOrganisationsListQuery(
      getCreateRecordQueryParams({ type: transfer_type, user_id }),
      {
        skip: !user_id || !transfer_type,
      }
    );

  const currentOrganisation = useSelector(getOrganisation());

  const movingToOrganisation = useSelector(
    getMovingToOrganisationFactory(movementOrganisationOptions)
  );

  const movingFromOrganisation = useSelector(
    getMovementFromOrganisationFactory(leave_organisation_ids[0], {
      userId: user_id,
      include_athlete: true,
    })
  );

  const hasMultipleOrganisation =
    profile.athlete && profile.athlete.organisations?.length > 1;

  const movementItems: Array<Item> = useMemo(() => {
    const items = [
      {
        label: props.t('Type'),
        value: getTitle({ type: transfer_type }),
      },
      {
        label: getTradeDateLabel({ type: transfer_type }),
        value: moment(joined_at).format('D MMM YYYY'),
      },
    ];
    if (transfer_type === MEDICAL_TRIAL) {
      items.push({
        label: props.t('Sharing Duration'),
        value: props.t('{{daycount}} days', {
          daycount: PRESET_SHARING_DURATION,
          interpolation: { escapeValue: false },
        }),
      });
    }

    return items;
  }, [props, transfer_type, joined_at]);

  const renderMovementRecordDetails = (): Node => {
    return movementItems.map((item) => {
      return (
        <Stack direction="row" spacing={2} key={item.label}>
          <Typography
            variant="body2"
            sx={{ color: 'text.primary', fontWeight: 'bold' }}
          >
            {item.label}:
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.primary' }}>
            {item.value}
          </Typography>
        </Stack>
      );
    });
  };

  const renderMovementFlow = () => {
    switch (transfer_type) {
      case TRADE:
        return (
          <Stack
            direction="row"
            divider={<KitmanIcon name={KITMAN_ICON_NAMES.ArrowForwardIos} />}
            justifyContent="space-between"
            alignItems="center"
            spacing={2}
          >
            <MovementDirectionItem
              organisation={movingFromOrganisation}
              label={props.t('Traded from')}
            />
            {movingToOrganisation && (
              <MovementDirectionItem
                organisation={movingToOrganisation}
                label={props.t('Traded to')}
              />
            )}
          </Stack>
        );
      case MEDICAL_TRIAL:
        return (
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            spacing={2}
          >
            <MovementDirectionItem
              organisation={movingToOrganisation}
              label={props.t('Medical Trial with')}
            />
          </Stack>
        );
      case MULTI_ASSIGN:
        return (
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            spacing={2}
          >
            <MovementDirectionItem
              organisation={movingToOrganisation}
              label={props.t('Assign to')}
            />
          </Stack>
        );
      case RETIRE:
      case RELEASE:
        return (
          <Stack
            direction="row"
            justifyContent="space-between"
            divider={<KitmanIcon name={KITMAN_ICON_NAMES.ArrowForwardIos} />}
            alignItems="center"
            spacing={2}
          >
            <MovementDirectionItem
              organisation={movingFromOrganisation}
              label={props.t('Released from')}
            />
            {!hasMultipleOrganisation && (
              <MovementDirectionItem
                organisation={currentOrganisation}
                label={props.t('Released to')}
              />
            )}
          </Stack>
        );

      default:
        return <></>;
    }
  };

  return (
    <Stack direction="column" spacing={2}>
      {renderMovementRecordDetails()}
      <Box sx={{ width: '100%' }}>{renderMovementFlow()}</Box>
    </Stack>
  );
};

export const MovementConfirmationDirectionTranslated = withNamespaces()(
  MovementConfirmationDirection
);
export default MovementConfirmationDirection;
