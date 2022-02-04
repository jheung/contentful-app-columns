import React, { useRef, useEffect, useCallback } from "react";
import cloneDeep from "lodash.clonedeep";
import {
  Column as ColumnType,
  ColumnProps,
  ColumnSizes as ColumnSizesType,
  HijackedFieldExtensionSDK,
  Item,
} from "./Columns.types.d";
import { ColumnSizes } from "./Sizes";
import { ColumnItems } from "./Items";

const Column = ({
  allowedContentModels,
  column,
  index,
  onChange,
  onRemove,
  sdk,
  breakpoints,
  style,
}: ColumnProps) => {
  // WARNING: UGLY HACK - No real way to change the default action MultipleEntryReferenceEditor
  // MultipleEntryReferenceEditor automatically gets and sets the value from the sdk
  const hijackedSdk = useRef(
    (() => {
      // Clone initial sdk but remove existing listeners
      const cloned: HijackedFieldExtensionSDK = cloneDeep(sdk);
      cloned.field._valueSignal._listeners = {};
      cloned.field._valueSignal._id = 0;
      return cloned;
    })()
  );

  // We need to hijack it so we can override and handle the default behaviour to get / set inside our object
  hijackedSdk.current.field.getValue = () => {
    return sdk.field.getValue()?.[index]?.items || [];
  };

  // Hijack initial setValue function to bypass default callbacks and pushing updated values to onChange prop which handles all changes
  hijackedSdk.current.field.setValue = (value: any) => {
    return new Promise((resolve, reject) => {
      const updatedColumn: ColumnType = {
        columnSizes: column.columnSizes,
        items: value,
      };
      if (JSON.stringify(column.items) !== JSON.stringify(value)) {
        onChange(updatedColumn);
      }
      resolve(updatedColumn);
    });
  };

  // Hijack initial onValueChanged function with exact same function but hijack the value that is passed to the callbacks
  hijackedSdk.current.field.onValueChanged = (
    callback: (value: any) => any
  ) => {
    return hijackedSdk.current.field._valueSignal.attach(() => {
      return callback(sdk.field.getValue()?.[index]?.items || []);
    });
  };

  const handleItemsChange = (items: Item[]) => {
    const updatedColumn = {
      columnSizes: column.columnSizes,
      items,
    };
    if (JSON.stringify(column.items) !== JSON.stringify(items)) {
      onChange(updatedColumn);
    }
  };

  const handleColumnSizeChange = (columnSizes: ColumnSizesType) => {
    const updatedColumn = {
      columnSizes,
      items: sdk.field.getValue()?.[index]?.items || [],
    };
    onChange(updatedColumn);
  };

  const handleRemoveColumn = useCallback<(...args: number[]) => void>(() => {
    onRemove(index);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  useEffect(() => {
    // When the underlying field value changes, dispatch our own update to the hijacked sdk to update their provider
    const detachValueChangeHandler = sdk.field.onValueChanged((value) => {
      hijackedSdk.current.field._valueSignal.dispatch(column?.items || []);
    });
    return detachValueChangeHandler;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={style}>
      <ColumnSizes
        breakpoints={breakpoints}
        onChange={handleColumnSizeChange}
        onRemove={handleRemoveColumn}
        sdk={sdk}
        sizes={column.columnSizes}
      />
      <ColumnItems
        allowedContentModels={allowedContentModels}
        items={column.items}
        onChange={handleItemsChange}
        sdk={hijackedSdk.current}
      />
    </div>
  );
};

export default Column;
export { Column };
