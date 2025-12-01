// @flow
import i18n from '@kitman/common/src/utils/i18n';
import {
  TextLink,
  UserAvatar,
  InfoTooltip,
  TextButton,
} from '@kitman/components';

import type { PlayerType } from '@kitman/modules/src/LeagueOperations/shared/types/common';

import type { ActiveStatus } from '@kitman/modules/src/LeagueOperations/technicalDebt/types';

import { cellStyle, statusStyle, invalidStyle } from '../CommonGridStyle';

type AvatarProps = {
  avatar_url: ?string,
  text?: string,
  href?: string,
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
      <div css={cellStyle.detailsContainer}>
        {props.href ? (
          <TextLink
            text={props?.text || ''}
            href={props.href}
            kitmanDesignSystem
          />
        ) : (
          <div css={[cellStyle.textCell]}>
            <span>{props.text}</span>
          </div>
        )}
      </div>
    </div>
  );
};

type LinkProps = {
  text?: string,
  href: string,
};

export const LinkCell = (props: LinkProps) => {
  return (
    <div css={cellStyle.linkCell}>
      <TextLink text={props?.text || ''} href={props.href} kitmanDesignSystem />
    </div>
  );
};

type TextCellProps = {
  text: string | number,
  isProminent?: boolean,
  onClick?: Function,
};

export const TextCell = (props: TextCellProps) => {
  return (
    <div
      css={[
        cellStyle.textCell,
        props.isProminent && cellStyle.prominent,
        props.onClick && cellStyle.hasClick,
      ]}
      onClick={props.onClick}
    >
      <span>{props.text}</span>
    </div>
  );
};

type IconCellProps = {
  icon: string,
  color?: string,
};

export const IconCell = (props: IconCellProps) => {
  return (
    <div css={[cellStyle.iconCell(props.color)]}>
      <i
        className={`icon-${props.icon}`}
        css={cellStyle.icon}
        data-testid="IconCell"
      />
    </div>
  );
};

type IconButtonCellProps = {
  icon: string,
  onClick: Function,
};

export const IconButtonCell = (props: IconButtonCellProps) => {
  return (
    <div css={[cellStyle.iconCell]}>
      <TextButton
        iconBefore={`icon-${props.icon}`}
        kitmanDesignSystem
        type="subtle"
        onClick={props.onClick}
      />
    </div>
  );
};

type ActiveProps = {
  value: ActiveStatus,
};

export const ActiveCell = (props: ActiveProps) => {
  return (
    <div css={statusStyle.statusCell}>
      <span css={[statusStyle.chip, statusStyle[props?.value || 'inactive']]}>
        {props.value}
      </span>
    </div>
  );
};

type PlayerTypeProps = {
  value: PlayerType,
};

export const PlayerTypeCell = (props: PlayerTypeProps) => {
  return (
    <div css={[cellStyle.textCell]}>
      <span>{props.value}</span>
    </div>
  );
};

type InvalidCellProps = {
  icon: string,
  color?: string,
  value?: string,
  message?: string,
  field?: string,
};

export const InvalidCell = (props: InvalidCellProps) => {
  return (
    <InfoTooltip
      errorStyle
      content={
        <div css={invalidStyle.tooltip}>
          <div css={invalidStyle.tooltipTitle}>
            {i18n.t('Invalid {{field}}', { field: props.field })}
          </div>
          <div>{props.message}</div>
        </div>
      }
    >
      <div css={invalidStyle.cell}>
        {props.value}
        <div css={[cellStyle.iconCell(props.color)]}>
          <i
            className={`icon-${props.icon}`}
            css={cellStyle.icon}
            data-testid="InvalidCell"
          />
        </div>
      </div>
    </InfoTooltip>
  );
};
