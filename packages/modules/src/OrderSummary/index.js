// @flow
import { useState } from 'react';
import moment from 'moment';
import * as DateFormatter from '@kitman/common/src/utils/dateFormatter';
import { LegacyModal as Modal, TextButton } from '@kitman/components';

type Props = {
  orderDraft: {
    id: number,
    creation_date: string,
    user: { id: number, fullname: string },
    athlete: { id: number, fullname: string, date_of_birth: string },
    approval: string,
    items: Array<{
      id: number,
      area?: string,
      diagnostic_type: { id: number, name: string },
      injuries: Array<{ id: number, name: string }>,
      illnesses: Array<{ id: number, name: string }>,
      provider: { id: number, name: string },
      order_type: { id: number, name: string },
      reason?: string,
      internal_note?: string,
      clinical_note: string,
    }>,
    is_draft: boolean,
  },
  athlete?: { id: number, fullname: string, date_of_birth: string },
  onClickClose: Function,
  onClickSave: Function,
  isOnManagementView?: boolean,
};

const OrderSummary = (props: Props) => {
  const [isPrintMode, setIsPrintMode] = useState(false);

  const handlePrint = (pdfName: string) => {
    /* $FlowFixMe  */
    document.querySelector('.reactModal__closeBtn').style.display = 'none';
    setIsPrintMode(true);

    const opts = {
      margin: 1,
      filename: pdfName,
      image: { type: 'jpeg', quality: 0.98 },
      jsPDF: {
        unit: 'in',
        orientation: 'portrait',
      },
    };

    /* $FlowFixMe  */
    html2pdf()
      .set(opts)
      .from(document.querySelector('.reactModal__content'))
      .save()
      .then(() => {
        setIsPrintMode(false);
        /* $FlowFixMe  */
        document.querySelector('.reactModal__closeBtn').style.display = 'block';
      });
  };

  const dob =
    props.athlete?.date_of_birth || props.orderDraft.athlete.date_of_birth;
  const formatedDob = DateFormatter.formatStandard({
    date: moment(dob, 'YYYY-MM-DD'),
    displayLongDate: true,
  });

  return (
    <Modal
      title="Order summary"
      close={() => props.onClickClose()}
      style={{ overflow: 'visible' }}
      width={900}
      isOpen
    >
      <div className="emrOrderItemSummary">
        <div className="emrOrderItemSummary__address">
          <h5>TAMPA BAY BUCCANEERS</h5>
          <p>AdventHealth Training Center</p>
          <p>One Buccaneer Place</p>
          <p>Tampa, FL 33607 </p>
        </div>
        <div className="row emrOrderItemSummary__metaInfo">
          <div className="col-md-3">
            <h5>Order Number</h5>
            <div>{props.orderDraft.id}</div>
          </div>
          <div className="col-md-3">
            <h5>Patient</h5>
            <div className="text-capitalize">
              {props.athlete?.fullname || props.orderDraft.athlete.fullname}
            </div>
          </div>
          <div className="col-md-3">
            <h5>Patient #</h5>
            <div className="text-capitalize">
              {props.athlete?.id || props.orderDraft.athlete.id}
            </div>
          </div>
          <div className="col-md-3">
            <h5>D.O.B</h5>
            <div className="text-capitalize">{formatedDob}</div>
          </div>

          <div className="col-md-3 marginTop24">
            <h5>Provider</h5>
            <div>Stanford Health</div>
          </div>
          <div className="col-md-3 marginTop24">
            <h5>Provider fax</h5>
            <div>202-555-0191</div>
          </div>
          <div className="col-md-3 marginTop24">
            <h5>Provider email</h5>
            <div className="text-truncate">
              orders@imaging.stanfordhealth.com
            </div>
          </div>
          <div className="col-md-3 marginTop24">
            <h5>Order By</h5>
            <div>{props.orderDraft.user.fullname || '-'}</div>
          </div>
        </div>
        <div className="row emrOrderItemSummary__items">
          {props.orderDraft.items.map((item) => (
            <div key={item.id} className="col-md-12 emrOrderItemSummary__item">
              <div className="row">
                <div className="col-md-3">
                  <h5>Area</h5>
                  <div>{item.area || '-'}</div>
                </div>
                <div className="col-md-3">
                  <h5>Related issues</h5>
                  <div>
                    {item.illnesses.length === 0 &&
                    item.injuries.length === 0 ? (
                      '-'
                    ) : (
                      <>
                        {item.illnesses.map((illness) => (
                          <p key={illness.id}>{illness.name}</p>
                        ))}
                        {item.injuries.map((injury) => (
                          <p key={injury.id}>{injury.name}</p>
                        ))}
                      </>
                    )}
                  </div>
                </div>
                <div className="col-md-3">
                  <h5>Diagnostic</h5>
                  <div>{item.order_type.name}</div>
                </div>
                <div className="col-md-3">
                  <h5>Diagnostic type</h5>
                  <div>{item.diagnostic_type.name}</div>
                </div>
                <div className="col-md-3 marginTop24">
                  <h5>Reason</h5>
                  <div>{item.reason || '-'}</div>
                </div>
                <div className="col-md-3 marginTop24">
                  <h5>Internal notes</h5>
                  <div>{item.internal_note || '-'}</div>
                </div>
                <div className="col-md-3 marginTop24">
                  <h5>Clinical notes</h5>
                  <div>{item.clinical_note || '-'}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
        {!isPrintMode && !props.isOnManagementView && (
          <footer>
            <div>
              <div className="emrOrderItemSummary__errorMessage">
                <i className="icon-alert" />
                Gateway not configured contact support
              </div>
              <div className="emrOrderItemSummary__errorMessage">
                <i className="icon-alert" />
                Fax gateway not configured contact support
              </div>
            </div>
            <div className="emrOrderItemSummary__actions">
              <TextButton
                text="Save"
                type="link"
                kitmanDesignSystem
                onClick={() => props.onClickSave()}
              />
              <TextButton
                text="Print"
                type="secondary"
                kitmanDesignSystem
                onClick={() =>
                  handlePrint(`ORDER NUMBER ${props.orderDraft.id}.pdf`)
                }
              />
              <a
                href={`mailto:oreders@imaging.stanfordhealth.com?subject=Order No. ${props.orderDraft.id}!&body=To whom it may concern,%0D%0A%0D%0APlease see imaging Order No. ${props.orderDraft.id}.pdf attached.%0D%0A%0D%0ARegards,%0D%0A`}
              >
                <TextButton
                  text="Email"
                  type="secondary"
                  kitmanDesignSystem
                  onClick={() => {}}
                />
              </a>
              <TextButton
                text="E-Fax"
                type="secondary"
                kitmanDesignSystem
                onClick={() => {}}
                isDisabled
                iconBefore="icon-alert"
              />
              <TextButton
                text="Order"
                type="secondary"
                kitmanDesignSystem
                onClick={() => {}}
                isDisabled
                iconBefore="icon-alert"
              />
            </div>
          </footer>
        )}
      </div>
    </Modal>
  );
};

export default OrderSummary;
