import { isObject } from "lodash-es";
import type { UnknownRecord } from "type-fest";

function convertKeyCaseDeep<Input, Output>(
    input: Input,
    convertKey: (key: string) => string,
): Output {
    if (!isObject(input)) {
        return input as unknown as Output;
    }

    if (Array.isArray(input)) {
        return input.map((item) =>
            convertKeyCaseDeep(item, convertKey),
        ) as unknown as Output;
    }

    const output = {} as UnknownRecord;
    for (const [key, value] of Object.entries(input)) {
        output[convertKey(key)] = convertKeyCaseDeep(value, convertKey);
    }
    return output as Output;
}

export function omit<Subject extends object, Key extends PropertyKey>(
    subject: Subject,
    keys: Key[],
) {
    const keySet = new Set<PropertyKey>(keys);
    return Object.fromEntries(
        Object.entries(subject).filter(([key]) => !keySet.has(key)),
        // hack: conditional type preserves unions
    ) as Subject extends unknown ? Omit<Subject, Key> : never;
}
