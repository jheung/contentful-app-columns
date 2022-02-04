import React, { useRef, useState, useEffect, ChangeEvent } from "react";
import FocusLock from "react-focus-lock";
import tokens from "@contentful/f36-tokens";
import {
  Button,
  ButtonGroup,
  Flex,
  IconButton,
  Popover,
  SectionHeading,
  Switch,
  TextInput,
} from "@contentful/f36-components";
import { ChevronDownIcon } from "@contentful/f36-icons";
import { BreakpointOption } from "../../../../locations/app-config/ConfigScreen.types";

export interface ColumnSizeDropdownProps {
  breakpoints: BreakpointOption;
  isCustom: boolean;
  label: string;
  onChange: any;
  size: any;
}

const ColumnSizeDropdown = ({
  breakpoints,
  isCustom: providedIsCustom,
  label,
  onChange,
  size: providedSize,
}: ColumnSizeDropdownProps) => {
  const dropdownTrigger = useRef<HTMLButtonElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [updatedSize, setUpdatedSize] = useState(providedSize);
  const [updatedIsCustom, setUpdatedIsCustom] = useState(providedIsCustom);
  const [isValidSize, setIsValidSize] = useState(!!providedSize);

  const handleDefinedSize = (size: string) => {
    setUpdatedSize(size);
    handleCloseAndUpdateSize(size);
  };

  const handleCustomSize = (event: ChangeEvent<HTMLInputElement>) => {
    const size = event.target.value;
    setUpdatedSize(size);

    if (size) {
      setIsValidSize(true);
    }
  };

  const handleToggleCustomSize = (event: ChangeEvent<HTMLInputElement>) => {
    const isCustom = event.target.checked;
    setUpdatedIsCustom(isCustom);

    if (!isCustom) {
      setIsValidSize(true);
    }
  };

  const handleCloseAndUpdateSize = (size?: string) => {
    let canClose = false;
    if (size) {
      canClose = true;
      setIsValidSize(true);
      setIsOpen(false);
      if (size !== providedSize) {
        onChange({
          device: breakpoints.value,
          columnSize: size,
          breakpoint: breakpoints.value,
          isCustomSize: false,
        });
      }
    } else {
      if (!updatedSize) {
        if (updatedIsCustom) {
          setIsValidSize(false);
        }
      } else {
        canClose = true;
        setIsOpen(false);
        onChange({
          device: breakpoints.value,
          columnSize: updatedSize,
          breakpoint: breakpoints.value,
          isCustomSize: updatedIsCustom,
        });
      }
    }

    if (canClose) {
      window.setTimeout(() => dropdownTrigger.current?.focus(), 0);
    }
  };

  useEffect(() => {
    setUpdatedSize(providedSize);
  }, [providedSize]);

  useEffect(() => {
    setUpdatedIsCustom(providedIsCustom);
  }, [providedIsCustom]);

  return (
    <div className="column-size">
      <SectionHeading style={{ marginBottom: "0.5rem" }}>
        {label}
      </SectionHeading>
      <Popover
        isOpen={isOpen}
        onClose={handleCloseAndUpdateSize}
        placement="top-start"
      >
        <Popover.Trigger>
          <ButtonGroup>
            <Button size="small">
              {updatedSize
                ? breakpoints.options.find(
                    (_breakpoint) => updatedSize === _breakpoint.value
                  )?.label ?? updatedSize
                : "Column size"}
            </Button>
            <IconButton
              ref={dropdownTrigger}
              aria-label="Open dropdown"
              icon={<ChevronDownIcon />}
              size="small"
              onClick={() => {
                if (isOpen) {
                  handleCloseAndUpdateSize();
                } else {
                  setIsOpen(true);
                }
              }}
              variant="secondary"
            />
          </ButtonGroup>
        </Popover.Trigger>
        <Popover.Content>
          <FocusLock>
            <Flex flexDirection="column" gap={tokens.spacing2Xs}>
              {breakpoints.options.map((breakpoint) => (
                <Button
                  key={breakpoint.value}
                  isActive={updatedSize === breakpoint.value}
                  isDisabled={
                    updatedIsCustom || updatedSize === breakpoint.value
                  }
                  isFullWidth={true}
                  onClick={() => handleDefinedSize(breakpoint.value)}
                  style={{ justifyContent: "flex-start" }}
                  variant="transparent"
                >
                  {breakpoint.label}
                </Button>
              ))}
              <Flex
                flexDirection="column"
                gap={tokens.spacingS}
                padding="spacingM"
                style={{
                  borderColor: tokens.gray200,
                  borderStyle: "solid",
                  borderWidth: "1px 0 0 0",
                }}
              >
                <Switch
                  id={`isCustomSize-${breakpoints.uid}`}
                  isChecked={updatedIsCustom}
                  name={`isCustomSize-${breakpoints.uid}`}
                  onChange={handleToggleCustomSize}
                >
                  Use custom size
                </Switch>
                {updatedIsCustom && (
                  <TextInput
                    id={`customSize-${breakpoints.uid}`}
                    isInvalid={!isValidSize}
                    onChange={handleCustomSize}
                    type="text"
                    value={updatedSize}
                    width="full"
                  />
                )}
              </Flex>
            </Flex>
          </FocusLock>
        </Popover.Content>
      </Popover>
    </div>
  );
};

export default ColumnSizeDropdown;
export { ColumnSizeDropdown };
