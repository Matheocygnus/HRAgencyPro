import { hashPassword } from '../server/auth';
import { storage } from '../server/storage';

async function updatePassword() {
  try {
    // Find the user
    const user = await storage.getUserByUsername('brunov@catalystgrowthsystems.com');
    if (!user) {
      console.error('User not found!');
      return;
    }
    
    console.log('Found user:', user.id, user.username);
    
    // Hash the new password
    const hashedPassword = await hashPassword('AAbb+1234');
    
    // Update the user's password
    const updatedUser = await storage.updateUser(user.id, { password: hashedPassword });
    
    if (updatedUser) {
      console.log('Password updated successfully!');
    } else {
      console.error('Failed to update password');
    }
  } catch (error) {
    console.error('Error updating password:', error);
  }
}

updatePassword();