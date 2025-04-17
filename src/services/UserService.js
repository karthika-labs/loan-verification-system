import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/UserModel.js';


const registerUser = async (username, mailID, role, password, phoneno) => {
  const existingUser = await User.findUserByEmail(mailID);
  if (existingUser) {
    throw new Error('Email already exists');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  await User.createUser(username, mailID, role, hashedPassword, phoneno);
  return { message: "User registered successfully", status_code: 201 };
};

const loginUser = async (mailID, password) => {
  const user = await User.findUserByEmail(mailID);
  
  if (!user) {
    throw new Error('Invalid email or password');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error('Invalid email or password');
  }
  console.log("User role from db:",user.role);
  // Create JWT token including user role and userID
  const token = jwt.sign(
    { 
      userID: user.userID, 
      role: user.role  // Send role in the token
    },
    "205a5642bb6bf55d33aea32df5cd81e4618dc6ef12aa57e05644e9d577cf0443f1d712b757df81775429eb67ac7098aef98755c554fb1f2016d0b34b10ff421a50b2d6406964d093a036c4ce47ff244c9c968aed8619bcb8b5b5834e6aab7b987d43a3ec6935a003d9235c3120ddf813eaee43963fc40c5969043830922a9537c8a9185ef1d20c60747f45c79378deceb88dd1b5d20bf26e0be56313912bffe1625cb75e91c14935d1ac6b1e7cc14804cb7079bd88446c50612d4527c6d1ff64c866c8f997630d8b2a5684396328a36ae43d09b1a0b0bad35b5700e83a2fc6f593a5264f524017c5d3e32ad_",  // Use environment variable for secret key
    { expiresIn: '1h' }
  );
  const decodedToken = jwt.verify(token, "205a5642bb6bf55d33aea32df5cd81e4618dc6ef12aa57e05644e9d577cf0443f1d712b757df81775429eb67ac7098aef98755c554fb1f2016d0b34b10ff421a50b2d6406964d093a036c4ce47ff244c9c968aed8619bcb8b5b5834e6aab7b987d43a3ec6935a003d9235c3120ddf813eaee43963fc40c5969043830922a9537c8a9185ef1d20c60747f45c79378deceb88dd1b5d20bf26e0be56313912bffe1625cb75e91c14935d1ac6b1e7cc14804cb7079bd88446c50612d4527c6d1ff64c866c8f997630d8b2a5684396328a36ae43d09b1a0b0bad35b5700e83a2fc6f593a5264f524017c5d3e32ad_");
  console.log("Decoded Token:", decodedToken);

  return { 
    message: "Login Successful", 
    status_code: 200, 
    token, 
    role: user.role, 
    userID: user.userID 
  };
};
// Export the functions
export { registerUser, loginUser };
