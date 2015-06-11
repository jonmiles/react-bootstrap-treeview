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
        isSelectionExclusive: React.PropTypes.bool,
        underlineLeafOnly: React.PropTypes.bool,
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
            emptyIcon: '',
            nodeIcon: 'glyphicon glyphicon-stop',

            color: undefined,
            backColor: undefined,
            borderColor: undefined,
            onhoverColor: '#F5F5F5', // TODO Not implemented yet, investigate radium.js 'A toolchain for React component styling'
            selectedColor: '#FFFFFF',
            selectedBackColor: '#428bca',
            classText: '',

            enableLinks: false,
            highlightSelected: true,
            isSelectionExclusive: false,
            underlineLeafOnly: false,
            showBorder: true,
            showTags: false,

            data: [],
            treeNodeAttributes: {}
        }
    },

    nodes: [],
    nodesSelected: {},

    getInitialState: function () {
        this.setNodeId({nodes: this.props.data});

        return {nodesSelected: this.nodesSelected};
    },

    setNodeId: function (node) {

        if (!node.nodes) return;

        node.nodes.forEach(function checkStates(node) {
            node.nodeId = this.nodes.length;
            this.nodesSelected[node.nodeId] = false;
            this.nodes.push(node);
            this.setNodeId(node);
        }, this);
    },

    /**
     * Line clicked from TreeNode
     * @param nodeId: node ID
     * @param evt: event
     */
    handleLineClicked: function (nodeId, evt) {
        if (this.props.onLineClicked !== undefined) {
            // CLONE EVT + CALLBACK DEV
            this.props.onLineClicked($.extend(true, {}, evt));
        }

        var matrice = this.state.nodesSelected;
        // Exclusive selection
        if (this.props.isSelectionExclusive) {
            // Unselection
            for (var i in matrice) {
                matrice[i] = false;
            }
        }
        // TOGGLE SELECTION OF CURRENT NODE
        matrice[nodeId] = !this.state.nodesSelected[nodeId];

        this.setState({nodesSelected: matrice});
    },

    render: function () {

        var children = [];
        if (this.props.data) {
            this.props.data.forEach(function (node, index) {

                // SELECTION
                node.selected = (this.state.nodesSelected[node.nodeId]);

                children.push(
                    <TreeNode
                        node={node}
                        level={1}
                        visible={true}
                        options={this.props}
                        key={node.nodeId}
                        onLineClicked={this.handleLineClicked}
                        attributes={this.props.treeNodeAttributes}
                        nodesSelected={this.state.nodesSelected} />);
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
        node: React.PropTypes.object.isRequired,
        onLineClicked: React.PropTypes.func,
        attributes: React.PropTypes.object,
        nodesSelected: React.PropTypes.object.isRequired,
        options: React.PropTypes.object
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

    componentWillUpdate: function (np, ns) {
        ns.selected = np.node.selected;

    },

    toggleExpanded: function (id, event) {
        this.setState({expanded: !this.state.expanded});
        event.stopPropagation();
    },

    toggleSelected: function (id, event) {
        // Exclusive selection
        if (!this.props.isSelectionExclusive) {
            this.setState({selected: !this.state.selected});
        }
        event.stopPropagation();
    },

    handleLineClicked: function (nodeId, evt) {

        // SELECT LINE
        this.toggleSelected(nodeId, $.extend(true, {}, evt));
        // DEV CLICK
        this.props.onLineClicked(nodeId, $.extend(true, {}, evt));
        evt.stopPropagation();
    },

    render: function () {

        var node = this.props.node;
        var options = this.props.options;

        // Noeud invisible
        var style;
        if (!this.props.visible) {
            style = {
                display: 'none'
            };
        }
        // Noeud visible
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

        // Indentation
        var indents = [];
        for (var i = 0; i < this.props.level - 1; i++) {
            indents.push(<span
                className='indent'
                key={i}></span>);
        }

        // Custom attributes
        var attrs = {};
        if (this.props.attributes !== undefined) {
            for (var i in this.props.attributes) {
                if (node[this.props.attributes[i]] !== undefined) {
                    attrs[i] = node[this.props.attributes[i]];
                }
            }
            ;
        }

        var expandCollapseIcon;
        // There are children
        if (node.nodes) {
            // Collapse
            if (!this.state.expanded) {
                expandCollapseIcon = (
                    <span className="icon plusmoins">
                        <i className = {options.expandIcon}
                            onClick={this.toggleExpanded.bind(this, node.nodeId)}>
                        </i>
                    </span>
                );
            }
            // Expanded
            else {
                expandCollapseIcon = (
                    <span className="icon">
                        <i className={options.collapseIcon}
                            onClick={this.toggleExpanded.bind(this, node.nodeId)}/>
                    </span>
                );
            }
        }
        else {
            expandCollapseIcon = (
                <span className={options.emptyIcon}></span>
            );
        }

        // Icon (if no nodes children)
        var nodeIcon = '';
        if (options.nodeIcon !== '' && !node.nodes) {
            nodeIcon = (
                <span className='icon'>
                    <i className={node.icon || options.nodeIcon}></i>
                </span>
            );
        }

        var badges = '';
        if (options.showTags) {
            // If tags are defined in the data
            if (node.tags) {
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
            // No tags in data => number of children
            else {
                // Children exist
                if(node.nodes) {
                    badges = (
                        <span
                            className='badge'>
                        {node.nodes.length}
                        </span>
                    );
                }
            }
        }

        var nodeText;
        if (options.enableLinks) {
            nodeText = (
                <span
                    className = {options.classText}>
                    <a href={node.href} /*style="color:inherit;"*/>
                        {node.text}
                    </a>
                </span>
            );
        }
        else {
            nodeText = (
            <span
                className = {options.classText}>
                {node.text}
            </span>
            );
        }

        var children = [];
        if (node.nodes) {
            node.nodes.forEach(function (node, index) {
                // SELECTION
                node.selected = (this.props.nodesSelected[node.nodeId]);
                children.push(
                    <TreeNode
                        node={node}
                        level={this.props.level + 1}
                        visible={this.state.expanded && this.props.visible}
                        options={options}
                        key={node.nodeId}
                        onLineClicked={this.props.onLineClicked}
                        attributes={this.props.attributes}
                        nodesSelected={this.props.nodesSelected} />);
            }, this);
        }

        return (
            <li className='list-group-item'
                style={style}
                onClick={this.handleLineClicked.bind(this, node.nodeId)}
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
