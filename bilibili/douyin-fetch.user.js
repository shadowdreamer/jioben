// ==UserScript==
// @name         XHR & Fetch Interceptor
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  拦截并修改XHR和Fetch请求响应 douyin
// @author       You
// @match        *://*.douyin.com/*
// @run-at       document-start
// @grant        none
// ==/UserScript==

(function () {
  'use strict';

  // 公共拦截器配置
  const interceptor = {
    beforeRequest: async (request) => {
      // console.log('拦截请求:', request)
      /* 请求处理示例：
      if(request.url.includes('/api')){
          request.headers['X-Modified'] = 'true'
          if(request.body) {
              try {
                  const data = await parseBody(request)
                  data.timestamp = Date.now()
                  request.body = JSON.stringify(data)
              } catch {}
          }
      }
      */
      return request
    },

    afterResponse: async (response) => {
      console.log('拦截响应:', response)
      /* 响应处理示例：
      if(response.url.includes('/api')){
          const data = await response.clone().json()
          data.modified = true
          return new Response(JSON.stringify(data), response)
      }
      */
      return response
    }
  }

  // 原生对象备份
  const nativeXHR = window.XMLHttpRequest
  const nativeFetch = window.fetch

  //================ XHR 拦截 ================//
  class CustomXHR {
    constructor() {
      this.xhr = new nativeXHR()
      this._setupProxy()
      // 保持原型链
      this.prototype = nativeXHR.prototype;
      // 伪装 CustomXHR 为 native 代码
      this.toString = function () {
        return 'function XMLHttpRequest() { [native code] }';
      };
    }

    _setupProxy () {
      const xhr = this.xhr
      const custom = this

      // 代理属性和方法
      for (const prop in xhr) {
        if (typeof xhr[prop] === 'function') {
          this[prop] = (...args) => xhr[prop].apply(xhr, args)
        } else {
          Object.defineProperty(this, prop, {
            get: () => xhr[prop],
            set: (val) => xhr[prop] = val
          })
        }
      }

      // 重写open方法
      let method, url
      const originalOpen = xhr.open.bind(xhr)
      xhr.open = (m, u) => {
        method = m
        url = u
        return originalOpen(m, u)
      }

      // 重写send方法
      const originalSend = xhr.send.bind(xhr)
      xhr.send = async (data) => {
        const req = await interceptor.beforeRequest({
          url: url,
          method: method,
          headers: xhr._headers || {},
          body: data
        })

        // 应用修改后的参数
        if (req.headers) {
          Object.entries(req.headers).forEach(([k, v]) => {
            xhr.setRequestHeader(k, v)
          })
        }
        return originalSend(req.body || data)
      }

      // 拦截响应
      const originalOnreadystatechange = xhr.onreadystatechange
      xhr.onreadystatechange = async function () {
        if (xhr.readyState === 4) {
          const res = await interceptor.afterResponse({
            url: url,
            status: xhr.status,
            headers: parseXHRHeaders(xhr.getAllResponseHeaders()),
            body: xhr.response,
            responseType: xhr.responseType
          })

          if (res) {
            Object.defineProperty(xhr, 'response', { value: res.body })
            Object.defineProperty(xhr, 'responseText', {
              value: typeof res.body === 'string' ? res.body : JSON.stringify(res.body)
            })
          }
        }
        originalOnreadystatechange?.apply(xhr, arguments)
      }
    }
  }

  //================ Fetch 拦截 ================//
  const customFetch = async (input, init = {}) => {
    // 构造请求对象
    const url = typeof input === 'string' ? input : input.url
    const request = await interceptor.beforeRequest({
      url: url,
      method: init.method || 'GET',
      headers: new Headers(init.headers || {}),
      body: init.body,
      referrer: init.referrer,
      mode: init.mode
    })

    // 发送修改后的请求
    const response = await nativeFetch(input, {
      ...init,
      method: request.method,
      headers: request.headers,
      body: request.body
    })

    // 处理响应
    const modifiedResponse = await interceptor.afterResponse({
      url: response.url,
      status: response.status,
      headers: response.headers,
      body: response.body,
      redirected: response.redirected
    })

    return modifiedResponse || response
  }
  // 伪装 customFetch 为 native 代码
  customFetch.toString = function () {
    return 'function fetch() { [native code] }';
  };
  Object.defineProperty(window, 'fetch', {
    configurable: false,
    enumerable: true,
    writable: false,
    value: customFetch
  });
  //================ 工具函数 ================//
  function parseXHRHeaders (headerString) {
    return headerString.split('\r\n').reduce((acc, line) => {
      const [key, value] = line.split(': ')
      if (key) acc[key] = value
      return acc
    }, {})
  }

  async function parseBody (request) {
    const contentType = request.headers?.['Content-Type'] || ''
    const body = request.body

    if (contentType.includes('json')) {
      return JSON.parse(body)
    }
    if (contentType.includes('form')) {
      return Object.fromEntries(new URLSearchParams(body))
    }
    return body
  }


  Object.defineProperty(window, 'XMLHttpRequest', {
    configurable: false,
    enumerable: true,
    writable: false,
    value: CustomXHR
  });
})()