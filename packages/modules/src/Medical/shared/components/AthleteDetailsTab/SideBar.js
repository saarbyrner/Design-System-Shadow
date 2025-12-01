// @flow
import { css } from '@emotion/react';
import { withNamespaces } from 'react-i18next';
import { colors } from '@kitman/common/src/variables';
import type { AthleteData } from '@kitman/services/src/services/getAthleteData';
import type { I18nProps } from '@kitman/common/src/types/i18n';

type Props = {
  athleteData: AthleteData,
};

const style = {
  headertext: css`
    font-family: Open Sans;
    font-size: 18px;
    font-weight: 600;
    line-height: 22px;
    letter-spacing: 0px;
    text-align: left;
  `,
  section: css`
    background-color: ${colors.white};
    border: 1px solid ${colors.neutral_300};
    border-radius: 3px;
    padding: 24px;
  `,
  availabilitySection: css`
    padding-bottom: 16px;
    margin-bottom: 16px;
    border-bottom: 1px solid ${colors.neutral_300};

    &:last-child {
      padding-bottom: 0;
      margin-bottom: 0;
      border-bottom: 0;
    }
  `,
  statusList: css`
    color: ${colors.grey_200};
    padding: 0;
    margin-bottom: 0;
    list-style: none;

    > li {
      &:last-child {
        border-bottom: 0;
        padding-bottom: 0;
      }
    }
  `,
  label: css`
    font-family: Open Sans;
    font-size: 14px;
    font-weight: 600;
    line-height: 16px;
    letter-spacing: 0px;
    text-align: left;
  `,
};

const SideBar = (props: I18nProps<Props>) => (
  <section css={style.section}>
    {props.athleteData.insurance_policies.map((policy, idx) => (
      <section key={policy.id} css={style.availabilitySection}>
        <h3 css={style.headertext} className="kitmanHeading--L3">
          {props.t('Insurance{{number}}', {
            number: idx > 0 ? ` ${idx + 1}` : '',
          })}
        </h3>

        <ul css={style.statusList}>
          <li key={`Insurance_Carrier_${policy?.provider && policy?.provider}`}>
            <span css={style.label}>{props.t('Insurance Carrier:')} </span>
            {policy?.provider ? ` ${policy?.provider}` : ' - '}
          </li>
          <li
            key={`Group_Number_${policy?.group_number && policy?.group_number}`}
          >
            <span css={style.label}>{props.t('Group Number:')} </span>
            {policy?.group_number ? ` ${policy?.group_number}` : ' - '}
          </li>
          <li
            key={`Policy_Number_${
              policy?.policy_number && policy?.policy_number
            }`}
          >
            <span css={style.label}>{props.t('Policy Number:')}</span>
            {policy?.policy_number ? ` ${policy?.policy_number}` : ' - '}
          </li>
          <li key={`Insurance_ID_${policy?.id && policy?.id}`}>
            <span css={style.label}>{props.t('Insurance ID:')}</span>
            {policy?.id ? ` ${policy?.id}` : ' - '}
          </li>
        </ul>
      </section>
    ))}
  </section>
);

export const SideBarTranslated = withNamespaces()(SideBar);
export default SideBar;
