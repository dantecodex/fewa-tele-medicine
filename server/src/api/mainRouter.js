
import express from "express";

import authController from "../controller/auth.controller.js";
import userController from "../controller/user.controller.js";

import checkAuth from "../middleware/checkAuth.js";
import rateLimiter from "../utils/rateLimiter.js";

const apiRouter = express.Router();


apiRouter.route('/auth/signup').post(rateLimiter(10, '15min'), authController.signup);
apiRouter.route('/auth/login').post(rateLimiter(5, '10min'), authController.login);

apiRouter.use(checkAuth);


apiRouter.route('/user/profile')
    .get(userController.profile)
    .put(userController.updateProfile);

export default apiRouter;
