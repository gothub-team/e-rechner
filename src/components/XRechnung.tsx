import { createSignal, For } from 'solid-js';
import { createStore } from 'solid-js/store';
import { create } from 'xmlbuilder';

export const XRechnung = () => {
    const [formData, setFormData] = createStore({
        invoiceId: '',
        issueDate: '',
        buyer: {
            name: '',
            address: '',
        },
        items: [{ description: '', quantity: 1, unitPrice: 0 }],
    });

    const [xmlOutput, setXmlOutput] = createSignal<string | null>(null);

    const handleInputChange = (path: string, value: unknown) => {
        const keys: unknown[] = path.split('.');
        keys.push(value);
        setFormData(...keys);
        console.log(formData);
    };

    const addItem = () => {
        setFormData('items', [...formData.items, { description: '', quantity: 1, unitPrice: 0 }]);
    };

    const removeItem = (index: number) => {
        setFormData(
            'items',
            formData.items.filter((_, i) => i !== index),
        );
    };

    const generateXml = () => {
        console.log('BUYER NAME', formData);
        const xml = create('Invoice')
            .att('xmlns', 'urn:xrechnung:xsd:1')
            .ele('InvoiceId', formData.invoiceId)
            .up()
            .ele('IssueDate', formData.issueDate)
            .up()
            .ele('Buyer')
            .ele('Name', formData.buyer.name)
            .up()
            .ele('Address', formData.buyer.address)
            .up()
            .up();

        const items = xml.ele('Items');
        formData.items.forEach((item) => {
            items
                .ele('Item')
                .ele('Description', item.description)
                .up()
                .ele('Quantity', item.quantity.toString())
                .up()
                .ele('UnitPrice', item.unitPrice.toString())
                .up()
                .up();
        });

        setXmlOutput(xml.end({ pretty: true }));
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
                    <label>Invoice ID</label>
                    <input
                        value={formData.invoiceId}
                        onInput={(e) => handleInputChange('invoiceId', e.currentTarget.value)}
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
                    <label>Buyer Name</label>
                    <input
                        value={formData.buyer.name}
                        onInput={(e) => handleInputChange('buyer.name', e.currentTarget.value)}
                        required
                    />
                </div>
                <div>
                    <label>Buyer Address</label>
                    <input
                        value={formData.buyer.address}
                        onInput={(e) => handleInputChange('buyer.address', e.currentTarget.value)}
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

                            <button type="button" onClick={() => removeItem(index())}>
                                Remove Item
                            </button>
                        </div>
                    )}
                </For>

                <button type="button" onClick={addItem}>
                    Add Item
                </button>

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
