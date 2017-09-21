define(['react'], function(React) {
  
  let create = React.createElement, Component = React.Component;
  let _super = Component;
  function Branch(props) {
    _super.call(this, props);
    this.state = {
      hideChildren: props.initialHide
    };
    let _this = this;
    this.toggle = function() {
      _this.setState(function(prevState) {
        return {hideChildren: !prevState.hideChildren}
      });
    };
  }
  Branch.prototype = Object.create(_super.prototype);
  Branch.prototype.getCaretClassName = function() {
    return "fa " + (this.state.hideChildren ? "fa-caret-right" : "fa-caret-down");
  };
    
  Branch.prototype.getDisclosureTriangle = function() {
    return create("span", {
      className: "Triangle "+this.getCaretClassName(),
      onClick: this.toggle
    });
  };
    
  Branch.prototype.renderBranch = function() {
    var hasChildren = (this.props.getChildren(this.props.branch) || []).length > 0;
    var _this = this;
    return create("div",
      {
        className: "Leaf",
        onDoubleClick: this.toggle
      },
      this.props.keys.map(
        function (key, i) {
          return create("div", 
            {className: "Col Col-"+(i+1), key: key},
            (i === 0 && hasChildren ? _this.getDisclosureTriangle() : null),
            _this.props.renderProperty(_this.props.branch,key)
          );
        }
      )
    );
  };
  
  Branch.prototype.renderChildren = function() {
    var key = this.props.branchKey;
    var children = this.props.getChildren(this.props.branch) || [];
    var _this = this;
    return children.map(
      function(child, i){
        var branchKey = key+'.'+(i+1);
        return create(Branch, {
          branch: child,
          keys: _this.props.keys,
          key: branchKey,
          branchKey: branchKey,
          renderProperty: _this.props.renderProperty,
          getChildren: _this.props.getChildren,
          hidden: _this.state.hideChildren
        });
      }
    );
  };
  
  Branch.prototype.render = function() {
    return create("div",
      {
        className: "Branch"+(this.props.hidden ? " Hidden" : ""),
        key: this.props.branchKey
      },
      this.renderBranch(),
      this.renderChildren()
    );
  };
  
  Branch.defaultProps = {
    initialHide: false,
    renderProperty: function (branch, key) { return create("span",{className:"Cell", key:key},branch[key])}
  };
  
  return Branch;
  
});