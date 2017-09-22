define(['react', 'src/util-array', 'src/util-tree'], function(React, util, treeUtil) {
  
  let create = React.createElement;

  let _super = React.Component;
  
  function Tree(props) {
    _super.call(this, props);
    this.state = {
      hideChildren:{}
    };
    let _this = this;
    this.toggleBranch = function(branchKey) {
      _this.setState(function(prevState){
        let prevHideChildren = prevState.hideChildren;
        let revision = {};
        revision[branchKey] = !prevHideChildren[branchKey];
        return {
          hideChildren: Object.assign({}, prevHideChildren, revision)
        };
      });
    }
  }
  
  Tree.defaultProps = {
    renderProperty: function(branch, key) {
      return create("span", null, branch[key]);
    }
  };
  
  Tree.prototype = Object.create(_super.prototype);
  
  Tree.prototype.getKeys = function() {
    return this.props.keys || Object.keys(this.props.root);
  };
  
  Tree.prototype.getDataTree = function() {
    return treeUtil.DataTree.from(this.props.root, this.props.getChildren);
  };
  
  Tree.prototype.getBranches = function() {
    let branches = this.reduceTree();
    return branches.map(this.renderBranch, this);
  };
  
  Tree.prototype.reduceTree = function() {
    let branches = [];
    let next = this.getDataTree();
    while(next) {
      branches.push(next);
      let doRenderChildren = !this.state.hideChildren[this.props.getKey(next.getData())];
      var parent = null;
      next = (doRenderChildren && next.getFirstChild()) ||
        next.getNextSibling() ||
        ((parent = next.getParent()) && parent.getNextSibling());
    }
    return branches;
  };
  
  Tree.prototype.renderBranch = function(branch) {
    let _this = this;
    let branchKey = this.props.getKey(branch.getData());
    return create("tr",
      {
        key: branchKey,
        onDoubleClick: function(ev) {
          _this.toggleBranch(branchKey)
        }
      },
      this.getKeys().map(function(propertyKey, i) {
        return create(
          "td", 
          {key: propertyKey,
          style: i === 0 ? {paddingLeft: branch.getDepth()+"em"} : undefined}, 
          i === 0 ? _this.getDisclosureTriangle(branch) : null,
          _this.props.renderProperty(branch.getData(), propertyKey)
        );
      })
    );
  };
  
  Tree.prototype.getDisclosureTriangle = function(branch) {
    if(!branch.getFirstChild()) {
      return null;
    }
    var branchKey = this.props.getKey(branch.getData());
    var cssClass = this.state.hideChildren[branchKey] ? "fa fa-caret-right" : "fa fa-caret-down";
    var _this = this;
    return create("span", 
      {
        className: cssClass,
        onClick: function(){_this.toggleBranch(branchKey)}
      }
    );
  }
  
  Tree.prototype.render = function() {
    let props = this.props;
    var keys = this.getKeys();
    return create("table", 
      {
      },
      create("thead",
        {
        },
        create("tr",null,
          keys.map(
            function(key, i) {
              return create("th", 
                {
                  key:key
                }, 
                key
                );
              }
            )
        )
      ),
      create("tfoot", 
        null,
        create("tr", null, 
          create("td", {colSpan:keys.length}, "Footer")
        )
      ),
      create("tbody",null, 
        this.getBranches()
      )
    );
  };
  return Tree;
});