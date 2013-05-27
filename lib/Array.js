/*
 * Copyright 2010 Acuminous Ltd / Energized Work Ltd
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var fnUtils = require('./fnUtils');

module.exports = function(obj) {

    function ensure_array(obj) {
        var array = obj ? [].concat(obj) : [];
        array.in_array = fnUtils.curry(array, in_array, array);
        array.each = fnUtils.curry(array, each, array);
        array.eachAsync = fnUtils.curry(array, eachAsync, array);
        array.collect = fnUtils.curry(array, collect, array);
        array.flatten = fnUtils.curry(array, flatten, array);
        array.inject = fnUtils.curry(array, inject, array);
        array.push_all = fnUtils.curry(array, push_all, array);
        array.find_all = fnUtils.curry(array, find_all, array);
        array.find = fnUtils.curry(array, find, array);
        array.naked = fnUtils.curry(array, naked, array);
        return array;
    };

    function is_array(obj) {
        return Object.prototype.toString.call(obj) === '[object Array]'        
    };

    function in_array(items, item) {
        for (var i = 0; i < items.length; i++) {
            if (items[i] == item) {                
                return true;
            }
        }
    };

    function flatten(items) {
        if (!is_array(items)) return [items]; 
        if (items.length == 0) return [];    
        var head = flatten(items[0]);
        var tail = flatten(items.slice(1));
        return ensure_array(head.concat(tail));
    };

    function each(items, fn) { 
        var result;
        for (var i = 0; i < items.length; i++) {
            result = fn(items[i], i);
        };
        return result;
    };

    function eachAsync(items, fn, callback) { 
        callback = callback || fnUtils.noop;
        if (!items.length) return callback();
        var completed = 0;
        var iterate = function() {
            fn(items[completed], completed, function(err, result) {
                if (err) return callback(err);
                if (++completed >= items.length) return callback(null, result);
                iterate();
            });
        };
        iterate();
    };    

    function collect(items, fn) {
        var results = [];
        for (var i = 0; i < items.length; i++) {
            results.push(fn(items[i]));
        }
        return results;
    };

    function inject(items, default_value, fn) {
        var result = default_value;
        for (var i = 0; i < items.length; i++) {
            result = fn(result, items[i]);            
        }
        return result;
    };

    function push_all(items, more_items) {
        var more_items = more_items ? [].concat(more_items) : [];
        for (var i = 0; i < more_items.length; i++) {
            items.push(more_items[i]);
        }        
    };

    function find_all(items, test) {
        var results = ensure_array();
        for (var i = 0; i < items.length; i++) {
            if (test(items[i])) {
                results.push(items[i]);
            }
        };
        return results;
    };

    function find(items, test) {        
        var result;
        for (var i = 0; i < items.length; i++) {
            if (test(items[i])) {
                result = items[i];                
                break;
            }
        };
        return result;
    };

    function naked(items) {
        return [].concat(items);
    };

    return ensure_array(obj);
};