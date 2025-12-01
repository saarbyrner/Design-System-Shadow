// @flow
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { Event, SportType } from '@kitman/common/src/types/Event';
import * as DateFormatter from '@kitman/common/src/utils/dateFormatter';
import { withNamespaces } from 'react-i18next';
import moment from 'moment-timezone';
import {
  LegacyModal as Modal,
  RadioList,
  Select,
  TextButton,
  ToggleSwitch,
} from '@kitman/components';
import { useState } from 'react';
import $ from 'jquery';
import { getEventName } from '@kitman/common/src/utils/workload';
import type { ParticipationLevel } from '@kitman/modules/src/OrganisationSettings/src/types';
import { TemplateTranslated as Template } from './Template/index';

type Props = {
  isOpen: boolean,
  closeModal: Function,
  event: Event,
  orgTimezone: string,
  orgLogoPath: string,
  orgName: string,
  orgSport: SportType,
  squadName: string,
  gameParticipationLevels: Array<ParticipationLevel>,
  areCoachingPrinciplesEnabled: boolean,
};

const templateItems = (props: I18nProps<Props>) => {
  return [
    {
      label: props.t('Default'),
      value: 'default',
    },
    {
      label: props.t('Stacked'),
      value: 'stacked',
    },
  ];
};

const pageFittingItems = (props: I18nProps<Props>) => {
  return [
    {
      name: props.t('Standard'),
      value: 'a4',
    },
    {
      name: props.t('Fit to page'),
      value: '1page',
    },
  ];
};

const DownloadOptionsModal = (props: I18nProps<Props>) => {
  const [downloadPresets, setDownloadPresets] = useState({
    template: 'default',
    pageFitting: 'a4',
    showParticipants: true,
    showNotes: true,
  });
  const [disableSaveButton, setDisableSaveButton] = useState(true);

  const formatDate = (date: moment): string => {
    if (window.featureFlags['standard-date-formatting']) {
      return DateFormatter.formatStandard({ date, displayLongDate: true });
    }

    return date.format('Do MMM YY');
  };

  const saveButtonClick = () => {
    setDisableSaveButton(true);

    const element = document.querySelector('.template');

    let pagesize = '';

    switch (downloadPresets.pageFitting) {
      case 'a4':
        pagesize = 'a4';
        break;
      case '1page':
        pagesize = [210, $(element).height() * 0.27];
        break;
      default:
        break;
    }

    const formatteddate = formatDate(
      moment.tz(props.event.start_date, props.orgTimezone)
    ).replace(/[^a-zA-Z0-9]/g, '');

    const opts = {
      margin: 0,
      filename: `${getEventName(props.event).replace(
        /[^a-zA-Z0-9]/g,
        '-'
      )}_${formatteddate}.pdf`,
      image: { type: 'jpeg', quality: 1 },
      html2canvas: {
        dpi: 192,
        scale: 4,
        letterRendering: true,
        useCORS: true,
        allowTaint: true,
      },
      jsPDF: {
        format: pagesize,
        orientation: 'portrait',
      },
    };

    // $FlowIgnore
    html2pdf()
      .set(opts)
      .from(element)
      .save()
      .then(() => {
        setDisableSaveButton(false);
      })
      .catch((e) => console.log(e));
  };

  const resetModal = () => {
    setDisableSaveButton(true);
    setDownloadPresets({
      pageFitting: 'a4',
      template: 'default',
      showParticipants: true,
      showNotes: true,
    });
    props.closeModal();
  };

  return (
    <div>
      <Modal
        isOpen={props.isOpen}
        close={() => resetModal()}
        width={1000}
        style={{ padding: 0 }}
      >
        <div className="downloadOptions">
          <div className="downloadOptions__leftCol">
            <div className="downloadOptions__leftCol__previewPanel">
              <div className="downloadOptions__leftCol__zoomer">
                <Template
                  event={props.event}
                  orgTimezone={props.orgTimezone}
                  orgLogoPath={props.orgLogoPath}
                  orgName={props.orgName}
                  orgSport={props.orgSport}
                  squadName={props.squadName}
                  template={downloadPresets.template}
                  showParticipants={downloadPresets.showParticipants}
                  showNotes={downloadPresets.showNotes}
                  disableSaveButton={() => setDisableSaveButton(false)}
                  gameParticipationLevels={props.gameParticipationLevels}
                  areCoachingPrinciplesEnabled={
                    props.areCoachingPrinciplesEnabled
                  }
                />
              </div>
            </div>
          </div>

          <div className="downloadOptions__rightCol">
            <div className="downloadOptions__title">{props.t('Download')}</div>
            <div className="downloadOptions__row">
              <Select
                onChange={(val) =>
                  setDownloadPresets({ ...downloadPresets, template: val })
                }
                onClear={() => {}}
                options={templateItems(props)}
                value={downloadPresets.template}
                label={props.t('Template layout')}
                name="template"
                kitmanDesignSystem
              />
            </div>

            <div>{props.t('Page fitting')}</div>
            <div>
              <RadioList
                options={pageFittingItems(props)}
                change={(val) =>
                  setDownloadPresets({
                    ...downloadPresets,
                    pageFitting: val,
                  })
                }
                radioName="pageFitting"
                value={downloadPresets.pageFitting}
                kitmanDesignSystem
              />
            </div>

            <div className="downloadOptions__label">
              {props.t('Show / Hide')}
            </div>
            <div className="downloadOptions__row">
              <ToggleSwitch
                isSwitchedOn={downloadPresets.showParticipants}
                toggle={() =>
                  setDownloadPresets({
                    ...downloadPresets,
                    showParticipants: !downloadPresets.showParticipants,
                  })
                }
                label={props.t('Participants')}
                labelPlacement="right"
                kitmanDesignSystem
              />
            </div>
            <div className="downloadOptions__row">
              <ToggleSwitch
                isSwitchedOn={downloadPresets.showNotes}
                toggle={() =>
                  setDownloadPresets({
                    ...downloadPresets,
                    showNotes: !downloadPresets.showNotes,
                  })
                }
                label={props.t('Notes')}
                labelPlacement="right"
                kitmanDesignSystem
              />
            </div>

            <div className="downloadOptions__buttons">
              <TextButton
                type="secondary"
                text={props.t('Cancel')}
                kitmanDesignSystem
                onClick={() => resetModal()}
              />
              <TextButton
                isSubmit
                type="primary"
                text={props.t('Download')}
                kitmanDesignSystem
                onClick={() => saveButtonClick()}
                isDisabled={disableSaveButton}
              />
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export const DownloadOptionsModalTranslated =
  withNamespaces()(DownloadOptionsModal);
export default DownloadOptionsModal;
