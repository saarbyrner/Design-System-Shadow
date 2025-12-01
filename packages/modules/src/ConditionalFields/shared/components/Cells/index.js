// @flow
import { TextLink, UserAvatar } from '@kitman/components';
import { Checkbox } from '@kitman/playbook/components';
import {
  cellStyle,
  headerStyle,
} from '@kitman/modules/src/ConditionalFields/shared/components/CommonGridStyle';

type TextCellProps = {
  text: string | number,
  isProminent?: boolean,
  wrapText?: boolean,
  onClick?: Function,
};

export const TextCell = (props: TextCellProps) => {
  return (
    <div
      css={[
        cellStyle.textCell,
        props.isProminent && cellStyle.prominent,
        props.wrapText && cellStyle.wrapText,
        props.onClick && cellStyle.hasClick,
      ]}
      onClick={props.onClick}
    >
      <span>{props.text}</span>
    </div>
  );
};

type HeaderProps = {
  title: ?string | ?number,
  centered?: boolean,
};

export const DefaultHeaderCell = (props: HeaderProps) => {
  return (
    <div
      css={
        props.centered ? headerStyle.headerCellCentered : headerStyle.headerCell
      }
    >
      <span>{props.title}</span>
    </div>
  );
};

type CheckboxHeaderProps = {
  title: ?string | ?number,
  editMode: boolean,
  checked: boolean,
  indeterminate: boolean,
  width?: number,
  onChange: Function,
};

export const CheckboxHeaderCell = (props: CheckboxHeaderProps) => {
  return (
    <div
      css={{
        width: props.width || 85,
        display: 'flex',
        justifyContent: 'space-between',
        position: 'relative',
      }}
    >
      <DefaultHeaderCell title={props.title} />
      <Checkbox
        checked={props.checked}
        indeterminate={props.indeterminate}
        disabled={!props.editMode}
        onChange={props.onChange}
        color="primary"
        size="small"
        sx={{
          padding: 0,
          right: 0,
          bottom: -2,
          position: 'absolute',
        }}
      />
    </div>
  );
};

type StatusCellProps = {
  status: 'draft' | 'active' | 'inactive',
  statusText: string,
};

export const StatusCell = (props: StatusCellProps) => {
  return (
    <div
      css={[
        cellStyle.statusCell,
        props.status === 'draft' && cellStyle.draftStatus,
        props.status === 'active' && cellStyle.activeStatus,
        props.status === 'inactive' && cellStyle.inactiveStatus,
      ]}
    >
      <div
        css={[
          cellStyle.statusIndicator,
          props.status === 'draft' && cellStyle.draftStatusIndicator,
          props.status === 'active' && cellStyle.activeStatusIndicator,
          props.status === 'inactive' && cellStyle.inactiveStatusIndicator,
        ]}
      />
      <div>{props.statusText}</div>
    </div>
  );
};

type AvatarProps = {
  avatar_url: ?string,
  text?: string,
  href?: string,
  position?: string,
};

export const AvatarCell = (props: AvatarProps) => {
  return (
    <div css={cellStyle.avatarCell}>
      <div css={cellStyle.imageContainer}>
        <UserAvatar
          url={props?.avatar_url || null}
          firstname={props.text}
          displayInitialsAsFallback
          size="SMALL"
        />
      </div>
      <div>
        {props.href ? (
          <TextLink
            text={props?.text || ''}
            href={props.href}
            kitmanDesignSystem
          />
        ) : (
          <div css={cellStyle.textCell}>
            <span>{props.text}</span>
          </div>
        )}
        {props.position && (
          <span css={cellStyle.positionCell}>{props.position}</span>
        )}
      </div>
    </div>
  );
};
