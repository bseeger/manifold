import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import DocumentMeta from 'react-document-meta';
import config from '../../config';
import { BodyClass, LoginOverlay, LoadingBar } from '../../components/shared';
import { Header, SectionPagination } from '../../components/reader';
import connectData from '../../decorators/connectData';
import { fetchOneText } from '../../actions/shared/collections';
import { select } from '../../utils/select';
import { startLogout } from '../../actions/shared/authentication';
import { visibilityToggle, visibilityHide, visibilityShow, panelToggle, panelHide }
  from '../../actions/shared/ui/visibility';
import { values } from 'lodash/object';
import { selectFont, incrementFontSize, decrementFontSize, incrementMargins, decrementMargins }
  from '../../actions/reader/ui/typography';
import { setColorScheme } from '../../actions/reader/ui/colors';

function fetchData(getState, dispatch, location, params) {
  const promises = [];
  promises.push(fetchOneText(params.text_id)(dispatch, getState));
  return Promise.all(promises);
}

function mapStateToProps(state) {
  const textId = state.collections.results.fetchOneText.entities;
  const text = state.collections.entities.texts[textId];
  const { category, project, creators, contributors, textSections, tocSection, stylesheets } =
    select(text, state.collections.entities);
  const sectionId = state.collections.results.fetchOneSection.entities;
  const appearance = {
    typography: state.ui.typography,
    colors: state.ui.colors
  };
  return {
    text,
    category,
    project,
    creators,
    contributors,
    textSections,
    tocSection,
    textId,
    sectionId,
    stylesheets,
    authentication: state.authentication,
    visibility: state.ui.visibility,
    loading: state.ui.loading.active,
    appearance
  };
}

@connectData(fetchData)
@connect(mapStateToProps)
class Reader extends Component {

  static propTypes = {
    children: PropTypes.object,
    params: PropTypes.object,
    text: PropTypes.object,
    textId: PropTypes.string,
    sectionId: PropTypes.string,
    textSections: PropTypes.array,
    visibility: PropTypes.object,
    appearance: PropTypes.object,
    stylesheets: PropTypes.array,
    authentication: PropTypes.object,
    dispatch: PropTypes.func,
    history: PropTypes.object,
    loading: PropTypes.bool
  };

  static contextTypes = {
    store: PropTypes.object.isRequired
  };

  constructor() {
    super();
    this.counter = 0;
  }

  componentWillMount() {
    if (!this.props.params.hasOwnProperty('section_id')) {
      this.transitionToFirstSection();
    }
  }

  componentWillReceiveProps(nextProps) {
    // We reload the page on logout, to ensure that all data is cleared from the store.
    if (nextProps.authentication.authenticated === false &&
      this.props.authentication.authenticated === true) {
      location.reload();
    }
  }

  transitionToFirstSection = () => {
    const firstSectionId = this.props.text.attributes.firstSectionId;
    this.props.history.push(`/read/${this.props.text.id}/section/${firstSectionId}`);
  };

  headerMethods = () => {
    return {
      visibilityToggle: bindActionCreators((el) => visibilityToggle(el), this.props.dispatch),
      visibilityHide: bindActionCreators((el) => visibilityHide(el), this.props.dispatch),
      visibilityShow: bindActionCreators((el) => visibilityShow(el), this.props.dispatch),
      panelToggle: bindActionCreators((el) => panelToggle(el), this.props.dispatch),
      panelHide: bindActionCreators((el) => panelHide(el), this.props.dispatch),
      selectFont: bindActionCreators((el) => selectFont(el), this.props.dispatch),
      incrementFontSize: bindActionCreators(incrementFontSize, this.props.dispatch),
      decrementFontSize: bindActionCreators(decrementFontSize, this.props.dispatch),
      incrementMargins: bindActionCreators(incrementMargins, this.props.dispatch),
      decrementMargins: bindActionCreators(decrementMargins, this.props.dispatch),
      setColorScheme: bindActionCreators((el) => setColorScheme(el), this.props.dispatch),
      startLogout: bindActionCreators(startLogout, this.props.dispatch)
    };
  };

  renderStyles = () => {
    return values(this.props.stylesheets).map((stylesheet, index) => {
      return (
        <style key={index}>
          {stylesheet.attributes.styles}
        </style>
      );
    });
  };

  render() {
    const text = this.props.text;
    const hideLoginOverlay = bindActionCreators(
      () => visibilityHide('loginOverlay'),
      this.props.dispatch
    );
    return (
      <BodyClass className="reader">
        <div>
          {this.renderStyles()}
          <DocumentMeta {...config.app}/>
          <LoadingBar loading={this.props.loading} />
          {/* Header inside scroll-aware HOC */}
          <Header
            // Props required by body component
            text={text}
            sectionId={this.props.sectionId}
            authenticated={this.props.authentication.authToken === null ? false : true}
            visibility={this.props.visibility }
            appearance={this.props.appearance}
            {...this.headerMethods()}
          />
          <LoginOverlay
            visible={this.props.visibility.loginOverlay}
            hideLoginOverlay={hideLoginOverlay}
          />
          <main>
            {this.props.children}
            <SectionPagination
              textId={this.props.textId}
              sectionId={this.props.sectionId}
              textSections={this.props.textSections}
            />
          </main>
        </div>
      </BodyClass>
    );
  }
}

export default connect(
)(Reader);
