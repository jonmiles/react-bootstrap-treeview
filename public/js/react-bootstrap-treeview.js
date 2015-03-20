var Tree = React.createClass({displayName: "Tree",

  propTypes: {
    levels: React.PropTypes.number,

    expandIcon: React.PropTypes.string,
    collapseIcon: React.PropTypes.string,
    emptyIcon: React.PropTypes.string,
    nodeIcon: React.PropTypes.string,

    color: React.PropTypes.string,
    backColor: React.PropTypes.string,
    borderColor: React.PropTypes.string,
    onhoverColor: React.PropTypes.string,
    selectedColor: React.PropTypes.string,
    selectedBackColor: React.PropTypes.string,

    enableLinks: React.PropTypes.bool,
    highlightSelected: React.PropTypes.bool,
    showBorder: React.PropTypes.bool,
    showTags: React.PropTypes.bool,

    nodes: React.PropTypes.arrayOf(React.PropTypes.number)
  },

  getDefaultProps: function () {
    return {
      levels: 2,

      expandIcon: 'glyphicon glyphicon-plus',
      collapseIcon: 'glyphicon glyphicon-minus',
      emptyIcon: 'glyphicon',
      nodeIcon: 'glyphicon glyphicon-stop',

      color: undefined,
      backColor: undefined,
      borderColor: undefined,
      onhoverColor: '#F5F5F5',
      selectedColor: '#FFFFFF',
      selectedBackColor: '#428bca',

      enableLinks: false,
      highlightSelected: true,
      showBorder: true,
      showTags: false,

      nodes: []
    }
  },

  setNodeId: function(node) {

    if (!node.nodes) return;

    var _this = this;
    $.each(node.nodes, function checkStates(index, node) {
      node.nodeId = _this.props.nodes.length;
      _this.props.nodes.push(node);
      _this.setNodeId(node);
    });
  },

  render: function() {

    this.setNodeId({ nodes: data });

    var children = [];
    if (data) {
      data.forEach($.proxy(function (node) {
        children.push(React.createElement(TreeNode, {node: node, 
                                level: 1, 
                                visible: true, 
                                options: this.props}));
      }, this));
    }

    return (
      React.createElement("div", {id: "treeview", className: "treeview"}, 
        React.createElement("ul", {className: "list-group"}, 
          children
        )
      )
    );
  }
});


var TreeNode = React.createClass({displayName: "TreeNode",

  getInitialState: function() {
    var node = this.props.node;
    return {
      expanded: (node.states && node.states.hasOwnProperty('expanded')) ?
                  node.states.expanded :
                    (this.props.level < this.props.options.levels) ?
                      true :
                      false,
      selected: (node.states && node.states.hasOwnProperty('selected')) ? 
                  node.states.selected :
                  false
    }
  },

  toggleExpanded: function(id, event) {
    this.setState({ expanded: !this.state.expanded });
    event.stopPropagation();
  },

  toggleSelected: function(id, event) {
    this.setState({ selected: !this.state.selected });
    event.stopPropagation();
  },

  render: function() {

    var node = this.props.node;
    var options = this.props.options;

    var style;
    if (!this.props.visible) {
      style = { 
        display: 'none' 
      }
    }
    else if (options.highlightSelected && this.state.selected) {
      style = {
        color: options.selectedColor,
        backgroundColor: options.selectedBackColor
      }
    }
    else {
      style = {
        color: options.color,
        backgroundColor: options.backColor
      }
    }

    var indents = [];
    for (var i = 0; i < this.props.level-1; i++) {
      indents.push(React.createElement("span", {className: "indent"}));
    }

    var expandCollapseIcon;
    if (node.nodes) {
      if (!this.state.expanded) {
        expandCollapseIcon = (
          React.createElement("span", {className: "expand-collapse click-expand", 
                onClick: this.toggleExpanded.bind(this, node.nodeId)}, 
            React.createElement("i", {className: options.expandIcon})
          )
        );
      }
      else {
        expandCollapseIcon = (
          React.createElement("span", {className: "expand-collapse click-collapse", 
                onClick: this.toggleExpanded.bind(this, node.nodeId)}, 
            React.createElement("i", {className: options.collapseIcon})
          )
        );
      }
    }
    else {
      expandCollapseIcon = (
        React.createElement("span", {className: "expand-collapse"}, 
          React.createElement("i", {className: options.emptyIcon})
        )
      );
    }

    var nodeIcon = (
      React.createElement("span", {className: "icon"}, 
        React.createElement("i", {className: options.nodeIcon})
      )
    );

    var nodeText;
    if (options.enableLinks) {
      nodeText = (
        React.createElement("a", {href: node.href/*style="color:inherit;"*/}, 
          node.text
        )
      );
    }
    else {
      nodeText = (
        React.createElement("span", null, node.text)
      );
    }

    var badges;
    if (options.showTags && node.tags) {
      badges = node.tags.map(function (tag) {
        return (
          React.createElement("span", {className: "badge"}, tag)
        );
      });
    }

    var children = [];
    if (node.nodes) {
      node.nodes.forEach($.proxy(function (node) {
        children.push(React.createElement(TreeNode, {node: node, 
                                level: this.props.level+1, 
                                visible: this.state.expanded && this.props.visible, 
                                options: options}));
      }, this));
    }

    return (
      React.createElement("li", {className: "list-group-item", 
          style: style, 
          onClick: this.toggleSelected.bind(this, node.nodeId), 
          key: node.nodeId}, 
        indents, 
        expandCollapseIcon, 
        nodeIcon, 
        nodeText, 
        badges, 
        children
      )
    );
  }
});