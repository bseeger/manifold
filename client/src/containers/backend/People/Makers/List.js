import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';
import { UserList, Drawer } from 'components/backend';
import { entityStoreActions } from 'actions';
import { select, meta } from 'utils/entityUtils';
import { makersAPI, requests } from 'api';
import debounce from 'lodash/debounce';
import get from 'lodash/get';
import { Maker, List } from 'components/backend';
import lh from 'helpers/linkHandler';
import { Route } from 'react-router-dom';
import { renderRoutes } from 'helpers/routing';

const { request } = entityStoreActions;
const perPage = 10;

class MakersListContainer extends PureComponent {

  static displayName = "Makers.List";

  static mapStateToProps(state) {
    return {
      makers: select(requests.beMakers, state.entityStore),
      makersMeta: meta(requests.beMakers, state.entityStore)
    };
  }

  static propTypes = {
    makers: PropTypes.array
  };

  constructor() {
    super();
    this.state = { filter: {} };
    this.lastFetchedPage = null;
    this.pageChangeHandlerCreator = this.pageChangeHandlerCreator.bind(this);
    this.fetchMakers = debounce(
      this.fetchMakers.bind(this), 250, { leading: false, trailing: true }
    );
    this.filterChangeHandler = this.filterChangeHandler.bind(this);
  }

  componentDidMount() {
    this.fetchMakers(1);
  }

  componentWillReceiveProps(nextProps) {
    this.maybeReload(nextProps.makersMeta);
  }

  maybeReload(nextMakersMeta) {
    const currentModified = get(this.props, 'makersMeta.modified');
    const nextModified = get(nextMakersMeta, 'modified');
    if (!nextModified) return;
    if (currentModified && nextModified) return;
    this.fetchMakers(this.lastFetchedPage);
  }

  fetchMakers(page) {
    this.lastFetchedPage = page;
    const pagination = { number: page, size: perPage };
    const action = request(
      makersAPI.index(this.state.filter, pagination),
      requests.beMakers
    );
    this.props.dispatch(action);
  }

  filterChangeHandler(filter) {
    this.setState({ filter }, () => {
      this.fetchMakers(1);
    });
  }

  handlePageChange(event, page) {
    this.fetchMakers(page);
  }

  pageChangeHandlerCreator(page) {
    return (event) => {
      this.handlePageChange(event, page);
    };
  }

  isDrawerOpen() {
    return !!this.props.match.params.id;
  }

  render() {
    const { makers, makersMeta, match } = this.props;
    if (!makers) return null;
    const active = match.params.id;
    return (
      <div>
        <header className="section-heading-secondary">
          <h3>
            {'Makers'} <i className="manicon manicon-users"></i>
          </h3>
        </header>
        <Drawer.Wrapper
          open={this.isDrawerOpen()}
          closeUrl={lh.link("backendPeopleMakers")}
        >
          {renderRoutes(this.props.route.routes)}
        </Drawer.Wrapper>
        { makers ?
          <List.Searchable
            entities={makers}
            singularUnit="maker"
            pluralUnit="makers"
            pagination={makersMeta.pagination}
            paginationClickHandler={this.pageChangeHandlerCreator}
            entityComponent={Maker.ListItem}
            entityComponentProps={{ active }}
            filterChangeHandler={this.filterChangeHandler}
          />
          : null
        }
      </div>
    );

  }

}

export default connect(
  MakersListContainer.mapStateToProps
)(MakersListContainer);

