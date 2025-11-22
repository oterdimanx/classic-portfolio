// scripts/discover-dbs.js
const mongoose = require('mongoose');

const discoverDatabases = async () => {
  try {
    // Connect without specifying a database
    await mongoose.connect('mongodb+srv://olivier:2xAjDf4GyLcHbE20@portfolio.zdlasg3.mongodb.net');
    
    const adminDb = mongoose.connection.db.admin();
    const result = await adminDb.listDatabases();
    
    console.log('📊 Available databases:');
    result.databases.forEach(db => {
      console.log(`   - ${db.name} (size: ${db.sizeOnDisk} bytes)`);
    });
    
    await mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error);
  }
};

discoverDatabases();