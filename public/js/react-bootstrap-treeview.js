var TreeViewWrapper = React.createClass({displayName: "TreeViewWrapper",

    propTypes: {
        handleClick: React.PropTypes.func
    },

    childContextTypes: {
        handleClick: React.PropTypes.func
    },

    getChildContext: function () {
        return {
            handleClick: function (evt) {
                // Dev click listener defined
                if (this.props.handleClick != undefined) {
                    this.props.handleClick(jQuery.extend(true, {}, evt));
                }
            }.bind(this)
        }
    },

    render: function () {
        return (
            React.createElement("div", {id: "treeview", className: "treeview"}, 
                React.createElement(TreeView, React.__spread({},  this.props))
            )
        );
    }
});

var TreeView = React.createClass({displayName: "TreeView",

    contextTypes: {
        handleClick: React.PropTypes.func
    },

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
            onhoverColor: '#F5F5F5', // TODO Not implemented yet, investigate radium.js 'A toolchain for React component styling'
            selectedColor: '#FFFFFF',
            selectedBackColor: '#428bca',

            enableLinks: false,
            highlightSelected: true,
            showBorder: true,
            showTags: false,

            nodes: []
        }
    },

    setNodeId: function (node) {

        if (!node.nodes) return;

        node.nodes.forEach(function checkStates(node) {
            node.nodeId = this.props.nodes.length;
            this.props.nodes.push(node);
            this.setNodeId(node);
        }, this);
    },

    render: function () {

        this.setNodeId({nodes: data});

        var children = [];
        if (data) {
            var _this = this;
            data.forEach(function (node, index) {
                children.push(React.createElement(TreeNode, {node: node, 
                    level: 1, 
                    visible: true, 
                    options: _this.props, 
                    key: index}));
            });
        }

        return (
            React.createElement("ul", {className: "list-group"}, 
          children
            )
        );
    }
});


var TreeNode = React.createClass({displayName: "TreeNode",

    contextTypes: {
        handleClick: React.PropTypes.func
    },

    getInitialState: function () {
        var node = this.props.node;
        return {
            expanded: (node.state && node.state.hasOwnProperty('expanded')) ?
                node.state.expanded :
                (this.props.level < this.props.options.levels) ?
                    true :
                    false,
            selected: (node.state && node.state.hasOwnProperty('selected')) ?
                node.state.selected :
                false
        }
    },

    toggleExpanded: function (id, event) {
        this.setState({expanded: !this.state.expanded});
        event.stopPropagation();
    },

    toggleSelected: function (id, event) {
        this.setState({selected: !this.state.selected});
        event.stopPropagation();
    },

    handleClickTreeNode: function (nodeId, evt) {

        // SELECT LINE
        this.toggleSelected(nodeId, jQuery.extend(true, {}, evt));
        // DEV CLICK
        this.context.handleClick(jQuery.extend(true, {}, evt));
        evt.stopPropagation();
    },

    render: function () {

        var node = this.props.node;
        var options = this.props.options;

        var style;
        if (!this.props.visible) {

            style = {
                display: 'none'
            };
        }
        else {

            if (options.highlightSelected && this.state.selected) {
                style = {
                    color: options.selectedColor,
                    backgroundColor: options.selectedBackColor
                };
            }
            else {
                style = {
                    color: node.color || options.color,
                    backgroundColor: node.backColor || options.backColor
                };
            }

            if (!options.showBorder) {
                style.border = 'none';
            }
            else if (options.borderColor) {
                style.border = '1px solid ' + options.borderColor;
            }
        }

        var indents = [];
        for (var i = 0; i < this.props.level - 1; i++) {
            indents.push(React.createElement("span", {
                className: "indent", 
                key: i}));
        }

        var expandCollapseIcon;
        if (node.nodes) {
            if (!this.state.expanded) {
                expandCollapseIcon = (
                    React.createElement("span", {className: options.expandIcon, 
                        onClick: this.toggleExpanded.bind(this, node.nodeId)}
                    )
                );
            }
            else {
                expandCollapseIcon = (
                    React.createElement("span", {className: options.collapseIcon, 
                        onClick: this.toggleExpanded.bind(this, node.nodeId)}
                    )
                );
            }
        }
        else {
            expandCollapseIcon = (
                React.createElement("span", {className: options.emptyIcon})
            );
        }

        var nodeIcon = (
            React.createElement("span", {className: "icon"}, 
                React.createElement("i", {className: node.icon || options.nodeIcon})
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
            badges = node.tags.map(function (tag, index) {
                return (
                    React.createElement("span", {
                        className: "badge", 
                        key: index}, 
                    tag
                    )
                );
            });
        }

        var children = [];
        if (node.nodes) {
            node.nodes.forEach(function (node, index) {
                children.push(React.createElement(TreeNode, {node: node, 
                    level: this.props.level + 1, 
                    visible: this.state.expanded && this.props.visible, 
                    options: options, 
                    key: index}));
            }, this);
        }

        return (
            React.createElement("li", {className: "list-group-item", 
                style: style, 
                onClick: this.handleClickTreeNode.bind(this, node.nodeId), 
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