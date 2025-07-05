import bcryptjs from "bcryptjs";
import {errorHandler} from '../utils/error.js';
import User from '../models/user.model.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

export const test = (req,res)=>{
    res.json({message: 'API is Working!'});
};

export const uploadImage = async(req,res,next)=>{
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = '../uploads/'; // Ensure this directory exists
    // Create the directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const userId = req.params.userId;
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, userId + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
});

}

export const updateUser = async(req,res,next)=>{
    // 1. Authorization check
    if (req.user.id !== req.params.userId) {
        return next(errorHandler(403, 'You are not allowed to update this user'));
    }

    // Initialize the 'updates' object to dynamically build the $set payload
    const updates = {};

    // 2. Password validation and hashing
    if (req.body.password) {
        if (req.body.password.length < 6) {
            return next(errorHandler(400, 'Password must be at least 6 characters'));
        }
        updates.password = bcryptjs.hashSync(req.body.password, 10);
    }

    // 3. Profile Picture update
    // This expects req.body.profilePicture to be the URL (e.g., from Cloudinary)
    if (req.body.profilePicture) {
        // Optional: Add URL validation here if you want to ensure it's a valid URL format
        updates.profilePicture = req.body.profilePicture;
    }

    // 4. Username validation
    if (req.body.username) {
        if (req.body.username.length < 7 || req.body.username.length > 20) {
            return next(errorHandler(400, 'Username must be between 7 and 20 characters'));
        }
        if (req.body.username.includes(' ')) {
            return next(errorHandler(400, 'Username cannot contain spaces'));
        }
        if (req.body.username !== req.body.username.toLowerCase()) {
            return next(errorHandler(400, 'Username must be lowercase'));
        }
        if (!req.body.username.match(/^[a-zA-Z0-9]+$/)) {
            return next(errorHandler(400, 'Username can only contain letters and numbers'));
        }
        updates.username = req.body.username;
    }

    // 5. Email update (add validation if needed)
    if (req.body.email) {
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(req.body.email)) {
            return next(errorHandler(400, 'Invalid email format'));
        }
        updates.email = req.body.email;
    }

    // 6. Check if there's anything to update
    // This check now correctly uses the populated 'updates' object
    if (Object.keys(updates).length === 0) {
        return next(errorHandler(400, 'No fields provided for update.'));
    }

    // 7. Perform the database update
    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.params.userId,
            { $set: updates }, // Use the dynamically built 'updates' object here
            { new: true, runValidators: true } // 'new:true' returns updated doc, 'runValidators' applies schema validators
        );

        // 8. Destructure and send response (remove password for security)
        const { password, ...rest } = updatedUser._doc;
        res.status(200).json(rest);
    } catch (error) {
        next(error); // Pass error to your global error handler
    }
        
    
}

export const deleteUser=async(req,res,next)=>{
    if(req.user.id !== req.params.userId){
        return next(errorHandler(403, 'You are not allowed to delete this user'));
    }
    try {
        await User.findByIdAndDelete(req.params.userId);
        res.status(200).json('User has been deleted');
    } catch (error) {
        next(error);
    }
}

export const signout = (req,res,next)=>{
    try {
        res
        .clearCookie('access_token')
        .status(200)
        .json('User has been signed out');
    } catch (error) {
        next(error);
    }
}