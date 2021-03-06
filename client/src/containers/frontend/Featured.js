import React, { Component, PropTypes } from 'react';
import connectAndFetch from 'utils/connectAndFetch';
import { ProjectList, Layout } from 'components/frontend';
import { commonActions } from 'actions/helpers';
import { bindActionCreators } from 'redux';
import { uiFilterActions, entityStoreActions } from 'actions';
import { select } from 'utils/entityUtils';
import { projectsAPI, subjectsAPI, requests } from 'api';
import get from 'lodash/get';


const { setProjectFilters } = uiFilterActions;
const { request, flush } = entityStoreActions;

class FeaturedContainer extends Component {

  static fetchData(getState, dispatch) {
    const state = getState();
    const featuredProjectsRequest =
      request(projectsAPI.featured(), requests.feProjectsFeatured);
    const featuredSubjectsRequest = request(
      subjectsAPI.featuredSubjects(),
      requests.feSubjectsFeatured
    );
    const { promise: one } = dispatch(featuredProjectsRequest);
    const { promise: two } = dispatch(featuredSubjectsRequest);
    return Promise.all([one, two]);
  }

  static mapStateToProps(state) {
    return {
      projectFilters: state.ui.filters.project,
      featuredProjects: select(requests.feProjectsFeatured, state.entityStore),
      subjects: select(requests.feSubjectsFeatured, state.entityStore),
      authentication: state.authentication
    };
  }

  static propTypes = {
    featuredProjects: PropTypes.array,
    authentication: PropTypes.object,
    projectFilters: PropTypes.object,
    subjects: PropTypes.array,
    dispatch: PropTypes.func
  };
  componentDidUpdate(prevProps) {
    const { dispatch } = this.props;
    if (prevProps.projectFilters !== this.props.projectFilters) {
      const apiCall = projectsAPI.featured(6, this.props.projectFilters);
      const featuredRequest =
        request(apiCall, requests.feProjectsFeatured);
      dispatch(featuredRequest);
    }
  }

  componentWillUnmount() {
    this.props.dispatch(flush(requests.feSubjectsFeatured));
  }

  render() {
    const boundSetFilters = bindActionCreators(setProjectFilters, this.props.dispatch);
    const subjects = this.props.subjects;

    return (
      <div style={ {
        overflowX: 'hidden'
      } }>
        <section className="bg-neutral05">
          <div className="container">
            <header className="section-heading utility-right">
              <h4 className="title">
                <i className="manicon manicon-lamp"></i>
                {'Featured Projects'}
              </h4>
              <div className="section-heading-utility-right">
                <ProjectList.Filters
                  updateAction={boundSetFilters}
                  subjects={subjects}
                  hideFeatured
                />
              </div>
            </header>
            { this.props.featuredProjects ?
              <ProjectList.Grid
                authenticated={this.props.authentication.authenticated}
                favorites={get(this.props.authentication, 'currentUser.favorites')}
                dispatch={this.props.dispatch}
                projects={this.props.featuredProjects}
              /> : null
            }
          </div>
        </section>
        <Layout.ButtonNavigation
          grayBg={false}
          authenticated={this.props.authentication.authenticated}
        />
      </div>
    );
  }
}

export default connectAndFetch(FeaturedContainer);
