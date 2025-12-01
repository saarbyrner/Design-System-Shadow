// @flow
import { useState, useEffect } from 'react';
import { withNamespaces } from 'react-i18next';
import {
  RichTextDisplay,
  RichTextEditor,
  SettingWidget,
  TextButton,
  ToggleSwitch,
} from '@kitman/components';
import type { I18nProps } from '@kitman/common/src/types/i18n';

export type ActionState = 'LOADING' | 'LOADED' | 'EDITING' | 'ERROR';

type Props = {
  policyIsActive: ?boolean,
  policyText: ?string,
  actionState: ActionState,
  fetchPrivacyPolicy: Function,
  fetchPrivacyPolicyIsActive: Function,
  onEditingPolicy: Function,
  onChangePolicy: Function,
  savePrivacyPolicyIsActive: Function,
};

const PrivacyPolicySettings = (props: I18nProps<Props>) => {
  const [haveEditedPolicyText, setHaveEditedPolicyText] = useState(false);
  const [privacyPolicy, setPrivacyPolicy] = useState(props.policyText);
  useEffect(() => {
    props.fetchPrivacyPolicyIsActive();
    props.fetchPrivacyPolicy();
  }, []);

  useEffect(() => setPrivacyPolicy(props.policyText), [props.policyText]);

  const emptyHTMLeditorContent = '<p><br></p>';

  const isEmptyPolicy = (policyText: string) =>
    !policyText || policyText === '' || policyText === emptyHTMLeditorContent;

  const onChangePrivacyPolicyText = (text: string) => {
    if (text === privacyPolicy) {
      return;
    }
    if (isEmptyPolicy(text)) {
      setHaveEditedPolicyText(false);
      return;
    }
    setPrivacyPolicy(text);
    setHaveEditedPolicyText(true);
  };

  const resetPolicy = () => {
    setPrivacyPolicy(props.policyText);
    setHaveEditedPolicyText(false);
    props.onEditingPolicy(false);
  };

  return (
    <div className="privacyPolicy">
      <SettingWidget title={props.t('Privacy policy')} kitmanDesignSystem>
        <table className="table km-table">
          <tbody>
            <tr key="privacyPolicy">
              <td>{props.t('Display in Athlete app')}</td>
              <td className="text-right">
                <ToggleSwitch
                  isSwitchedOn={props.policyIsActive || false}
                  toggle={() =>
                    props.savePrivacyPolicyIsActive(!props.policyIsActive)
                  }
                  isDisabled={
                    props.policyIsActive === undefined ||
                    props.actionState === 'LOADING' ||
                    !props.policyText
                  }
                />
              </td>
            </tr>
          </tbody>
        </table>
        <span className="privacyPolicy__subHeading">
          {props.t('Policy text')}
        </span>
        {props.actionState === 'LOADING' && (
          <div className="privacyPolicy__loading">{props.t('Loading...')}</div>
        )}
        {props.actionState === 'EDITING' && (
          <div className="privacyPolicy__editor">
            <RichTextEditor
              onChange={(content) => {
                onChangePrivacyPolicyText(content);
              }}
              value={privacyPolicy || ''}
              kitmanDesignSystem
            />
            <footer className="privacyPolicy__footer">
              <TextButton
                text={props.t('Cancel')}
                type="secondary"
                onClick={() => resetPolicy()}
                kitmanDesignSystem
              />
              <TextButton
                text={props.t('Save')}
                type="primary"
                onClick={() => props.onChangePolicy(privacyPolicy)}
                isDisabled={!haveEditedPolicyText}
                kitmanDesignSystem
              />
            </footer>
          </div>
        )}
        {props.actionState === 'LOADED' && (
          <>
            <span className="privacyPolicy__edit">
              <TextButton
                onClick={() => props.onEditingPolicy(true)}
                type="link"
                text={props.t('Edit')}
                kitmanDesignSystem
              />
            </span>
            {privacyPolicy && (
              <div className="privacyPolicy__content">
                <RichTextDisplay value={privacyPolicy} isAbbreviated={false} />
              </div>
            )}
            {!privacyPolicy && (
              <div className="privacyPolicy__empty">
                {props.t('No policy set')}
              </div>
            )}
          </>
        )}
      </SettingWidget>
    </div>
  );
};

export const PrivacyPolicySettingsTranslated = withNamespaces()(
  PrivacyPolicySettings
);
export default PrivacyPolicySettings;
