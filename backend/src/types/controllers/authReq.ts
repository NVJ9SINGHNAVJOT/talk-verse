export type SignUpReq = {
    firstName: string,
    lastName: string,
    userName: string,
    email: string,
    otp: string,
    password: string,
    confirmPassword: string,
};

export type LogInReq = {
    email: string,
    password: string,
    confirmPassword: string,
};

export type SendOtpReq = {
    email: string
}