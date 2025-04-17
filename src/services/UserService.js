const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/UserModel');

class UserService {
  static async registerUser(username, mailID, role, password, phoneno) {
    const existingUser = await User.findUserByEmail(mailID);
    if (existingUser) {
      throw new Error('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.createUser(username, mailID, role, hashedPassword, phoneno);
    return { message: "User registered successfully", status_code : 201 };
  }

  static async loginUser(mailID, password) {
    const user = await User.findUserByEmail(mailID);
    if (!user) {
      throw new Error('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    const token = jwt.sign(
      { userID: user.userID, role: user.role },
"205a5642bb6bf55d33aea32df5cd81e4618dc6ef12aa57e05644e9d577cf0443f1d712b757df81775429eb67ac7098aef98755c554fb1f2016d0b34b10ff421a50b2d6406964d093a036c4ce47ff244c9c968aed8619bcb8b5b5834e6aab7b987d43a3ec6935a003d9235c3120ddf813eaee43963fc40c5969043830922a9537c8a9185ef1d20c60747f45c79378deceb88dd1b5d20bf26e0be56313912bffe1625cb75e91c14935d1ac6b1e7cc14804cb7079bd88446c50612d4527c6d1ff64c866c8f997630d8b2a5684396328a36ae43d09b1a0b0bad35b5700e83a2fc6f593a5264f524017c5d3e32ad_"
,
      { expiresIn: '1h' }
    );

    return { message:"Login Successfull", status_code : 200,token, role: user.role, userID: user.userID };
  }
}

module.exports = UserService;
