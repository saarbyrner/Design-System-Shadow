// @flow
import { useState } from 'react';
import { withNamespaces } from 'react-i18next';
import { Select } from '@kitman/components';
import type { IssueStatusTypes } from '@kitman/modules/src/Medical/shared/types';
import useAthletesIssues from '@kitman/modules/src/Medical/shared/hooks/useAthletesIssues';
import SquadSelector from '@kitman/modules/src/Medical/shared/components/SquadSelector';
import type { Details } from '@kitman/modules/src/Medical/issues/src/components/IssueHeader';
import style from './styles/editView';

type Props = {
  athleteId: number,
  occurrenceType: IssueStatusTypes,
  details: Details,
  onSelectDetail: (
    detailType: string,
    detailValue: string | number | Object
  ) => void,
  t: Function,
};

// returns id that coresponds to string (issue status type) passed
const getInjuryIdFromType = (type, injuryTypes) => {
  const result = injuryTypes.find((item) => item.key === type);
  if (!result) {
    return null;
  }
  return result.value;
};

const EditView = (props: Props) => {
  // Options used by Select component
  const injuryTypes = [
    {
      value: 1,
      key: 'new',
      label: props.t('New Injury/illness'),
    },
    {
      value: 2,
      key: 'recurrence',
      label: props.t('Recurrent Injury/illness'),
    },
  ];

  const [typeOfInjuryIllness, setTypeOfInjuryIllness] = useState(() =>
    getInjuryIdFromType(props.occurrenceType, injuryTypes)
  );
  const [linkedInjuryIllness, setLinkedInjuryIllness] = useState('');
  const { athleteIssues } = useAthletesIssues(props.athleteId, [
    'open',
    'chronic',
  ]);

  const renderInjuryTypeSelector = () => (
    <>
      {window.featureFlags['editable-injury-type'] &&
        props.occurrenceType === 'new' && (
          <>
            <div data-testid="InjuryOccurrenceTypeUpdate|Input">
              <Select
                label={props.t('Type')}
                value={typeOfInjuryIllness}
                onChange={(option) => setTypeOfInjuryIllness(option)}
                options={injuryTypes}
              />
            </div>
            {/* Recurrent injury */}
            {typeOfInjuryIllness === 2 && (
              <div data-testid="LinkInjuryOccurrenceType|Input">
                <Select
                  value={linkedInjuryIllness}
                  label={props.t('Previous injury/ illness')}
                  options={[
                    ...athleteIssues,
                    {
                      label: props.t('No prior injury record in EMR'),
                      value: 'no_prior_injury_record_in_emr',
                    },
                  ]}
                  onChange={(newId) => {
                    setLinkedInjuryIllness(newId);
                    props.onSelectDetail('newInjuryToRecurrentInjury', newId);
                  }}
                />
              </div>
            )}
          </>
        )}
    </>
  );

  const renderSquadSelector = () => (
    <SquadSelector
      label={props.t('Squad')}
      athleteId={props.athleteId}
      value={props.details.squadId}
      onChange={(squadId) => props.onSelectDetail('squadId', squadId)}
    />
  );

  return (
    <div css={style.viewWrapper}>
      {renderInjuryTypeSelector()}
      {!!props.details?.squadId && renderSquadSelector()}
    </div>
  );
};

export const EditViewTranslated = withNamespaces()(EditView);
export default EditView;
