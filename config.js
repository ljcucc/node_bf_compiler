System.config({
  paths:{
    'npm_web:':'https://unpkg.com/',
    "npm:":"./node_modules/"
  },
  packages: {
    ".":{
      main: './src/app.js',
      defaultExtension: 'js'
    }
  },
  map:{
    "jquery": "npm_web:jquery@3.3.1"
  }
});

System.import('./src/index.js')
  .catch(console.error.bind(console)); //The script that for index.html
System.import('./src/app.js')
  .catch(console.error.bind(console)); //The script that access to compiler