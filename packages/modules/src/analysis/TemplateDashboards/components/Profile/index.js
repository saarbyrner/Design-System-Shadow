/* eslint-disable camelcase */
// @flow

import { withNamespaces } from 'react-i18next';
import { css } from '@emotion/react';

import { ErrorBoundary, InfoTooltip, UserAvatar } from '@kitman/components';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { colors } from '@kitman/common/src/variables';
import Card from '../Widget/Card';
import useFilterValues from '../../hooks/useFilterValues';
import { useGetAthleteDataQuery } from '../../redux/services/templateDashboards';

const styles = {
  noContent: css`
    margin: auto;
    justify-content: center;
  `,
  cardContentCustom: css`
    font-family: Open Sans;
    display: flex;
    flex-direction: column;
    h4 {
      font-size: 16px;
    }
  `,
  imageContainer: css`
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 26px;
    flex-shrink: 0;
    img {
      height: 133px;
      margin: -10px auto 0;
      width: 133px;
    }
  `,
  subTitle: css`
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: 20px;
    color: ${colors.grey_100};

    p {
      font-size: 14px;
      color: ${colors.grey_200};
    }
  `,
  squadNames: css`
    p {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 300px;
    }
  `,
  heightAndWeightContainer: css`
    display: flex;
    gap: 15px;

    div {
      flex-shrink: 0;
    }
  `,
};

const getSquadNames = (squadNames: { id: number, name: string }[]) => {
  return squadNames.map((squad) => squad.name).join(', ') || '-';
};

function Profile(props: I18nProps<{}>) {
  const { population } = useFilterValues(['population']);
  const athleteId = population.athletes[0];
  const { data, error, isFetching } = useGetAthleteDataQuery(athleteId);

  const renderContent = () => {
    if (!data) {
      return <div css={styles.noContent}>{props.t('No Data Available')}</div>;
    }
    const {
      avatar_url,
      squad_names,
      date_of_birth,
      height,
      age,
      firstname,
      lastname,
    } = data;
    const squadNames = getSquadNames(squad_names);
    const avatarUrl = avatar_url === null ? '/img/avatar.jpg' : avatar_url;
    return (
      <>
        <div css={styles.imageContainer}>
          <UserAvatar
            url={avatarUrl}
            firstname={firstname}
            lastname={lastname}
            size="SMALL"
            displayInitialsAsFallback
          />
        </div>
        <div css={styles.squadNames}>
          <span css={styles.subTitle}>{props.t('Squad')}</span>
          <InfoTooltip placement="bottom-start" content={squadNames}>
            <p>{squadNames}</p>
          </InfoTooltip>
        </div>
        <div css={styles.heightAndWeightContainer}>
          <div>
            <span css={styles.subTitle}>{props.t('Height')}</span>
            <p>{height ? `${height}` : '-'}</p>
          </div>
        </div>
        <div>
          <span css={styles.subTitle}>{props.t('DoB')}</span>
          <p>
            {date_of_birth || '-'} {age ? `(${age})` : ''}
          </p>
        </div>
      </>
    );
  };

  return (
    <Card>
      <Card.Header>
        <Card.Title>
          <h4>{data?.fullname}</h4>
        </Card.Title>
      </Card.Header>
      <Card.Content styles={styles.cardContentCustom}>
        <ErrorBoundary kitmanDesignSystem>
          {!error && renderContent()}
          <Card.Loading isLoading={isFetching} />
        </ErrorBoundary>
      </Card.Content>
    </Card>
  );
}

export const ProfileTranslated = withNamespaces()(Profile);
export default Profile;
