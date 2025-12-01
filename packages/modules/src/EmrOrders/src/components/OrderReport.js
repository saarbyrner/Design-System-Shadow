// @flow
import { useState, useEffect } from 'react';
import $ from 'jquery';
import _isNull from 'lodash/isNull';
import _get from 'lodash/get';
import _isArray from 'lodash/isArray';
import {
  AppStatus,
  TextButton,
  DelayedLoadingFeedback,
  Link,
  Select,
  Toast,
} from '@kitman/components';
import * as DateFormatter from '@kitman/common/src/utils/dateFormatter';
import moment from 'moment';

type Props = {
  order: Object,
  athletes: Array<{
    value: any,
    label: string,
  }>,
  needReconciliation?: boolean,
  onClickBack: Function,
  onReconcileOrder: Function,
  reconciledOrder?: ?{
    athlete_id: number,
    issue_type: number,
    issue_id: number,
    issue_name: string,
  },
};

const headerBlocks = [
  {
    title: 'Date Received',
    key: 'report.dateRecieved',
  },
  {
    title: 'Patient',
    key: 'athlete',
  },
  {
    title: 'Patient #',
    key: 'athlete.id',
  },
  {
    title: 'D.O.B',
    key: 'athlete.date_of_birth',
  },
  {
    title: 'Related Issue',
    key: 'issues',
  },
  {
    title: 'Provider',
    key: 'report.provider',
  },
  {
    title: 'Examining Physician',
    key: 'report.practitioner',
  },
];
const secondaryBlocks = [
  {
    title: 'Area',
    key: 'report.area',
  },
  {
    title: 'Diagnostic',
    key: 'report.diagnostic',
  },
  {
    title: 'Diagnostic Type',
    key: 'report.diagnosticType',
  },
  {
    title: 'Clinical Notes',
    key: 'report.clinicalNotes',
  },
  {
    title: 'Internal Notes',
    key: 'report.internalNotes',
  },
];

const TextBlock = ({ title, text }) => (
  <div className="emrOrders__textBlock">
    <div className="emrOrders__textBlock__heading">{title}</div>

    {_isArray(text) && text.map((item) => <p>{item}</p>)}
    {!_isArray(text) && <p>{text}</p>}
  </div>
);

const getAthleteInjuries = (athleteId) =>
  new Promise((resolve, reject) => {
    $.get(
      `/athletes/${athleteId}/injuries.json`,
      (data) => {
        resolve(data);
      },
      'json'
    ).fail(() => {
      reject();
    });
  });

const getAthleteIllnesses = (athleteId) =>
  new Promise((resolve, reject) => {
    $.get(
      `/athletes/${athleteId}/illnesses.json`,
      (data) => {
        resolve(data);
      },
      'json'
    ).fail(() => {
      reject();
    });
  });

function OrderReport(props: Props) {
  const [selectedAthlete, setSelectedAthlete] = useState(null);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [issueList, setIssueList] = useState([]);
  const [requestStatus, setRequestStatus] = useState([]);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [isFakeLoadingDone, setIsFakeLoadingDone] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setIsFakeLoadingDone(true), 1000);
    return () => {
      clearTimeout(timeout);
    };
  }, []);

  if (_isNull(props.order)) {
    return null;
  }

  const onSelectectAthlete = (athleteId) => {
    setRequestStatus('LOADING');

    Promise.all([
      getAthleteInjuries(athleteId),
      getAthleteIllnesses(athleteId),
    ]).then(
      ([injuries, illnesses]) => {
        setIssueList([
          ...injuries.map((injury) => ({
            value: `injury_${injury.injury_id}`,
            label: injury.name,
          })),
          ...illnesses.map((illness) => ({
            value: `illness_${illness.illness_id}`,
            label: illness.name,
          })),
        ]);
        setSelectedAthlete(athleteId);
        setRequestStatus('SUCCESS');
      },
      () => setRequestStatus('FAILURE')
    );
  };

  const createDiagnostic = () => {
    setRequestStatus('CREATE_DIAGNOSTIC_LOADING');

    const issueType = selectedIssue?.includes('illness_')
      ? 'illness'
      : 'injury';
    const issueId =
      issueType === 'illness'
        ? selectedIssue?.replace('illness_', '')
        : selectedIssue?.replace('injury_', '');

    $.ajax({
      method: 'POST',
      // $FlowFixMe
      url: `/athletes/${selectedAthlete}/diagnostics`,
      contentType: 'application/json',
      // $FlowFixMe
      headers: {
        'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content'),
        Accept: 'application/json',
      },
      data: JSON.stringify({
        diagnostic: {
          diagnostic_type_id: 2,
          diag_date: props.order.creation_date,
          injury_ids: issueType === 'injury' ? [issueId] : [],
          illness_ids: issueType === 'illness' ? [issueId] : [],
          attached_links: [
            {
              title: 'PET-CT-Scan-Chest-Abdomen-JC',
              uri: `${window.location.origin}/settings/order_management#orderToReconcile_${props.order.id}`,
            },
            {
              title: props.order.report.dicom.name,
              uri: props.order.report.dicom.link,
            },
          ],
        },
      }),
    })
      .done(() => {
        setRequestStatus('SUCCESS');
        setShowSuccessToast(true);
        setTimeout(() => setShowSuccessToast(false), 1000);

        props.onReconcileOrder({
          athlete_id: selectedAthlete,
          issue_type: issueType,
          issue_id: issueId,
          issue_name: issueList.find(
            // $FlowFixMe
            (issue) => issue.value === `${issueType}_${issueId}`
          )?.label,
        });
      })
      .fail(() => setRequestStatus('FAILURE'));
  };

  return (
    <>
      <div>
        <a
          onClick={() => {
            window.location.hash = '';
            props.onClickBack();
          }}
          type="button"
          className="emrOrders__link"
        >
          <i className="icon-next-left" />
          Back
        </a>
      </div>
      {!isFakeLoadingDone ? (
        <div className="emrOrders__container emrOrders__container--with-padding">
          <DelayedLoadingFeedback />
        </div>
      ) : (
        <div className="emrOrders__container emrOrders__container--with-padding">
          <header className="emrOrders__reportHeader">
            <h4>REPORT</h4>
            {props.needReconciliation && (
              <TextButton
                text="Complete"
                type="primary"
                onClick={() => createDiagnostic()}
                kitmanDesignSystem
                isDisabled={!selectedAthlete || !selectedIssue}
              />
            )}
          </header>
          <h4>
            {props.needReconciliation || props.reconciledOrder
              ? 'Return ref ID: AD15679'
              : 'Order ID: 764121 / Return ref no. AD32489'}
          </h4>
          <div className="emrOrders__inlineList">
            {headerBlocks.map((header) => {
              switch (header.key) {
                case 'athlete': {
                  if (props.needReconciliation)
                    return (
                      <div
                        key={header.key}
                        className="emrOrders__textBlock emrOrders__textBlock--athleteSelection"
                      >
                        <div className="emrOrders__textBlock__heading">
                          Patient
                        </div>
                        <div>Jack Cichy</div>
                        <div className="mt-2">
                          <Select
                            placeholder="Unassigned"
                            value={selectedAthlete}
                            onChange={(athleteId) =>
                              onSelectectAthlete(athleteId)
                            }
                            options={props.athletes}
                            isDisabled={requestStatus === 'LOADING'}
                          />
                        </div>
                      </div>
                    );

                  return (
                    <div className="emrOrders__textBlock">
                      <div className="emrOrders__textBlock__heading">
                        Patient
                      </div>
                      {props.reconciledOrder ? (
                        <Link
                          href={`/athletes/${props.reconciledOrder.athlete_id}`}
                          className="emrOrders__linkColumn"
                        >
                          {
                            props.athletes.find(
                              (athlete) =>
                                athlete.value ===
                                props.reconciledOrder?.athlete_id
                            )?.label
                          }
                        </Link>
                      ) : (
                        <Link
                          href={`/athletes/${props.order.athlete.id}`}
                          className="emrOrders__linkColumn"
                        >
                          {props.order.athlete.fullname}
                        </Link>
                      )}
                    </div>
                  );
                }
                case 'issues': {
                  if (props.needReconciliation)
                    return (
                      <div
                        key={header.key}
                        className="emrOrders__textBlock emrOrders__textBlock--athleteSelection"
                      >
                        <div className="emrOrders__textBlock__heading">
                          Related Issue
                        </div>
                        <div>-</div>
                        <div className="mt-2">
                          <Select
                            placeholder="None"
                            value={selectedIssue}
                            onChange={(issueId) => setSelectedIssue(issueId)}
                            options={issueList}
                            isDisabled={requestStatus === 'LOADING'}
                          />
                        </div>
                      </div>
                    );

                  return (
                    <div className="emrOrders__textBlock">
                      <div className="emrOrders__textBlock__heading">
                        Related Issue
                      </div>
                      {props.reconciledOrder ? (
                        <Link
                          href={`/athletes/${
                            props.reconciledOrder.athlete_id
                          }/${
                            props.reconciledOrder.issue_type === 'injury'
                              ? 'injuries'
                              : 'illnesses'
                          }`}
                          className="emrOrders__linkColumn"
                        >
                          {props.reconciledOrder.issue_name}
                        </Link>
                      ) : (
                        <Link
                          href={`/athletes/${props.order.athlete.id}/injuries`}
                          className="emrOrders__linkColumn"
                        >
                          ACL rupture (Knee Left)
                        </Link>
                      )}
                    </div>
                  );
                }
                case 'athlete.date_of_birth': {
                  return (
                    <div className="emrOrders__textBlock">
                      <div className="emrOrders__textBlock__heading">D.O.B</div>
                      {DateFormatter.formatStandard({
                        date: moment(
                          props.order.athlete.date_of_birth,
                          'YYYY-MM-DD'
                        ),
                        displayLongDate: true,
                      })}
                    </div>
                  );
                }
                default:
                  return (
                    <TextBlock
                      key={header.key}
                      title={header.title}
                      text={_get(props.order, header.key)}
                    />
                  );
              }
            })}
          </div>

          <hr className="emrOrders__divider" />

          <div className="emrOrders__inlineList">
            {secondaryBlocks.map((header) => {
              return (
                <TextBlock
                  key={header.key}
                  title={header.title}
                  text={_get(props.order, header.key, '')}
                />
              );
            })}
          </div>

          <div className="emrOrders__inlineList">
            <TextBlock
              title="Reason"
              text={_get(props.order, 'report.reason', '')}
            />
          </div>

          <hr className="emrOrders__divider" />

          <h4>FINDINGS</h4>
          {props.order.report.findings.notes.map((note) => (
            <TextBlock
              key={note.heading}
              title={note.heading}
              text={note.content}
            />
          ))}

          <div className="emrOrders__textBlock">
            <p>
              Dr. Geoffrey Smith [56289]
              <br />
              THIS REPORT WAS ELECTRONICALLY SIGNED
            </p>
          </div>

          <h4>Media</h4>
          <div>
            <a
              href={props.order.report.dicom.link}
              rel="noopener noreferrer"
              target="_blank"
              className="emrOrders__link"
            >
              <i className="icon-attachment" />
              {props.order.report.dicom.name}
            </a>
          </div>
          {requestStatus === 'FAILURE' && <AppStatus status="error" />}
          {requestStatus === 'CREATE_DIAGNOSTIC_LOADING' && (
            <AppStatus status="loading" />
          )}
          {showSuccessToast && (
            <Toast
              items={[
                {
                  text: 'Diagnostic created',
                  status: 'SUCCESS',
                  id: 1,
                },
              ]}
            />
          )}
        </div>
      )}
    </>
  );
}

export default OrderReport;
