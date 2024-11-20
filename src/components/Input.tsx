import { Component, JSX } from 'solid-js';
import { getPath } from '../util/getPath';

export const Input: Component<
    JSX.InputHTMLAttributes<HTMLInputElement> & {
        data: Record<string, unknown>;
        path: string;
        onInputPath?: (path: string, value: ReturnType<typeof parseValue>) => void;
    }
> = ({ data, path, onInputPath, onInput, ...props }) => {
    const value = getPath(undefined, path.split('.'), data);
    const valueType = typeof value;
    return (
        <input
            {...props}
            value={getPath('', path.split('.'), data)}
            onInput={(e) => {
                typeof onInput === 'function' && onInput(e);
                onInputPath && onInputPath(path, parseValue(e.currentTarget.value, valueType));
            }}
        />
    );
};

const parseValue = (value: string, valueType = typeof value) => {
    switch (valueType) {
        case 'boolean':
            return Boolean(value);
        case 'number':
            return Number(value);
        default:
            return value;
    }
};
