const propTypes = require("prop-types");
const React = require("react");
const ReactDOM = require("react-dom");
const { styled } = require("styletron-react");
const Modal = require("./modal");
const View = require("./view");
const $ = React.createElement;

const Root = styled("div", {
  position: "relative",
  width: "100%",
  height: "100%",
  padding: 0,
  margin: 0,
  display: "flex"
});

const LeftPanel = styled("div", {
  width: "300px",
  height: "100%"
});

const Pane = styled("div", {
  flex: 1,
  position: "relative"
});

const PaneInner = styled("div", {
  position: "absolute",
  left: 0,
  top: 0,
  bottom: 0,
  right: 0
});

const BackgroundTip = styled("div", {
  fontFamily: "sans-serif",
  height: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center"
});

class Workspace extends React.Component {
  constructor() {
    super();
    this.didKeyDown = this.didKeyDown.bind(this);
  }

  render() {
    let modal;
    if (this.props.modal) {
      modal = $(Modal, null, $(View, { id: this.props.modal }));
    }

    let leftPanel;
    if (this.props.left_panel) {
      leftPanel = $(LeftPanel, null, $(View, { id: this.props.left_panel }));
    }

    let centerItem;
    if (this.props.center_pane) {
      centerItem = $(View, { id: this.props.center_pane });
    } else if (this.context.inBrowser) {
      centerItem = $(BackgroundTip, {}, "Press Ctrl-T to browse files");
    }

    return $(
      Root,
      {
        tabIndex: -1,
        onKeyDownCapture: this.didKeyDown
      },
      leftPanel,
      $(Pane, null, $(PaneInner, null, centerItem)),
      modal
    );
  }

  componentDidMount() {
    ReactDOM.findDOMNode(this).focus();
  }

  didKeyDown(event) {
    if (event.metaKey || event.ctrlKey) {
      if (event.key === "t") {
        this.props.dispatch({ type: "ToggleFileFinder" });
        event.stopPropagation();
      } else if (event.key === "s") {
        this.props.dispatch({ type: "SaveActiveBuffer" });
        event.stopPropagation();
      }
    }
  }
}

Workspace.contextTypes = {
  inBrowser: propTypes.bool
};

module.exports = Workspace;
