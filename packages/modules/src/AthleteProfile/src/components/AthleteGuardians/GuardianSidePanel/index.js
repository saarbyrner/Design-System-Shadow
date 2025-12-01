// @flow
import { type ComponentType } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { withNamespaces, type I18nProps } from 'react-i18next';
import { useTheme } from '@kitman/playbook/hooks';
import { useGetAthleteIdFromPath } from '@kitman/modules/src/HumanInput/hooks/helperHooks/useGetAthleteIdFromPath';
import {
  type GuardianSidePanelState,
  type GuardianForm,
  onUpdateGuardianForm,
} from '@kitman/modules/src/AthleteProfile/redux/slices/guardiansTabSlice';
import type {
  CreateGuardianRequestBody,
  UpdateGuardianRequestBody,
  GenericGuardian,
} from '@kitman/modules/src/AthleteProfile/redux/types/index';
import {
  getGuardianFormFactory,
  getModeFactory,
} from '@kitman/modules/src/AthleteProfile/redux/selectors/index';
import { MODES } from '@kitman/modules/src/HumanInput/shared/constants';
import {
  useCreateGuardianMutation,
  useUpdateGuardianMutation,
} from '@kitman/services/src/services/humanInput/humanInput';
import {
  Button,
  Drawer,
  Grid,
  TextField,
  CircularProgress,
} from '@kitman/playbook/components';
import SideDrawerLayout from '@kitman/modules/src/HumanInput/shared/components/SideDrawerLayout';
import { drawerMixin } from '@kitman/modules/src/HumanInput/shared/components/SideDrawerLayout/mixins';
import { isEmailValid } from '@kitman/common/src/utils/validators';
import { useShowToasts } from '@kitman/common/src/hooks';
import { type Mode } from '@kitman/modules/src/HumanInput/types/forms';

type Props = {
  isOpen: boolean,
  onClose: () => void,
};

export type TranslatedProps = I18nProps<Props>;

export const GUARDIAN_ERROR_TOAST_ID = 'GUARDIAN_ERROR_TOAST';
export const GUARDIAN_SUCCESS_TOAST_ID = 'GUARDIAN_SUCCESS_TOAST';

const GuardianSidePanel = ({ isOpen, t, onClose }: TranslatedProps) => {
  const dispatch = useDispatch();
  const athleteId = useGetAthleteIdFromPath();
  const theme = useTheme();

  const {
    id,
    first_name: firstName,
    surname,
    email,
  } = useSelector<GuardianSidePanelState>(getGuardianFormFactory());
  const mode: Mode = useSelector<GuardianSidePanelState>(getModeFactory());

  const { showErrorToast, showSuccessToast } = useShowToasts({
    errorToastId: 'CREATE_NOTIFICATION_TRIGGERS_ERROR_TOAST_ID',
    successToastId: 'CREATE_NOTIFICATION_TRIGGERS_SUCCESS_TOAST_ID',
  });

  const [createGuardian, { isLoading: isCreateGuardianLoading }]: [
    (requestBody: CreateGuardianRequestBody) => {
      unwrap: () => Promise<GenericGuardian>,
    },
    { isLoading: boolean }
  ] = useCreateGuardianMutation();

  const [updateGuardian, { isLoading: isUpdateGuardianLoading }]: [
    (requestBody: UpdateGuardianRequestBody) => {
      unwrap: () => Promise<GenericGuardian>,
    },
    { isLoading: boolean }
  ] = useUpdateGuardianMutation();

  const handleUpdateForm = (partialForm: $Shape<GuardianForm>) => {
    dispatch(onUpdateGuardianForm(partialForm));
  };

  const handleUpdate = (field: string, value) =>
    handleUpdateForm({ [field]: value });

  const hasRequiredFields =
    firstName?.length > 0 && surname?.length && isEmailValid(email);

  const isLoading = isCreateGuardianLoading || isUpdateGuardianLoading;

  const handleSaveButton = async () => {
    const actionPayload = {
      first_name: firstName,
      surname,
      email,
    };

    if (mode === MODES.CREATE) {
      createGuardian({
        athleteId,
        ...actionPayload,
      })
        .unwrap()
        .then(() => {
          showSuccessToast({
            translatedTitle: t('New guardian added successfully'),
          });
          onClose();
        })
        .catch(() => {
          showErrorToast({
            translatedTitle: t(
              'Error creating the new guardian. Please try again.'
            ),
          });
        });
    } else if (mode === MODES.EDIT) {
      updateGuardian({
        athleteId,
        id,
        ...actionPayload,
      })
        .unwrap()
        .then(() => {
          showSuccessToast({
            translatedTitle: t('New guardian updated successfully'),
          });
          onClose();
        })
        .catch(() => {
          showErrorToast({
            translatedTitle: t(
              'Error updating the new guardian. Please try again.'
            ),
          });
        });
    }
  };

  return (
    <Drawer open={isOpen} anchor="right" sx={drawerMixin({ theme, isOpen })}>
      <SideDrawerLayout>
        <SideDrawerLayout.Title
          title={
            mode === MODES.CREATE ? t('Add guardian') : t('Update guardian')
          }
          onClose={onClose}
        />
        <SideDrawerLayout.Body>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="first-name-text-field"
                label={t('First name')}
                required
                value={firstName}
                onChange={(event) => {
                  handleUpdate('first_name', event.target?.value);
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="surname-text-field"
                label={t('Surname')}
                required
                value={surname}
                onChange={(event) => {
                  handleUpdate('surname', event.target?.value);
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="email-text-field"
                label={t('Email')}
                required
                value={email}
                onChange={(event) => {
                  handleUpdate('email', event.target?.value);
                }}
              />
            </Grid>
          </Grid>
        </SideDrawerLayout.Body>
        <SideDrawerLayout.Actions>
          <Button variant="secondary" onClick={onClose}>
            {t('Cancel')}
          </Button>
          <Button
            variant="contained"
            disabled={!hasRequiredFields || isLoading}
            onClick={handleSaveButton}
          >
            {isLoading ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              t('Save')
            )}
          </Button>
        </SideDrawerLayout.Actions>
      </SideDrawerLayout>
    </Drawer>
  );
};

export const GuardianSidePanelTranslated: ComponentType<Props> =
  withNamespaces()(GuardianSidePanel);
export default GuardianSidePanel;
