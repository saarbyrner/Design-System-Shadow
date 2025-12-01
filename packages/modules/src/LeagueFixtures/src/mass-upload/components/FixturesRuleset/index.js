// @flow
import { Box, Typography } from '@mui/material';
import i18n from '@kitman/common/src/utils/i18n';
import {
  getDataTypeGuideline,
  getLabels,
} from '@kitman/modules/src/shared/MassUpload/utils';
import downloadCsvTemplate from '@kitman/modules/src/shared/MassUpload/New/utils/downloadCsvTemplate';
import { IMPORT_TYPES } from '@kitman/modules/src/shared/MassUpload/New/utils/consts';
import { getGuidelines } from './guidelines';

type Props = {
  acceptedDateFormats: Array<{
    format: string,
    example: string,
  }>,
};

const FixturesRuleset = ({ acceptedDateFormats }: Props) => {
  const guidelines = getGuidelines({ acceptedDateFormats }).map((guideline) =>
    getDataTypeGuideline(guideline)
  );

  const handleDownloadClick = () => {
    downloadCsvTemplate(
      'League_Fixtures_Import_Template',
      IMPORT_TYPES.LeagueGame
    );
  };

  return (
    <Box>
      <Typography variant="body1" fontSize={14}>
        {i18n.t(
          'To avoid errors make sure you are importing the correct template file type for this submission. Download a CSV file template for'
        )}{' '}
        <Typography
          variant="body1"
          component="span"
          fontSize={14}
          sx={{
            fontWeight: 500,
            cursor: 'pointer',
            color: 'primary.main',
            '&:hover': {
              textDecoration: 'underline',
            },
          }}
          onClick={handleDownloadClick}
          data-testid="download-fixtures-template"
        >
          {i18n.t('League fixtures import.')}
        </Typography>
      </Typography>
      <Typography
        variant="body1"
        fontSize={14}
        sx={{
          mt: 2,
          fontWeight: 600,
          color: 'text.secondary',
        }}
      >
        {`${getLabels().generalFormatGuide}:`}
      </Typography>
      {guidelines}
    </Box>
  );
};

export default FixturesRuleset;
