import "dotenv/config";

const transporter = nodemailer.createTransport({
  port: 465,
  host: "smtp.gmail.com",
  auth: {
    user: process.env.GOOGLE_NODEMAILER_USER_EMAIL,
    pass: process.env.GOOGLE_NODEMAILER_APP_PASSWORD,
  },
  secure: true,
});

transporter.use(
  "compile",
  hbs({
    viewEngine: {
      extName: ".hbs",
      layoutsDir: "#views/layouts/",
      defaultLayout: "#views/layouts/main.layout.hbs",
    },
    extName: ".hbs",
    viewPath: "#views/pages/",
  }),
);

export default transporter;
