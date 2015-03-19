var Tree = React.createClass({

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
    }
  },

  build: function (nodes, level) {
    if (nodes) {
      var _this = this;
      return nodes.map(function (node) {
        return (
          <TreeNode node={node} 
                    level={level} 
                    options={_this.props} 
                    build={_this.build} />
        );
      });
    }
  },

  render: function() {
    return (
      <div id='treeview' className='treeview'>
        <ul className='list-group'>
          {this.build(data, 0)}
        </ul>
      </div>
    );
  }
});


var TreeNode = React.createClass({

  getInitialState: function() {
    return {
      expanded: (this.props.node.states && this.props.node.states.hasOwnProperty('expanded')) ?
                  this.props.node.states.expanded :
                    (this.props.level < this.props.options.levels) ?
                      true :
                      false,
      selected: (this.props.node.states && this.props.node.states.hasOwnProperty('selected')) ? 
                  this.props.node.states.selected :
                  false
    }
  },

  render: function() {

    var indents = [];
    for (var i = 0; i < this.props.level; i++) {
      indents.push(<span className='indent'></span>);
    }

    var expandCollapseIcon;
    if (this.props.node.nodes) {
      if (!this.state.expanded) {
        expandCollapseIcon = (
          <span className="expand-collapse click-expand">
            <i className={this.props.options.expandIcon}></i>
          </span>
        );
      }
      else {
        expandCollapseIcon = (
          <span className="expand-collapse click-collapse">
            <i className={this.props.options.collapseIcon}></i>
          </span>
        );
      }
    }
    else {
      expandCollapseIcon = (
        <span className="expand-collapse">
          <i className={this.props.options.emptyIcon}></i>
        </span>
      );
    }

    var nodeIcon = (
      <span className='icon'>
        <i className={this.props.options.nodeIcon}></i>
      </span>
    );

    var nodeText;
    if (this.props.options.enableLinks) {
      nodeText = (
        <a href={this.props.node.href} /*style="color:inherit;"*/>
          {this.props.node.text}
        </a>
      );
    }
    else {
      nodeText = (
        <span>{this.props.node.text}</span>
      );
    }

    var badges;
    if (this.props.options.showTags && this.props.node.tags) {
      badges = this.props.node.tags.map(function (tag) {
        return (
          <span className='badge'>{tag}</span>
        );
      });
    }

    var children;
    if (this.props.node.nodes && this.state.expanded) {
      children = this.props.build(this.props.node.nodes, this.props.level+1);
    }

    var style = {
      color: this.props.options.color,
      backColor: this.props.options.backColor
    };

    return (
      <li className='list-group-item' style={style}>
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