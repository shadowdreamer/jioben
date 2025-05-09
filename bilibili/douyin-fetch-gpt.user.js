// ==UserScript==
// @name         URL-Based XHR & fetch Interceptor (Response Modification Supported)
// @namespace    http://your.namespace.here
// @version      1.1
// @description  在文档加载前劫持 XMLHttpRequest 与 fetch，根据 URL 分发不同的请求/响应拦截器，其中 fetch 拦截器可返回修改后的 Response 对象（XHR 部分保持只读）
// @author       Your Name
// @match        *://*.douyin.*/*
// @run-at       document-start
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    /***************** 拦截器管理（按 URL 分发） *****************/
    // 定义请求与响应拦截器数组，每项包含 { rule, interceptor }
    // rule: 可以为正则表达式或一个接受 url 字符串返回布尔值的函数
    const requestInterceptors = [];
    const responseInterceptors = [];

    /**
     * 添加请求拦截器
     * @param {RegExp|Function} rule - 匹配 URL 的规则（正则表达式或函数，函数接收 URL 字符串，返回 true/false）
     * @param {Function} interceptor - 拦截器函数，形如 function(req) { ... }
     */
    window.__addRequestInterceptor = function(rule, interceptor) {
        if (typeof interceptor === 'function') {
            requestInterceptors.push({ rule, interceptor });
        }
    };

    /**
     * 添加响应拦截器
     * @param {RegExp|Function} rule - 匹配 URL 的规则（正则表达式或函数，函数接收 URL 字符串，返回 true/false）
     * @param {Function} interceptor - 拦截器函数，形如 async function(res) { ... }，可返回新的 Response 对象
     */
    window.__addResponseInterceptor = function(rule, interceptor) {
        if (typeof interceptor === 'function') {
            responseInterceptors.push({ rule, interceptor });
        }
    };

    /**
     * 根据 URL 判断一个规则是否匹配  
     * @param {RegExp|Function} rule 
     * @param {string} url 
     * @returns {boolean}
     */
    function ruleMatches(rule, url) {
        if (typeof rule === 'function') {
            try {
                return rule(url);
            } catch (e) {
                console.error('Rule function error:', e);
                return false;
            }
        } else if (rule instanceof RegExp) {
            return rule.test(url);
        }
        return false;
    }

    /***************** 劫持 fetch *****************/
    const originalFetch = window.fetch;
    function customFetch(input, init) {
        // 解析 URL：input 可能为 string 或 Request 对象
        let url;
        if (typeof input === 'string') {
            url = input;
        } else if (input && typeof input.url === 'string') {
            url = input.url;
        } else {
            // 如果无法解析 URL，则直接调用原生 fetch
            return originalFetch(input, init);
        }

        // 筛选出匹配当前 URL 的请求拦截器
        const applicableRequestInterceptors = requestInterceptors.filter(item => ruleMatches(item.rule, url));
        // 筛选出匹配当前 URL 的响应拦截器
        const applicableResponseInterceptors = responseInterceptors.filter(item => ruleMatches(item.rule, url));

        // 构造请求对象，供拦截器处理
        let req = { input, init, url };

        // 执行请求拦截器（同步执行，可在这里修改 req.input 与 req.init）
        try {
            applicableRequestInterceptors.forEach(item => {
                item.interceptor(req);
            });
        } catch (e) {
            console.error('Fetch request interceptor error:', e);
        }

        // 调用原生 fetch，并依次执行响应拦截器
        return originalFetch(req.input, req.init).then(function(initialResponse) {
            // 通过链式 Promise 依次调用每个响应拦截器
            return applicableResponseInterceptors.reduce((chain, { interceptor }) => {
                return chain.then(currentResponse => {
                    // 拦截器的返回值可能是新的 Response 对象，或者 undefined（表示不修改）
                    return Promise.resolve(interceptor(currentResponse)).then(modifiedResponse => {
                        // 如果拦截器返回一个新的 Response 对象，则使用之，否则继续使用原响应
                        return (modifiedResponse instanceof Response) ? modifiedResponse : currentResponse;
                    });
                });
            }, Promise.resolve(initialResponse));
        });
    }
    // 伪装 customFetch 为 native 代码
    customFetch.toString = function() {
        return 'function fetch() { [native code] }';
    };
    Object.defineProperty(window, 'fetch', {
        configurable: false,
        enumerable: true,
        writable: false,
        value: customFetch
    });

    /***************** 劫持 XMLHttpRequest *****************/
    const OriginalXHR = window.XMLHttpRequest;
    function CustomXHR() {
        // 创建一个原生 XHR 实例
        const xhrInstance = new OriginalXHR();

        // 保存原始 open 与 send 方法
        const originalOpen = xhrInstance.open;
        const originalSend = xhrInstance.send;

        // 重写 open 方法：记录请求信息，并根据 URL 分配拦截器
        xhrInstance.open = function(method, url, async, user, password) {
            this._url = url;
            this._requestInfo = { method, url, async, user, password };
            // 根据 URL 筛选匹配的拦截器
            this._applicableRequestInterceptors = requestInterceptors.filter(item => ruleMatches(item.rule, url));
            this._applicableResponseInterceptors = responseInterceptors.filter(item => ruleMatches(item.rule, url));
            return originalOpen.apply(this, arguments);
        };

        // 重写 send 方法：在发送前执行请求拦截器
        xhrInstance.send = function(body) {
            if (this._applicableRequestInterceptors && this._applicableRequestInterceptors.length > 0) {
                let req = { xhr: this, body, url: this._url };
                try {
                    this._applicableRequestInterceptors.forEach(item => {
                        item.interceptor(req);
                    });
                } catch (e) {
                    console.error('XHR request interceptor error:', e);
                }
            }
            return originalSend.apply(this, arguments);
        };

        // 在 readyState 变化时检测响应完成，并执行响应拦截器（注意：这里无法真正修改内置 response，只能用于监控或统计）
        xhrInstance.addEventListener('readystatechange', function() {
            if (this.readyState === 4 && this._applicableResponseInterceptors && this._applicableResponseInterceptors.length > 0) {
                try {
                    this._applicableResponseInterceptors.forEach(item => {
                        item.interceptor(xhrInstance);
                    });
                } catch (e) {
                    console.error('XHR response interceptor error:', e);
                }
            }
        });

        return xhrInstance;
    }
    // 伪装 CustomXHR 为 native 代码
    CustomXHR.toString = function() {
        return 'function XMLHttpRequest() { [native code] }';
    };
    // 保持原型链
    CustomXHR.prototype = OriginalXHR.prototype;
    Object.defineProperty(window, 'XMLHttpRequest', {
        configurable: false,
        enumerable: true,
        writable: false,
        value: CustomXHR
    });

    /***************** 示例拦截器 *****************/
    // 示例1：针对包含 "example.com" 的 URL，请求拦截器仅输出日志
    window.__addRequestInterceptor(/example\.com/, function(req) {
        console.log('[Interceptor - example.com] 请求信息：', req.url, req.input || (req.xhr && req.xhr._requestInfo));
        // 例如：可修改 req.init 或 req.body 改变请求参数
    });
    // 示例2：针对包含 "example.com" 的 URL，响应拦截器输出状态码，并不修改 Response
    window.__addResponseInterceptor(/example\.com/, function(res) {
        if (res instanceof Response) {
            console.log('[Interceptor - example.com] fetch 响应状态：', res.status);
        } else if (res && typeof res.status === 'number') {
            console.log('[Interceptor - example.com] XHR 响应状态：', res.status);
        }
        // 未返回新 Response，则继续使用原响应
    });

    // 示例3：针对 URL 包含 "api.mysite.com/v1" 的请求，修改 fetch 响应内容
    // 拦截器读取原响应文本，将其中 "foo" 替换为 "bar"，然后返回新的 Response 对象
    window.__addResponseInterceptor(/douyin/, async function(res) {
        if (!(res instanceof Response)) return res;
        try {
            let text = await res.text();
            // 修改响应内容（例如：替换文本）
            text = text.replace(/foo/g, 'bar');
            // 构造一个新的 Response 对象，并复制原响应的状态、headers 等信息
            const newRes = new Response(text, {
                status: res.status,
                statusText: res.statusText,
                headers: res.headers
            });
            console.log('[Interceptor - api.mysite.com/v1] 修改响应内容完成');
            return newRes;
        } catch (e) {
            console.error('Response modification error:', e);
            return res;
        }
    });

})();
