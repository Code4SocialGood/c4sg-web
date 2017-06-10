// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
    production: false,
    backend_url: 'http://localhost:8080',
    //auth_clientID: '332DZAQiUiXAXYYKvzJy6EodylS2rze5',
    //auth_domain: 'c4sg.auth0.com'
    auth_clientID: 'J1BEcuAH11iilNBPX2n3TrCL4HWoL3NO',   //jek
    auth_domain: 'jekcosty.auth0.com',
    AWS_ACCESS_KEY_ID: 'AKIAJCZUH6MBDLYBK5CQ',
    AWS_SECRET_ACCESS_KEY: '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',
    AWS_IMAGE_BUCKET: 'dev.c4sg.images',
    AWS_DOCS_BUCKET: 'dev.c4sg.docs',
    AWS_REGION: 'us-west-2',
    AWS_SIGNATURE_VERSION: 'v4'    
};
