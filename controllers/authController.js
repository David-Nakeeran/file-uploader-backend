import asyncHandler from "express-async-handler";

export const registerPost = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  //check if user exists

  // if user exists throw custom error 400

  //has password before saving

  //save user in database

  res
    .status(201)
    .json({ success: true, message: "User registered successfully" });
});
