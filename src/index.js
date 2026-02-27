/**
 * @author anthony@straylightagency.be
 */
class Storage {
    #storage;

    /**
     * Constructor.
     * Choose your storage type
     *
     * @param storage_type
     */
    constructor(storage_type = 'session') {
        this.#storage = storage_type === 'session' ? window.sessionStorage : window.localStorage;
    }

    /**
     * Check if an item exists for the given key
     *
     * @param key
     * @returns {boolean}
     */
    has(key) {
        return this.#storage.getItem( key ) !== undefined
    }

    /**
     * Forget an item for the given key
     *
     * @param key
     */
    remove(key) {
        this.#storage.removeItem( key );
    }

    /**
     * Get the item for the given key or return the default value
     *
     * @param key
     * @param default_value
     * @returns {undefined|any}
     */
    get(key, default_value = undefined) {
        const decode = value => {
            if ( ( value?.length || 0 ) < 10 ) {
                return undefined;
            }

            const source = value.substring( 9 );

            switch ( value.substring( 0, 8 ) ) {
                case '__date__':
                    return new Date( source );

                case '__expr__':
                    return new RegExp( source );

                case '__numb__':
                    return Number( source );

                case '__bool__':
                    return Boolean( source === '1' );

                case '__strn__':
                    return `${source}`;

                case '__objt__':
                    return JSON.parse( source );

                default:
                    return value;
            }
        }

        const value = decode( this.#storage.getItem( key ) );

        if ( value ) {
            return value;
        }

        return default_value;
    }

    /**
     * Set an item with the given key
     *
     * @param key
     * @param value
     */
    set(key, value) {
        const encode = value => {
            if ( Object.prototype.toString.call( value ) === '[object Date]' ) {
                return `__date__|${value.toUTCString()}`;
            }

            if ( Object.prototype.toString.call( value ) === '[object RegExp]') {
                return `__expr__|${value.source}`;
            }

            if ( typeof value === 'number') {
                return `__numb__|${value}`;
            }

            if ( typeof value === 'boolean') {
                return `__bool__|${value ? '1' : '0'}`;
            }

            if ( typeof value === 'string') {
                return `__strn__|${value}`;
            }

            if ( typeof value === 'function') {
                return `__strn__|${value.toString()}`;
            }

            if ( value === Object( value ) ) {
                return `__objt__|${JSON.stringify( value )}`;
            }

            return value;
        }

        this.#storage.setItem( key, encode( value ) );
    }
}

/**
 * @type {Storage}
 */
export const sessionStorage = new Storage('session');

/**
 * @type {Storage}
 */
export const localStorage = new Storage('local');

/**
 * @param key {String}
 * @param default_value {*}
 * @returns {({value: undefined}|(function(*): void)|(function(): void))[]|*|undefined|boolean}
 */
export function useSessionStorage(key, default_value = undefined) {
    const proxy = new Proxy( {
        value: default_value,
    }, {
        set(target, prop, value) {
            return false;
        },
        get(target, prop) {
            return sessionStorage.get( key, default_value );
        }
    } );

    const setter = new_value => sessionStorage.set( key, new_value );
    const remove = () => sessionStorage.remove( key );

    return [ proxy, setter, remove ];
}

/**
 * @param key {String}
 * @param default_value {*}
 * @returns {({value: undefined}|(function(*): void)|(function(): void))[]|*|undefined|boolean}
 */
export function useLocalStorage(key, default_value = undefined) {
    const proxy = new Proxy( {
        value: default_value,
    }, {
        set(target, prop, value) {
            return false;
        },
        get(target, prop) {
            return localStorage.get( key, default_value );
        }
    } );

    const setter = new_value => localStorage.set( key, new_value );
    const remove = () => localStorage.remove( key );

    return [ proxy, setter, remove ];
}