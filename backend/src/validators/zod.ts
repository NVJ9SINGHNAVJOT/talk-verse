import z from "zod";

// password
export const passwordSchema = z.string().min(8).max(20).regex(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*])$/);

// name
export const nameSchema = z.string().min(1).max(15).regex(/^[a-zA-Z]{2,}$/);
export const fancyNameSchema = z.string().min(3).max(15).regex(/^[a-zA-Z][a-zA-Z0-9_-]{2,}$/);

// email
export const emailSchema = z.string().regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/);

// otp
export const optSchema = z.string().length(6).regex(/^[0-9]{6}$/);

// category
export const categoriesSchema = z.enum(["Technology", "Lifestyle", "Blog", "Nature", "Music",
    "Sports", "Health", "Finance", "Art", "History",
    "Literature", "Science", "Business", "Other"]);