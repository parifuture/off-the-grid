const path = require('path');

const config = {
    // server details
    server: {
      host: 'localhost',
      port: '3000',
    },
    csvFilePath: path.resolve(__dirname,'../data/OffTheGridData.csv')
};
  
module.exports = config;
  