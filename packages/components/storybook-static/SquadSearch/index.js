// @flow
/* eslint-disable react/sort-comp */
import { Component } from 'react';
import { setI18n } from 'react-i18next';
import i18n from '@kitman/common/src/utils/i18n';
import { MultiSelect } from '@kitman/components';

type Item = {
  id: string,
  title: string,
  description?: string,
};

type Props = {
  label?: string,
  unique_key: string,
  items: Array<Item>,
  selectedItems: Array<string>,
  missingAthletes: Array<string>,
  exclusive?: boolean,
  onChange: (Array<string>) => Array<string>,
};

type State = {
  items: Array<Item>,
  itemsHash: {
    [string]: Item,
  },
  athletesNotOnDashboard: Array<string>,
};

// set the i18n instance
setI18n(i18n);

class SquadSearch extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      items: props.items || [],
      // eslint-disable-next-line react/no-unused-state
      itemsHash: props.items ? this.createItemsHash(props.items) : {},
      athletesNotOnDashboard: props.missingAthletes,
    };

    this.handleChange = this.handleChange.bind(this);
    this.missingAthletesMessage = this.missingAthletesMessage.bind(this);
  }

  handleChange = (selectedItems: Array<string>) => {
    const selected = selectedItems.slice();
    if (this.props.exclusive) {
      if (
        this.props.selectedItems.indexOf('applies_to_squad') !== -1 &&
        selectedItems.length > 1
      ) {
        // remove applies to squad
        selected.splice(0, 1);
      } else if (
        this.props.selectedItems.indexOf('applies_to_squad') === -1 &&
        selectedItems.indexOf('applies_to_squad') !== -1
      ) {
        // keep applies to squad, clear the rest
        selected.splice(1, selected.length - 1);
      }
    }

    // tell our container the new selected items
    this.props.onChange(selected);
  };

  // create a hash for the items for easy lookups
  createItemsHash(items: Array<Item>) {
    return items.reduce((hash, item) => {
      Object.assign(hash, { [item.id]: item });
      return hash;
    }, {});
  }

  // return all the names of athletes who are not in the squad
  getMissingAthleteNames(missingAthletes: Array<string>) {
    const self = this;
    return missingAthletes
      .map((id) => {
        const itemId = `athlete_${id}`;
        return `${self.state.itemsHash[itemId].title}`;
      })
      .join(', ');
  }

  // message to show athletes selected that are not in the squad
  missingAthletesMessage = (missingAthletes: Array<string>) => {
    // if an athlete is selected that is in our list of missingAthletes
    // we want to display the missing athletes message
    const notOnDashboard = missingAthletes.filter(
      (athleteId) =>
        this.props.selectedItems.indexOf(`athlete_${athleteId}`) !== -1
    );
    if (notOnDashboard.length > 0) {
      const missingAthleteNames = this.getMissingAthleteNames(notOnDashboard);
      switch (notOnDashboard.length) {
        case 0:
          return null;
        case 1:
          return i18n.t(
            'Athlete not in current squad: {{missingAthleteNames}}',
            { missingAthleteNames }
          );
        case 2:
        case 3:
          return i18n.t(
            'Athletes not in current squad: {{missingAthleteNames}}',
            { missingAthleteNames }
          );
        default:
          return i18n.t(
            'Alarms are set for {{missingAthletesCount}} athletes not in current squad',
            { missingAthletesCount: missingAthletes.length }
          );
      }
    } else {
      return null;
    }
  };

  render() {
    return (
      <div className="squadSearch" data-testid="squad-search">
        <MultiSelect
          label={this.props.label || ''}
          name={this.props.unique_key}
          items={this.state.items}
          selectedItems={this.props.selectedItems}
          onChange={this.handleChange}
        />
        <div className="squadSearch__missingAthletes">
          {this.missingAthletesMessage(this.state.athletesNotOnDashboard)}
        </div>
      </div>
    );
  }
}

export default SquadSearch;
