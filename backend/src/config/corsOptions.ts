const corsOptions = {
  origin: ["http://localhost:5173 ", "http://localhost:4173"],
  credentials: true,
  methods: ["PUT", "PATCH", "POST", "GET", "DELETE"],
};

export default corsOptions;
