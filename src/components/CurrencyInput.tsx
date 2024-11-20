import { Component, createSignal, JSX } from 'solid-js';
import { getPath } from '../util/getPath';

export const Euro = new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
});

export const CurrencyInput: Component<
    JSX.InputHTMLAttributes<HTMLInputElement> & {
        data: Record<string, unknown>;
        path: string;
        onInputPath?: (path: string, value: number) => void;
    }
> = ({ data, path, onInputPath, onInput, ...props }) => {
    const [value, setValue] = createSignal(Number(getPath(undefined, path.split('.'), data)));
    const history: number[] = [];
    const [typing, setTyping] = createSignal('');
    const [decimalTyping, setDecimalTyping] = createSignal('');
    return (
        <input
            {...props}
            value={Euro.format(value())}
            onInput={(e) => {
                if (e.inputType !== 'insertText') {
                    setValue(0);
                    setTyping('');
                    setDecimalTyping('');
                } else if (e.data === ',') {
                    setDecimalTyping('0');
                } else if (!decimalTyping()) {
                    setTyping((t) => t + e.data);
                } else {
                    setDecimalTyping((t) => {
                        const dt = t + e.data;
                        return Number(dt) > 99 ? t : dt;
                    });
                }
                if (e.inputType === 'historyUndo') {
                    const last = history.pop();
                    last && setValue(last);
                    setTyping('');
                    setDecimalTyping('');
                } else {
                    history.push(value());
                    setValue(Number(typing()) + Number(decimalTyping()) / 100);
                }

                typeof onInput === 'function' && onInput(e);
                onInputPath && onInputPath(path, value());
            }}
            onFocus={() => {
                setTyping('');
                setDecimalTyping('');
            }}
        />
    );
};
