import { Title } from '@solidjs/meta';
import { XRechnung } from '../components/XRechnung';

export default function Home() {
    return (
        <main>
            <Title>E-Rechner</Title>
            <div class="flex flex-col items-center">
                <div class="container mb-12 max-w-[1000px]">
                    <div class="mt-24 flex flex-row items-start gap-12">
                        <div class="flex flex-col gap-4">
                            <h1 class="text-6xl">E-Rechner</h1>
                            <p class="text-2xl italic">
                                Das Standard-Tool für Deutschland zur Erstellung offizieller E-Rechnungen.
                            </p>
                            <p class="text-lg">
                                E-Rechner ist ein einfaches Werkzeug zur Erstellung rechtssicherer E-Rechnungen. Die
                                Verarbeitung ist kostenlos und erfolgt vollständig lokal auf Ihrem Computer – keine
                                Datenübertragung, keine Speicherung auf externen Servern.
                            </p>
                        </div>
                        <img src="Logo.svg" width={300} />
                    </div>
                    <XRechnung />
                </div>
            </div>
        </main>
    );
}
