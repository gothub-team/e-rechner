import { MetaProvider, Title } from '@solidjs/meta';
import { Router } from '@solidjs/router';
import { FileRoutes } from '@solidjs/start/router';
import { Suspense } from 'solid-js';
import './index.css';

export default function App() {
    return (
        <Router
            root={(props) => (
                <MetaProvider>
                    <Title>E-Rechner</Title>
                    <div
                        class="fixed flex h-36 w-full flex-col items-center"
                        data-framer-name="Mask Pattern"
                        style={{
                            'background-color': 'transparent',
                            'background-image':
                                'radial-gradient(transparent 1px, var(--token-f32baa44-90b8-42a5-8bca-ffba9d95b23a, #ffffff) 1px)',
                            'background-size': '4px 4px',
                            'backdrop-filter': ' blur(3px)',
                            mask: ' linear-gradient(rgb(0, 0, 0) 60%, rgba(0, 0, 0, 0) 100%)',
                            opacity: 1,
                        }}
                    >
                        <div class="container flex max-w-[1000px] flex-row items-center gap-12 text-2xl drop-shadow-[0_0_3px__rgba(255,255,255,1)]">
                            <a class="my-8 flex items-center" href="/">
                                Index
                            </a>
                            <a class="m-4 flex items-center" href="/about">
                                Über E-Rechner
                            </a>
                        </div>
                    </div>
                    <Suspense>{props.children}</Suspense>
                </MetaProvider>
            )}
        >
            <FileRoutes />
        </Router>
    );
}
