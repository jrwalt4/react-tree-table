define([], function() {
  
  function DataTree(root) {
    this._root = root;
  }
  
  DataTree.from = function(data, getChildrenFn) {
    return buildTree(data, getChildrenFn);
  }
  
  function buildTree(data, getChildrenFn) {
    return (getChildrenFn(data) || []).reduce(function(branch, subData, i) {
      branch.addChild(buildTree(subData, getChildrenFn));
      return branch;
    }, new DataBranch(data));
  }
  
  function DataBranch(data) {
    this._data = data;
    this._parent = null;
    this._firstChild = null;
    this._previousSibling = null;
    this._nextSibling = null;
  }
  
  DataBranch.prototype.getData = function() {
    return this._data;
  }
  
  DataBranch.prototype.getFirstChild = function() {
    return this._firstChild;
  };
  
  DataBranch.prototype.getLastChild = function() {
    var child = this.getFirstChild();
    if (!child) {
      return null;
    }
    var nextChild = null;
    while(nextChild = child.getNextSibling()) {
      child = nextChild;
    }
    return child;
  };
  
  DataBranch.prototype.addChild = function(branch) {
    if(!this._firstChild) {
      this._firstChild = branch;
      branch._parent = this;
    } else {
      this.getLastChild().setNextSibling(branch);
    }
  };
  
  DataBranch.prototype.getParent = function() {
    return this._parent || (this._previousSibling && this._previousSibling.getParent()) || null;
  };
  
  DataBranch.prototype.getNextSibling = function() {
    return this._nextSibling;
  };
  
  DataBranch.prototype.setNextSibling = function(branch) {
    this._nextSibling = branch;
    branch._previousSibling = this;
  };
  
  DataBranch.prototype.getChildren = function() {
    if(!this._firstChild) {
      return [];
    }
    var currentChild = this._firstChild;
    var children = [currentChild];
    while(currentChild = currentChild.getNextSibling()) {
      children.push(currentChild);
    }
    return children;
  };
  
  return {
    DataTree: DataTree,
    DataBranch: DataBranch
  }
});
