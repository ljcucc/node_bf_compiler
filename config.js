System.config({
  packages: {
    ".":{
      main: './app.js',
      defaultExtension: 'js'
    }
  }
});

// System.import('./main')
//   .catch(console.error.bind(console));

System.import('./app.js')
  .catch(console.error.bind(console));
