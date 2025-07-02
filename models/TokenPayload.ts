export interface TokenPayload{
    username: string,
    sub: number,
    roles: string[],
    permissions: string[],
    iat: number,
    exp: number
}