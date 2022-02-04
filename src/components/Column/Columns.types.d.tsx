import { CSSProperties } from "react";
import { FieldExtensionSDK } from "@contentful/app-sdk";
import { BreakpointOption } from "../../locations/app-config/ConfigScreen.types";

export type HijackedFieldExtensionSDK = FieldExtensionSDK & {
  field: any;
};

export interface ColumnSizes {
  [key: string]: {
    value: string;
    isCustom: boolean;
  };
}

export interface Item extends Object {
  sys: {
    id: string;
    type: string;
    linkType: string;
  };
}

export interface Column {
  columnSizes: ColumnSizes;
  items: Item[];
}

export interface ColumnProps {
  sdk: FieldExtensionSDK;
  style: CSSProperties;
  allowedContentModels: string[];
  breakpoints: BreakpointOption[];
  column: Column;
  index: number;
  onChange: (column: Column) => void;
  onRemove: (index: number) => void;
}

export interface ColumnSizesProps {
  breakpoints: BreakpointOption[];
  onChange: (columnSizes: ColumnSizes) => void;
  onRemove: (...args: number[]) => void;
  sdk: FieldExtensionSDK;
  sizes: ColumnSizes;
}

export interface ColumnItemsProps {
  allowedContentModels: string[];
  items: Item[];
  onChange: (items: Item[]) => void;
  sdk: FieldExtensionSDK;
}

export interface ColumnSizesChange {
  columnSize: string;
  device: "mobile" | "tablet" | "desktop" | string;
  isCustomSize: boolean;
}
