"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRequestParameters = void 0;
const utils_1 = require("../utils");
const camelcase_1 = __importDefault(require("camelcase"));
/**
 * 参数去重
 * 后台书写不规范,存在参数重名的情况
 * @param params
 */
function getUniqParams(params) {
    const uniqParams = {};
    params.forEach(v => {
        // _${v.in}
        // TODO:同名但是v.in= query |path |body 的情况同时出现如何处理？分出不同的request参数？
        if ('$ref' in v && !('name' in v)) {
            v.name = (0, utils_1.refClassName)(v.$ref);
        }
        if (!v.name.includes('[0]')) {
            //DTO class中存在List<T>时会出现这种参数 (list[0].prop)
            uniqParams[`${v.name}`] = v;
        }
    });
    return Object.values(uniqParams);
}
/**
 * 生成参数
 * @param params
 */
function getRequestParameters(params, useHeaderParameters) {
    params = getUniqParams(params);
    let requestParameters = '';
    let requestFormData = '';
    let requestPathReplace = '';
    let queryParameters = [];
    let bodyParameters = [];
    let headerParameters = [];
    let imports = [];
    let moreBodyParams = params.filter(item => item.in === 'body').length > 1;
    params.forEach(p => {
        // 根据设置跳过请求头中的参数
        if (!useHeaderParameters && p.in === 'header')
            return;
        let propType = '';
        // 引用类型定义
        if (p.schema) {
            if (p.schema.items) {
                propType = (0, utils_1.refClassName)(p.schema.items.$ref);
                if (p.schema.type && p.schema.type === 'array') {
                    propType += '[]';
                }
            }
            else if (p.schema.$ref) {
                propType = (0, utils_1.refClassName)(p.schema.$ref);
                // console.log('propType', refClassName(p.schema.$ref))
            }
            else if (p.schema.type) {
                propType = (0, utils_1.toBaseType)(p.schema.type);
            }
            else {
                throw new Error('Could not find property type on schema');
            }
            imports.push(propType);
        }
        else if (p.items) {
            propType = p.items.$ref ? (0, utils_1.refClassName)(p.items.$ref) + '[]' : (0, utils_1.toBaseType)(p.items.type) + '[]';
            imports.push(propType);
        }
        // 基本类型
        else {
            propType = (0, utils_1.toBaseType)(p.type);
        }
        const paramName = (0, camelcase_1.default)(p.name);
        requestParameters += `
    /** ${p.description || ''} */
    ${paramName}${p.required ? '' : '?'}:${propType},`;
        // 如果参数是从formData 提交
        if (p.in === 'formData') {
            requestFormData += `if(params['${paramName}']){
        if(Object.prototype.toString.call(params['${paramName}']) === '[object Array]'){
          for (const item of params['${paramName}']) {
            data.append('${p.name}',item as any)
          }
        } else {
          data.append('${p.name}',params['${paramName}'] as any)
        }
      }\n
      `;
        }
        else if (p.in === 'path') {
            requestPathReplace += `url = url.replace('{${p.name}}',params['${paramName}']+'')\n`;
        }
        else if (p.in === 'query') {
            queryParameters.push(`'${p.name}':params['${paramName}']`);
        }
        else if (p.in === 'body') {
            const body = moreBodyParams ? `'${p.name}':params['${paramName}']` : `params['${paramName}']`;
            // var body = p.schema
            //   ? p.schema.type === 'array'
            //     ? `[...params['${paramName}']]`
            //     : `...params['${paramName}']`
            //   : `'${p.name}':params['${paramName}']`
            bodyParameters.push(body);
        }
        else if (p.in === 'header') {
            headerParameters.push(`'${p.name}':params['${paramName}']`);
        }
    });
    const bodyParameter = moreBodyParams ? `{${bodyParameters.join(',')}}` : bodyParameters.join(',');
    return {
        requestParameters,
        requestFormData,
        requestPathReplace,
        queryParameters,
        bodyParameter,
        headerParameters,
        imports
    };
}
exports.getRequestParameters = getRequestParameters;
//# sourceMappingURL=getRequestParameters.js.map