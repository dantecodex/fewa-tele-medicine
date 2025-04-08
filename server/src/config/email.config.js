const emailConfig = {
  HOST: process.env.EMAIL_HOST,
  PORT: process.env.EMAIL_PORT,
  USER: process.env.EMAIL_USER,
  PASSWORD: process.env.EMAIL_PASS,
  FROM: process.env.EMAIL_FROM
}

export default emailConfig
