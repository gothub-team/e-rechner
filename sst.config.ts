/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
    app(input) {
        return {
            name: 'e-rechner',
            removal: input?.stage === 'production' ? 'retain' : 'remove',
            home: 'aws',
        };
    },
    async run() {
        new sst.aws.SolidStart('ERechnerWeb', {
            domain:
                $app.stage === 'production' && process.env.DOMAIN_NAME
                    ? { name: process.env.DOMAIN_NAME, aliases: [`www.${process.env.DOMAIN_NAME}`] }
                    : undefined,
        });
    },
});
