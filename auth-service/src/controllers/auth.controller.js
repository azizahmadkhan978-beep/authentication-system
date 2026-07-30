const bcrypt = require("bcryptjs");

const {
  findUserByEmail,
  findRoleByName,
  createUser,
} = require("../repositories/user.repository");

const {
  generateAccessToken,
} = require("../services/token.service");

async function register(req, res, next) {
  try {
    const { name, email, password, role = "viewer" } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email, and password are required",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        message: "Password must contain at least 8 characters",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedRole = role.trim().toLowerCase();

    const existingUser = await findUserByEmail(normalizedEmail);

    if (existingUser) {
      return res.status(409).json({
        message: "A user with this email already exists",
      });
    }

    const selectedRole = await findRoleByName(normalizedRole);

    if (!selectedRole) {
      return res.status(400).json({
        message: "Invalid role",
      });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await createUser({
      name: name.trim(),
      email: normalizedEmail,
      passwordHash,
      roleId: selectedRole.id,
    });

    return res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: selectedRole.name,
        createdAt: user.created_at,
      },
    });
  } catch (error) {
    next(error);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const user = await findUserByEmail(normalizedEmail);

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const passwordMatches = await bcrypt.compare(
      password,
      user.password_hash
    );

    if (!passwordMatches) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const accessToken = generateAccessToken(user);

    return res.status(200).json({
      message: "Login successful",
      accessToken,
      tokenType: "Bearer",
      expiresIn: process.env.JWT_EXPIRES_IN || "1h",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  register,
  login,
};