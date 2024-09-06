/**
 * Default array of sensitive words that are commonly redacted from objects.
 */
const defaultBadWords: string[] = [
    'password',
    'pass',
    'token',
    'auth',
    'secret',
    'secret_key',
    'secret_api',
    'passphrase',
    'card'
];

/**
 * Options for redacting sensitive words from an object.
 * @param {string[]} [badWords] An array of sensitive words that should be redacted from the object.
 *                             If `strictMatch` is set to true, only exact matches of these words as object keys will be redacted.
 *                             If `strictMatch` is set to false, object keys that start with the `customPrefix` will be redacted if they match any word in `badWords`.
 *                             Default value is `defaultBadWords`.
 * @param {string} [mode='strict'] The mode of redaction, either 'strict' or 'prefix'.
 * @param {boolean} [onlyStringReplace=true] If set to true, only string values will be replaced with the `replacement`.
 * @param {string} [replacement='[SECRET]'] The string to replace sensitive words with.
 * @param {string} [customPrefix=''] A custom prefix that, when used with `strictMatch: false`, indicates which object keys to redact.
 */
interface Options {
    badWords?: string[];
    mode: 'strict' | 'prefix';
    onlyStringReplace?: boolean;
    replacement?: string;
    customPrefix?: string;
}

/**
 * Redacts sensitive words from an object based on the provided options.
 * @param obj The object to redact sensitive words from.
 * @param opts The options for redacting sensitive words.
 * @returns The object with sensitive words redacted.
 */
export default function redactSensitiveWords(obj: any, opts: Options = {mode: 'strict'}): any {
    const {
        badWords = defaultBadWords,
        mode,
        onlyStringReplace = true,
        replacement = '[SECRET]',
        customPrefix = ''
    } = opts;

    if (mode === 'prefix' && !customPrefix.length) {
        throw new Error('Custom prefix must be provided when using mode "prefix"');
    }

    function traverseObject(obj: any, path: string[]) {
        for (let key in obj) {
            if (obj.hasOwnProperty(key)) {
                let currentPath = path.concat(key);

                switch (mode) {
                    case 'strict':
                        if (badWords.includes(key)) {
                            if (onlyStringReplace && typeof obj[key] === 'string') {
                                obj[key] = replaceString(obj[key], replacement);
                            } else if (!onlyStringReplace) {
                                obj[key] = typeof obj[key] === 'string' ? replaceString(obj[key], replacement) : replacement;
                            }
                        }
                        break;
                    case 'prefix':
                        if (customPrefix.length && badWords.some(word => key.startsWith(customPrefix))) {
                            if (typeof obj[key] === 'string') {
                                obj[key] = replaceString(obj[key], replacement);
                            }
                        }
                        break;
                    default:
                        break;
                }

                if (typeof obj[key] === 'object') {
                    traverseObject(obj[key], currentPath);
                }
            }
        }
    }

    traverseObject(obj, []);

    return obj;
}


/**
 * Replaces a string with a specified replacement string.
 * @param str The original string to replace.
 * @param replacement The string to replace `str` with.
 * @returns The string with replacements made.
 */
function replaceString(str: string, replacement: string): string {
    return replacement;
}
