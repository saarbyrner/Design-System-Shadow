// @flow
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  ListItem,
  List,
} from '@kitman/playbook/components';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { withNamespaces } from 'react-i18next';

type NoConsentAthlete = {
  athlete_id: number,
  fullname: string,
  message: string,
};

type Props = {
  isOpen: boolean,
  selectedNumber: number,
  notConsentedAthletes: Array<NoConsentAthlete>,
  onSave: () => void,
  onCancel: () => void,
};

const ConsentOverlapDialog = ({
  isOpen,
  t,
  selectedNumber,
  notConsentedAthletes,
  onSave,
  onCancel,
}: I18nProps<Props>) => {
  const notConsentedAthletesCount = notConsentedAthletes.length;
  const consentedAthletesCount = selectedNumber - notConsentedAthletesCount;
  return (
    <Dialog
      open={isOpen}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle>{t('Review Consent')}</DialogTitle>
      <DialogContent>
        <Typography variant="body2">
          {`${notConsentedAthletesCount}/${selectedNumber} ${t(
            'The following athletes cannot be updated due to overlapping consent dates'
          )}`}
        </Typography>
        {notConsentedAthletes.length > 0 && (
          <List disablePadding sx={{ mb: 2 }}>
            {notConsentedAthletes.map((athlete) => (
              <ListItem
                dense
                disablePadding
                key={athlete.athlete_id}
                sx={{ fontWeight: 600, lineHeight: 1.2 }}
              >
                {athlete.fullname}
              </ListItem>
            ))}
          </List>
        )}
        <Typography variant="body2">
          {`${consentedAthletesCount}/${selectedNumber} ${t(
            'athletes have consented to this time period.'
          )}`}
        </Typography>
        <Typography variant="body2">{t('Click Save to update.')}</Typography>
      </DialogContent>
      <DialogActions>
        <Button color="secondary" onClick={onCancel}>
          {t('Cancel')}
        </Button>
        <Button color="primary" onClick={onSave}>
          {t('Save')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export const ConsentOverlapDialogTranslated =
  withNamespaces()(ConsentOverlapDialog);

export default ConsentOverlapDialog;
