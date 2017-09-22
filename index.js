requirejs.config({
  baseUrl: '.',
  paths: {
    'react': 'vendor/react',
    'react-dom': 'vendor/react-dom'
  }
})
requirejs(['react','react-dom','src/tree'], function(React, ReactDOM, Tree) {
  var family = {
    name: 'Tom', age: 62,
    children: [
      {
        name: 'Matt', age:31,
        children: [
          {
            name: 'Lincoln', age:0.25
          },
          {
            name: 'Caroline', age:0.25
          }
        ]
      },
      {
        name:'Reese', age:28, 
        children:[{name:'Rory', age:10}]
      }
    ]
  };
  window.element = React.createElement(Tree, {
    root: family,
    keys: ['name', 'age'],
    getChildren: function(person) {return person.children},
    getKey: function(person) {return person.name}
  });

  window.domElement = ReactDOM.render(element, document.getElementById('root'));
});