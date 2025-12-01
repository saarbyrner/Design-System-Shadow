// @flow
import React from 'react';
import { css } from '@emotion/react';
import { withNamespaces } from 'react-i18next';
import { colors } from '@kitman/common/src/variables';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { EmergencyContact } from '../../../../../../services/src/services/getAthleteData';

type Item = { label: string, value: string };
type Items = Array<Item>;

type Squad = {
  id: number,
  name: string,
};
type Country = {
  abbreviation: string,
  id: number,
  name: string,
};

export type Address = {
  line1: ?string,
  line2: ?string,
  line3: ?string,
  city: ?string,
  zipcode: ?string,
  state: ?string,
  country: ?Country,
};
type Props = {
  title: string,
  subTitle: string,
  items: Items,
  addressList?: Array<Address>,
  emergencyContacts: Array<EmergencyContact>,
  squads: Array<Squad>,
};

const AthleteSection = (props: I18nProps<Props>) => {
  const style = {
    title: css`
      font-family: Open Sans;
      font-size: 20px;
      font-weight: 600;
      line-height: 24px;
      letter-spacing: 0px;
      text-align: left;
    `,
    titleText: css`
      font-family: Open Sans;
      font-size: 20px;
      font-weight: 600;
      line-height: 24px;
      letter-spacing: 0px;
      text-align: left;
      margin: 0;
      padding-top: 24px;
    `,
    subTitleText: css`
      font-family: Open Sans;
      font-size: 18px;
      font-weight: 600;
      line-height: 22px;
      letter-spacing: 0px;
      text-align: left;
    `,
    details: css`
      color: ${colors.grey_200};
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 20px;
      list-style: none;
      line-height: 16px;
      padding: 0;
      margin-bottom: 0;
      margin-top: 18px;
      li {
        line-height: 16px;
      }
    `,
    detailLabel: css`
      font-weight: 600;
      text-transform: capitalize;
    `,
    athleteSectionInner: css`
      border: ${props.title ? 'initial' : `2px solid ${colors.neutral_300}`};
      border-right: none;
      border-left: none;
    `,
    athleteSection: css`
      padding: 0px 24px 0px 24px;
      background-color: ${colors.white};
      h3 {
        padding-top: 24px;
      }
      div {
        padding-bottom: 18px;
      }
    `,
    contactRelation: css`
      text-transform: capitalize;
    `,
  };
  const titleIsPresent = props.title.length > 1;

  return (
    <section css={style.athleteSection}>
      <div css={style.athleteSectionInner}>
        {titleIsPresent && <h2 css={style.titleText}>{props.title}</h2>}
        <h3 css={style.subTitleText}>{props.subTitle}</h3>
        <ul css={style.details}>
          {props.items?.map((item) => (
            <li key={`${item?.label}-${item?.value}`}>
              <span css={style.detailLabel}>{`${item.label}: `}</span>
              {item.value ? item.value : ' - '}
            </li>
          ))}
          {/* Athlete Addresses */}
          {props.addressList?.map((address, i) => (
            <li
              key={`${address?.line1 ? address?.line1 : 'address-'}-${
                address?.country?.name ? address?.country.name : i
              }`}
            >
              <span css={style.detailLabel} className="detailLabel">
                {/* if there is more than one address they get numbered */}
                {`${props.t('Address')} ${
                  Array.isArray(props.addressList) &&
                  props.addressList.length > 0
                    ? i + 1
                    : ''
                }: `}
              </span>
              {`
                ${address.line1 ? `${address.line1}, ` : ''} 
                ${address.line2 ? `${address.line2}, ` : ''}
                ${address.line3 ? `${address.line3}, ` : ''}
                ${address.city ? `${address.city}, ` : ''}
                ${address.zipcode ? `${address.zipcode}, ` : ''}
                ${address.state ? `${address.state}, ` : ''}
                ${address.country?.name ? `${address.country?.name} ` : ''} 
              `}
            </li>
          ))}
          {/* Athletes Emergancy Contatcs */}
          {props.emergencyContacts?.map((contact) => (
            <React.Fragment key={`${contact.firstname}_${contact.lastname}`}>
              <li key={`${contact?.firstname}_emergencyContact`}>
                <span css={style.detailLabel} className="detailLabel">
                  {props.t('First name: ')}
                </span>
                {` ${contact.firstname}`}
              </li>
              <li key={`${contact?.lastname}_emergencyContact`}>
                <span css={style.detailLabel} className="detailLabel">
                  {props.t('Last name: ')}
                </span>
                {` ${contact.lastname}`}
              </li>
              <li
                key={`${contact?.contact_relation}_emergencyContact`}
                css={style.contactRelation}
              >
                <span css={style.detailLabel} className="detailLabel">
                  {props.t('Relation: ')}
                </span>
                {contact?.contact_relation ? contact.contact_relation : ' -'}
              </li>
              {contact.phone_numbers.map((number, idx) => (
                <li key={`${number.number}_emergencyContact`}>
                  <span css={style.detailLabel} className="detailLabel">
                    {props.t('Phone number {{number}}:', { number: idx + 1 })}
                  </span>
                  {` ${number.number_international_e164}`}
                </li>
              ))}
              <li key={`${contact?.email}_emergencyContact`}>
                <span css={style.detailLabel} className="detailLabel">
                  {props.t('Email: ')}
                </span>
                {contact?.email ? contact.email : ' -'}
              </li>
            </React.Fragment>
          ))}
          {props.squads?.map((squad) => (
            <React.Fragment key={`${squad.name}_${squad.id}`}>
              <li key={`${squad?.id}-${squad.id}`}>
                <span css={style.detailLabel} className="detailLabel">
                  {props.t('Squad: ')}
                </span>
                {` ${squad.name}`}
              </li>
            </React.Fragment>
          ))}
        </ul>
      </div>
    </section>
  );
};

export const AthleteSectionTranslated = withNamespaces()(AthleteSection);
export default AthleteSection;
