export type SendRequestBody = {
    reqUserId: string,
};

export type AcceptRequestBody = {
    acceptUserId: string,
};

export type SetUnseenCountBody = {
    mainId: string,
    count: number,
}