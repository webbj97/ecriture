/*
 * @desc:
 * @Author: 余光
 * @Email: webbj97@163.com
 * @Date: 2020-06-03 22:35:26
 */
import SetCache from './SetCache.js'
import arrayIncludes from './arrayIncludes.js'
import arrayIncludesWith from './arrayIncludesWith.js'
import cacheHas from './cacheHas.js'
import createSet from './createSet.js'
import setToArray from './internal/setToArray.js'

const ARRAY_MAX_SIZE = 200 // 如果数组的长度超过此值，我们考虑用set去重

/**
 * The base implementation of `uniqBy`.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {Function} [iteratee] The iteratee invoked per element.
 * @param {Function} [comparator] The comparator invoked per element.
 * @returns {Array} Returns the new duplicate free array.
 */
function baseUniq(array, iteratee, comparator) {
    let index = -1
    let includes = arrayIncludes
    let isCommon = true

    const { length } = array
    const result = []
    let seen = result

    if (comparator) {
        isCommon = false
        includes = arrayIncludesWith
    } else if (length >= ARRAY_MAX_SIZE) {
        const set = iteratee ? null : createSet(array)
        if (set) {
            return setToArray(set)
        }
        isCommon = false
        includes = cacheHas
        seen = new SetCache
    } else {
        seen = iteratee ? [] : result
    }
    outer:
        while (++index < length) {
            let value = array[index]
            const computed = iteratee ? iteratee(value) : value

            value = (comparator || value !== 0) ? value : 0
            if (isCommon && computed === computed) {
                let seenIndex = seen.length
                while (seenIndex--) {
                    if (seen[seenIndex] === computed) {
                        continue outer
                    }
                }
                if (iteratee) {
                    seen.push(computed)
                }
                result.push(value)
            } else if (!includes(seen, computed, comparator)) {
                if (seen !== result) {
                    seen.push(computed)
                }
                result.push(value)
            }
        }
    return result
}

export default baseUniq