export default () => ({
  APP_PORT: parseInt(process.env.PORT),
  HASH_PASS_DIGIT: parseInt(process.env.HASH_PASS_DIGIT),
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXP_D: process.env.JWT_EXP_D,
  JWT_EXP_H: process.env.JWT_EXP_H,
});
