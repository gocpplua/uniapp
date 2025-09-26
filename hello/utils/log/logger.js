/**
 * 公共日志工具类
 * 提供统一的日志格式化输出功能
 */

class BaseLogger {
    constructor(moduleName = '', parentLogger = null) {
      this.moduleName = moduleName;
      this.parentLogger = parentLogger;
      this.localRequiredFields = {};
      
      // 如果没有父Logger，说明是主Logger
      if (!parentLogger) {
        this.globalRequiredFields = {};
        this.errorCallback = null;
      }
    }
  
    /**
     * 创建子Logger
     * @param {string} moduleName 模块名
     * @returns {BaseLogger} 新的Logger实例
     */
    create(moduleName) {
      return new BaseLogger(moduleName, this.getRootLogger());
    }
  
    /**
     * 获取根Logger（主Logger）
     * @returns {BaseLogger} 根Logger实例
     */
    getRootLogger() {
      return this.parentLogger || this;
    }
  
    /**
     * 设置全局必打印字段（仅主Logger可用）
     * @param {Object} fields 必打印的字段对象
     */
    setGlobalRequiredFields(fields) {
      const root = this.getRootLogger();
      root.globalRequiredFields = { ...root.globalRequiredFields, ...fields };
    }
  
    /**
     * 设置局部必打印字段
     * @param {Object} fields 必打印的字段对象
     */
    setRequiredFields(fields) {
      this.localRequiredFields = { ...this.localRequiredFields, ...fields };
    }
  
    /**
     * 删除全局必打印字段（仅主Logger可用）
     * @param {string|Array<string>} fieldNames 要删除的字段名
     */
    removeGlobalRequiredFields(fieldNames) {
      const root = this.getRootLogger();
      const fieldsToRemove = Array.isArray(fieldNames) ? fieldNames : [fieldNames];
      fieldsToRemove.forEach(fieldName => {
        delete root.globalRequiredFields[fieldName];
      });
    }
  
    /**
     * 删除局部必打印字段
     * @param {string|Array<string>} fieldNames 要删除的字段名
     */
    removeRequiredFields(fieldNames) {
      const fieldsToRemove = Array.isArray(fieldNames) ? fieldNames : [fieldNames];
      fieldsToRemove.forEach(fieldName => {
        delete this.localRequiredFields[fieldName];
      });
    }
  
    /**
     * 清空所有必打印字段
     */
    clearRequiredFields() {
      this.localRequiredFields = {};
    }
  
    /**
     * 清空全局必打印字段（仅主Logger可用）
     */
    clearGlobalRequiredFields() {
      const root = this.getRootLogger();
      root.globalRequiredFields = {};
    }
  
    /**
     * 注册错误回调
     * @param {Function} callback 错误回调函数
     */
    registerErrorCallback(callback) {
      const root = this.getRootLogger();
      if (typeof callback === 'function') {
        root.errorCallback = callback;
      }
    }
  
    /**
     * 注销错误回调
     */
    unregisterErrorCallback() {
      const root = this.getRootLogger();
      root.errorCallback = null;
    }
  
    /**
     * 获取所有必打印字段（全局+局部）
     * @returns {Object} 合并后的必打印字段对象
     */
    getAllRequiredFields() {
      const root = this.getRootLogger();
      const globalFields = root.globalRequiredFields || {};
      return { ...globalFields, ...this.localRequiredFields };
    }
  
    /**
     * 获取必打印字段的字符串表示
     * @returns {string} 格式化的必打印字段字符串
     */
    getRequiredFieldsString() {
      const allFields = this.getAllRequiredFields();
      const fields = Object.entries(allFields)
        .map(([key, value]) => `${key}:${value}`)
        .join(' ');
      return fields ? `[${fields}]` : '';
    }
  
    /**
     * 获取模块名字符串
     * @returns {string} 格式化的模块名字符串
     */
    getModuleNameString() {
      return this.moduleName ? `[${this.moduleName}]` : '';
    }
  
    /**
     * 获取格式化的时间戳
     * @returns {string} 格式化的时间戳字符串
     */
    getTimeStamp() {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      const milliseconds = String(now.getMilliseconds()).padStart(3, '0');
      return `[${hours}:${minutes}:${seconds}.${milliseconds}]`;
    }
  
    /**
     * 格式化日志前缀
     * @returns {Array} 日志前缀数组
     */
    getLogPrefix() {
      const prefix = [this.getTimeStamp()];
      
      const moduleName = this.getModuleNameString();
      if (moduleName) {
        prefix.push(moduleName);
      }
      
      const requiredFields = this.getRequiredFieldsString();
      if (requiredFields) {
        prefix.push(requiredFields);
      }
      
      return prefix;
    }
  
    /**
     * 输出普通日志
     * @param {...any} args 日志参数
     */
    log(...args) {
      console.log(...this.getLogPrefix(), ...args);
    }
  
    /**
     * 输出错误日志
     * @param {...any} args 日志参数
     */
    error(...args) {
      const prefix = this.getLogPrefix();
      console.error(...prefix, ...args);
      
      const root = this.getRootLogger();
      if (root.errorCallback) {
        try {
          const context = {
            moduleName: this.moduleName,
            requiredFields: this.getAllRequiredFields(),
            timestamp: this.getTimeStamp()
          };
          root.errorCallback(context, args);
        } catch (error) {
          console.error('Error callback execution failed:', error);
        }
      }
    }
  
    /**
     * 输出警告日志
     * @param {...any} args 日志参数
     */
    warn(...args) {
      console.warn(...this.getLogPrefix(), ...args);
    }
  
    /**
     * 输出信息日志
     * @param {...any} args 日志参数
     */
    info(...args) {
      console.info(...this.getLogPrefix(), ...args);
    }
  
    /**
     * 输出调试日志
     * @param {...any} args 日志参数
     */
    debug(...args) {
      console.debug(...this.getLogPrefix(), ...args);
    }
  
    /**
     * 输出堆栈信息
     * @param {...any} args 日志参数
     */
    stack(...args) {
      console.log(...this.getLogPrefix(), ...args, '\n', new Error().stack);
    }
  
    /**
     * 将参数转换为字符串，支持对象解析
     * @param {any} arg 要转换的参数
     * @returns {string} 转换后的字符串
     */
    stringifyArg(arg) {
      if (arg === null) return 'null';
      if (arg === undefined) return 'undefined';
      if (typeof arg === 'string') return arg;
      if (typeof arg === 'object') {
        try {
          return JSON.stringify(arg, null, 2);
        } catch (error) {
          return `[object ${arg.constructor?.name || 'Object'}]`;
        }
      }
      return String(arg);
    }
  }
  
  // 创建主Logger实例
  const baseLogger = new BaseLogger();
  
  export default baseLogger;
  export { BaseLogger };