define(['react','src/branch'], function(React, Branch) {
  
  let create = React.createElement;

  function defaultGetChildren(obj) {
    return obj.children;
  }
  
  return function Tree(props) {
    var getChildren = props.getChildren || defaultGetChildren;
    var keys = props.keys || Object.keys(props.root);
    return create("div", 
      {
        className: "Table"
      },
      create("div",
        {
          className: "Header"
        },
        keys.map(
          function(key, i) {
            return create("span", 
              {
                key:key,
                className: "Col Col-"+(i+1)
              }, 
              key);
            }
          )
        ),
      create("div",
        {
          className: "Body"
        }, create(Branch, {
            branch: props.root,
            keys: keys,
            key: 'root',
            branchKey: 'root',
            renderProperty: props.renderProperty,
            getChildren: getChildren
          })
        ),
      create("div",
        {
          className: "Footer"
        }, create("span", null, "Footer"))
    );
  };

});