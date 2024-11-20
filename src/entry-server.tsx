// @refresh reload
import { createHandler, StartServer } from '@solidjs/start/server';

export default createHandler(() => (
    <StartServer
        document={({ assets, children, scripts }) => (
            <html lang="en">
                <head>
                    <meta charset="utf-8" />
                    <meta name="viewport" content="width=device-width, initial-scale=1" />
                    <link rel="icon" href="/favicon.ico" />
                    {assets}
                </head>
                <body class="bg-stone-100 font-montserrat">
                    <div
                        id="app"
                        style={{
                            'background-color': 'transparent',
                            'background-image':
                                'radial-gradient(transparent 1px, var(--token-f32baa44-90b8-42a5-8bca-ffba9d95b23a, #ffffff) 1px)',
                            'background-size': '4px 4px',
                            // mask: ' linear-gradient(rgb(0, 0, 0) 60%, rgba(0, 0, 0, 0) 100%)',
                            opacity: 1,
                        }}
                    >
                        {children}
                    </div>
                    {scripts}
                </body>
            </html>
        )}
    />
));
