export interface ISwaggerSource {
    swagger?: string | undefined;
    openapi?: string | undefined;
    info: string;
    paths: IPaths;
    securityDefinitions: string;
    definitions: IDefinitions;
    components: IComponents;
    externalDocs: string;
    basePath?: string | undefined;
}
export interface IPaths {
    [url: string]: IRequestUrl;
}
export interface IRequestUrl {
    [method: string]: IRequestMethod;
}
export interface IRequestMethod {
    tags: string[];
    summary: string;
    description: string;
    operationId: string;
    consumes: string[];
    produces: string[];
    parameters: IParameter[];
    requestBody: IRequestBody;
    responses: {
        [key: string]: {
            description: string;
            schema: {
                '$ref': string;
                'type'?: string;
                'items'?: IParameterItems;
                'format'?: string;
            };
            content: {
                [key: string]: {
                    schema: {
                        '$ref': string;
                        'type'?: string;
                        'items'?: IParameterItems;
                        'format'?: string;
                    };
                };
            };
        };
    };
}
export interface IRequestBody {
    content: {
        [key: string]: {
            schema: ISchema;
        };
    };
}
export declare type IParameterIn = 'path' | 'formData' | 'query' | 'body' | 'header';
export interface IParameter {
    in: IParameterIn;
    name: string;
    description: string;
    required: string;
    schema: IParameterSchema;
    items: IParameterItems;
    type: string;
    format: string;
    $ref?: string;
}
export interface IParameterSchema {
    $ref: string;
    items?: IParameterItems;
    type: string;
}
export interface IParameterItems {
    type?: string;
    format?: string;
    $ref: string;
    items?: IParameterItems;
}
export interface IDefinitions {
    [key: string]: IDefinition;
}
export interface IDefinition {
    required: string[];
    type: 'object' | 'array';
    properties: IDefinitionProperties;
    additionalProperties: IDefinitionProperty | boolean | undefined;
    enum: any[];
    items: IDefinitionProperty;
}
export interface IDefinitionProperties {
    [key: string]: IDefinitionProperty;
}
export interface IDefinitionProperty {
    type: string;
    enum: any[];
    format: string;
    maxLength: number;
    $ref: string;
    allOf: IDefinitionProperty[];
    oneOf: IDefinitionProperty[];
    items: IDefinitionProperty;
    description: string;
    additionalProperties: IDefinitionProperty | boolean | undefined;
}
export interface IComponents {
    schemas: {
        [key: string]: IDefinition;
    };
}
export interface ISchema {
    '$ref': string;
    'type'?: string;
    'items'?: IParameterItems;
    'format'?: string;
    'properties'?: {
        [key: string]: IParameterItems;
    };
}
export interface IDictionary<TKey, TValue = any> {
    [key: string]: TValue;
}
export interface IDictionary<TKey, TValue = any> {
    [key: number]: TValue;
}
export declare class Dictionary<TKey, TValue> implements IDictionary<TKey, TValue> {
    [key: string]: TValue;
}
export declare class Map<TKey, TValue> implements IDictionary<TKey, TValue> {
    [key: string]: TValue;
}
