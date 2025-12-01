// @flow
import i18n from '@kitman/common/src/utils/i18n';
import { uniqueId } from 'lodash';
import {
  Drawer,
  Stack,
  Button,
  IconButton,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
} from '@kitman/playbook/components';
import { KITMAN_ICON_NAMES, KitmanIcon } from '@kitman/playbook/icons';
import { useTheme } from '@kitman/playbook/hooks';
import { drawerMixin } from '@kitman/modules/src/UserMovement/shared/mixins';
import ManageSectionLayout from '@kitman/modules/src/LeagueOperations/shared/layouts/ManageSectionLayout';
import useLocationSearch from '@kitman/common/src/hooks/useLocationSearch';
import HomegrownTotalsTable from '../HomegrownTotalsTable';

import CONTENT_TEXT from './utils';

type BulletPoint = {
  point: string,
  subPoints?: Array<string>,
};

type InfoContentProps = {
  subHeader?: string,
  bulletPoints: Array<BulletPoint>,
};

// This renders bullet points with sub points
const BulletPointItem = ({ text }: { text: string }) => {
  return (
    <ListItem disableGutters sx={{ p: 0 }}>
      <ListItemText
        primary={
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box
              sx={{
                display: 'flex',
                alignSelf: 'baseline',
                justifyContent: 'center',
                width: 16,
                height: 16,
              }}
            >
              •
            </Box>
            <Typography
              sx={{
                whiteSpace: 'normal',
                fontSize: 14,
                width: '100%',
                maxWidth: '100%',
                overflowWrap: 'break-word',
                wordBreak: 'break-word',
              }}
            >
              {text}
            </Typography>
          </Box>
        }
        sx={{ m: 0, p: 0, width: '100%', maxWidth: '100%' }}
      />
    </ListItem>
  );
};

// It takes a subHeader and an array of bullet points and sub points
// The bullet points are displayed as a list with the sub points indented
const InformationContent = ({ subHeader, bulletPoints }: InfoContentProps) => {
  return (
    <Box>
      {subHeader && (
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: 600,
            fontSize: 14,
            lineHeight: '150%',
            letterSpacing: '0.15px',
          }}
        >
          {subHeader}
        </Typography>
      )}
      <List sx={{ pt: 0, pb: 0, width: '100%', maxWidth: '100%' }}>
        {bulletPoints.map(({ point, subPoints }) => (
          <Box key={uniqueId()} sx={{ mb: 1.5 }}>
            <BulletPointItem text={point} />
            {subPoints && (
              <List dense sx={{ pl: 4, pt: 0, pb: 0 }}>
                {subPoints.map((sub) => (
                  <BulletPointItem key={uniqueId()} text={sub} />
                ))}
              </List>
            )}
          </Box>
        ))}
      </List>
    </Box>
  );
};

const HomegrownTotalPanel = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean,
  onClose: () => void,
}) => {
  const locationSearch = useLocationSearch();

  const theme = useTheme();
  // Get the organisation ID from the URL, for example: ?id=1267
  const organisationId = Number(locationSearch.get('id'));

  const handleClose = () => {
    onClose();
  };

  return (
    <Drawer
      open={isOpen}
      anchor="right"
      onClose={handleClose}
      sx={drawerMixin({ theme, isOpen })}
      data-testid="homegrown-total-panel"
    >
      <Box
        sx={{
          display: 'flex',
          height: '100vh',
          flexDirection: 'column',
          overflowY: 'hidden',
          p: 0,
          gap: 0,
        }}
      >
        {/* Header */}
        <Box
          sx={{
            p: 2,
            mb: 0,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: 'none',
            height: 50,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontFamily: 'Open Sans',
              fontWeight: 600,
              fontSize: 20,
              lineHeight: '160%',
              letterSpacing: '0.15px',
            }}
          >
            {i18n.t('Homegrown totals')}
          </Typography>
          <IconButton onClick={handleClose} disableRipple>
            <KitmanIcon name={KITMAN_ICON_NAMES.Close} />
          </IconButton>
        </Box>

        {/* Content */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            flexGrow: 3,
            pt: 2,
            px: 2,
            pb: 0,
            overflowY: 'auto',
          }}
        >
          <HomegrownTotalsTable organisationId={organisationId} />
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              fontSize: 16,
              lineHeight: '150%',
              letterSpacing: '0.15px',
              mb: 1.5,
            }}
          >
            {i18n.t('Homegrown rules')}
          </Typography>
          {CONTENT_TEXT.map((rule) => (
            <InformationContent
              key={uniqueId()}
              subHeader={rule.subHeader}
              bulletPoints={rule.bulletPoints}
            />
          ))}
        </Box>

        {/* Actions */}
        <ManageSectionLayout.Actions>
          <Stack direction="row" gap={2}>
            <Button onClick={handleClose} color="primary">
              {i18n.t('Close')}
            </Button>
          </Stack>
        </ManageSectionLayout.Actions>
      </Box>
    </Drawer>
  );
};

export default HomegrownTotalPanel;
