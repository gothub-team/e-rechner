import { createSignal, For } from 'solid-js';
import { createStore } from 'solid-js/store';
import { create } from 'xmlbuilder2';

export const XRechnung = () => {
    const [formData, setFormData] = createStore({
        invoiceNumber: '',
        issueDate: '',
        dueDate: '',
        currencyCode: 'EUR',
        supplier: {
            name: '',
            id: '',
            streetName: '',
            cityName: '',
            postalZone: '',
            country: '',
        },
        customer: {
            name: '',
            id: '',
            streetName: '',
            cityName: '',
            postalZone: '',
            country: '',
        },
        items: [
            {
                description: '',
                quantity: 1,
                unitPrice: 0,
                lineExtensionAmount: 0,
                taxAmount: 0,
                taxPercent: 0,
            },
        ],
        legalMonetaryTotal: {
            lineExtensionAmount: 0,
            taxExclusiveAmount: 0,
            taxInclusiveAmount: 0,
            payableAmount: 0,
        },
        paymentMeans: {
            paymentMeansCode: '',
            payeeFinancialAccount: {
                id: '',
                name: '',
                financialInstitutionBranch: '',
            },
        },
    });

    const [xmlOutput, setXmlOutput] = createSignal<string | null>(null);

    const handleInputChange = (path: string, value: unknown) => {
        const keys: unknown[] = path.split('.');
        keys.push(value);
        // @ts-ignore
        setFormData(...keys);
        console.log(formData);
    };

    const addItem = () => {
        setFormData('items', [
            ...formData.items,
            {
                description: '',
                quantity: 1,
                unitPrice: 0,
                lineExtensionAmount: 0,
                taxAmount: 0,
                taxPercent: 0,
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
            .ele('ns0:Invoice', {
                xmlns: 'urn:oasis:names:specification:ubl:schema:xsd:Invoice-2',
                'xmlns:cac': 'urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2',
                'xmlns:cbc': 'urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2',
                'xmlns:ns0': 'urn:oasis:names:specification:ubl:schema:xsd:Invoice-2',
            })
            .ele('cbc:UBLVersionID')
            .txt('2.1')
            .up()
            .ele('cbc:CustomizationID')
            .txt('urn:cen.eu:en16931:2017')
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
            .up();

        // Supplier Party
        const accountingSupplierParty = invoice
            .ele('cac:AccountingSupplierParty')
            .ele('cac:Party')
            .ele('cbc:EndpointID')
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
            .up();

        // Customer Party
        const accountingCustomerParty = invoice
            .ele('cac:AccountingCustomerParty')
            .ele('cac:Party')
            .ele('cbc:EndpointID')
            .txt(formData.customer.id)
            .up()
            .ele('cac:PartyName')
            .ele('cbc:Name')
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

        // Invoice Lines
        formData.items.forEach((item, index) => {
            invoice
                .ele('cac:InvoiceLine')
                .ele('cbc:ID')
                .txt((index + 1).toString())
                .up()
                .ele('cbc:InvoicedQuantity', { unitCode: 'EA' })
                .txt(item.quantity.toString())
                .up()
                .ele('cbc:LineExtensionAmount', { currencyID: formData.currencyCode })
                .txt(item.lineExtensionAmount.toFixed(2))
                .up()
                .ele('cac:Item')
                .ele('cbc:Description')
                .txt(item.description)
                .up()
                .up()
                .ele('cac:Price')
                .ele('cbc:PriceAmount', { currencyID: formData.currencyCode })
                .txt(item.unitPrice.toFixed(2))
                .up()
                .up()
                .up();
        });

        // Legal Monetary Total
        invoice
            .ele('cac:LegalMonetaryTotal')
            .ele('cbc:LineExtensionAmount', { currencyID: formData.currencyCode })
            .txt(formData.legalMonetaryTotal.lineExtensionAmount.toFixed(2))
            .up()
            .ele('cbc:TaxExclusiveAmount', { currencyID: formData.currencyCode })
            .txt(formData.legalMonetaryTotal.taxExclusiveAmount.toFixed(2))
            .up()
            .ele('cbc:TaxInclusiveAmount', { currencyID: formData.currencyCode })
            .txt(formData.legalMonetaryTotal.taxInclusiveAmount.toFixed(2))
            .up()
            .ele('cbc:PayableAmount', { currencyID: formData.currencyCode })
            .txt(formData.legalMonetaryTotal.payableAmount.toFixed(2))
            .up()
            .up();

        const xmlString = invoice.end({ prettyPrint: true });
        setXmlOutput(xmlString);
    };

    return (
        <div>
            <h1>Invoice Generator</h1>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    generateXml();
                }}
            >
                <div>
                    <label>Invoice Number</label>
                    <input
                        value={formData.invoiceNumber}
                        onInput={(e) => handleInputChange('invoiceNumber', e.currentTarget.value)}
                        required
                    />
                </div>
                <div>
                    <label>Issue Date</label>
                    <input
                        type="date"
                        value={formData.issueDate}
                        onInput={(e) => handleInputChange('issueDate', e.currentTarget.value)}
                        required
                    />
                </div>
                <div>
                    <label>Due Date</label>
                    <input
                        type="date"
                        value={formData.dueDate}
                        onInput={(e) => handleInputChange('dueDate', e.currentTarget.value)}
                        required
                    />
                </div>
                <div>
                    <label>Currency Code</label>
                    <input
                        value={formData.currencyCode}
                        onInput={(e) => handleInputChange('currencyCode', e.currentTarget.value)}
                        required
                    />
                </div>

                <h2>Supplier Information</h2>
                {/* Supplier Fields */}
                <div>
                    <label>Supplier ID</label>
                    <input
                        value={formData.supplier.id}
                        onInput={(e) => handleInputChange('supplier.id', e.currentTarget.value)}
                        required
                    />
                </div>
                <div>
                    <label>Supplier Name</label>
                    <input
                        value={formData.supplier.name}
                        onInput={(e) => handleInputChange('supplier.name', e.currentTarget.value)}
                        required
                    />
                </div>
                <div>
                    <label>Street Name</label>
                    <input
                        value={formData.supplier.streetName}
                        onInput={(e) => handleInputChange('supplier.streetName', e.currentTarget.value)}
                        required
                    />
                </div>
                <div>
                    <label>City Name</label>
                    <input
                        value={formData.supplier.cityName}
                        onInput={(e) => handleInputChange('supplier.cityName', e.currentTarget.value)}
                        required
                    />
                </div>
                <div>
                    <label>Postal Zone</label>
                    <input
                        value={formData.supplier.postalZone}
                        onInput={(e) => handleInputChange('supplier.postalZone', e.currentTarget.value)}
                        required
                    />
                </div>
                <div>
                    <label>Country Code</label>
                    <input
                        value={formData.supplier.country}
                        onInput={(e) => handleInputChange('supplier.country', e.currentTarget.value)}
                        required
                    />
                </div>

                <h2>Customer Information</h2>
                {/* Customer Fields */}
                <div>
                    <label>Customer ID</label>
                    <input
                        value={formData.customer.id}
                        onInput={(e) => handleInputChange('customer.id', e.currentTarget.value)}
                        required
                    />
                </div>
                <div>
                    <label>Customer Name</label>
                    <input
                        value={formData.customer.name}
                        onInput={(e) => handleInputChange('customer.name', e.currentTarget.value)}
                        required
                    />
                </div>
                <div>
                    <label>Street Name</label>
                    <input
                        value={formData.customer.streetName}
                        onInput={(e) => handleInputChange('customer.streetName', e.currentTarget.value)}
                        required
                    />
                </div>
                <div>
                    <label>City Name</label>
                    <input
                        value={formData.customer.cityName}
                        onInput={(e) => handleInputChange('customer.cityName', e.currentTarget.value)}
                        required
                    />
                </div>
                <div>
                    <label>Postal Zone</label>
                    <input
                        value={formData.customer.postalZone}
                        onInput={(e) => handleInputChange('customer.postalZone', e.currentTarget.value)}
                        required
                    />
                </div>
                <div>
                    <label>Country Code</label>
                    <input
                        value={formData.customer.country}
                        onInput={(e) => handleInputChange('customer.country', e.currentTarget.value)}
                        required
                    />
                </div>

                <h2>Payment Means</h2>
                <div>
                    <label>Payment Means Code</label>
                    <input
                        value={formData.paymentMeans.paymentMeansCode}
                        onInput={(e) => handleInputChange('paymentMeans.paymentMeansCode', e.currentTarget.value)}
                        required
                    />
                </div>
                <div>
                    <label>Payee Account ID</label>
                    <input
                        value={formData.paymentMeans.payeeFinancialAccount.id}
                        onInput={(e) =>
                            handleInputChange('paymentMeans.payeeFinancialAccount.id', e.currentTarget.value)
                        }
                        required
                    />
                </div>
                <div>
                    <label>Payee Account Name</label>
                    <input
                        value={formData.paymentMeans.payeeFinancialAccount.name}
                        onInput={(e) =>
                            handleInputChange('paymentMeans.payeeFinancialAccount.name', e.currentTarget.value)
                        }
                        required
                    />
                </div>
                <div>
                    <label>Financial Institution Branch ID</label>
                    <input
                        value={formData.paymentMeans.payeeFinancialAccount.financialInstitutionBranch}
                        onInput={(e) =>
                            handleInputChange(
                                'paymentMeans.payeeFinancialAccount.financialInstitutionBranch',
                                e.currentTarget.value,
                            )
                        }
                        required
                    />
                </div>

                <h2>Items</h2>
                <For each={formData.items}>
                    {(item, index) => (
                        <div>
                            <label>Description</label>
                            <input
                                value={item.description}
                                onInput={(e) =>
                                    handleInputChange(`items.${index()}.description`, e.currentTarget.value)
                                }
                                required
                            />

                            <label>Quantity</label>
                            <input
                                type="number"
                                value={item.quantity}
                                onInput={(e) =>
                                    handleInputChange(`items.${index()}.quantity`, parseFloat(e.currentTarget.value))
                                }
                                required
                            />

                            <label>Unit Price</label>
                            <input
                                type="number"
                                step="0.01"
                                value={item.unitPrice}
                                onInput={(e) =>
                                    handleInputChange(`items.${index()}.unitPrice`, parseFloat(e.currentTarget.value))
                                }
                                required
                            />

                            <label>Line Extension Amount</label>
                            <input
                                type="number"
                                step="0.01"
                                value={item.lineExtensionAmount}
                                onInput={(e) =>
                                    handleInputChange(
                                        `items.${index()}.lineExtensionAmount`,
                                        parseFloat(e.currentTarget.value),
                                    )
                                }
                                required
                            />

                            {/* Additional item fields */}
                            <button type="button" onClick={() => removeItem(index())}>
                                Remove Item
                            </button>
                        </div>
                    )}
                </For>

                <button type="button" onClick={addItem}>
                    Add Item
                </button>

                <h2>Monetary Totals</h2>
                <div>
                    <label>Line Extension Amount</label>
                    <input
                        type="number"
                        step="0.01"
                        value={formData.legalMonetaryTotal.lineExtensionAmount}
                        onInput={(e) =>
                            handleInputChange(
                                'legalMonetaryTotal.lineExtensionAmount',
                                parseFloat(e.currentTarget.value),
                            )
                        }
                        required
                    />
                </div>
                <div>
                    <label>Tax Exclusive Amount</label>
                    <input
                        type="number"
                        step="0.01"
                        value={formData.legalMonetaryTotal.taxExclusiveAmount}
                        onInput={(e) =>
                            handleInputChange(
                                'legalMonetaryTotal.taxExclusiveAmount',
                                parseFloat(e.currentTarget.value),
                            )
                        }
                        required
                    />
                </div>
                <div>
                    <label>Tax Inclusive Amount</label>
                    <input
                        type="number"
                        step="0.01"
                        value={formData.legalMonetaryTotal.taxInclusiveAmount}
                        onInput={(e) =>
                            handleInputChange(
                                'legalMonetaryTotal.taxInclusiveAmount',
                                parseFloat(e.currentTarget.value),
                            )
                        }
                        required
                    />
                </div>
                <div>
                    <label>Payable Amount</label>
                    <input
                        type="number"
                        step="0.01"
                        value={formData.legalMonetaryTotal.payableAmount}
                        onInput={(e) =>
                            handleInputChange('legalMonetaryTotal.payableAmount', parseFloat(e.currentTarget.value))
                        }
                        required
                    />
                </div>

                <button type="submit">Generate XML</button>
            </form>

            {xmlOutput() && (
                <div>
                    <h2>Generated XML</h2>
                    <pre>{xmlOutput()}</pre>
                </div>
            )}
        </div>
    );
};
