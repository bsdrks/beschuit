export interface Credentials {
    username: string;
    password: string;
}

/**
 * Parse the authorization header.
 * @param header 
 * @returns 
 */
export const parseAuthorizationHeader = (header: string | undefined): Credentials => {
    if (typeof header === 'string') {
        const split = header.split(' ');
        
        if (split.length === 2 && split[0] === 'Basic' && typeof split[1] === 'string') {
            const buff = Buffer.from(split[1], 'base64');
            const [username, password] = buff.toString('utf8').split(':');

            if (typeof username === 'string' && typeof password === 'string') {
                return { username, password };
            }
        }
    }

    throw new Error('Authorization header is invalid.');
};
