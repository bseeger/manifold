import React, { Component, PropTypes } from 'react';
import Dropzone from 'react-dropzone';
import { Form as GlobalForm } from 'components/global';
import classnames from 'classnames';
import isString from 'lodash/isString';
import isObject from 'lodash/isObject';
import get from 'lodash/get';
import setter from './setter';

class FormUpload extends Component {

  static displayName = "Form.Upload";

  static propTypes = {
    set: PropTypes.func.isRequired, // set is called when the value changes
    setOther: PropTypes.func, // used to set another prop, eg removed, in session
    label: PropTypes.string,
    instructions: PropTypes.string,
    accepts: PropTypes.string,
    inlineStyle: PropTypes.object,
    name: PropTypes.string, // name of the model field: attributes[avatar]
    remove: PropTypes.string, // name of the model remove field: attributes[removeAvatar]
    style: React.PropTypes.oneOf(['square', 'portrait', 'landscape']),
    value: PropTypes.any, // the current value of the field in the connected model
    initialValue: PropTypes.string, // the initial value of the input when it's rendered
    errors: PropTypes.array
  };

  static defaultProps = {
    style: "square",
    accepts: "any"
  }

  static types = {
    images: {
      accepts: "image/*",
      extensions: "jpeg, tiff, gif, png"
    },
    audio: {
      accepts: "audio/*",
      extensions: "mp3"
    },
    video: {
      accepts: "video/*",
      extensions: "mp4, webm"
    },
    pdf: {
      accepts: "application/pdf",
      extensions: "pdf"
    },
    document: {
      accepts: "application/vnd.openxmlformats-officedocument.wordprocessingml.document," +
      "application/msword,text/*",
      extensions: "doc docx txt"
    },
    spreadsheet: {
      accepts: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet," +
      "application/vnd.ms-excel",
      extensions: "xls xlsx"
    },
    presentation: {
      accepts: "application/vnd.openxmlformats-officedocument.presentationml.presentation," +
      "application/vnd.ms-powerpoint",
      extensions: "ppt pptx"
    },
    texts: {
      accepts: "application/epub+zip,application/zip,text/*",
      extensions: ".epub, .zip, .md"
    },
    json: {
      accepts: "application/json",
      extensions: ".json"
    },
    any: {
      accepts: null,
      extensions: null
    }
  };

  constructor(props) {
    super(props);

    this.state = {
      removed: false,
      attachment: null
    };

    this.setValueFromCurrentState = this.setValueFromCurrentState.bind(this);
    this.handleFileDrop = this.handleFileDrop.bind(this);
    this.handleRemove = this.handleRemove.bind(this);
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state !== prevState) this.setValueFromCurrentState();
  }

  setValueFromCurrentState() {
    const { attachment, removed } = this.state;
    const { set, setOther, remove: removeName } = this.props;

    if (setOther && removeName) setOther(removed, removeName);
    if (attachment) {
      const { type, name } = attachment;
      const reader = new FileReader();
      reader.onload = (e) => {
        set({ data: reader.result, content_type: type, filename: name });
      };
      reader.readAsDataURL(attachment);
    } else {
      set(null);
    }
  }

  handleFileDrop(file) {
    this.setState({ attachment: file[0], removed: false });
  }

  handleRemove(event) {
    event.preventDefault();
    event.stopPropagation();
    this.setState({ attachment: null, removed: true });
  }

  isFile(object) {
    return isObject(object) && object.hasOwnProperty('data');
  }

  displayState(props, state) {
    if (props.value || this.showInitialValue(props, state)) {
      if (props.accepts === "images") return 'image-preview';
      return 'file-preview';
    }
    return 'empty';
  }

  accepts(props) {
    const key = props.accepts;
    let config;
    config = get(FormUpload.types, key);
    if (!config) config = FormUpload.types.any;
    return config;
  }

  showInitialValue(props, state) {
    return !state.removed && isString(props.initialValue);
  }

  previewFile(props, state) {
    if (this.isFile(props.value)) return props.value.data;
    if (this.showInitialValue(props, state)) {
      return props.initialValue;
    }
  }

  previewFileName(props, state) {
    if (this.isFile(props.value)) return props.value.filename;
    if (this.showInitialValue(props, state)) {
      return props.initialValue;
      // return props.initialValue.split("/").pop().split("-").shift();
    }
  }

  renderImagePreview() {
    return (
      <div className="contents-image-preview">
        <div
          data-id="preview"
          className="preview"
          style={{ backgroundImage: `url(${this.previewFile(this.props, this.state)})` }}
        >
        </div>
        <div className="message">
          <p className="secondary">
            <a data-id="remove"
              onClick={this.handleRemove}
              href="#"
            >
              Remove this image
            </a><br />
            or <span className="fake-link">Upload a new image</span>
          </p>
        </div>
      </div>
    );
  }

  renderFilePreview() {
    return (
      <div className="contents-icon-preview">
        <div
          className="message"
          data-id="preview"
        >
          <i className="manicon manicon-document" />
          <p className="primary">
            {this.previewFileName(this.props, this.state)}
          </p>
          <p className="secondary">
            <a
              onClick={this.handleRemove}
              href="#"
            >
              Remove this file
            </a><br />
            or <span className="fake-link">Upload a new file</span>
          </p>
        </div>
      </div>
    );
  }

  renderEmpty() {
    const { extensions } = this.accepts(this.props);
    return (
      <div className="contents-empty">
        <i className="manicon manicon-cloud-up" />
        <div className="message">
          <p className="primary">
            {'Upload a file or'}
            <br/>
            {'drag and drop here'}
            <br />
          </p>
          { extensions ?
            <p className="secondary">
              {extensions}
            </p>
            : null }
        </div>
      </div>
    );
  }

  renderBasedOnState() {
    const state = this.displayState(this.props, this.state);
    if (state === "image-preview") return this.renderImagePreview();
    if (state === "file-preview") return this.renderFilePreview();
    return this.renderEmpty();
  }

  render() {
    const labelClass = classnames({
      "has-instructions": isString(this.props.instructions)
    });
    const dropzoneProps = {};
    const { accepts } = this.accepts(this.props);
    if (accepts) dropzoneProps.accept = accepts;

    return (
      <div className="form-input">
        <GlobalForm.Errorable
          className="form-input"
          name={this.props.name}
          errors={this.props.errors}
          label={this.props.label}
        >
        <label className={labelClass}>{this.props.label}</label>
        {
          isString(this.props.instructions) ?
            <span className="instructions">{this.props.instructions}</span>
          : null
        }
          <Dropzone
            style={this.props.inlineStyle}
            className={`form-dropzone style-${this.props.style}`}
            activeStyle={{}}
            multiple={false}
            ref={"dropzone"}
            onDrop={this.handleFileDrop}
            {...dropzoneProps}
          >
            {this.renderBasedOnState()}
          </Dropzone>
        </GlobalForm.Errorable>
      </div>
    );
  }
}

export default setter(FormUpload);
