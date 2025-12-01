// @flow
import { InputTextField, IconButton, Checkbox } from '@kitman/components';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import style from '../style';
import type { RehabGroupHeading } from '../../../types';

export type Props = {
  data: RehabGroupHeading,
  onGroupSelected: Function,
  onSelectedGroupArchive: Function,
  isSelected: number, // ID of the selected checkbox
};

const RehabGroup = (props: I18nProps<Props>) => {
  const selectedCheckbox = props.isSelected;
  return (
    <div
      css={style.rehabGroupItemContainer}
      key={`RehabGroup_${props.data.id}`}
    >
      <Checkbox
        toggle={() => {
          props.onGroupSelected(props.data.id);
        }}
        id={`RehabGroupCheckbox_${props.data.id}`}
        isChecked={selectedCheckbox === props.data.id}
        isDisabled={false}
        name=""
        radioStyle={false}
        kitmanDesignSystem
      />
      <InputTextField
        label={props.t('Name')}
        value={props.data.name}
        kitmanDesignSystem
        disabled
      />
      <span
        data-testid="Rehab|ColorSwatch"
        css={[
          style.rehabGroupColorSwatch,
          { backgroundColor: props.data.theme_colour },
        ]}
      />
      <IconButton
        icon="icon-bin"
        isTransparent
        onClick={() => {
          props.onSelectedGroupArchive(props.data.id);
        }}
        isDisabled={false}
      />
    </div>
  );
};
export default RehabGroup;
