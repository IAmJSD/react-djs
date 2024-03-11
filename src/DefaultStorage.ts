import { Renderer, Storage } from "./Renderer";

// Defines 5 hours in milliseconds.
const FIVE_HOURS = 5 * 60 * 60 * 1000;

export default class DefaultStorage implements Storage {
    private _map: Map<string, {killer: any; item: any}> = new Map();

    get(_: string, messageId: string) {
        const value = this._map.get(messageId);
        if (value) {
            clearTimeout(value.killer);
            value.killer = setTimeout(() => this.delete(_, messageId), FIVE_HOURS);
            return value.item;
        }
        return undefined;
    }

    set(_: string, messageId: string, value: any) {
        const killer = setTimeout(() => this.delete(_, messageId), FIVE_HOURS);
        this._map.set(messageId, {killer, item: value});
    }

    delete(_: string, messageId: string) {
        const value = this._map.get(messageId);
        if (value) {
            clearTimeout(value.killer);
            this._map.delete(messageId);
        }
    }
}
