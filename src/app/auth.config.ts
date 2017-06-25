interface AuthConfiguration {
    // clientID: string,
    // domain: string,
    bypassRole: boolean; // Functional only during dev mode
    roleAs: string; // Set a value 'ADMIN' or 'VOLUNTEER' or 'ORGANIZATION'
}
// If a developer wants to override the role set for the id he/she is logged on
// then, set 'bypassRole' to true and set the 'roleAs' accordingly
export const myConfig: AuthConfiguration = {
    // clientID: '332DZAQiUiXAXYYKvzJy6EodylS2rze5',   // DO NOT CHANGE
    // domain: 'c4sg.auth0.com',                       // DO NOT CHANGE
    bypassRole: false,
    roleAs: 'VOLUNTEER'
};
