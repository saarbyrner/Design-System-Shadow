// @flow
import { Component } from 'react';
import Modal from 'react-modal';
import { InfoTooltip } from '@kitman/components';
import type { Athlete } from '@kitman/common/src/types/Athlete';
import type { GroupBy } from '@kitman/common/src/types';
import isEqual from 'lodash/isEqual';
import type { State as ReduxState } from '../../../types/state';
import AthleteAvatar from '../AthleteAvatar';
import { IndicationsTranslated as Indications } from '../Indications';

type Props = {
  athlete: Athlete,
  groupBy: GroupBy,
  groupingLabels: { [$PropertyType<Athlete, 'availability'>]: string },
  canViewAvailability: boolean,
  canManageAvailability: boolean,
  indicationTypes: $PropertyType<ReduxState, 'indicationTypes'>,
};
type State = {
  modalIsOpen: boolean,
};

export default class AthleteInfo extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      modalIsOpen: false,
    };

    this.openModal = this.openModal.bind(this);
  }

  // Tries shallow compare and then does deep compare
  // Code from http://benchling.engineering/performance-engineering-with-react/
  shouldComponentUpdate(nextProps: Props, nextState: State) {
    return !isEqual(this.props, nextProps) || !isEqual(this.state, nextState);
  }

  closeModal = () => {
    this.setState({ modalIsOpen: false });
  };

  openModal = () => {
    this.setState({ modalIsOpen: true });
  };

  statusClass(availability: $PropertyType<Athlete, 'availability'>) {
    if (availability === 'available') {
      return null;
    }
    return `km-availability-triangle km-availability-${availability}`;
  }

  athleteUrl(athlete: Athlete) {
    return `/athletes/${athlete.id}`;
  }

  athletePosition(athlete: Athlete) {
    return this.props.groupBy !== 'position' ? athlete.position : false;
  }

  render() {
    let indicationsButton = null;

    if (this.props.athlete.indications) {
      indicationsButton = Object.keys(this.props.athlete.indications).length ? (
        <span>
          <button
            type="button"
            onClick={this.openModal}
            className="athleteInfo__indicationsBtn"
          >
            <div className="athleteInfo__icon icon-stiffness" />
          </button>
          <Modal
            isOpen={this.state.modalIsOpen}
            onRequestClose={this.closeModal}
            className="framedModal__content"
            overlayClassName="framedModal__overlay"
            contentLabel=""
            ariaHideApp={false}
          >
            <Indications
              indications={this.props.athlete.indications}
              indicationTypes={this.props.indicationTypes}
              close={this.closeModal}
            />
          </Modal>
        </span>
      ) : null;
    }

    const indicationsCell = (
      <div className="athleteInfo__indications">{indicationsButton}</div>
    );

    const tooltip = this.props.athlete.comment ? (
      <InfoTooltip placement="top" content={this.props.athlete.comment}>
        <button type="button" className="athleteInfo__commentBtn">
          <div className="athleteInfo__icon icon-bubble" />
        </button>
      </InfoTooltip>
    ) : null;

    const commentCell = <div className="athleteInfo__comment">{tooltip}</div>;

    return (
      <div className="athleteInfo">
        <div className="athleteInfo__wrapper">
          <div className="athleteInfo__avatarContainer">
            <InfoTooltip
              placement="top-start"
              content={
                this.props.groupingLabels[this.props.athlete.availability]
              }
            >
              <button type="button">
                {(this.props.canViewAvailability ||
                  this.props.canManageAvailability) && (
                  <span
                    className={this.statusClass(
                      this.props.athlete.availability
                    )}
                  />
                )}
                <AthleteAvatar
                  image={this.props.athlete.avatar_url}
                  url={this.athleteUrl(this.props.athlete)}
                  alt={this.props.athlete.fullname}
                />
              </button>
            </InfoTooltip>
          </div>
          <div className="athleteInfo__data">
            <a
              className="athleteInfo__athleteName"
              title={this.props.athlete.fullname}
              href={this.athleteUrl(this.props.athlete)}
            >
              {this.props.athlete.shortname}
            </a>
            <br />
            <span className="athleteInfo__athletePosition">
              {this.athletePosition(this.props.athlete)}
            </span>
          </div>
        </div>

        {indicationsCell}
        {commentCell}
      </div>
    );
  }
}
