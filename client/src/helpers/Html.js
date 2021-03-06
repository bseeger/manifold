import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom/server';
import serialize from 'serialize-javascript';
import DocumentMeta from 'react-document-meta';
import { HigherOrder } from 'components/global';
import get from 'lodash/get';
import has from 'lodash/has';

/**
 * Wrapper component containing HTML metadata and boilerplate tags.
 * Used in server-side code only to wrap the string output of the
 * rendered route component.
 *
 * The only thing this component doesn't (and can't) include is the
 * HTML doctype declaration, which is added to the rendered output
 * by the server.js file.
 */
export default class Html extends Component {
  static propTypes = {
    assets: PropTypes.object,
    component: PropTypes.node,
    store: PropTypes.object
  }

  constructor(props) {
    super(props);
    this.javascripts = this.javascripts.bind(this);
    this.stylesheets = this.stylesheets.bind(this);
  }

  stylesheets() {
    if (!this.props.assets && !this.props.assets.styles) return null;
    return Object.keys(this.props.assets.styles).map((style, key) =>
      <link
        href={this.props.assets.styles[style]}
        key={key}
        media="screen, projection"
        rel="stylesheet"
        type="text/css"
        charSet="UTF-8"
      />
    );
  }

  javascripts() {
    if (!this.props.assets && !this.props.assets.javascript) return null;
    const keys = Object.keys(this.props.assets.javascript);
    keys.splice(keys.indexOf("main"), 1);
    keys.splice(keys.indexOf("theme"), 1);
    keys.unshift("main");
    keys.unshift("theme");
    return keys.map((js, key) =>
      <script
        src={this.props.assets.javascript[js]}
        key={key}
        charSet="UTF-8"
      />
    );
  }

  render() {
    const { assets, component, store } = this.props;
    const content = component ? ReactDOM.renderToString(component) : null;
    const bodyClass = HigherOrder.BodyClass.rewind();
    const tkId = get(store.getState(),
      "entityStore.entities.settings.0.attributes.theme.typekitId");
    const tkEnabled = !!tkId;

    const contentProps = {};
    if (content) {
      contentProps.dangerouslySetInnerHTML = { __html: content };
      contentProps["data-ssr-render"] = true;
    }

    return (
      <html lang="en-us">
        <head>
          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
          <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=0" />
          {DocumentMeta.renderAsReact()}

          <link rel="shortcut icon" href="/favicon.ico?client=true" />

          {this.stylesheets()}

          {/* Import fonts from webkit */}
          {tkEnabled ? <script src={`https://use.typekit.net/${tkId}.js`}></script> : null}
          {tkEnabled ?
            <script
              dangerouslySetInnerHTML={{ __html: 'try{Typekit.load({ async: true });}catch(e){}' }}
              charSet="UTF-8"
            /> : null
          }

          {/* styles (will be present only in production with webpack extract text plugin) */}

        </head>
        <body className={bodyClass}>
          <div
            id="content"
            {...contentProps}
          />
          <script
            dangerouslySetInnerHTML={{
              __html: `window.__INITIAL_STATE__=${serialize(store.getState())};`
            }}
            charSet="UTF-8"
          />
          {this.javascripts()}
        </body>
      </html>
    );
  }
}
