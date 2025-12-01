// @flow
import { withNamespaces } from 'react-i18next';
import { useEffect, useMemo, type ComponentType } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import useEventTracking from '@kitman/common/src/hooks/useEventTracking';

import {
  Box,
  FormControl,
  FormControlLabel,
  FormGroup,
  Switch,
  Card,
  CardContent,
  Typography,
  Grid,
} from '@kitman/playbook/components';
import {
  APP_BAR_HEIGHT,
  BUILDER_HEADER_HEIGHT,
  PDF_EXPORT_PROCESSOR,
} from '@kitman/modules/src/HumanInput/shared/constants';
import {
  getFormStructure,
  getFormMetaData,
} from '@kitman/modules/src/FormTemplates/redux/selectors/formBuilderSelectors';
import {
  setSettingsConfig,
  setPostProcessorsConfig,
} from '@kitman/modules/src/FormTemplates/redux/slices/formBuilderSlice';
import { colors } from '@kitman/common/src/variables';

import type { HumanInputFormTemplateVersionConfig } from '@kitman/modules/src/HumanInput/types/forms';

import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { FormStructure } from '@kitman/modules/src/FormTemplates/shared/types';

type Props = {};

const SettingsTab = ({ t }: I18nProps<Props>) => {
  const dispatch = useDispatch();
  const { trackEvent } = useEventTracking();
  const { config: formTemplateConfig, id: formTemplateId }: FormStructure =
    useSelector(getFormStructure);
  const { productArea } = useSelector(getFormMetaData);

  const defaultSettings = useMemo(
    () => ({
      can_edit_submitted_forms: false,
      can_save_drafts: false,
      autosave_as_draft: false,
      autopopulate_from_previous_answerset: false,
      input_method: {
        athlete_app: true,
        kiosk_app: true,
        web: true,
      },
    }),
    []
  );

  useEffect(() => {
    if (!formTemplateConfig) {
      dispatch(
        setSettingsConfig({
          settings: defaultSettings,
        })
      );
    }
  }, [formTemplateConfig, defaultSettings, dispatch]);

  const {
    settings: incomingSettings = defaultSettings,
    post_processors: postProcessors = [],
  }: HumanInputFormTemplateVersionConfig = formTemplateConfig || {};

  const settings = { ...defaultSettings, ...incomingSettings };

  const handleSettingChange = (setting) => {
    dispatch(
      setSettingsConfig({
        settings: {
          // $FlowIgnore Flow(exponential-spread)
          ...defaultSettings,
          ...settings,
          ...setting,
        },
      })
    );
  };

  const handlePdfPostProcessorChange = ({
    canSaveAsPdf,
  }: {
    canSaveAsPdf: boolean,
  }) => {
    dispatch(
      setPostProcessorsConfig({
        postProcessors: canSaveAsPdf ? [PDF_EXPORT_PROCESSOR] : [],
      })
    );
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        p: 2,
        width: '100%',
        backgroundColor: colors.background,
        height: `calc(100vh - ${APP_BAR_HEIGHT}px - ${BUILDER_HEADER_HEIGHT}px)`,
      }}
    >
      <Grid container spacing={2} p={0}>
        <Grid item xs={12} sm={6}>
          <Card sx={{ minWidth: 275 }}>
            <CardContent>
              <Typography variant="h6" component="div" mb={1}>
                {t('Actions')}
              </Typography>
              <FormControl component="fieldset" variant="standard">
                <FormGroup>
                  {[
                    {
                      id: 1,
                      label: t('Athletes can edit submitted forms'),
                      checked: settings.can_edit_submitted_forms,
                      disabled: false,
                      onChange: (checked) => {
                        handleSettingChange({
                          can_edit_submitted_forms: checked,
                        });
                        trackEvent(
                          'Form Builder Settings - Athletes Can Edit Toggled',
                          {
                            formTemplateId,
                            can_edit_submitted_forms: checked,
                          }
                        );
                      },
                    },
                    {
                      id: 2,
                      label: t('Athletes can save a draft'),
                      checked: settings.can_save_drafts,
                      disabled: false,
                      onChange: (checked) => {
                        if (!checked) {
                          handleSettingChange({
                            can_save_drafts: false,
                            autosave_as_draft: false,
                          });
                        } else {
                          handleSettingChange({ can_save_drafts: checked });
                        }
                        trackEvent(
                          'Form Builder Settings - Athletes Can Save Draft Toggled',
                          {
                            formTemplateId,
                            can_save_drafts: checked,
                          }
                        );
                      },
                    },
                    // Feature flag: cp-eforms-autosave-as-draft
                    ...(window.getFlag('cp-eforms-autosave-as-draft')
                      ? [
                          {
                            id: 3,
                            label: 'Autosave as draft',
                            checked: settings.autosave_as_draft || false,
                            disabled: !settings.can_save_drafts,
                            onChange: (checked) => {
                              handleSettingChange({
                                autosave_as_draft: checked,
                              });
                              trackEvent(
                                'Form Builder Settings - Autosave as Draft Toggled',
                                {
                                  formTemplateId,
                                  autosave_as_draft: checked,
                                }
                              );
                            },
                          },
                        ]
                      : []),
                    // Feature flag: cp-eforms-auto-populate-last-response
                    ...(window.getFlag('cp-eforms-auto-populate-last-response') ? [
                      {
                        id: window.getFlag('cp-eforms-autosave-as-draft') ? 4 : 3,
                        label: t('Auto-populate from previous answers'),
                        checked: settings.autopopulate_from_previous_answerset || false,
                        disabled: false,
                        onChange: (checked) => {
                          handleSettingChange({
                            autopopulate_from_previous_answerset: checked,
                          });
                          trackEvent(
                            'Form Builder Settings - Autopopulate from Previous Answerset Toggled',
                            {
                              formTemplateId,
                              autopopulate_from_previous_answerset: checked,
                            }
                          );
                        },
                      },
                    ] : []),
                    // only show the PDF export option for medical forms
                    // we will need to revisit this when we implement ProductArea - Category relationship
                    // for now, we will only show the PDF export option for medical forms
                    ...(productArea.toLowerCase() === 'medical'
                      ? [
                          {
                    // Adjust ID based on whether the autosave toggle is enabled
                    id: (window.getFlag('cp-eforms-autosave-as-draft')) ? 4 : 3,
                    label: t('Save form as a PDF after submission'),
                    checked:
                      postProcessors.includes(PDF_EXPORT_PROCESSOR),
                    disabled: false,
                            onChange: (checked) => {
                              handlePdfPostProcessorChange({
                                canSaveAsPdf: checked,
                              });
                              trackEvent(
                                'Form Builder Settings - Save form as PDF after submission Toggled',
                                {
                                  formTemplateId,
                                  saveFormAsPdf: checked,
                                }
                              );
                            },
                          },
                        ]
                      : []),
                  ].map(({ label, checked, onChange, id, disabled }) => (
                    <FormControlLabel
                      key={id}
                      control={
                        <Switch
                          checked={checked}
                          onChange={(event) => onChange(event.target.checked)}
                          disabled={disabled}
                        />
                      }
                      label={label}
                    />
                  ))}
                </FormGroup>
              </FormControl>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Card sx={{ minWidth: 275 }}>
            <CardContent>
              <Typography variant="h6" component="div" mb={1}>
                {t('Input method for athletes to submit answer sets')}
              </Typography>
              <FormControl component="fieldset" variant="standard">
                <FormGroup>
                  {[
                    {
                      id: 1,
                      label: t('Athlete app'),
                      checked: settings.input_method.athlete_app,
                      onChange: (checked) => {
                        handleSettingChange({
                          input_method: {
                            ...settings.input_method,
                            athlete_app: checked,
                          },
                        });
                        trackEvent(
                          'Form Builder Settings - Athlete App Toggled',
                          {
                            formTemplateId,
                            athlete_app: checked,
                          }
                        );
                      },
                    },
                    {
                      id: 2,
                      label: t('Kiosk app'),
                      checked: settings.input_method.kiosk_app,
                      onChange: (checked) => {
                        handleSettingChange({
                          input_method: {
                            ...settings.input_method,
                            kiosk_app: checked,
                          },
                        });
                        trackEvent(
                          'Form Builder Settings - Kiosk App Toggled',
                          {
                            formTemplateId,
                            kiosk_app: checked,
                          }
                        );
                      },
                    },
                    {
                      id: 3,
                      label: t('Athlete Web'),
                      checked: settings.input_method.web,
                      onChange: (checked) => {
                        handleSettingChange({
                          input_method: {
                            ...settings.input_method,
                            web: checked,
                          },
                        });
                        trackEvent(
                          'Form Builder Settings - Athlete Web Toggled',
                          {
                            formTemplateId,
                            web: checked,
                          }
                        );
                      },
                    },
                  ].map(({ label, checked, onChange, id }) => (
                    <FormControlLabel
                      key={id}
                      control={
                        <Switch
                          checked={checked}
                          onChange={(event) => onChange(event.target.checked)}
                        />
                      }
                      label={label}
                    />
                  ))}
                </FormGroup>
              </FormControl>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export const SettingsTabTranslated: ComponentType<Props> =
  withNamespaces()(SettingsTab);
export default SettingsTab;
