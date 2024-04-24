export type SignUpBody = {
    firstName: string,
    lastName: string,
    userName: string,
    email: string,
    password: string,
    confirmPassword: string,
};

export type LogInBody = {
    email: string,
    password: string,
    confirmPassword: string,
};