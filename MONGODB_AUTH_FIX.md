# MongoDB Atlas Authentication Error - Troubleshooting Guide

## Current Error
```
[MongoServerError: bad auth : authentication failed]
Error Code: 8000 (AtlasError)
```

## Step-by-Step Solution

### 1. Verify Database User Credentials
Go to your MongoDB Atlas dashboard:
1. **Login to MongoDB Atlas**: https://cloud.mongodb.com/
2. **Navigate to Database Access** (left sidebar)
3. **Check if user `Rajanya` exists**
4. **Verify the password is exactly**: `synaptix19251411620924`

### 2. Create/Update Database User (if needed)
If the user doesn't exist or password is wrong:
1. Click **"Add New Database User"** or **Edit** existing user
2. **Username**: `Rajanya`
3. **Password**: `synaptix19251411620924`
4. **Database User Privileges**: 
   - Choose **"Read and write to any database"** 
   - Or grant **"readWrite"** role to **"synaptix"** database specifically

### 3. Whitelist Your IP Address
1. Go to **"Network Access"** (left sidebar)
2. Click **"Add IP Address"**
3. **Option A**: Click **"Add Current IP Address"** (recommended for development)
4. **Option B**: Add **"0.0.0.0/0"** (allows access from anywhere - less secure)
5. Click **"Confirm"**

### 4. Verify Cluster Status
1. Go to **"Database"** (left sidebar)
2. Ensure your cluster **"SynaptixCluster"** is **"Active"** (green status)
3. If it shows **"Paused"**, click **"Resume"**

### 5. Test Connection String
After making the above changes, try this updated connection string format:

**Option 1** (Current format):
```
mongodb+srv://Rajanya:synaptix19251411620924@synaptixcluster.rvmby1e.mongodb.net/?retryWrites=true&w=majority&appName=SynaptixCluster
```

**Option 2** (With database specified):
```
mongodb+srv://Rajanya:synaptix19251411620924@synaptixcluster.rvmby1e.mongodb.net/synaptix?retryWrites=true&w=majority&appName=SynaptixCluster
```

**Option 3** (URL-encoded password - if password contains special characters):
```
mongodb+srv://Rajanya:synaptix19251411620924@synaptixcluster.rvmby1e.mongodb.net/?retryWrites=true&w=majority&appName=SynaptixCluster
```

### 6. Common Issues & Solutions

**Issue**: Password contains special characters
**Solution**: URL encode the password or use a simpler password

**Issue**: User has limited permissions
**Solution**: Grant "readWrite" permission to the "synaptix" database

**Issue**: IP not whitelisted
**Solution**: Add your current IP or 0.0.0.0/0 to Network Access

**Issue**: Cluster is paused
**Solution**: Resume the cluster from the Atlas dashboard

### 7. Next Steps
1. Make the changes in MongoDB Atlas dashboard
2. Wait 1-2 minutes for changes to propagate
3. Restart your development server: `bun dev`
4. Test the connection: Visit `http://localhost:3001/api/test/mongodb`

### 8. Alternative: Create New Database User
If issues persist, create a completely new user:
1. **Username**: `synaptix_user`
2. **Password**: `password123` (simple password for testing)
3. **Permissions**: Read and write to any database
4. Update `.env.local`:
```
MONGODB_URI=mongodb+srv://synaptix_user:password123@synaptixcluster.rvmby1e.mongodb.net/?retryWrites=true&w=majority&appName=SynaptixCluster
```

---

**After completing these steps, the authentication error should be resolved.**
