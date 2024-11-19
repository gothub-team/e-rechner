import { Title } from '@solidjs/meta';
import { HttpStatusCode } from '@solidjs/start';

export default function NotFound() {
    return (
        <main>
            <Title>Nicht Gefunden!</Title>
            <HttpStatusCode code={404} />
            <h1>Nicht Gefunden!</h1>
        </main>
    );
}
