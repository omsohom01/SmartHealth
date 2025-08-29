// Test MongoDB Connection
import { getDatabase } from '../lib/mongodb.js';

async function testConnection() {
  try {
    console.log('Testing MongoDB connection...');
    const db = await getDatabase();
    console.log('✅ Successfully connected to MongoDB!');
    
    // Test basic database operation
    const result = await db.admin().ping();
    console.log('✅ Database ping successful:', result);
    
    // List collections to verify access
    const collections = await db.listCollections().toArray();
    console.log('📁 Available collections:', collections.map(c => c.name));
    
    process.exit(0);
  } catch (error) {
    console.error('❌ MongoDB connection failed:');
    console.error('Error details:', error);
    
    if (error.code === 8000) {
      console.error('\n🔑 Authentication Error Solutions:');
      console.error('1. Verify username and password in MongoDB URI');
      console.error('2. Check if the database user has proper permissions');
      console.error('3. Ensure your IP address is whitelisted in MongoDB Atlas');
      console.error('4. Verify the cluster is active and accessible');
    }
    
    process.exit(1);
  }
}

testConnection();
