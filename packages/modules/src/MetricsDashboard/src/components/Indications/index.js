// @flow
/* eslint-disable react/sort-comp */
import { Component } from 'react';
import { withNamespaces } from 'react-i18next';
import classNames from 'classnames';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { State as ReduxState } from '../../../types/state';
import BodyPart from '../BodyPart';
import { SkeletalMap, OrderedBodyParts } from '../../../resources/skeletal_map';

type Props = {
  close: Function,
  indications: {
    [key: string]: Object,
  },
  indicationTypes: $PropertyType<ReduxState, 'indicationTypes'>,
};

class Indications extends Component<
  I18nProps<Props>,
  {
    activeTab: string,
    selectedBodyPart: string,
  }
> {
  skeletalMap: Function;

  indicationTypes: { string: string };

  constructor(props: I18nProps<Props>) {
    super(props);

    this.raiseErrorIfTooManyTabs();

    // The first indication type should be selected by default
    const firstIndicationType = Object.keys(this.props.indications)[0];

    this.state = {
      activeTab: firstIndicationType,
      selectedBodyPart: this.getFirstBodyPart(firstIndicationType),
    };

    this.skeletalMap = SkeletalMap();

    this.shouldShowTabs = this.shouldShowTabs.bind(this);
    this.setActiveBodyPart = this.setActiveBodyPart.bind(this);
    this.createTabs = this.createTabs.bind(this);
    this.createSidebar = this.createSidebar.bind(this);
    this.createBodyMap = this.createBodyMap.bind(this);
    this.getNumberOfIndications = this.getNumberOfIndications.bind(this);
  }
  /* eslint-enable max-statements */

  raiseErrorIfTooManyTabs() {
    if (Object.keys(this.props.indications).length > 4 && console != null) {
      console.error("<Indications /> doesn't support more than 4 tabs"); // eslint-disable-line no-console
    }
  }

  // Sets the body part to an active state
  setActiveBodyPart = (bodyPart: string) => {
    this.setState({
      selectedBodyPart: bodyPart,
    });
  };

  // Returns the number of indications
  getNumberOfIndications = (indications: Object): number => {
    let count = 0;
    const skeletalMap = this.skeletalMap;

    // Because some body parts are in both front and rear,
    // we need to tally the count of indications by checking both
    Object.keys(indications).forEach((indicator) => {
      if (indicator in skeletalMap.front) {
        count += 1;
      }

      if (indicator in skeletalMap.rear) {
        count += 1;
      }
    });

    return count;
  };

  getTabClass(bodyPart: string) {
    return classNames({
      indicationsModal__tabBtn: true,
      active: this.state.activeTab === bodyPart || false,
    });
  }

  getFirstBodyPart(indicationType: string) {
    const orderedBodyPart = this.sortBodyParts(
      this.props.indications[indicationType],
      OrderedBodyParts
    );
    return Object.keys(orderedBodyPart)[0];
  }

  // Returns the body parts in a sorted order
  sortBodyParts(bodyParts: Object, sortedKeynames: Object): Object {
    // Body parts in the sidebar need to be displayed in a
    // certain order. This function loops through that order,
    // if we have data for that body part, add it to 'sortedBodyParts'.
    // This will give us back our indicator data ordered by front and
    // then back.
    const sortedBodyParts = {};

    sortedKeynames.front.map((keyname) => {
      if (keyname in bodyParts) {
        sortedBodyParts[keyname] = bodyParts[keyname];
      }
      return null;
    });

    sortedKeynames.rear.map((keyname) => {
      if (keyname in bodyParts) {
        sortedBodyParts[keyname] = bodyParts[keyname];
      }

      return null;
    });

    return sortedBodyParts;
  }

  shouldShowTabs = (): boolean => {
    return Object.keys(this.props.indications).length > 1;
  };

  // Sets the target tab active
  changeTab(targetTab: string) {
    this.setState({
      activeTab: targetTab,
      selectedBodyPart: this.getFirstBodyPart(targetTab),
    });
  }

  // Returns JSX for the tabs
  createTabs = (): Array<?Object> => {
    return Object.keys(this.props.indications).map((bodyPart) => (
      <button
        type="button"
        key={bodyPart}
        className={this.getTabClass(bodyPart)}
        onClick={() => {
          this.changeTab(bodyPart);
        }}
      >
        {bodyPart}
        <span>
          {this.getNumberOfIndications(this.props.indications[bodyPart])}
        </span>
      </button>
    ));
  };

  // Returns JSX for the sidebar list
  createSidebarList(
    bodyParts: Object,
    bodyPartKeynames: Object
  ): Array<?Object> {
    return Object.keys(bodyParts)
      .map((bodyPart) => {
        let liClass = null;

        if (this.state.selectedBodyPart === bodyPart) {
          liClass = 'active';
        }

        if (bodyPart in bodyPartKeynames) {
          return (
            <li
              key={bodyPart}
              onClick={() => this.setActiveBodyPart(bodyPart)}
              className={liClass}
            >
              {bodyPartKeynames[bodyPart].name}
              <span>{`${bodyParts[bodyPart]}/10`}</span>
            </li>
          );
        }

        return null;
      })
      .filter((item) => item !== null);
  }

  // Returns JSX for the sidebar
  createSidebar = (
    bodyParts: Object,
    skeletalMap: Object,
    indicatorType: string
  ): Object => {
    const frontItems = this.createSidebarList(bodyParts, skeletalMap.front);
    const rearItems = this.createSidebarList(bodyParts, skeletalMap.rear);

    return (
      <div className="indicationsModal__sidebar">
        <h5>{this.props.indicationTypes[indicatorType]}</h5>
        <div className="indicationsModal__sidebarMenu">
          {frontItems.length ? (
            <div className="km-datagrid-modalIndicationList">
              <div className="km-datagrid-modalIndicationList__section">
                <p>{this.props.t('Front')}</p>
                <hr />
                <ul>{frontItems}</ul>
              </div>
            </div>
          ) : null}

          {rearItems.length ? (
            <div className="km-datagrid-modalIndicationList">
              <div className="km-datagrid-modalIndicationList__section">
                <p>{this.props.t('Back')}</p>
                <hr />
                <ul>{rearItems}</ul>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    );
  };

  // Returns JSX for the body map
  createBodyMap = (bodyParts: Object, skeletalMap: Object): Object => {
    const sortedBodyParts = {
      front: [],
      rear: [],
    };

    Object.keys(bodyParts).map((bodyPart) => {
      if (bodyPart in skeletalMap.front) {
        sortedBodyParts.front.push(
          <BodyPart
            key={bodyPart}
            bodyPart={bodyPart}
            score={bodyParts[bodyPart]}
            scoreOffset={bodyParts[bodyPart].scoreOffset || {}}
            pos={skeletalMap.front[bodyPart].pos}
            size={skeletalMap.front[bodyPart].size}
            svgData={skeletalMap.front[bodyPart].svgData}
            viewBox={skeletalMap.front[bodyPart].viewBox}
            active={this.state.selectedBodyPart === bodyPart}
            setActive={this.setActiveBodyPart}
          />
        );
      }

      if (bodyPart in skeletalMap.rear) {
        sortedBodyParts.rear.push(
          <BodyPart
            key={bodyPart}
            bodyPart={bodyPart}
            score={bodyParts[bodyPart]}
            scoreOffset={bodyParts[bodyPart].scoreOffset || {}}
            pos={skeletalMap.rear[bodyPart].pos}
            size={skeletalMap.rear[bodyPart].size}
            svgData={skeletalMap.rear[bodyPart].svgData}
            viewBox={skeletalMap.rear[bodyPart].viewBox}
            active={this.state.selectedBodyPart === bodyPart}
            setActive={this.setActiveBodyPart}
          />
        );
      }

      return {};
    });

    return (
      <div className="row">
        <div className="col-lg-6 skeletonFront">
          <div className="km-datagrid-skeleton">{sortedBodyParts.front}</div>
        </div>
        <div className="col-lg-6 skeletonRear">
          <div className="km-datagrid-skeleton km-datagrid-skeletonRear">
            {sortedBodyParts.rear}
          </div>
        </div>
      </div>
    );
  };

  render() {
    const modalClasses = classNames({
      'km-datagrid-modal': true,
      indicationsModal: true,
      'indicationsModal--hasTabs': this.shouldShowTabs(),
    });

    const activeIndication = this.props.indications[this.state.activeTab];
    const sortedBodyParts = this.sortBodyParts(
      activeIndication,
      OrderedBodyParts
    );

    const tabs = this.createTabs();
    const sidebar = this.createSidebar(
      sortedBodyParts,
      this.skeletalMap,
      this.state.activeTab
    );
    const bodyMap = this.createBodyMap(sortedBodyParts, this.skeletalMap);

    return (
      <div className={modalClasses}>
        <button
          type="button"
          onClick={this.props.close}
          className="km-datagrid-modal-closeButton indicationsModal__closeButton icon-close"
        />

        <div className="indicationsModal__tabs">{tabs}</div>

        <div className="d-flex">
          {sidebar}
          <div className="km-datagrid-modalContent km-datagrid-modalContent--bodymap">
            {bodyMap}
          </div>
        </div>
      </div>
    );
  }
}

export const IndicationsTranslated = withNamespaces()(Indications);
export default Indications;
