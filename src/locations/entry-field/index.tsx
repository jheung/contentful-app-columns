import React, { useState, useEffect } from "react";
import { FieldExtensionSDK } from "@contentful/app-sdk";
import cloneDeep from "lodash.clonedeep";
import tokens from "@contentful/f36-tokens";
import { Button } from "@contentful/f36-components";
import { PlusIcon } from "@contentful/f36-icons";
import { Column as ColumnType } from "../../components/Column/Columns.types.d";
import { AppInstallationParameters } from "../app-config/ConfigScreen.types";
import { DEFAULT_COLUMN_SETTINGS } from "../../constants";
import { Column } from "../../components/Column";

interface FieldProps {
  sdk: FieldExtensionSDK;
}

interface AppInstanceParameters {
  preset: string;
  breakpoints: string;
}

const EntryField = ({ sdk }: FieldProps) => {
  const { presets, breakpoints } = sdk.parameters
    .installation as AppInstallationParameters;
  const { preset, breakpoints: instanceBreakpoints } = sdk.parameters
    .instance as AppInstanceParameters;
  const fieldPreset = presets.find(
    (_preset) => _preset.id === preset || _preset.name === preset
  );
  const fieldBreakpoints = breakpoints.find(
    (_breakpoints) =>
      _breakpoints.id === instanceBreakpoints ||
      _breakpoints.name === instanceBreakpoints
  );

  const [value, setValue] = useState<ColumnType[]>(
    sdk.field.getValue() || [DEFAULT_COLUMN_SETTINGS]
  );

  const onExternalChange = (updatedValue: ColumnType[]) => {
    setValue(updatedValue);
  };

  const handleUpdateColumn = (index: number, updatedColumn: ColumnType) => {
    const updatedData = cloneDeep(sdk.field.getValue());
    updatedData[index] = updatedColumn;

    sdk.field.setValue(updatedData);
  };

  const handleAddColumn = () => {
    const initialData = sdk.field.getValue();

    if (initialData) {
      const updatedData = [...initialData, DEFAULT_COLUMN_SETTINGS];
      sdk.field.setValue(updatedData);
    } else {
      sdk.field.setValue([DEFAULT_COLUMN_SETTINGS]);
    }
  };

  const handleRemoveColumn = (index: number) => {
    const initialData = sdk.field.getValue();
    const updatedData = [
      ...initialData.slice(0, index),
      ...initialData.slice(index + 1),
    ];

    sdk.field.setValue(updatedData);
  };

  useEffect(() => {
    // Handler for external field value changes (e.g. when multiple authors are working on the same entry).
    sdk.window.startAutoResizer();

    const detachValueChangeHandler = sdk.field.onValueChanged(onExternalChange);
    return detachValueChangeHandler;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{ minHeight: value?.length > 0 ? "25rem" : "auto" }}>
      {value?.map((column, index) => (
        <Column
          key={index}
          allowedContentModels={fieldPreset?.acceptedContentTypes ?? []}
          breakpoints={
            fieldBreakpoints?.breakpoints ?? breakpoints[0].breakpoints
          }
          column={column}
          index={index}
          onChange={(updatedColumn: ColumnType) =>
            handleUpdateColumn(index, updatedColumn)
          }
          onRemove={handleRemoveColumn}
          sdk={sdk}
          style={{ marginBottom: tokens.spacingM }}
        />
      ))}
      <Button startIcon={<PlusIcon />} onClick={handleAddColumn} size="small">
        Add column
      </Button>
    </div>
  );
};

export default EntryField;
export { EntryField };
