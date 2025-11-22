// scripts/backup.js
require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const backupDatabase = async () => {
  // Use your production MongoDB connection string
  const DB_URI = process.env.MONGODB_URI || 'mongodb+srv://xxx@xxx.mongodb.net/portfolio?retryWrites=true&w=majority';
  
  console.log('🔗 Connecting to production database...');

  try {
    console.log('🔗 Connecting to database...');
    await mongoose.connect(DB_URI);
    
    console.log('✅ Connected to production successfully!');
    console.log('📊 Database name:', "xxx");
    
    // Rest of your backup code remains the same...
    const collections = await mongoose.connection.db.collections();
    console.log(`📋 Found ${collections.length} collections`);
    
    const backupData = {
      metadata: {
        database: "xxx",
        backupDate: new Date().toISOString(),
        collections: []
      },
      data: {}
    };

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupDir = path.join(process.cwd(), 'backups');
    
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }

    console.log('📦 Starting backup process...');
    
    for (const collection of collections) {
      const collectionName = collection.collectionName;
      
      if (collectionName.startsWith('system.')) {
        console.log(`⏭️  Skipping system collection: ${collectionName}`);
        continue;
      }
      
      console.log(`📋 Backing up: ${collectionName}`);
      const documentCount = await collection.countDocuments();
      const data = await collection.find({}).toArray();
      backupData.data[collectionName] = data;
      backupData.metadata.collections.push({
        name: collectionName,
        documentCount: data.length,
        backedUpAt: new Date().toISOString()
      });
      
      console.log(`   ✅ Backed up ${data.length} documents`);
    }

    const backupFile = path.join(backupDir, `production-backup-${timestamp}.json`);
    fs.writeFileSync(backupFile, JSON.stringify(backupData, null, 2));
    
    console.log('\n🎉 PRODUCTION BACKUP COMPLETE!');
    console.log(`💾 File: ${backupFile}`);
    console.log(`📊 Collections backed up: ${backupData.metadata.collections.length}`);
    
    backupData.metadata.collections.forEach(col => {
      console.log(`   - ${col.name}: ${col.documentCount} documents`);
    });
    
    await mongoose.connection.close();
    
  } catch (error) {
    console.error('❌ Production backup failed:', error);
    process.exit(1);
  }
};

if (require.main === module) {
  backupDatabase();
}