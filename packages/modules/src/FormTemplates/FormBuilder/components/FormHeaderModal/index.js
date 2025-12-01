// @flow
import { withNamespaces } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect, type ComponentType } from 'react';
import { MuiColorInput, matchIsValidColor } from 'mui-color-input';

import { useGetOrganisationQuery } from '@kitman/common/src/redux/global/services/globalApi';
import { useGetFormHeaderDefaultsQuery } from '@kitman/services/src/services/formTemplates';
import { getFormHeaderBrandingConfig } from '@kitman/modules/src/FormTemplates/redux/selectors/formBuilderSelectors';

import {
  Avatar,
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  FormLabel,
  Grid,
  Switch,
  Typography,
  Skeleton,
} from '@kitman/playbook/components';
import { setBrandingHeaderConfig } from '@kitman/modules/src/FormTemplates/redux/slices/formBuilderSlice';
import { LayoutSelectorTranslated as LayoutSelector } from '@kitman/modules/src/FormTemplates/FormBuilder/components/FormHeaderModal/components/LayoutSelector';
import { LogoSelectorTranslated as LogoSelector } from '@kitman/modules/src/FormTemplates/FormBuilder/components/FormHeaderModal/components/LogoSelector';
import { TextContentInputTranslated as TextContentInput } from '@kitman/modules/src/FormTemplates/FormBuilder/components/FormHeaderModal/components/TextContentInput';
import { type Attachment } from '@kitman/modules/src/HumanInput/types/forms';
import type { I18nProps } from '@kitman/common/src/types/i18n';

type Props = {
  isModalOpen: boolean,
  onClose: () => void,
  onCancel: () => void,
};

const FormHeaderModal = ({
  t,
  isModalOpen,
  onClose,
  onCancel,
}: I18nProps<Props>) => {
  const dispatch = useDispatch();
  const formHeaderBrandingConfig = useSelector(getFormHeaderBrandingConfig);

  // to get the default organisation logo image
  const { data: organisation, isSuccess: hasOrganisationDataLoaded } =
    useGetOrganisationQuery();

  // to get the default form header branding data for the current org
  const {
    data: formHeaderDefaultsData,
    isSuccess: hasFormHeaderDefaultsDataLoaded,
  } = useGetFormHeaderDefaultsQuery();

  const [data, setData] = useState({
    hidden: false,
    image: {
      hidden: false,
      current_organisation_logo: true,
      attachment: null,
    },
    text: {
      hidden: false,
      content: '',
      color: '#000000',
    },
    color: {
      primary: '#ffffff',
    },
    layout: 'left',
  });

  useEffect(() => {
    if (hasFormHeaderDefaultsDataLoaded) {
      const { header: headerDefaultsData } = formHeaderDefaultsData;

      // If the form template already has a branding config, use the data from Redux.
      // Otherwise, use the default values from the API response.
      setData(formHeaderBrandingConfig || headerDefaultsData);
    }
  }, [
    hasFormHeaderDefaultsDataLoaded,
    formHeaderBrandingConfig,
    formHeaderDefaultsData,
  ]);

  const handleTextChange = (updatedTextContent: {
    content?: string,
    hidden?: boolean,
    color?: string,
  }) => {
    setData((prevData) => ({
      ...prevData,
      text: {
        ...prevData.text,
        ...updatedTextContent,
      },
    }));
  };

  const handleColorChange = (color: string) => {
    if (matchIsValidColor(color)) {
      setData((prevData) => ({
        ...prevData,
        color: {
          ...prevData.color,
          primary: color,
        },
      }));
    }
  };

  const handleFontColorChange = (newColor: string) => {
    if (matchIsValidColor(newColor)) {
      setData((prevData) => ({
        ...prevData,
        text: {
          ...prevData.text,
          color: newColor,
        },
      }));
    }
  };

  const handleLayoutChange = (layout: 'left' | 'right' | 'center') => {
    setData((prevData) => ({
      ...prevData,
      layout,
    }));
  };

  const handleUseCurrentOrgLogoChange = (e: Object) => {
    setData((prevData) => ({
      ...prevData,
      image: {
        ...prevData.image,
        current_organisation_logo: e.target.checked,
      },
    }));
  };

  const handleHideImageToggle = () => {
    setData((prevData) => ({
      ...prevData,
      image: {
        ...prevData.image,
        hidden: !prevData.image.hidden,
      },
    }));
  };

  const handleBrandingHeaderToggle = () => {
    setData((prevData) => ({
      ...prevData,
      hidden: !prevData.hidden,
    }));
  };

  const handleChangeAttachment = (attachment: Attachment) => {
    setData((prevData) => ({
      ...prevData,
      image: {
        ...prevData.image,
        attachment,
      },
    }));
  };

  const handleSaveClick = () => {
    dispatch(setBrandingHeaderConfig({ headerConfig: data }));
    onClose();
  };

  const showDefaultOrgLogo =
    hasOrganisationDataLoaded && organisation.logo_full_path;

  const generateSkeletonLoaders = (count: number) => (
    <Box m={1}>
      {Array(count)
        .fill()
        .map((_, i) => (
          // eslint-disable-next-line react/no-array-index-key
          <Skeleton key={i} variant="text" height={56} />
        ))}
    </Box>
  );
  return (
    <Dialog
      fullWidth
      open={isModalOpen}
      onClose={onClose}
      aria-labelledby="form-header-modal"
    >
      <DialogTitle id="follow-up-questions-modal">
        {t('Form Header')}
      </DialogTitle>
      {hasFormHeaderDefaultsDataLoaded ? (
        <DialogContent>
          <Grid
            container
            spacing={1}
            columns={2}
            sx={{ flexDirection: 'column' }}
          >
            <Grid item>
              <FormLabel id="image-logo-label">
                <Typography
                  variant="subtitle1"
                  sx={{ color: 'text.primary', fontSize: '.875rem' }}
                >
                  {t('Image')}
                </Typography>
              </FormLabel>
            </Grid>
            <Grid
              item
              sx={{
                display: 'flex',
                alignItems: 'center',
                flexDirection: 'row',
                alignContent: 'center',
              }}
            >
              <Checkbox
                checked={data.image.current_organisation_logo}
                onChange={handleUseCurrentOrgLogoChange}
              />
              {showDefaultOrgLogo && (
                <Avatar src={organisation.logo_full_path} variant="square" />
              )}
              <Typography
                variant="subtitle1"
                sx={{ color: 'text.primary', fontSize: '.875rem', ml: 1 }}
              >
                {t('Use current organisation logo')}
              </Typography>
              <FormControlLabel
                control={
                  <Switch
                    checked={data.image.hidden}
                    onChange={handleHideImageToggle}
                    inputProps={{ 'aria-label': 'hidden-toggle-logo' }}
                  />
                }
                sx={{ ml: 1 }}
                label={t('Hide')}
              />
            </Grid>

            {!data.image.current_organisation_logo && (
              <Grid item>
                <LogoSelector
                  image={data.image}
                  handleChange={handleChangeAttachment}
                />
              </Grid>
            )}
            <Grid item>
              <TextContentInput
                text={data.text}
                handleChange={handleTextChange}
              />
            </Grid>
            <Grid item>
              <MuiColorInput
                disabled={false}
                label={t('Primary colour')}
                value={data.color.primary}
                onChange={handleColorChange}
                format="hex"
                fallbackValue="#ffffff"
                isAlphaHidden
              />
            </Grid>
            <Grid item>
              <MuiColorInput
                disabled={false}
                label={t('Font colour')}
                value={data.text.color}
                onChange={handleFontColorChange}
                format="hex"
                isAlphaHidden
              />
            </Grid>
            <Grid item>
              <LayoutSelector
                layout={data.layout}
                handleChange={handleLayoutChange}
              />
            </Grid>
          </Grid>
          <Grid item>
            <FormControlLabel
              control={
                <Switch
                  checked={data.hidden}
                  onChange={handleBrandingHeaderToggle}
                  inputProps={{ 'aria-label': 'hidden-toggle-header' }}
                />
              }
              sx={{ ml: 1 }}
              label={t('Hide Branding Header')}
            />
          </Grid>
        </DialogContent>
      ) : (
        generateSkeletonLoaders(6)
      )}
      <DialogActions>
        <Button onClick={onCancel} color="secondary">
          {t('Cancel')}
        </Button>
        <Button onClick={handleSaveClick} color="primary">
          {t('Save')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export const FormHeaderModalTranslated: ComponentType<Props> =
  withNamespaces()(FormHeaderModal);
export default FormHeaderModal;
