// @flow
import type { Node } from 'react';
import { useDispatch } from 'react-redux';

import i18n from '@kitman/common/src/utils/i18n';
import { TextButton } from '@kitman/components';

import {
  onOpenAddAthletesSidePanel,
  closeMassUploadModal,
} from '../../redux/massUploadSlice';
import type { UserTypes } from '../../types';
import { USER_TYPES_WITH_ONLY_MISSING_COLUMNS_WHEN_ERROR } from '../../utils/consts';
import style from './style';

type Props = {
  expectedFields: Array<string>,
  providedFields: Array<string>,
  userType?: UserTypes,
  mustCheckExpectedHeadersOnly?: boolean,
};

const ErrorState = (props: Props): Node => {
  const dispatch = useDispatch();

  const hasAdditionalColumns =
    props.expectedFields.filter((item) => !props.providedFields.includes(item))
      .length === 0;

  const headersPrefix = props.mustCheckExpectedHeadersOnly
    ? i18n.t('Required')
    : i18n.t('Expected');
  return (
    <div css={style.error.container}>
      <i className="icon-circle-cross" />
      <div css={style.error.title}>
        {i18n.t('You have an error in your provided CSV file')}
      </div>

      <div css={style.error.expectedHeaders}>
        {`${headersPrefix} ${i18n.t('columns')}`}:{' '}
        {props.expectedFields?.join(', ')}
      </div>
      {USER_TYPES_WITH_ONLY_MISSING_COLUMNS_WHEN_ERROR.includes(
        props.userType
      ) ? (
        <>
          <div css={style.error.providedHeaders}>
            {hasAdditionalColumns
              ? i18n.t('Please remove additional column(s)')
              : i18n.t('Missing column(s)')}
            :{' '}
            {hasAdditionalColumns
              ? props.providedFields
                  .filter((item) => !props.expectedFields.includes(item))
                  .join(', ')
              : props.expectedFields
                  .filter((item) => !props.providedFields.includes(item))
                  .join(', ')}
          </div>
          <div css={style.error.expectedHeaders}>
            {i18n.t('Download a CSV file template for')}{' '}
            <TextButton
              type="textOnly"
              text={
                props.userType === 'growth_and_maturation'
                  ? i18n.t('Growth and maturation assessments.')
                  : i18n.t('Khamis-Roche baselines.')
              }
              onClick={() => {
                dispatch(closeMassUploadModal());
                dispatch(onOpenAddAthletesSidePanel());
              }}
            />
          </div>
        </>
      ) : (
        <div css={style.error.providedHeaders}>
          {i18n.t('Provided columns')}: {props.providedFields.join(', ')}
        </div>
      )}
    </div>
  );
};

export default ErrorState;
