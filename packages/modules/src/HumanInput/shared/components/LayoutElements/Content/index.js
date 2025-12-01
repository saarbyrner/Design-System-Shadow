// @flow
import { RichTextDisplay } from '@kitman/components';
import { Box, Typography } from '@kitman/playbook/components';
import type { HumanInputFormElement } from '@kitman/modules/src/HumanInput/types/forms';
import {
  APP_BAR_HEIGHT,
  TITLE_BAR_HEIGHT,
  FOOTER_HEIGHT,
} from '@kitman/modules/src/HumanInput/shared/constants';
import { PdfViewerTranslated as PdfViewer } from '@kitman/components/src/PdfViewer';
import { MODE_KEY } from '@kitman/components/src/PdfViewer/src/consts';

type Props = {
  element: HumanInputFormElement,
};

const TITLE_HEIGHT = 44;
const ACTION_HEIGHT = 66;
const PADDING_BUFFER = 66;

const Content = ({ element }: Props) => {
  const text = element.config?.text;
  const source = element.config?.source;

  switch (element.config?.custom_params?.content_type) {
    case 'pdf':
      return (
        <Box
          sx={{
            height: `calc(100dvh - ${
              FOOTER_HEIGHT +
              APP_BAR_HEIGHT +
              TITLE_BAR_HEIGHT +
              TITLE_HEIGHT +
              ACTION_HEIGHT +
              PADDING_BUFFER
            }px)`,
            mb: 2,
          }}
        >
          <Typography variant="body1" mb={1}>
            {text}
          </Typography>
          {source && (
            <Box
              sx={{
                height: '100%',
                width: '100%',
                overflow: 'scroll',
              }}
            >
              <PdfViewer
                fileUrl={source}
                mode={MODE_KEY.full}
                isDownloadable
                forceShowPreview={false}
                initialPreviewVisible={false}
              />
            </Box>
          )}
        </Box>
      );
    case 'markdown':
    case 'html':
      return (
        <Box data-testid="richTextContent">
          <Typography variant="body2">
            <RichTextDisplay value={text} isAbbreviated={false} />
          </Typography>
        </Box>
      );
    default:
      return <Typography variant="body2">{text}</Typography>;
  }
};

export default Content;
