const corsOptions = {
  origin: `${process.env["ALLOWED_ORIGINS"]}`.split(",").map((origin) => origin.trim()),
  credentials: true,
  methods: ["PUT", "PATCH", "POST", "GET", "DELETE"],
};

export default corsOptions;
