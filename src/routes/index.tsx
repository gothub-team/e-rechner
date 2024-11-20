import { Title } from '@solidjs/meta';
import { XRechnung } from '../components/XRechnung';

export default function Home() {
    return (
        <main>
            <Title>E-Rechner</Title>
            <h1>E-Rechner</h1>
            <p>Das Standard Tool der Bundesrepublik Deutschland zum Erstellen und Lesen von E-Rechnungen.</p>
            <div class="flex flex-col items-center">
                <div class="container max-w-[1000px]">
                    <XRechnung />
                </div>
            </div>
        </main>
    );
}
