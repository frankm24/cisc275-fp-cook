import { v4 as uuidv4 } from "uuid";

export type ComponentType =
    | "Text"
    | "TextBox"
    | "TextArea"
    | "CheckBox"
    | "SelectBox"
    | "Button"
    | "Header";

export interface TextConfig {
    content: string;
}
export interface TextBoxConfig {
    name: string;
    defaultValue: string;
}
export interface TextAreaConfig {
    name: string;
    defaultValue: string;
}
export interface CheckBoxConfig {
    name: string;
    defaultValue: boolean;
}
export interface SelectBoxConfig {
    name: string;
    options: string[];
    defaultValue: string;
}
export interface ButtonConfig {
    label: string;
    route: string;
}
export interface HeaderConfig {
    content: string;
    level: 1 | 2 | 3 | 4 | 5 | 6;
}

export type ComponentConfig =
    | TextConfig
    | TextBoxConfig
    | TextAreaConfig
    | CheckBoxConfig
    | SelectBoxConfig
    | ButtonConfig
    | HeaderConfig;

export interface ComponentStyle {
    color?: string;
    backgroundColor?: string;
    fontFamily?: string;
    fontSize?: string;
    fontWeight?: string;
    border?: string;
    borderRadius?: string;
    padding?: string;
    margin?: string;
    display?: string;
    flexDirection?: string;
    gap?: string;
    justifyContent?: string;
    alignItems?: string;
}

export interface PageComponent {
    id: string;
    type: ComponentType;
    config: ComponentConfig;
    style: ComponentStyle;
}

export interface PageStyle {
    backgroundColor?: string;
    color?: string;
    fontFamily?: string;
    display?: string;
    flexDirection?: string;
    gap?: string;
    padding?: string;
    justifyContent?: string;
    alignItems?: string;
}

export interface IfAnnotation {
    id: string;
    description: string;
}

export interface ForAnnotation {
    id: string;
    description: string;
}

export interface DrafterPage {
    id: string;
    name: string;
    components: PageComponent[];
    style: PageStyle;
    stateAnnotation: string;
    ifAnnotations: IfAnnotation[];
    forAnnotations: ForAnnotation[];
    position: { x: number; y: number };
}

export interface Route {
    id: string;
    name: string;
    sourcePageId: string;
    targetPageId: string;
    stateAnnotation: string;
    ifAnnotations: IfAnnotation[];
    forAnnotations: ForAnnotation[];
}

export interface StateAttribute {
    id: string;
    name: string;
    type: string;
    description: string;
    isListOf?: boolean;
}

export interface SecondaryDataclass {
    id: string;
    name: string;
    attributes: StateAttribute[];
}

export interface StateModel {
    primaryAttributes: StateAttribute[];
    secondaryDataclasses: SecondaryDataclass[];
}

export interface Project {
    id: string;
    name: string;
    purpose: string;
    pages: DrafterPage[];
    routes: Route[];
    stateModel: StateModel;
    lastModified: number;
}

export function makeId(): string {
    return uuidv4();
}
