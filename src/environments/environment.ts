// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
    production: false,
    backend_url: 'http://localhost:8080',
    auth_clientID: 'EIefKrM2FEELy4E66NJ9uJ4QPvjU0LOO',
    auth_domain: 'c4sg-local.auth0.com',
    auth_tenant_shared: false,
    auth_api: 'https://c4sg-api',
    auth_callback_env: 'local',
    auth_silenturl: 'silent-dev-local.html',
    AWS_IMAGE_BUCKET: 'c4sg.dev.images',
    AWS_DOCS_BUCKET: 'c4sg.dev.docs',
    AWS_REGION: 'us-west-2',
    AWS_SIGNATURE_VERSION: 'v4'
};
