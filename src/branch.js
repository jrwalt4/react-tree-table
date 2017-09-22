define(['react'], function(React) {
  
  let create = React.createElement;
  
  return function Branch(props) {
    return create("tr", null,
      props.keys.map(function(key){
        return create("td", {key:key}, props.renderProperty(props.branch));
      })
    );
  }
  
});
