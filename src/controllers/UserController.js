const UserService = require('../services/UserService');

const registerUser = async (req, res) => {
  try {
    const { username, mailID, role, password, phoneno } = req.body;
    if (!username || !mailID || !role || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }
    const response = await UserService.registerUser(username, mailID, role, password, phoneno);
    res.status(201).json(response);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { mailID, password } = req.body;
    if (!mailID || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }
    const response = await UserService.loginUser(mailID, password);
    res.status(200).json(response);
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

module.exports = { registerUser, loginUser };
