// @flow
import { useEffect, useState, type ComponentType } from 'react';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { withNamespaces } from 'react-i18next';
import uploadAttachment from '@kitman/services/src/services/uploadAttachment';
import { styled } from '@mui/material/styles';
import { Box, Button, Avatar, Alert } from '@kitman/playbook/components';
import { type Attachment } from '@kitman/modules/src/HumanInput/types/forms';

type Props = {
  image: {
    hidden: boolean,
    current_organisation_logo: boolean,
    attachment: ?Attachment,
  },
  handleChange: (attachment: Attachment) => void,
};

const FileInput = styled('input')`
  clip: rect(0 0 0 0);
  position: absolute;
  white-space: nowrap;
  clip-path: inset(50%);
  height: 1px;
  overflow: hidden;
  bottom: 0;
  left: 0;
  width: 1px;
`;

const LogoSelector = ({ t, image, handleChange }: I18nProps<Props>) => {
  const [logoUrl, setLogoUrl] = useState('');
  const [error, setError] = useState('');

  const getButtonText = () => {
    if (image.attachment) return t('Select a different');
    return t('Select');
  };

  useEffect(() => {
    const fetchLogo = async () => {
      if (image?.attachment) {
        setLogoUrl(image?.attachment.url);
      }
    };

    fetchLogo();
  }, [image?.attachment, t]);

  return (
    <Box display="flex" flexDirection="column">
      <Box display="flex">
        <Avatar src={logoUrl} sx={{ mr: 1 }} variant="square" />
        <Button
          component="label"
          variant="contained"
          color="secondary"
          role={undefined}
        >
          {getButtonText()} {t('Image')}
          <FileInput
            type="file"
            accept="image/png, image/jpg, image/jpeg"
            onChange={async (e) => {
              const file = e.target.files[0];

              // Validate the file size
              if (file.size > 5 * 1024 * 1024) {
                // 5MB limit
                setError(t('File size exceeds the limit of 5MB.'));
                return;
              }

              try {
                const { attachment } = await uploadAttachment(file, file.name);

                handleChange(attachment);
              } catch (err) {
                const errorMessage = t(
                  'Error uploading the logo - {{errorMessage}}',
                  { errorMessage: err.message }
                );
                setError(errorMessage);
              }
            }}
          />
        </Button>
        {error && (
          <Alert severity="error" sx={{ ml: 2 }}>
            {error}
          </Alert>
        )}
      </Box>
    </Box>
  );
};

export const LogoSelectorTranslated: ComponentType<Props> =
  withNamespaces()(LogoSelector);
export default LogoSelector;
