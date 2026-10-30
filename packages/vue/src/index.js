import { sessionStorage, localStorage } from '@straylightagency/storage';
import { ref, readonly } from 'vue';

/**
 * @param {string} key
 * @param {*} initial
 * @returns {[import('vue').Ref, Function, Function]}
 */
export function useSessionStorage(key, initial = undefined) {
    const getter = ref(sessionStorage.get(key, initial));

    const setter = new_value => {
        sessionStorage.set(key, new_value);
        getter.value = new_value;
    };

    const remove = () => {
        sessionStorage.remove(key);
        getter.value = undefined;
    };

    return [
        readonly(getter),
        setter,
        remove
    ];
}

/**
 * @param {string} key
 * @param {*} initial
 * @returns {[import('vue').Ref, Function, Function]}
 */
export function useLocalStorage(key, initial = undefined) {
    const getter = ref(localStorage.get(key, initial));

    const setter = new_value => {
        localStorage.set(key, new_value);
        getter.value = new_value;
    };

    const remove = () => {
        localStorage.remove(key);
        getter.value = undefined;
    };

    return [
        readonly(getter),
        setter,
        remove
    ];
}