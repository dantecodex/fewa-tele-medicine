// import Joi from "joi";
// import ValidationHelper from "../utils/validationHelper.js";

// const setDoctorAvailability = new ValidationHelper({
//     data: Joi.array()
//         .items(
//             Joi.object({
//                 weekday: Joi.string()
//                     .valid('SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY')
//                     .required(),
//                 setTime: Joi.date().iso().required(),
//                 endTime: Joi.date().iso().required(),
//                 isOnline: Joi.boolean().valid(true),
//                 isOffline: Joi.boolean().valid(true)
//             }).xor("isOnline", "isOffline") // Ensures one of isOnline or isOffline is true, not both
//         )
//         .required()
//         .min(1) // Optionally, ensure that there is at least one availability in the array
// });

// export default {
//     setDoctorAvailability
// };

import Joi from "joi"
import ValidationHelper from "../utils/validationHelper.js"

const setDoctorAvailability = new ValidationHelper(
  Joi.array()
    .items({
      weekday: Joi.string()
        .valid("SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY")
        .required(),
      startTime: Joi.date().iso().required(),
      endTime: Joi.date().iso().required(),
      mode: Joi.string().valid("ONLINE", "OFFLINE"),
    })
    .required()
    .min(1)
)

export default {
  setDoctorAvailability,
}
