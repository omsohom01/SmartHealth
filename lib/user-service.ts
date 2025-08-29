import { getDatabase } from '@/lib/mongodb';
import { User, UserRegistrationData, UserLoginData, ApiResponse } from '@/lib/types';
import { hashPassword, comparePassword, validateEmail, validatePassword } from '@/lib/auth-utils';
import { ObjectId } from 'mongodb';

export class UserService {
  private static readonly COLLECTION_NAME = 'users';

  /**
   * Create a new user account
   */
  static async createUser(userData: UserRegistrationData): Promise<ApiResponse<Partial<User>>> {
    try {
      const db = await getDatabase();
      const usersCollection = db.collection<User>(this.COLLECTION_NAME);

      // Validate input data
      const validation = this.validateUserData(userData);
      if (!validation.isValid) {
        return {
          success: false,
          message: 'Validation failed',
          error: validation.errors.join(', ')
        };
      }

      // Check if user already exists
      const existingUser = await usersCollection.findOne({ email: userData.email.toLowerCase() });
      if (existingUser) {
        return {
          success: false,
          message: 'User already exists',
          error: 'An account with this email address already exists'
        };
      }

      // Hash password
      const hashedPassword = await hashPassword(userData.password);

      // Create user document
      const newUser: Omit<User, '_id'> = {
        name: userData.name.trim(),
        email: userData.email.toLowerCase(),
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // Insert user into database
      const result = await usersCollection.insertOne(newUser);

      // Return user data without password
      const { password, ...userWithoutPassword } = newUser;
      return {
        success: true,
        message: 'User created successfully',
        data: {
          _id: result.insertedId,
          ...userWithoutPassword
        }
      };
    } catch (error) {
      console.error('Error creating user:', error);
      return {
        success: false,
        message: 'Failed to create user',
        error: 'Internal server error'
      };
    }
  }

  /**
   * Authenticate user login
   */
  static async authenticateUser(loginData: UserLoginData): Promise<ApiResponse<Partial<User>>> {
    try {
      const db = await getDatabase();
      const usersCollection = db.collection<User>(this.COLLECTION_NAME);

      // Validate email format
      if (!validateEmail(loginData.email)) {
        return {
          success: false,
          message: 'Invalid email format',
          error: 'Please provide a valid email address'
        };
      }

      // Find user by email
      const user = await usersCollection.findOne({ email: loginData.email.toLowerCase() });
      if (!user) {
        return {
          success: false,
          message: 'Invalid credentials',
          error: 'Email or password is incorrect'
        };
      }

      // Compare password
      const isPasswordValid = await comparePassword(loginData.password, user.password);
      if (!isPasswordValid) {
        return {
          success: false,
          message: 'Invalid credentials',
          error: 'Email or password is incorrect'
        };
      }

      // Update last login time
      await usersCollection.updateOne(
        { _id: user._id },
        {
          $set: {
            updatedAt: new Date()
          }
        }
      );

      // Return user data without password
      const { password, ...userWithoutPassword } = user;
      return {
        success: true,
        message: 'Authentication successful',
        data: userWithoutPassword
      };
    } catch (error) {
      console.error('Error authenticating user:', error);
      return {
        success: false,
        message: 'Authentication failed',
        error: 'Internal server error'
      };
    }
  }

  /**
   * Get user by ID
   */
  static async getUserById(userId: string): Promise<User | null> {
    try {
      const db = await getDatabase();
      const usersCollection = db.collection<User>(this.COLLECTION_NAME);
      const user = await usersCollection.findOne({ _id: new ObjectId(userId) });
      return user;
    } catch (error) {
      console.error('Error getting user by ID:', error);
      return null;
    }
  }

  /**
   * Get user by email
   */
  static async getUserByEmail(email: string): Promise<User | null> {
    try {
      const db = await getDatabase();
      const usersCollection = db.collection<User>(this.COLLECTION_NAME);
      const user = await usersCollection.findOne({ email: email.toLowerCase() });
      return user;
    } catch (error) {
      console.error('Error getting user by email:', error);
      return null;
    }
  }

  /**
   * Validate user data
   */
  private static validateUserData(userData: UserRegistrationData): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Validate name
    if (!userData.name || userData.name.trim().length < 2) {
      errors.push('Name must be at least 2 characters long');
    }

    // Validate email
    if (!userData.email || !validateEmail(userData.email)) {
      errors.push('Valid email address is required');
    }

    // Validate password
    const passwordValidation = validatePassword(userData.password);
    if (!passwordValidation.isValid) {
      errors.push(...passwordValidation.messages);
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}
