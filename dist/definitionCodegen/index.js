"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.definitionsCodeGen = void 0;
const utils_1 = require("../utils");
const createDefinitionClass_1 = require("./createDefinitionClass");
const createDefinitionEnum_1 = require("./createDefinitionEnum");
function definitionsCodeGen(definitions) {
    let definitionModels = {};
    let definitionEnums = {};
    if (!!definitions)
        for (const [k, v] of Object.entries(definitions)) {
            let className = (0, utils_1.refClassName)(k);
            // 如果已经转为泛型类型，则不需要重新定义
            if ((0, utils_1.isGenerics)(className)) {
                continue;
            }
            let result = null;
            // is an enum definition,just in swagger openAPI v2
            if (v.enum) {
                const enumDef = (0, createDefinitionEnum_1.createDefinitionEnum)(className, v.enum, v.type);
                definitionEnums[`#/definitions/${k}`] = {
                    name: enumDef.name,
                    value: enumDef
                };
            }
            else if (v.type === 'array') {
                // #TODO
            }
            else {
                // default definition generate
                const { enums, model } = (0, createDefinitionClass_1.createDefinitionClass)(className, v.properties, v.required);
                // console.log('createDefinitionClass', enums)
                enums.forEach(item => {
                    // definitionModels[item.name] = {
                    //   value: item.text
                    // }
                    definitionEnums[`#/definitions/${item.name}`] = {
                        name: item.name,
                        content: item.text
                    };
                });
                definitionModels[`#/definitions/${k}`] = {
                    value: model,
                    name: className
                };
            }
        }
    return { models: definitionModels, enums: definitionEnums };
}
exports.definitionsCodeGen = definitionsCodeGen;
//# sourceMappingURL=index.js.map