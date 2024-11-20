import { MetaProvider, Title } from '@solidjs/meta';
import { Router } from '@solidjs/router';
import { FileRoutes } from '@solidjs/start/router';
import { Suspense } from 'solid-js';
import './app.css';
import './index.css';

export default function App() {
    return (
        <Router
            root={(props) => (
                <MetaProvider>
                    <Title>E-Rechner</Title>
                    <a href="/">Index</a>
                    <a href="/about">Über E-Rechner</a>
                    <Suspense>{props.children}</Suspense>
                </MetaProvider>
            )}
        >
            <FileRoutes />
        </Router>
    );
}
