"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDefinitionClass = void 0;
const propTrueType_1 = require("./propTrueType");
const pascalcase_1 = __importDefault(require("pascalcase"));
const utils_1 = require("../utils");
/**
 * 生成类定义
 * @param className class名称
 * @param properties 属性
 * @param isGenericsType 是否是泛型接口
 */
function createDefinitionClass(className, properties, additionalProperties, required) {
    var _a, _b;
    /** 枚举值 */
    let enums = [];
    let types = [];
    let model = { name: className, props: [], imports: [] };
    const propertiesEntities = Object.entries(properties || {});
    for (const [k, v] of propertiesEntities) {
        // console.log('props name', k)
        let { propType, isEnum, isArray, isType, ref, isUnionType, isCombinedType } = (0, propTrueType_1.propTrueType)(v);
        if (isEnum) {
            let enumName = `Enum${className}${(0, pascalcase_1.default)(k)}`;
            enums.push({
                name: enumName, text: `export enum ${enumName}{
        ${propType}
      }`
            });
            propType = isArray ? enumName + '[]' : enumName;
            ref = enumName;
        }
        if (isType) {
            let typeName = `I${className}${(0, pascalcase_1.default)(k)}`;
            enums.push({
                name: typeName, text: `type ${typeName} = ${propType};`
            });
            propType = isArray ? typeName + '[]' : typeName;
            ref = typeName;
        }
        if (isUnionType) {
            let typeName = `All${(0, pascalcase_1.default)(k)}Types`;
            let types = propType.split(',');
            enums.push({
                name: typeName,
                text: `export type ${typeName} = ${types.join(' | ')};`
            });
            propType = isArray ? typeName + '[]' : typeName;
            ref = typeName;
            model.imports.push(...types);
        }
        if (isCombinedType) {
            let typeName = `Combined${(0, pascalcase_1.default)(k)}Types`;
            let types = propType.split(',');
            enums.push({
                name: typeName,
                text: `export type ${typeName} = ${types.join(' & ')};`
            });
            propType = isArray ? typeName + '[]' : typeName;
            ref = typeName;
            model.imports.push(...types);
        }
        // 转化引用值到引用列表
        if (!!ref) {
            model.imports.push(ref);
        }
        let validationModel = (0, utils_1.getValidationModel)(k, v, required);
        // propsStr += classPropsTemplate(k, propType, v.description)
        model.props.push({ name: k, type: propType, format: v.format, desc: (_a = v.description) === null || _a === void 0 ? void 0 : _a.replace(/\//g, '\\/'), isType, isEnum, validationModel });
    }
    if (additionalProperties !== undefined) {
        let definition = additionalProperties;
        switch (typeof additionalProperties) {
            case "boolean":
                if (additionalProperties === false) {
                    break;
                }
                definition = { type: "object" };
            case "object":
            default:
                let { propType, isEnum, isArray, isType, ref, isUnionType, isCombinedType } = (0, propTrueType_1.propTrueType)(definition);
                let validationModel = null;
                // Since there are no additional properties the whole object will be of this type
                if (model.props.length == 0) {
                    model.props.push({
                        name: "[additionalProperties: string]",
                        type: propType,
                        format: definition.format,
                        desc: (_b = definition.description) === null || _b === void 0 ? void 0 : _b.replace(/\//g, '\\/'),
                        isType,
                        isEnum,
                        validationModel
                    });
                }
                else {
                    // We will have to use a union type to be able to use additional Properties
                    const typeName = `${className}WithAdditionalProperties`;
                    const types = [className, `{ [additionalProperties: string]: ${propType} }`];
                    enums.push({
                        name: typeName,
                        text: `export type ${typeName} = ${types.join(' & ')};`
                    });
                }
        }
    }
    // : classTemplate(className, propsStr, constructorStr)
    return { enums, model };
}
exports.createDefinitionClass = createDefinitionClass;
//# sourceMappingURL=createDefinitionClass.js.map