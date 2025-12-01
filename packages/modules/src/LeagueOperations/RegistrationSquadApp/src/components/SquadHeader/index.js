// @flow
import { withNamespaces } from 'react-i18next';
import type { ComponentType } from 'react';

import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { Squad } from '@kitman/modules/src/LeagueOperations/shared/types/common';
import HeaderLayout from '@kitman/modules/src/LeagueOperations/shared/layouts/HeaderLayout';
import useLocationSearch from '@kitman/common/src/hooks/useLocationSearch';
import BackLink from '@kitman/modules/src/LeagueOperations/shared/layouts/HeaderLayout/components/BackLink';
import HeaderAvatar from '@kitman/modules/src/LeagueOperations/shared/layouts/HeaderLayout/components/HeaderAvatar';
import getSquadStatics from '../../utils';

type Props = {
  squad: Squad,
};

type SquadHeaderProps = I18nProps<Props>;

const SquadHeader = (props: SquadHeaderProps) => {
  const urlParams = useLocationSearch();

  const hasUrlParams: boolean =
    (urlParams && Array.from(urlParams.entries())?.length > 0) || false;

  return (
    <HeaderLayout withTabs>
      {hasUrlParams && (
        <HeaderLayout.BackBar>
          <BackLink />
        </HeaderLayout.BackBar>
      )}
      <HeaderLayout.Content>
        <HeaderLayout.Avatar>
          <HeaderAvatar
            alt={props.squad.organisations[0].name}
            src={props.squad.organisations[0]?.logo_full_path}
            variant="large"
          />
        </HeaderLayout.Avatar>
        <HeaderLayout.MainContent>
          <HeaderLayout.TitleBar>
            <HeaderLayout.Title>{props.squad.name}</HeaderLayout.Title>
          </HeaderLayout.TitleBar>
          <HeaderLayout.Items>
            {getSquadStatics({ squad: props.squad })}
          </HeaderLayout.Items>
        </HeaderLayout.MainContent>
      </HeaderLayout.Content>
    </HeaderLayout>
  );
};

export const SquadHeaderTranslated: ComponentType<Props> =
  withNamespaces()(SquadHeader);
export default SquadHeader;
