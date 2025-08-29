import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

/**
 * GET /api/test/mongodb
 * Test MongoDB connection endpoint
 */
export async function GET(request: NextRequest) {
  try {
    console.log('Testing MongoDB connection...');
    console.log('MongoDB URI exists:', !!process.env.MONGODB_URI);
    
    const client = await clientPromise;
    const db = client.db();
    
    // Test basic database operation
    const result = await db.admin().ping();
    console.log('✅ Database ping successful:', result);
    
    // List collections to verify access
    const collections = await db.listCollections().toArray();
    console.log('📁 Available collections:', collections.map(c => c.name));
    
    return NextResponse.json({
      success: true,
      message: 'MongoDB connection successful',
      data: {
        ping: result,
        collections: collections.map(c => c.name)
      }
    });
    
  } catch (error: any) {
    console.error('❌ MongoDB connection failed:', error);
    
    let errorMessage = 'Database connection failed';
    let suggestions: string[] = [];
    
    if (error.code === 8000) {
      errorMessage = 'MongoDB Atlas authentication failed';
      suggestions = [
        'Verify username and password in MongoDB URI',
        'Check if the database user has proper permissions',
        'Ensure your IP address is whitelisted in MongoDB Atlas',
        'Verify the cluster is active and accessible'
      ];
    }
    
    return NextResponse.json({
      success: false,
      message: errorMessage,
      error: error.message || 'Unknown error occurred',
      suggestions,
      errorCode: error.code || 'UNKNOWN'
    }, { status: 500 });
  }
}
