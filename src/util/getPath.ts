export const getPath = <TInput extends Record<string, unknown>, TRes>(
    or: TRes | undefined,
    path: string[],
    input: TInput | undefined,
): TRes | undefined => {
    if (!input) return or;

    try {
        let obj: Record<string, unknown> = input;
        for (let i = 0; i < path.length; i += 1) {
            const key = path[i];
            if (key in obj) {
                obj = obj[key] as Record<string, unknown>;
            } else {
                return or;
            }
        }
        return obj as unknown as TRes;
    } catch (err) {
        return or;
    }
};
