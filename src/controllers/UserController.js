import { registerUser as registerUserService, loginUser as loginUserService } from '../services/UserService.js';

const registerUser = async (req, res) => {
  try {
    const { username, mailID, role, password, phoneno } = req.body;
    if (!username || !mailID || !role || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }
    const response = await registerUserService(username, mailID, role, password, phoneno);
    res.status(response.status_code).json(response);
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
    const response = await loginUserService(mailID, password);
    res.status(response.status_code).json(response);
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

// ✅ Export both functions (no default export)
export { registerUser, loginUser };
