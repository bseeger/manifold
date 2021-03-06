import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router-dom';
import filesize from 'filesize';
import FormattedDate from 'components/global/FormattedDate';

export default class ResourceMeta extends Component {

  static displayName = "Resource.Meta";

  static propTypes = {
    resource: PropTypes.object,
    style: PropTypes.string,
    showIcon: PropTypes.bool,
    showTags: PropTypes.bool,
    projectUrl: PropTypes.string
  };

  static defaultProps = {
    showIcon: true,
    showTags: true
  };

  constructor(props) {
    super();
  }

  mapTagsToLinks(attr) {
    if (!attr.tagList || !this.props.projectUrl) return null;
    const tags = attr.tagList;
    const out = [];
    tags.map((tag, index) => {
      out.push(this.createTagLink(tag, index));
    });
    return out;
  }

  createTagLink(tag, index) {
    if (!tag) return null;
    return (
      <li key={index}>
        {/* Will be route to view resources by tags */}
        <a href={`${this.props.projectUrl}?tag=${tag.toLowerCase()}`}>
          {tag}
        </a>
      </li>
    );
  }

  render() {
    const attr = this.props.resource.attributes;

    return (
      <section className="resource-meta">
        {this.props.showIcon ?
          <figure className="resource-type">
            <i
              className={`manicon manicon-resource-${attr.kind}`}
            >
            </i>
          </figure> : null
        }
        <ul className={`meta-list-${this.props.style}`}>
          <li>
            <span className="meta-label">{'Type'}</span>
            <span className="meta-value">
              {
                attr.kind.charAt(0).toUpperCase() +
                attr.kind.slice(1)
              }
            </span>
          </li>
          {attr.attachmentFileSize ?
            <li>
              <span className="meta-label">{'File Size'}</span>
              <span className="meta-value">
                { ' ' + filesize(attr.attachmentFileSize, { round: 0 }) }
              </span>
            </li> : null
          }
          {attr.attachmentExtension ?
            <li>
              <span className="meta-label">{'File Format'}</span>
              <span className="meta-value">
                {attr.attachmentExtension}
              </span>
            </li> : null
          }
          <li>
            <span className="meta-label">{'Created On'}</span>
            <span className="meta-value">
              <FormattedDate
                format="MMMM DD, YYYY"
                date={attr.createdAt}
              />
            </span>
          </li>
          {attr.copyrightStatus ?
            <li>
              <span className="meta-label">{'Copyright Status'}</span>
              <span className="meta-value">
                {attr.copyrightStatus}
              </span>
            </li> : null
          }
          {attr.copyrightHolder ?
            <li>
              <span className="meta-label">{'Copyright Holder'}</span>
              <span className="meta-value">
                {attr.copyrightHolder}
              </span>
            </li> : null
          }
          {attr.creditFormatted ?
            <li>
              <span className="meta-label">{'Credit'}</span>
              <span
                className="meta-value"
                dangerouslySetInnerHTML={{ __html: attr.creditFormatted }}
              />
            </li> : null
          }
        </ul>

        {this.props.showTags ?
          <nav className="tag-list">
            <ul>
              {this.mapTagsToLinks(attr)}
            </ul>
          </nav> : null
        }
      </section>
    );
  }
}
