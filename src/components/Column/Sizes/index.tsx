import React, { useState, useEffect } from "react";
import tokens from "@contentful/f36-tokens";
import { Flex, IconButton, Stack, Tooltip } from "@contentful/f36-components";
import { DeleteIcon, SettingsIcon } from "@contentful/f36-icons";
import { ColumnSizesProps, ColumnSizesChange } from "../Columns.types.d";
import { ColumnSizeDropdown } from "./Dropdown";

const ColumnSizes = React.memo(
  ({
    breakpoints,
    onChange,
    onRemove: handleRemoveColumn,
    sdk,
    sizes,
  }: ColumnSizesProps) => {
    const [isAdvancedSettings, setIsAdvancedSettings] = useState(false);

    const handleUseAdvancedSettings = () => {
      setIsAdvancedSettings(!isAdvancedSettings);
    };

    const handleColumnSizesChange = (changedColumnSizes: ColumnSizesChange) => {
      const updatedColumnSizes = {
        ...sizes,
        [changedColumnSizes.device]: {
          isCustom: changedColumnSizes.isCustomSize,
          value: changedColumnSizes.columnSize,
        },
      };

      onChange(updatedColumnSizes);
    };

    useEffect(() => {
      sdk.window.updateHeight();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
      <Flex
        alignItems="center"
        justifyContent="space-between"
        padding="spacingS"
        style={{
          backgroundColor: tokens.gray100,
          borderColor: tokens.gray400,
          borderStyle: "solid",
          borderTopLeftRadius: tokens.borderRadiusMedium,
          borderTopRightRadius: tokens.borderRadiusMedium,
          borderWidth: "1px",
        }}
      >
        <Flex flexGrow={1} flexShrink={0} flexBasis="auto" gap="spacingL">
          {breakpoints.slice(0, 1).map((breakpoint) => (
            <ColumnSizeDropdown
              breakpoints={breakpoint}
              isCustom={sizes[breakpoint.value]?.isCustom}
              label={breakpoint.label}
              onChange={handleColumnSizesChange}
              size={sizes[breakpoint.value]?.value}
            />
          ))}
          {isAdvancedSettings && (
            <>
              {breakpoints.slice(1).map((breakpoint) => (
                <ColumnSizeDropdown
                  breakpoints={breakpoint}
                  isCustom={sizes[breakpoint.value]?.isCustom}
                  label={breakpoint.label}
                  onChange={handleColumnSizesChange}
                  size={sizes[breakpoint.value]?.value}
                />
              ))}
            </>
          )}
        </Flex>
        <Stack spacing="spacingXs">
          <Tooltip content="Advanced Settings" placement="bottom">
            <IconButton
              aria-label="Advanced Settings"
              icon={<SettingsIcon size="tiny" />}
              isActive={isAdvancedSettings}
              onClick={handleUseAdvancedSettings}
              size="small"
              variant="secondary"
            />
          </Tooltip>
          <Tooltip content="Remove column" placement="bottom">
            <IconButton
              aria-label="Remove column"
              icon={<DeleteIcon size="tiny" variant="negative" />}
              onClick={() => handleRemoveColumn()}
              size="small"
              variant="secondary"
            />
          </Tooltip>
        </Stack>
      </Flex>
    );
  },
  (prevProps, nextProps) => {
    if (JSON.stringify(prevProps.sizes) === JSON.stringify(nextProps.sizes)) {
      return true;
    }

    return false;
  }
);

export default ColumnSizes;
export { ColumnSizes };
