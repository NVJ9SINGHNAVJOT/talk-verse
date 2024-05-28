export function isEmail(email: string): boolean {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
}

export function isUserName(username: string): boolean {
    const usernameRegex = /^[a-zA-Z][a-zA-Z0-9_-]{2,}$/;
    return usernameRegex.test(username);
}

export function isName(name: string): boolean {
    const nameRegex = /^[a-zA-Z]{2,}$/;
    return nameRegex.test(name);
}

export function isPassword(password: string, confirmPassword?: string): boolean {
    if (confirmPassword && password !== confirmPassword) {
        return false;
    }

    // Check length
    if (password.length < 8 || password.length > 20) {
        return false;
    }

    // Check for at least one uppercase letter
    if (!/[A-Z]/.test(password)) {
        return false;
    }
    // Check for at least one lowercase letter
    if (!/[a-z]/.test(password)) {
        return false;
    }

    // Check for at least one digit
    if (!/\d/.test(password)) {
        return false;
    }

    // Check for at least one special symbol
    if (!/[!@#$%^&*]/.test(password)) {
        return false;
    }
    return true;
}

const categories = ["Technology", "Lifestyle", "Blog", "Nature", "Music",
    "Sports", "Health", "Finance", "Art", "History",
    "Literature", "Science", "Business", "Other"];

export function isCategory(category: string): boolean {
    return categories.includes(category);
}
