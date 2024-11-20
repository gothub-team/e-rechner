import { Component, createSignal, For } from 'solid-js';
import { createStore } from 'solid-js/store';
import { create } from 'xmlbuilder2';
import { Input } from './Input';
import { CurrencyInput, Euro } from './CurrencyInput';

export const XRechnung: Component = () => {
    const [formData, setFormData] = createStore({
        invoiceNumber: '2025-00001',
        issueDate: new Date().toISOString().substring(0, 10),
        dueDate: '2024-11-30',
        currencyCode: 'EUR',
        buyerReference: '500001',
        supplier: {
            name: 'Muster GmbH',
            id: 'muster@gmbh.de',
            streetName: 'Musterstraße 1',
            cityName: 'Musterstadt',
            postalZone: '12345',
            country: 'DE',
            vatNumber: 'DE 1234123',
            registrationNumber: 'HRB123123',
            legalForm: '123/456/7890, HRA-Eintrag in […]',
            contact: {
                name: 'Max Mustermann',
                phone: '019123123',
                email: 'm.mustermann@gmbh.de',
            },
        },
        customer: {
            name: 'Kunden Gmbh',
            id: 'info@kunde.de',
            streetName: 'Kundenstr. 15',
            cityName: 'Kundenstadt',
            postalZone: '23456',
            country: 'DE',
        },
        items: [
            { number: '1', description: 'Eine Sache', quantity: 1, unitPrice: 50 },
            { number: '2', description: 'Andere Sache', quantity: 2, unitPrice: 25 },
        ],
        paymentMeans: {
            paymentMeansCode: '58',
            payeeFinancialAccount: {
                name: 'Muster GmbH',
                id: 'DE75512108001245126199',
                financialInstitutionBranch: 'Musterbank AG',
            },
            paymentTerms: 'Zahlbar sofort ohne Abzug.',
        },
    });

    const [xmlOutput, setXmlOutput] = createSignal<string | null>(null);

    const getTaxExclusiveAmount = () =>
        formData.items.map((item) => item.quantity * item.unitPrice).reduce((a, b) => a + b, 0);

    const handleInputChange = (path: string, value: unknown) => {
        console.log(path, typeof value, value);
        const keys: unknown[] = path.split('.');
        keys.push(value);
        // @ts-ignore
        setFormData(...keys);
    };

    const addItem = () => {
        setFormData('items', [
            ...formData.items,
            {
                number: '',
                description: '',
                quantity: 1,
                unitPrice: 0,
            },
        ]);
    };

    const removeItem = (index: number) => {
        setFormData(
            'items',
            formData.items.filter((_, i) => i !== index),
        );
    };

    const generateXml = () => {
        const invoice = create()
            .ele('ubl:Invoice', {
                'xmlns:ubl': 'urn:oasis:names:specification:ubl:schema:xsd:Invoice-2',
                'xmlns:cac': 'urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2',
                'xmlns:cbc': 'urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2',
            })
            .ele('cbc:CustomizationID')
            .txt('urn:cen.eu:en16931:2017#compliant#urn:xeinkauf.de:kosit:xrechnung_3.0')
            .up()
            .ele('cbc:ProfileID')
            .txt('urn:fdc:peppol.eu:2017:poacc:billing:01:1.0')
            .up()
            .ele('cbc:ID')
            .txt(formData.invoiceNumber)
            .up()
            .ele('cbc:IssueDate')
            .txt(formData.issueDate)
            .up()
            .ele('cbc:DueDate')
            .txt(formData.dueDate)
            .up()
            .ele('cbc:InvoiceTypeCode')
            .txt('380')
            .up()
            .ele('cbc:DocumentCurrencyCode')
            .txt(formData.currencyCode)
            .up()
            .ele('cbc:BuyerReference')
            .txt(formData.buyerReference)
            .up();

        // Supplier Party
        const accountingSupplierParty = invoice
            .ele('cac:AccountingSupplierParty')
            .ele('cac:Party')
            .ele('cbc:EndpointID')
            .att('schemeID', 'EM')
            .txt(formData.supplier.id)
            .up()
            .ele('cac:PartyName')
            .ele('cbc:Name')
            .txt(formData.supplier.name)
            .up()
            .up()
            .ele('cac:PostalAddress')
            .ele('cbc:StreetName')
            .txt(formData.supplier.streetName)
            .up()
            .ele('cbc:CityName')
            .txt(formData.supplier.cityName)
            .up()
            .ele('cbc:PostalZone')
            .txt(formData.supplier.postalZone)
            .up()
            .ele('cac:Country')
            .ele('cbc:IdentificationCode')
            .txt(formData.supplier.country)
            .up()
            .up()
            .up()
            .ele('cac:PartyTaxScheme')
            .ele('cbc:CompanyID')
            .txt(formData.supplier.vatNumber)
            .up()
            .ele('cac:TaxScheme')
            .ele('cbc:ID')
            .txt('VAT')
            .up()
            .up()
            .up()
            .ele('cac:PartyLegalEntity')
            .ele('cbc:RegistrationName')
            .txt(formData.supplier.name)
            .up()
            .ele('cbc:CompanyID')
            .txt(formData.supplier.registrationNumber)
            .up()
            .ele('cbc:CompanyLegalForm')
            .txt(formData.supplier.legalForm)
            .up()
            .up()
            .ele('cac:Contact')
            .ele('cbc:Name')
            .txt(formData.supplier.contact.name)
            .up()
            .ele('cbc:Telephone')
            .txt(formData.supplier.contact.phone)
            .up()
            .ele('cbc:ElectronicMail')
            .txt(formData.supplier.contact.email)
            .up()
            .up()
            .up()
            .up();
        // Customer Party
        const accountingCustomerParty = invoice
            .ele('cac:AccountingCustomerParty')
            .ele('cac:Party')
            .ele('cbc:EndpointID', { schemeID: 'EM' })
            .txt(formData.customer.id)
            .up()
            .ele('cac:PartyIdentification')
            .ele('cbc:ID')
            .txt(formData.customer.name)
            .up()
            .up()
            .ele('cac:PostalAddress')
            .ele('cbc:StreetName')
            .txt(formData.customer.streetName)
            .up()
            .ele('cbc:CityName')
            .txt(formData.customer.cityName)
            .up()
            .ele('cbc:PostalZone')
            .txt(formData.customer.postalZone)
            .up()
            .ele('cac:Country')
            .ele('cbc:IdentificationCode')
            .txt(formData.customer.country)
            .up()
            .up()
            .up()
            .ele('cac:PartyLegalEntity')
            .ele('cbc:RegistrationName')
            .txt(formData.customer.name)
            .up()
            .up()
            .up()
            .up();

        // Payment Means
        const paymentMeans = invoice
            .ele('cac:PaymentMeans')
            .ele('cbc:PaymentMeansCode')
            .txt(formData.paymentMeans.paymentMeansCode)
            .up()
            .ele('cac:PayeeFinancialAccount')
            .ele('cbc:ID')
            .txt(formData.paymentMeans.payeeFinancialAccount.id)
            .up()
            .ele('cbc:Name')
            .txt(formData.paymentMeans.payeeFinancialAccount.name)
            .up()
            .ele('cac:FinancialInstitutionBranch')
            .ele('cbc:ID')
            .txt(formData.paymentMeans.payeeFinancialAccount.financialInstitutionBranch)
            .up()
            .up()
            .up()
            .up();

        const paymentTerms = invoice
            .ele('cac:PaymentTerms')
            .ele('cbc:Note')
            .txt(formData.paymentMeans.paymentTerms)
            .up()
            .up();

        const taxExclusiveAmount = getTaxExclusiveAmount();

        const taxTotal = invoice
            .ele('cac:TaxTotal')
            .ele('cbc:TaxAmount', { currencyID: formData.currencyCode })
            .txt((taxExclusiveAmount * 0.19).toFixed(2))
            .up()
            .ele('cac:TaxSubtotal')
            .ele('cbc:TaxableAmount', { currencyID: formData.currencyCode })
            .txt(taxExclusiveAmount.toFixed(2))
            .up()
            .ele('cbc:TaxAmount', { currencyID: formData.currencyCode })
            .txt((taxExclusiveAmount * 0.19).toFixed(2))
            .up()
            .ele('cac:TaxCategory')
            .ele('cbc:ID')
            .txt('S')
            .up()
            .ele('cbc:Percent')
            .txt('19')
            .up()
            .ele('cac:TaxScheme')
            .ele('cbc:ID')
            .txt('VAT')
            .up()
            .up()
            .up()
            .up()
            .up();

        // Legal Monetary Total
        invoice
            .ele('cac:LegalMonetaryTotal')
            .ele('cbc:LineExtensionAmount', { currencyID: formData.currencyCode })
            .txt(taxExclusiveAmount.toFixed(2))
            .up()
            .ele('cbc:TaxExclusiveAmount', { currencyID: formData.currencyCode })
            .txt(taxExclusiveAmount.toFixed(2))
            .up()
            .ele('cbc:TaxInclusiveAmount', { currencyID: formData.currencyCode })
            .txt((taxExclusiveAmount * 1.19).toFixed(2))
            .up()
            .ele('cbc:PayableAmount', { currencyID: formData.currencyCode })
            .txt((taxExclusiveAmount * 1.19).toFixed(2))
            .up()
            .up();

        // Invoice Lines
        formData.items.forEach((item, index) => {
            invoice
                .ele('cac:InvoiceLine')
                .ele('cbc:ID')
                .txt(item.description)
                .up()
                .ele('cbc:InvoicedQuantity', { unitCode: 'XPP' })
                .txt(item.quantity.toString())
                .up()
                .ele('cbc:LineExtensionAmount', { currencyID: formData.currencyCode })
                .txt((item.unitPrice * item.quantity).toFixed(2))
                .up()
                .ele('cac:Item')
                .ele('cbc:Name')
                .txt(item.description)
                .up()
                .ele('cac:ClassifiedTaxCategory')
                .ele('cbc:ID')
                .txt('S')
                .up()
                .ele('cbc:Percent')
                .txt('19')
                .up()
                .ele('cac:TaxScheme')
                .ele('cbc:ID')
                .txt('VAT')
                .up()
                .up()
                .up()
                .up()
                .ele('cac:Price')
                .ele('cbc:PriceAmount', { currencyID: formData.currencyCode })
                .txt(item.unitPrice.toFixed(2))
                .up()
                .up()
                .up();
        });

        const xmlString = invoice.end({ prettyPrint: true, indent: '    ' });
        setXmlOutput(xmlString);
        downloadXml();
    };

    // Function to trigger the download
    function downloadXml() {
        const xml = xmlOutput();

        if (!xml) return;
        // Create a Blob from the string
        const blob = new Blob([xml], { type: 'application/xml' });

        // Create a temporary anchor element
        const anchor = document.createElement('a');
        anchor.href = URL.createObjectURL(blob);

        // Specify the filename
        anchor.download = `Rechnung-${formData.invoiceNumber}.xml`;

        // Trigger the download
        anchor.click();

        // Clean up
        URL.revokeObjectURL(anchor.href);
    }

    return (
        <div class="flex flex-col pt-12">
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    generateXml();
                }}
            >
                <div class="flex flex-col gap-4">
                    <div class="flex flex-col gap-4 min-[364px]:flex-row">
                        <div class="flex flex-[2] flex-col gap-4">
                            <div class="flex min-w-[150px] max-w-[300px] flex-1 flex-col items-start gap-1">
                                <label>Rechnungsnummer:</label>
                                <Input
                                    path="invoiceNumber"
                                    class="w-full rounded-md border border-cyan-950/20 bg-cyan-950/5 px-1 py-1 outline-none focus:border-cyan-950/50"
                                    data={formData}
                                    onInputPath={handleInputChange}
                                    required
                                />
                            </div>
                            <div class="flex min-w-[150px] max-w-[300px] flex-1 flex-col items-start gap-1">
                                <label>Kundennummer:</label>
                                <Input
                                    path="buyerReference"
                                    class="w-full rounded-md border border-cyan-950/20 bg-cyan-950/5 px-1 py-1 outline-none focus:border-cyan-950/50"
                                    data={formData}
                                    onInputPath={handleInputChange}
                                    required
                                />
                            </div>
                        </div>
                        <div class="flex-1 sm:flex-[2] md:flex-[3]"></div>
                        <div class="flex flex-[2] flex-col gap-4">
                            <div class="flex min-w-[150px] max-w-[300px] flex-1 flex-col items-start gap-1">
                                <label>Erstellungsdatum:</label>
                                <Input
                                    path="issueDate"
                                    class="w-full rounded-md border border-cyan-950/20 bg-cyan-950/5 px-1 py-1 outline-none focus:border-cyan-950/50"
                                    data={formData}
                                    type="date"
                                    onInputPath={handleInputChange}
                                    required
                                />
                            </div>
                            <div class="flex min-w-[150px] max-w-[300px] flex-1 flex-col items-start gap-1">
                                <label>Fälligkeitsdatum:</label>
                                <Input
                                    path="dueDate"
                                    class="w-full rounded-md border border-cyan-950/20 bg-cyan-950/5 px-1 py-1 outline-none focus:border-cyan-950/50"
                                    data={formData}
                                    type="date"
                                    onInputPath={handleInputChange}
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div class="flex flex-row gap-4 md:gap-12 lg:gap-24">
                        <div class="flex flex-1 flex-col gap-4">
                            <h2 class="mt-12 text-left text-2xl">Käufer</h2>
                            <div class="flex min-w-[150px] flex-col items-start gap-1">
                                <label>E-Mail:</label>
                                <Input
                                    path="customer.id"
                                    class="w-full rounded-md border border-cyan-950/20 bg-cyan-950/5 px-1 py-1 outline-none focus:border-cyan-950/50"
                                    data={formData}
                                    onInputPath={handleInputChange}
                                    required
                                />
                            </div>
                            <div class="flex min-w-[150px] flex-col items-start gap-1">
                                <label>Firmenname:</label>
                                <Input
                                    path="customer.name"
                                    class="w-full rounded-md border border-cyan-950/20 bg-cyan-950/5 px-1 py-1 outline-none focus:border-cyan-950/50"
                                    data={formData}
                                    onInputPath={handleInputChange}
                                    required
                                />
                            </div>
                            <div class="flex min-w-[150px] flex-col items-start gap-1">
                                <label>Adresszeile 1:</label>
                                <Input
                                    path="customer.streetName"
                                    class="w-full rounded-md border border-cyan-950/20 bg-cyan-950/5 px-1 py-1 outline-none focus:border-cyan-950/50"
                                    data={formData}
                                    onInputPath={handleInputChange}
                                    required
                                />
                            </div>
                            <div class="flex min-w-[150px] flex-col items-start gap-1">
                                <label>Postleitzahl:</label>
                                <Input
                                    path="customer.postalZone"
                                    class="w-full rounded-md border border-cyan-950/20 bg-cyan-950/5 px-1 py-1 outline-none focus:border-cyan-950/50"
                                    data={formData}
                                    onInputPath={handleInputChange}
                                    required
                                />
                            </div>
                            <div class="flex min-w-[150px] flex-col items-start gap-1">
                                <label>Stadt:</label>
                                <Input
                                    path="customer.cityName"
                                    class="w-full rounded-md border border-cyan-950/20 bg-cyan-950/5 px-1 py-1 outline-none focus:border-cyan-950/50"
                                    data={formData}
                                    onInputPath={handleInputChange}
                                    required
                                />
                            </div>
                            <div class="flex min-w-[150px] flex-col items-start gap-1">
                                <label>Land:</label>
                                <Input
                                    path="customer.country"
                                    class="w-full rounded-md border border-cyan-950/20 bg-cyan-950/5 px-1 py-1 outline-none focus:border-cyan-950/50"
                                    data={formData}
                                    onInputPath={handleInputChange}
                                    required
                                />
                            </div>
                        </div>
                        <div class="flex flex-1 flex-col gap-4">
                            <h2 class="mt-12 text-left text-2xl">Verkäufer</h2>
                            <div class="flex min-w-[150px] flex-col items-start gap-1">
                                <label>E-Mail:</label>
                                <Input
                                    path="supplier.id"
                                    class="w-full rounded-md border border-cyan-950/20 bg-cyan-950/5 px-1 py-1 outline-none focus:border-cyan-950/50"
                                    data={formData}
                                    onInputPath={handleInputChange}
                                    required
                                />
                            </div>
                            <div class="flex min-w-[150px] flex-col items-start gap-1">
                                <label>Firmenname:</label>
                                <Input
                                    path="supplier.name"
                                    class="w-full rounded-md border border-cyan-950/20 bg-cyan-950/5 px-1 py-1 outline-none focus:border-cyan-950/50"
                                    data={formData}
                                    onInputPath={handleInputChange}
                                    required
                                />
                            </div>
                            <div class="flex min-w-[150px] flex-col items-start gap-1">
                                <label>Adresszeile 1:</label>
                                <Input
                                    path="supplier.streetName"
                                    class="w-full rounded-md border border-cyan-950/20 bg-cyan-950/5 px-1 py-1 outline-none focus:border-cyan-950/50"
                                    data={formData}
                                    onInputPath={handleInputChange}
                                    required
                                />
                            </div>
                            <div class="flex min-w-[150px] flex-col items-start gap-1">
                                <label>Postleitzahl:</label>
                                <Input
                                    path="supplier.postalZone"
                                    class="w-full rounded-md border border-cyan-950/20 bg-cyan-950/5 px-1 py-1 outline-none focus:border-cyan-950/50"
                                    data={formData}
                                    onInputPath={handleInputChange}
                                    required
                                />
                            </div>
                            <div class="flex min-w-[150px] flex-col items-start gap-1">
                                <label>Stadt:</label>
                                <Input
                                    path="supplier.cityName"
                                    class="w-full rounded-md border border-cyan-950/20 bg-cyan-950/5 px-1 py-1 outline-none focus:border-cyan-950/50"
                                    data={formData}
                                    onInputPath={handleInputChange}
                                    required
                                />
                            </div>
                            <div class="flex min-w-[150px] flex-col items-start gap-1">
                                <label>Land:</label>
                                <Input
                                    path="supplier.country"
                                    class="w-full rounded-md border border-cyan-950/20 bg-cyan-950/5 px-1 py-1 outline-none focus:border-cyan-950/50"
                                    data={formData}
                                    onInputPath={handleInputChange}
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <h2 class="mt-12 text-left text-2xl">Positionen</h2>
                    <For each={formData.items}>
                        {(item, index) => (
                            <div class="flex flex-row gap-4">
                                <div class="flex min-w-[150px] flex-1 flex-col items-start gap-1">
                                    <label>Pos.Nr.:</label>
                                    <Input
                                        path={`items.${index()}.number`}
                                        class="w-full rounded-md border border-cyan-950/20 bg-cyan-950/5 px-1 py-1 outline-none focus:border-cyan-950/50"
                                        data={formData}
                                        onInputPath={handleInputChange}
                                        required
                                    />
                                </div>
                                <div class="flex min-w-[150px] flex-[3] flex-col items-start gap-1">
                                    <label>Beschreibung:</label>
                                    <Input
                                        path={`items.${index()}.description`}
                                        class="w-full rounded-md border border-cyan-950/20 bg-cyan-950/5 px-1 py-1 outline-none focus:border-cyan-950/50"
                                        data={formData}
                                        onInputPath={handleInputChange}
                                        required
                                    />
                                </div>
                                <div class="flex min-w-[150px] flex-1 flex-col items-start gap-1">
                                    <label>Menge:</label>
                                    <Input
                                        path={`items.${index()}.quantity`}
                                        class="w-full rounded-md border border-cyan-950/20 bg-cyan-950/5 px-1 py-1 outline-none focus:border-cyan-950/50"
                                        data={formData}
                                        type="number"
                                        onInputPath={handleInputChange}
                                        required
                                    />
                                </div>
                                <div class="flex min-w-[150px] flex-1 flex-col items-start gap-1">
                                    <label>Einzelpreis:</label>
                                    <CurrencyInput
                                        path={`items.${index()}.unitPrice`}
                                        class="w-full rounded-md border border-cyan-950/20 bg-cyan-950/5 px-1 py-1 outline-none focus:border-cyan-950/50"
                                        data={formData}
                                        type="text"
                                        onInputPath={handleInputChange}
                                        required
                                    />
                                    {/* Additional item fields */}
                                    <button type="button" onClick={() => removeItem(index())}>
                                        Remove Item
                                    </button>
                                </div>
                            </div>
                        )}
                    </For>

                    <button type="button" onClick={addItem}>
                        Add Item
                    </button>

                    <div class="flex flex-row">
                        <div class="flex-[2]"></div>
                        <div class="flex-1">
                            <div class="flex min-w-[150px] max-w-[300px] flex-1 flex-col items-start gap-1">
                                <label>Tax Exclusive Amount</label>
                                <div>{Euro.format(getTaxExclusiveAmount())}</div>
                            </div>
                            <div class="flex min-w-[150px] max-w-[300px] flex-1 flex-col items-start gap-1">
                                <label>Tax Inclusive Amount</label>
                                <div>{Euro.format(getTaxExclusiveAmount() * 1.19)}</div>
                            </div>
                            <div class="flex min-w-[150px] max-w-[300px] flex-1 flex-col items-start gap-1">
                                <label>Payable Amount</label>
                                <div>{Euro.format(getTaxExclusiveAmount() * 1.19)}</div>
                            </div>
                        </div>
                    </div>

                    <div class="mt-12 flex flex-row gap-4">
                        <div class="flex flex-1 flex-col gap-4">
                            <div class="flex min-w-[150px] flex-col items-start gap-1">
                                <label>Zahlungsempfänger:</label>
                                <Input
                                    path="paymentMeans.payeeFinancialAccount.name"
                                    class="w-full rounded-md border border-cyan-950/20 bg-cyan-950/5 px-1 py-1 outline-none focus:border-cyan-950/50"
                                    data={formData}
                                    onInputPath={handleInputChange}
                                    required
                                />
                            </div>
                            <div class="flex min-w-[150px] flex-col items-start gap-1">
                                <label>IBAN:</label>
                                <Input
                                    path="paymentMeans.payeeFinancialAccount.id"
                                    class="w-full rounded-md border border-cyan-950/20 bg-cyan-950/5 px-1 py-1 outline-none focus:border-cyan-950/50"
                                    data={formData}
                                    onInputPath={handleInputChange}
                                    required
                                />
                            </div>
                            <div class="flex min-w-[150px] flex-col items-start gap-1">
                                <label>Kreditinstitut:</label>
                                <Input
                                    path="paymentMeans.payeeFinancialAccount.financialInstitutionBranch"
                                    class="w-full rounded-md border border-cyan-950/20 bg-cyan-950/5 px-1 py-1 outline-none focus:border-cyan-950/50"
                                    data={formData}
                                    onInputPath={handleInputChange}
                                    required
                                />
                            </div>
                        </div>
                        <div class="flex flex-1 flex-col gap-4">
                            <div class="flex min-w-[150px] flex-col items-start gap-1">
                                <label>USt.ID.:</label>
                                <Input
                                    path="supplier.vatNumber"
                                    class="w-full rounded-md border border-cyan-950/20 bg-cyan-950/5 px-1 py-1 outline-none focus:border-cyan-950/50"
                                    data={formData}
                                    onInputPath={handleInputChange}
                                    required
                                />
                            </div>
                            <div class="flex min-w-[150px] flex-col items-start gap-1">
                                <label>Handelsregisternr.:</label>
                                <Input
                                    path="supplier.registrationNumber"
                                    class="w-full rounded-md border border-cyan-950/20 bg-cyan-950/5 px-1 py-1 outline-none focus:border-cyan-950/50"
                                    data={formData}
                                    onInputPath={handleInputChange}
                                    required
                                />
                            </div>
                            <div class="flex min-w-[150px] flex-col items-start gap-1">
                                <label>Rechtliches:</label>
                                <Input
                                    path="supplier.legalForm"
                                    class="w-full rounded-md border border-cyan-950/20 bg-cyan-950/5 px-1 py-1 outline-none focus:border-cyan-950/50"
                                    data={formData}
                                    onInputPath={handleInputChange}
                                    required
                                />
                            </div>
                        </div>
                        <div class="flex flex-1 flex-col gap-4">
                            <div class="flex min-w-[150px] flex-col items-start gap-1">
                                <label>Kontakt Name:</label>
                                <Input
                                    path="supplier.contact.name"
                                    class="w-full rounded-md border border-cyan-950/20 bg-cyan-950/5 px-1 py-1 outline-none focus:border-cyan-950/50"
                                    data={formData}
                                    onInputPath={handleInputChange}
                                    required
                                />
                            </div>
                            <div class="flex min-w-[150px] flex-col items-start gap-1">
                                <label>Kontakt Telefon:</label>
                                <Input
                                    path="supplier.contact.phone"
                                    class="w-full rounded-md border border-cyan-950/20 bg-cyan-950/5 px-1 py-1 outline-none focus:border-cyan-950/50"
                                    data={formData}
                                    onInputPath={handleInputChange}
                                    required
                                />
                            </div>
                            <div class="flex min-w-[150px] flex-col items-start gap-1">
                                <label>Kontakt E-Mail:</label>
                                <Input
                                    path="supplier.contact.email"
                                    class="w-full rounded-md border border-cyan-950/20 bg-cyan-950/5 px-1 py-1 outline-none focus:border-cyan-950/50"
                                    data={formData}
                                    onInputPath={handleInputChange}
                                    required
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <button
                    class="m-12 cursor-pointer rounded-full border-2 border-green-800 bg-green-800/30 px-12 py-4 text-xl text-green-950 hover:bg-green-800/40"
                    type="submit"
                >
                    Speichern
                </button>
            </form>
        </div>
    );
};
