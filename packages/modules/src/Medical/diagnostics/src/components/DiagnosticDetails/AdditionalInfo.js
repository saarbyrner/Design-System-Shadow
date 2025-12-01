// @flow
import type { ComponentType } from 'react';
import { withNamespaces } from 'react-i18next';
import * as DateFormatter from '@kitman/common/src/utils/dateFormatter';
import moment from 'moment';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { useDiagnostic } from '@kitman/modules/src/Medical/shared/contexts/DiagnosticContext';
import { useDiagnosticResults } from '@kitman/modules/src/Medical/shared/contexts/DiagnosticResultsContext';
import style from './styles';

type Props = {};

const AdditionalInfo = (props: I18nProps<Props>) => {
  const { diagnostic } = useDiagnostic();
  const { resultBlocks } = useDiagnosticResults();

  const accessionId =
    resultBlocks?.results?.length > 0
      ? resultBlocks?.results[0]?.results[0]?.application_order_id
      : null;
  const refId =
    resultBlocks?.results?.length > 0
      ? resultBlocks?.results[0]?.results[0]?.reference_id
      : null;
  const clubName = diagnostic.team_name ? diagnostic.team_name : null;
  const resultsDate =
    resultBlocks?.results?.length > 0
      ? resultBlocks?.results[0]?.results[0]?.created_at
      : null;

  const isRedoxOrg =
    // eslint-disable-next-line dot-notation
    window.featureFlags['redox'] && window.featureFlags['redox-iteration-1'];

  return (
    <>
      {!isRedoxOrg && (
        <h2 className="kitmanHeading--L3">{props.t('Additional Info')}</h2>
      )}
      {!isRedoxOrg && (
        <ul css={style.detailsAdditionalInfo}>
          <li>
            <span css={style.detailLabel}>{props.t('Practitioner: ')}</span>
            {props.t('{{prescriber}}', {
              prescriber: diagnostic?.prescriber?.fullname || '--',
              interpolation: { escapeValue: false },
            })}
          </li>
          <li>
            <span css={style.detailLabel}>{props.t('Location: ')}</span>
            {props.t('{{location}}', {
              location: diagnostic?.location?.name || '--',
              interpolation: { escapeValue: false },
            })}
          </li>
          <li>
            <span css={style.detailLabel}>
              {props.t('Date of diagnostic: ')}
            </span>
            <span>
              {props.t('{{date}}', {
                date: DateFormatter.formatStandard({
                  date: moment(diagnostic?.diagnostic_date) || '--',
                }),
              })}{' '}
            </span>
          </li>
        </ul>
      )}
      {isRedoxOrg && (
        <>
          <ul
            css={style.redoxDetailsAdditionalInfo}
            data-testid="RedoxDetailsAdditionalInfo"
          >
            <li>
              <span css={style.detailLabel}>{props.t('Name: ')}</span>
              <span css={style.detailValue}>
                {props.t('{{name}}', {
                  name: diagnostic?.athlete.fullname || '--',
                  interpolation: { escapeValue: false },
                })}
              </span>
            </li>
            <li>
              <span css={style.detailLabel}>{props.t('D.O.B.: ')}</span>
              <span css={style.detailValue}>
                {props.t('{{DOB}}', {
                  DOB: diagnostic?.athlete?.date_of_birth || '--',
                  interpolation: { escapeValue: false },
                })}{' '}
              </span>
            </li>
            <li>
              <span css={style.detailLabel}>{props.t('NFL ID: ')}</span>
              <span css={style.detailValue}>
                {props.t('{{nflId}}', {
                  nflId: diagnostic?.athlete.nfl_id || '--',
                  interpolation: { escapeValue: false },
                })}
              </span>
            </li>
          </ul>
          <ul css={style.redoxDetailsAdditionalInfo}>
            <li>
              <span css={style.detailLabel}>{props.t('Gender: ')}</span>
              {props.t('{{gender}}', {
                gender: diagnostic?.athlete?.gender || '--',
                interpolation: { escapeValue: false },
              })}
            </li>
            <li>
              <span css={style.detailLabel}>{props.t('Type - name: ')}</span>
              {props.t('{{diagnosticType}}', {
                diagnosticType: diagnostic?.type || '--',
                interpolation: { escapeValue: false },
              })}
            </li>
            <li>
              <span css={style.detailLabel}>{props.t('CPT: ')}</span>
              {props.t('{{cptCode}}', {
                cptCode: diagnostic?.cpt_code || '--',
                interpolation: { escapeValue: false },
              })}
            </li>
            <li>
              <span css={style.detailLabel}>{props.t('Provider: ')}</span>
              <span>
                {props.t('{{provider}} {{npiNumber}}', {
                  provider: `${diagnostic?.provider?.fullname}`,
                  npiNumber: diagnostic?.provider?.npi
                    ? `(NPI#: ${diagnostic.provider.npi})`
                    : null,
                  interpolation: { escapeValue: false },
                })}
              </span>
            </li>
          </ul>
          <ul css={style.redoxDetailsAdditionalInfo}>
            <li>
              <span css={style.detailLabel}>{props.t('Reason: ')}</span>
              {props.t('{{reason}}', {
                reason: diagnostic?.diagnostic_reason?.name || '--',
                interpolation: { escapeValue: false },
              })}
            </li>
            <li>
              <span css={style.detailLabel}>{props.t('Body area: ')}</span>
              {props.t('{{bodyArea}}', {
                bodyArea: diagnostic?.body_area?.name || '--',
                interpolation: { escapeValue: false },
              })}
            </li>
            <li>
              <span css={style.detailLabel}>{props.t('Laterality: ')}</span>
              <span>
                {props.t('{{laterality}}', {
                  laterality: diagnostic?.laterality?.name || '--',
                  interpolation: { escapeValue: false },
                })}
              </span>
            </li>
          </ul>
          <ul css={style.redoxDetailsAdditionalInfo}>
            <li>
              <span css={style.detailLabel}>{props.t('Company: ')}</span>
              {props.t('{{company}} {{companyAccountNumber}}', {
                company: diagnostic?.location?.name || '--',
                companyAccountNumber: diagnostic?.location?.account
                  ? `(Account#: ${diagnostic.location.account})`
                  : null,
                interpolation: { escapeValue: false },
              })}
            </li>
            <li>
              <span css={style.detailLabel}>{props.t('Club: ')}</span>
              {props.t('{{clubName}}', {
                clubName: clubName || '--',
                interpolation: { escapeValue: false },
              })}
            </li>
            <li>
              <span css={style.detailLabel}>
                {props.t('Completion date: ')}
              </span>
              <span>
                {props.t('{{date}}', {
                  date: DateFormatter.formatStandard({
                    date: moment(diagnostic?.redox_completed_at) || '--',
                    showTime: true,
                  }),
                })}{' '}
              </span>
            </li>
          </ul>
          <ul css={style.redoxDetailsAdditionalInfo}>
            <li>
              <span css={style.detailLabel}>{props.t('Order date:  ')}</span>
              <span>
                {props.t('{{date}}', {
                  date: DateFormatter.formatStandard({
                    date: moment(diagnostic?.order_date) || '--',
                  }),
                })}{' '}
              </span>
            </li>
            <li>
              <span css={style.detailLabel}>{props.t('Appt. date:  ')}</span>
              <span>
                {props.t('{{date}}', {
                  date: DateFormatter.formatStandard({
                    date: moment(diagnostic?.diagnostic_date) || '--',
                    showTime: true,
                  }),
                })}{' '}
              </span>
            </li>

            <li>
              <span css={style.detailLabel}>{props.t('Results date:  ')}</span>
              <span>
                {props.t('{{date}}', {
                  date: DateFormatter.formatStandard({
                    date: moment(resultsDate) || '--',
                    showTime: true,
                  }),
                })}{' '}
              </span>
            </li>
          </ul>
          <ul css={style.redoxDetailsAdditionalInfo}>
            <li>
              <span css={style.detailLabel}>{props.t('Accession ID: ')}</span>
              {props.t('{{accessionId}}', {
                accessionId: accessionId || '--',
                interpolation: { escapeValue: false },
              })}
            </li>
            <li>
              <span css={style.detailLabel}>{props.t('REF ID: ')}</span>
              {props.t('{{refId}}', {
                refId: refId || '--',
                interpolation: { escapeValue: false },
              })}
            </li>
            <li>
              <span css={style.detailLabel}>{props.t('Status: ')}</span>
              <span>
                {props.t('{{resultStatus}}', {
                  resultStatus: diagnostic?.results_status?.text || '--',
                  interpolation: { escapeValue: false },
                })}
              </span>
            </li>
          </ul>
        </>
      )}
      <div
        css={[style.metadataSection, style.authorDetails]}
        data-testid="AdditionalInfo|AuthorDetails"
      >
        {props.t('Created {{date}} by {{author}}', {
          date: DateFormatter.formatStandard({
            date: moment(diagnostic?.created_date) || '--',
          }),
          author: diagnostic?.created_by?.fullname || '--',
          interpolation: { escapeValue: false },
        })}
      </div>
    </>
  );
};

export const AdditionalInfoTranslated: ComponentType<Props> =
  withNamespaces()(AdditionalInfo);
export default AdditionalInfo;
