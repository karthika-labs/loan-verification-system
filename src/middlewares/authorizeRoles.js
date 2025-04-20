// middlewares/authorizeRoles.js

export const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
      const userRole = req.user?.role;
      console.log(`User Role: ${userRole}`); 
  
      if (!userRole || !allowedRoles.includes(userRole)) {
        return res.status(403).json({ message: "Access denied. Insufficient permissions." });
      }
  
      next();
    };
  };
  