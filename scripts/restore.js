// scripts/restore.js
require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const restoreDatabase = async (backupFilePath) => {
  const DB_URI = process.env.MONGODB_URI;

  if (!backupFilePath) {
    console.error('❌ Please provide a backup file path');
    console.log('Usage: node scripts/restore.js <backup-file-path>');
    process.exit(1);
  }

  try {
    // Read backup file
    const backupData = JSON.parse(fs.readFileSync(backupFilePath, 'utf8'));
    
    console.log('🔗 Connecting to database...');
    await mongoose.connect(DB_URI);
    
    console.log('🔄 Starting restore process...');
    
    // Restore each collection
    for (const [collectionName, documents] of Object.entries(backupData.data)) {
      console.log(`📋 Restoring collection: ${collectionName}`);
      
      // Drop existing collection (optional - be careful!)
      // await mongoose.connection.db.collection(collectionName).drop();
      
      // Insert documents
      if (documents.length > 0) {
        await mongoose.connection.db.collection(collectionName).insertMany(documents);
        console.log(`   ✅ Restored ${documents.length} documents to ${collectionName}`);
      } else {
        console.log(`   ℹ️  No documents to restore for ${collectionName}`);
      }
    }
    
    console.log('✅ Restore completed successfully!');
    await mongoose.connection.close();
    
  } catch (error) {
    console.error('❌ Restore failed:', error);
    process.exit(1);
  }
};

// Get backup file from command line argument
const backupFile = process.argv[2];
if (require.main === module) {
  restoreDatabase(backupFile);
}

module.exports = { restoreDatabase };