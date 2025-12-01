// @flow
import { useState, useEffect } from 'react';

import { Modal, TextButton, ColorPicker, Checkbox } from '@kitman/components';
import style from '@kitman/modules/src/DynamicCohorts/shared/styles';
import { colors } from '@kitman/common/src/variables';
import type { SetState } from '@kitman/common/src/types/react';
import i18n from '@kitman/common/src/utils/i18n';
import {
  TabContext,
  TabList,
  Tab,
  TabPanel,
} from '@kitman/playbook/components';

import { Indexes } from '../types';

type InitialProps = {
  colorPickerModalEventIndex: number,
  color: string,
};

type Props = {
  ...InitialProps,
  brandingColors: Array<string>,
  setColorPickerModalEventIndex: SetState<number>,
  onChangeColor: (color: string) => void,
  onSave: () => void,
};

const TabIndexes = {
  Branding: '0',
  Custom: '1',
};
type TabIndex = $Values<typeof TabIndexes>;

export default ({
  colorPickerModalEventIndex,
  setColorPickerModalEventIndex,
  color,
  brandingColors,
  onChangeColor,
  onSave,
}: Props) => {
  const [initialProps, setInitialProps] = useState<InitialProps>({
    colorPickerModalEventIndex,
    color,
  });

  useEffect(() => {
    if (
      [Indexes.NoEvent, Indexes.AllEvents].some(
        (index) => index === colorPickerModalEventIndex
      )
    ) {
      return;
    }
    setInitialProps({
      colorPickerModalEventIndex,
      color,
    });
  }, [colorPickerModalEventIndex]);

  const [currentTab, setCurrentTab] = useState<TabIndex>(TabIndexes.Branding);

  const onClose = () => {
    setColorPickerModalEventIndex(Indexes.NoEvent);
    setCurrentTab(TabIndexes.Branding);
    setInitialProps({
      colorPickerModalEventIndex: Indexes.NoEvent,
      color: '',
    });
  };

  const isBulkSave = colorPickerModalEventIndex === Indexes.AllEvents;

  return (
    <Modal
      isOpen={colorPickerModalEventIndex > Indexes.NoEvent}
      onPressEscape={onClose}
      onClose={onClose}
      // $FlowIgnore[incompatible-type] style.modal’s type is fine.
      additionalStyle={style.modal}
    >
      <Modal.Header>
        <Modal.Title>{i18n.t('Select color')}</Modal.Title>
      </Modal.Header>
      <Modal.Content>
        <TabContext value={currentTab}>
          <div css={style.modalTabList}>
            <TabList onChange={(_, value) => setCurrentTab(value)}>
              <Tab label={i18n.t('Branding')} value={TabIndexes.Branding} />
              <Tab label={i18n.t('Custom')} value={TabIndexes.Custom} />
            </TabList>
          </div>
          <TabPanel value={TabIndexes.Branding}>
            <div css={{ display: 'flex', gap: '.5rem', flexWrap: 'wrap' }}>
              {brandingColors.map((brandingColor) => (
                <div
                  style={
                    color === brandingColor
                      ? {
                          boxShadow: `0 0 0 2px ${colors.blue_100}`,
                          borderRadius: '6px',
                        }
                      : {}
                  }
                  key={brandingColor}
                >
                  <ColorPicker
                    initialColor={brandingColor}
                    isExampleTextVisible
                    onClick={() => onChangeColor(brandingColor)}
                  />
                </div>
              ))}
            </div>
          </TabPanel>
          <TabPanel value={TabIndexes.Custom}>
            <div css={style.modalCenteredContent}>
              <ColorPicker
                initialColor={initialProps.color}
                onChange={onChangeColor}
                kitmanDesignSystem
                showPickerOnly
              />
            </div>
          </TabPanel>
        </TabContext>
      </Modal.Content>
      <Modal.Footer>
        <div>
          <Checkbox.New
            id="bulkSave"
            checked={isBulkSave}
            onClick={() => {
              setColorPickerModalEventIndex(
                isBulkSave
                  ? initialProps.colorPickerModalEventIndex
                  : Indexes.AllEvents
              );
            }}
          />
          {i18n.t('Apply to all in group')}
        </div>
        <div>
          <TextButton
            text={i18n.t('Cancel')}
            type="subtle"
            onClick={onClose}
            kitmanDesignSystem
          />
          <TextButton
            text={i18n.t('Select')}
            type="primary"
            onClick={() => {
              onSave();
              onClose();
            }}
            kitmanDesignSystem
          />
        </div>
      </Modal.Footer>
    </Modal>
  );
};
