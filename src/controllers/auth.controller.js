import express from "express";
import Workspace from "../models/workspace.model.js";
import User from "../models/user.model.js";
import { v4 as uuidv4 } from "uuid";
import { websocket } from "../setup.websocket.js";
import { verifyPassword } from '../utils/crypt.js'
import { generateOtp } from '../utils/opt.js'
import { buildSession } from '../services/authService.js'
import jwt from 'jsonwebtoken'

// TODO: mejorar el tema de los tokens

const router = express.Router();

router.post(`/login`, async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(422).json({ status: false, message: 'email or password not sended' })
      return;
    }

    // validating user existence
    const user = await User.findOne({ email: email })

    if (!user) {
      res.status(422).json({ status: false, message: 'user not exist' })
      return;
    }

    // validacion de contraseña
    const isPasswordCorrect = verifyPassword(password, user.password)
    if (!isPasswordCorrect) {
      res.status(422).json({ status: false, message: 'incorrect password' })
      return;
    }

    // armar sesion
    const token = await buildSession({
      userId: user.id
    })

    res.status(200).json({
      status: true,
      data: {
        token: token
      }
    })

  } catch (ex) {
    res.status(500).json({
      status: false,
      message: ex.message
    })
  }
})

router.post("/verify", async (req, res) => {
  try {
    const { otp, userId } = req.body;

    const user = await User.findOne({
      id: userId
    });

    if (!user) {
      return res.status(404).json({
        status: false,
        message: "User not exist"
      });
    }

    if (user.isVerified) {
      return res.status(409).json({
        status: false,
        message: "User already verified"
      });
    }

    if (user.otpValidationCode !== otp.trim()) {
      return res.status(422).json({
        status: false,
        message: "OTP not valid"
      });
    }

    user.isVerified = true;
    // user.otpValidationCode = null;

    await user.save();

    // armar session
    const token = await buildSession({
      userId: user.id
    })

    return res.status(200).json({
      status: true,
      message: "User verified successfully",
      data: {
        id: user.id,
        email: user.email,
        isVerified: user.isVerified,
        token: token
      }
    });

  } catch (ex) {
    return res.status(500).json({
      status: false,
      message: ex.message
    });
  }
});

router.post(`/register`, async (req, res) => {
  try {
    const { fullname, email, password, username } = req.body;

    const exists = await User.findOne({ email });

    if (exists) {
      return res.status(400).json({
        message: "Email already exists"
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = User.create({
      email,
      password: passwordHash,
      fullname,
      id: uuidv4(),
      username,
      optValidationCode: generateOtp(),
      status: 1, // active,
      validationOptDate: new Date().toISOString(),
      isVerified: false
    });

    await user.save()

    const token = await buildSession({
      userId: user.id
    })

    res.status(201).json({
      status: true,
      data: {
        token: token
      }
    });

  } catch (ex) {
    res.status(500).json({
      status: false,
      message: ex.message
    })
  }
})

//TODO: forget password

export default router;