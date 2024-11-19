import { Title } from '@solidjs/meta';
import Counter from '~/components/Counter';

export default function Home() {
    return (
        <main>
            <Title>E-Rechner</Title>
            <h1>E-Rechner</h1>
            <p>Das Standard Tool der Bundesrepublik Deutschland zum Erstellen und Lesen von E-Rechnungen.</p>
            <Counter />
        </main>
    );
}
