// @flow
import { useDispatch } from 'react-redux';
import { AppStatus } from '@kitman/components';
import ProfileHeaderLayout from '@kitman/modules/src/LeagueOperations/shared/layouts/ProfileHeaderLayout';
import EditableTitle from '@kitman/modules/src/ConditionalFields/shared/components/EditableTitle';
import { css } from '@emotion/react';
import { colors } from '@kitman/common/src/variables';
import {
  useFetchRulesetQuery,
  useUpdateOwnerRulesetMutation,
} from '../../services/conditionalFields';
import {
  onSetRequestStatus,
  onResetFormState,
} from '../../redux/slices/conditionBuildViewSlice';
import { BackButtonTranslated as BackButton } from '../BackButton';

import { getRulesetTitle } from '../../utils';

type Props = {
  title: ?string, // it's possible to create a ruleset without a title
  rulesetId: ?string,
};

const style = {
  title: css`
    color: ${colors.grey_300};
    font-size: 24px;
    font-weight: 600;
    margin: 0;
  `,
};

const RulesetAppHeader = ({ title, rulesetId }: Props) => {
  const { data: ruleset } = useFetchRulesetQuery(rulesetId, {
    skip: !rulesetId,
  });

  const dispatch = useDispatch();
  const [updateOwnerRuleset, { isLoading: isTitleSaving }] =
    useUpdateOwnerRulesetMutation();

  const handleOnSubmit = (titleToUpdate: String) => {
    dispatch(onSetRequestStatus({ requestStatus: 'PENDING' }));
    updateOwnerRuleset({ rulesetId, name: titleToUpdate })
      .then(() => {
        dispatch(onResetFormState());
        dispatch(onSetRequestStatus({ requestStatus: 'SUCCESS' }));
      })
      .catch(() => {
        dispatch(onSetRequestStatus({ requestStatus: 'ERROR' }));
        return <AppStatus status="error" isEmbed />;
      });
  };

  return (
    <ProfileHeaderLayout>
      <ProfileHeaderLayout.Actions>
        <BackButton />
      </ProfileHeaderLayout.Actions>
      <ProfileHeaderLayout.Main>
        <ProfileHeaderLayout.Content>
          <h2 css={style.title}>
            <EditableTitle
              initialValue={getRulesetTitle({
                rtkTitle: ruleset?.name,
                propTitle: title,
              })}
              isTitleSaving={isTitleSaving}
              onSubmit={handleOnSubmit}
              title={title}
            />
          </h2>
        </ProfileHeaderLayout.Content>
      </ProfileHeaderLayout.Main>
    </ProfileHeaderLayout>
  );
};

export default RulesetAppHeader;
