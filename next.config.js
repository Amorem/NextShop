// must restart server whenever you make changes in next.config
module.exports = {
  env: {
    MONGO_SRV:
      "mongodb+srv://amorem:Foforum@cluster0-a8boz.mongodb.net/test?retryWrites=true&w=majority",
    JWT_SECRET: "zddcsvzvvoejpojfzecoihezfoiscd",
    CLOUDINARY_URL: "https://api.cloudinary.com/v1_1/amorem/image/upload",
    STRIPE_SECRET_KEY: "sk_test_DiKwkQDvx2eURpCX0thg5TDc"
  }
};
