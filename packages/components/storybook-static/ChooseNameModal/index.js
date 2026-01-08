// @flow
import type { Node } from 'react';
import { Component } from 'react';
import { withNamespaces, setI18n } from 'react-i18next';
import classNames from 'classnames';

import i18n from '@kitman/common/src/utils/i18n';
import {
  InputText,
  LegacyModal as Modal,
  TextButton,
} from '@kitman/components';
import type { Validation } from '@kitman/common/src/types';
import type { I18nProps } from '@kitman/common/src/types/i18n';

// set the i18n instance
setI18n(i18n);

type Props = {
  title: string,
  label: string,
  description?: string,
  // {no-unused-prop-types} is disable for {isOpen} because the prop is not directly used.
  // It is used in {UNSAFE_componentWillReceiveProps(newProp)} as {newProp.isOpen}
  // Eslint doesn't make the link with the original prop.
  isOpen: boolean,
  value?: string,
  closeModal?: () => void,
  actionButtonText?: string,
  onConfirm: Function,
  onChange?: Function,
  customValidations?: Array<Function>,
  maxLength?: number,
  customEmptyMessage?: string,
  adminContent?: Node,
};

class ChooseNameModal extends Component<
  I18nProps<Props>,
  {
    isValid: boolean,
    isOpen: boolean,
    value?: string,
    revealError: boolean,
  }
> {
  escClose: () => void;

  constructor(props: I18nProps<Props>) {
    super(props);
    this.state = {
      isValid: false,
      isOpen: props.isOpen || false,
      value: this.props.value || '',
      revealError: false,
    };

    this.validateForm = this.validateForm.bind(this);
    this.onClickActionButton = this.onClickActionButton.bind(this);
    this.UNSAFE_componentWillReceiveProps =
      this.UNSAFE_componentWillReceiveProps.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.escClose = this.escClose.bind(this);
  }

  componentDidMount() {
    document.addEventListener('keydown', this.escClose, false);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.escClose, false);
  }

  escClose = (event: any) => {
    if (event.keyCode === 27) {
      this.closeModal();
    }
  };

  UNSAFE_componentWillReceiveProps = (newProps: Props) => {
    if (newProps.isOpen !== this.props.isOpen) {
      this.setState({ isOpen: newProps.isOpen });
    }
    if (newProps.value !== this.props.value) {
      this.setState({ value: newProps.value });
    }
  };

  validateForm = (response: Validation) => {
    if (typeof this.props.onChange === 'function') {
      this.props.onChange(response.value);
    }
    this.setState({
      isValid: response.isValid,
      value: response.value,
    });
  };

  onClickActionButton = () => {
    if (this.state.isValid) {
      this.props.onConfirm(this.state.value);
    } else {
      this.setState({ revealError: true });
    }
  };

  closeModal = () => {
    this.setState({ revealError: false });
    if (typeof this.props.closeModal === 'function') {
      this.props.closeModal();
    }
  };

  render() {
    return (
      <Modal
        isOpen={this.state.isOpen}
        close={this.closeModal}
        title={this.props.title}
        width={490}
        // Makes sure it appears above .slidingPanel (Example: Renaming an assessment template)
        overlayStyle={{ zIndex: 2147483004 }}
      >
        <div
          className={classNames('chooseNameModal', {
            'chooseNameModal--withAdminContent': this.props.adminContent,
          })}
        >
          {this.props.description && this.props.description !== '' && (
            <p className="chooseNameModal__description">
              {this.props.description}
            </p>
          )}
          <div className="chooseNameModal__input">
            <InputText
              value={this.state.value || ''}
              label={this.props.label}
              maxLength={this.props.maxLength || 40}
              onValidation={this.validateForm}
              customValidations={this.props.customValidations}
              onEnterPressed={() => {
                this.props.onConfirm(this.state.value);
              }}
              revealError={this.state.revealError}
              customEmptyMessage={this.props.customEmptyMessage}
              required
              t={this.props.t}
            />
          </div>
          {this.props.adminContent && <>{this.props.adminContent}</>}
          <div className="km-datagrid-modalFooter">
            <TextButton
              text={this.props.t('Cancel')}
              type="secondary"
              onClick={this.closeModal}
            />
            <TextButton
              text={this.props.actionButtonText || this.props.t('Create')}
              type="primary"
              onClick={this.onClickActionButton}
            />
          </div>
        </div>
      </Modal>
    );
  }
}

export default ChooseNameModal;
export const ChooseNameModalTranslated = withNamespaces()(ChooseNameModal);
