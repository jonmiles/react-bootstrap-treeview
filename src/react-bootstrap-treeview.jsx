var React = require('react/addons');
var TreeView = React.createClass({

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

        data: React.PropTypes.arrayOf(React.PropTypes.object),
        onLineClicked: React.PropTypes.func,
        treeNodeAttributes: React.PropTypes.object //ex:{'data-id': a key in this.props.data}
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

            data: [],
            treeNodeAttributes: {}
        }
    },

    nodes: [],

    setNodeId: function (node) {

        if (!node.nodes) return;

        node.nodes.forEach(function checkStates(node) {
            node.nodeId = this.nodes.length;
            this.nodes.push(node);
            this.setNodeId(node);
        }, this);
    },

    handleLineClicked: function (evt) {
        if (this.props.onLineClicked !== undefined) {
            // CLONE EVT + CALLBACK DEV
            this.props.onLineClicked($.extend(true, {}, evt));
        }
    },

    render: function () {

        this.setNodeId({nodes: this.props.data});

        var children = [];
        if (this.props.data) {
            this.props.data.forEach(function (node, index) {
                children.push(<TreeNode node={node}
                    level={1}
                    visible={true}
                    options={this.props}
                    key={index}
                    onLineClicked={this.handleLineClicked}
                    attributes={this.props.treeNodeAttributes}/>);
            }.bind(this));
        }

        return (
            <div className='treeview'>
                <ul className='list-group'>
          {children}
                </ul>
            </div>
        );
    }
});

module.exports = TreeView;

var TreeNode = React.createClass({

    propTypes: {
        onLineClicked: React.PropTypes.func,
        attributes: React.PropTypes.object
    },

    getInitialState: function () {
        var node = this.props.node;
        return {
            expanded: (node.state && node.state.hasOwnProperty('expanded')) ?
                node.state.expanded :
                (this.props.level < this.props.options.levels),
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

    handleLineClicked: function (nodeId, evt) {

        // SELECT LINE
        this.toggleSelected(nodeId, $.extend(true, {}, evt));
        // DEV CLICK
        this.props.onLineClicked($.extend(true, {}, evt));
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
            indents.push(<span
                className='indent'
                key={i}></span>);
        }

        var attrs = {};
        if (this.props.attributes !== undefined) {
            for( var i in this.props.attributes) {
                if (node[this.props.attributes[i]] !== undefined) {
                    attrs[i] = node[this.props.attributes[i]];
                }
            };
        }

        var expandCollapseIcon;
        if (node.nodes) {
            if (!this.state.expanded) {
                expandCollapseIcon = (
                    <span className={options.expandIcon}
                        onClick={this.toggleExpanded.bind(this, node.nodeId)}>
                    </span>
                );
            }
            else {
                expandCollapseIcon = (
                    <span className={options.collapseIcon}
                        onClick={this.toggleExpanded.bind(this, node.nodeId)}>
                    </span>
                );
            }
        }
        else {
            expandCollapseIcon = (
                <span className={options.emptyIcon}></span>
            );
        }

        var nodeIcon = (
            <span className='icon'>
                <i className={node.icon || options.nodeIcon}></i>
            </span>
        );

        var nodeText;
        if (options.enableLinks) {
            nodeText = (
                <a href={node.href} /*style="color:inherit;"*/>
          {node.text}
                </a>
            );
        }
        else {
            nodeText = (
                <span>{node.text}</span>
            );
        }

        var badges;
        if (options.showTags && node.tags) {
            badges = node.tags.map(function (tag, index) {
                return (
                    <span
                        className='badge'
                        key={index}>
                    {tag}
                    </span>
                );
            });
        }

        var children = [];
        if (node.nodes) {
            node.nodes.forEach(function (node, index) {
                children.push(<TreeNode node={node}
                    level={this.props.level + 1}
                    visible={this.state.expanded && this.props.visible}
                    options={options}
                    key={index}
                    onLineClicked={this.props.onLineClicked}
                    attributes={this.props.attributes}/>);
            }, this);
        }

        return (
            <li className='list-group-item'
                style={style}
                onClick={this.handleLineClicked.bind(this, node.nodeId)}
                key={node.nodeId}
                {...attrs}>
            {indents}
            {expandCollapseIcon}
            {nodeIcon}
            {nodeText}
            {badges}
            {children}
            </li>
        );
    }
});
