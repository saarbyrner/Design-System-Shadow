// @flow
import { useEffect, useState } from 'react';
import { withNamespaces } from 'react-i18next';
import { AppStatus, Dropdown, SettingWidget } from '@kitman/components';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { GraphColoursTranslated as GraphColours } from '../GraphColours';
import { ScaleColoursTranslated as ScaleColours } from '../ScaleColours';
import type { NameFormattings } from '../../types';

type Props = {
  fetchGraphColours: Function,
  graphColourPalette: Array<string>,
  onResetGraphColours: Function,
  onUpdateGraphColourPalette: Function,
  nameFormattings: NameFormattings,
  updateNameFormattings: Function,
};

// default dropdown values
const DEFAULT_DISPLAY_NAME_ID = 1;
const DEFAULT_SHORTENED_NAME_ID = 1;

// tooltip settings
const getTooltipSettings = (text: string) => ({
  placement: 'bottom-start',
  content: <div>{text}</div>,
  tooltipTriggerElement: <i className="icon-info" />,
});

const AppearanceSettings = (props: I18nProps<Props>) => {
  const [displayNameId, setDisplayNameId] = useState(
    props.nameFormattings?.display_name?.active || DEFAULT_DISPLAY_NAME_ID
  );
  const [shortenedNameId, setShortenedNameId] = useState(
    props.nameFormattings?.shortened_name?.active || DEFAULT_SHORTENED_NAME_ID
  );

  const [feedbackModalStatus, setFeedbackModalStatus] = useState(null);
  const [feedbackModalMessage, setFeedbackModalMessage] = useState(null);

  useEffect(() => {
    if (window.featureFlags['athlete-name-display-settings']) {
      const isNewDisplayName =
        props.nameFormattings?.display_name?.active !== displayNameId;
      const isNewShortenedName =
        props.nameFormattings?.shortened_name?.active !== shortenedNameId;

      if (isNewDisplayName || isNewShortenedName) {
        props.updateNameFormattings({
          displayNameId,
          shortenedNameId,
        });
      }
    }
  }, [displayNameId, shortenedNameId]);

  return (
    <>
      {window.featureFlags['athlete-name-display-settings'] && (
        <div className="organisationAppearanceSettings">
          <div className="organisationAppearanceSettings__title">
            <h6>{props.t('Naming')}</h6>
          </div>
          <div className="organisationAppearanceSettings__content">
            <SettingWidget title={props.t('Athlete Name')} kitmanDesignSystem>
              <div className="organisationAppearanceSettings__dropdown">
                <Dropdown
                  onChange={(value) => setDisplayNameId(value)}
                  items={props.nameFormattings.display_name.options}
                  label={props.t('Display name')}
                  value={displayNameId}
                  tooltipSettings={getTooltipSettings(
                    props.t(
                      'This name is used in the majority of areas throughout the platform'
                    )
                  )}
                />
              </div>
              <div className="organisationAppearanceSettings__dropdown">
                <Dropdown
                  onChange={(value) => setShortenedNameId(value)}
                  items={props.nameFormattings.shortened_name.options}
                  label={props.t('Shortened name')}
                  value={shortenedNameId}
                  tooltipSettings={getTooltipSettings(
                    props.t(
                      'This name is used on the metric dashboard and graph legends'
                    )
                  )}
                />
              </div>
            </SettingWidget>
          </div>
        </div>
      )}
      <div className="organisationAppearanceSettings">
        <div className="organisationAppearanceSettings__title">
          <h6>{props.t('Branding')}</h6>
        </div>
        <div className="organisationAppearanceSettings__content">
          <SettingWidget
            title={props.t('Graph Colours')}
            onClickRestore={() => {
              setFeedbackModalStatus('warning');
              setFeedbackModalMessage('Restore Default Graph Colours?');
            }}
            kitmanDesignSystem
          >
            <GraphColours
              fetchColours={() => props.fetchGraphColours()}
              onUpdateColours={(palette) =>
                props.onUpdateGraphColourPalette(palette)
              }
              palette={props.graphColourPalette}
            />
          </SettingWidget>
        </div>

        {window.featureFlags['scales-colours'] && (
          <SettingWidget title={props.t('Scale colours')} kitmanDesignSystem>
            <ScaleColours />
          </SettingWidget>
        )}
      </div>

      <AppStatus
        status={feedbackModalStatus}
        message={feedbackModalMessage}
        deleteAllButtonText={props.t('Restore')}
        hideConfirmation={() => {
          setFeedbackModalStatus(null);
          setFeedbackModalMessage(null);
        }}
        close={() => {
          setFeedbackModalStatus(null);
          setFeedbackModalMessage(null);
        }}
        confirmAction={() => {
          setFeedbackModalStatus(null);
          setFeedbackModalMessage(null);
          props.onResetGraphColours();
        }}
      />
    </>
  );
};

export const AppearanceSettingsTranslated =
  withNamespaces()(AppearanceSettings);
export default AppearanceSettings;
