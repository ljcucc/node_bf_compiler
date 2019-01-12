System.config({
  packages: {
    ".":{
      main: './index.js',
      defaultExtension: 'js'
    }
  }
});

// System.import('./main')
//   .catch(console.error.bind(console));

System.import('./index.js')
  .catch(console.error.bind(console));
