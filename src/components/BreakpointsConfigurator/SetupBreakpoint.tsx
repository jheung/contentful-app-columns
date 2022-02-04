import React, { useRef, useState, ChangeEvent } from "react";
import { nanoid } from "nanoid";
import tokens from "@contentful/f36-tokens";
import {
  Box,
  Button,
  FormControl,
  Paragraph,
  SectionHeading,
  Stack,
  TextInput,
} from "@contentful/f36-components";
import { CopyIcon, DeleteIcon, PlusIcon } from "@contentful/f36-icons";
import {
  BreakpointOption,
  SizeOptions,
} from "../../locations/app-config/ConfigScreen.types";

interface SetupBreakpointProps {
  breakpoint: BreakpointOption;
  canAdd?: boolean;
  canDelete: boolean;
  onChange?: (breakpoint: BreakpointOption) => void;
  onAdd?: (breakpoint: BreakpointOption) => void;
  onDuplicate?: (breakpoint: BreakpointOption) => void;
  onDelete?: (uid: string) => void;
}

const SetupBreakpoint = ({
  breakpoint,
  canAdd = false,
  canDelete,
  onChange = () => {},
  onAdd = () => {},
  onDuplicate = () => {},
  onDelete = () => {},
}: SetupBreakpointProps) => {
  const breakpointUid = useRef(breakpoint.uid);
  const [breakpointLabel, setBreakpointLabel] = useState(breakpoint.label);
  const [breakpointValue, setBreakpointValue] = useState(breakpoint.value);
  const [breakpointOptions, setBreakpointOptions] = useState(
    breakpoint.options
  );

  const handleFieldChange = (key: string, setter: (value: string) => void) => {
    return (event: ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;

      if (value) {
        setter(value);

        const updatedBreakpoint: BreakpointOption = {
          uid: breakpointUid.current,
          label: breakpointLabel,
          value: breakpointValue,
          options: breakpointOptions,
          [key]: value,
        };

        if (breakpoint) {
          onChange(updatedBreakpoint);
        }
      }
    };
  };

  const handleOptionChange = (
    uid: string,
    key: string,
    setter: (value: SizeOptions[]) => void
  ) => {
    return (event: ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;

      if (value) {
        const updatedBreakpointOptions: BreakpointOption = {
          uid: breakpointUid.current,
          label: breakpointLabel,
          value: breakpointValue,
          options: breakpointOptions.map((option) => {
            if (option.uid === uid) {
              return {
                ...option,
                [key]: value,
              };
            }
            return option;
          }),
        };

        setter(updatedBreakpointOptions.options);

        if (breakpoint) {
          onChange(updatedBreakpointOptions);
        }
      }
    };
  };

  const handleAddOption = () => {
    const updatedBreakpointOptions: BreakpointOption = {
      uid: breakpointUid.current,
      label: breakpointLabel,
      value: breakpointValue,
      options: [
        ...breakpointOptions,
        {
          uid: nanoid(),
          label: "",
          value: "",
        },
      ],
    };

    setBreakpointOptions(updatedBreakpointOptions.options);

    if (breakpoint) {
      onChange(updatedBreakpointOptions);
    }
  };

  const handleDeleteOption = (uid: string) => {
    const updatedBreakpointOptions: BreakpointOption = {
      uid: breakpointUid.current,
      label: breakpointLabel,
      value: breakpointValue,
      options: breakpointOptions.filter((option) => option.uid !== uid),
    };

    setBreakpointOptions(updatedBreakpointOptions.options);

    if (breakpoint) {
      onChange(updatedBreakpointOptions);
    }
  };

  const handleDuplicateBreakpoint = () => {
    onDuplicate({
      uid: nanoid(),
      label: breakpointLabel,
      value: breakpointValue,
      options: breakpointOptions,
    });
  };

  const handleDeleteBreakpoint = () => {
    onDelete(breakpointUid.current);
  };

  const handleSaveNewBreakpoint = () => {
    onAdd({
      uid: breakpointUid.current,
      label: breakpointLabel,
      value: breakpointValue,
      options: breakpointOptions,
    });

    // Reset new breakpoint view
    breakpointUid.current = nanoid();
  };

  return (
    <Box>
      <Stack>
        <FormControl isRequired isInvalid={!breakpointLabel}>
          <FormControl.Label>Breakpoint label</FormControl.Label>
          <TextInput
            id={`${breakpointUid.current}-label`}
            onChange={handleFieldChange("label", setBreakpointLabel)}
            placeholder="Breakpoint label"
            value={breakpointLabel}
          />
          <FormControl.HelpText>
            Displayed to content editors
          </FormControl.HelpText>
        </FormControl>
        <FormControl isRequired isInvalid={!breakpointLabel}>
          <FormControl.Label>Breakpoint value</FormControl.Label>
          <TextInput
            id={`${breakpointUid.current}-value`}
            onChange={handleFieldChange("value", setBreakpointValue)}
            placeholder="Breakpoint value"
            value={breakpointValue}
          />
          <FormControl.HelpText>Value returned from API</FormControl.HelpText>
        </FormControl>
      </Stack>
      <hr style={{ marginBottom: tokens.spacingL }} />
      <SectionHeading>Options (Sizes)</SectionHeading>
      <Paragraph>
        These are the options displayed to the content editors when selecting a
        size for their column. The label is meant for the editors while the
        value is meant for the developers and will be returned in the API.
      </Paragraph>
      {breakpointOptions.map((option) => (
        <Stack key={option.uid} alignItems="flex-end">
          <FormControl isRequired isInvalid={!option.label}>
            <FormControl.Label>Label</FormControl.Label>
            <TextInput
              id={`${option.uid}-label`}
              onChange={handleOptionChange(
                option.uid,
                "label",
                setBreakpointOptions
              )}
              placeholder="Label"
              value={option.label}
            />
          </FormControl>
          <FormControl isRequired isInvalid={!option.value}>
            <FormControl.Label>Value</FormControl.Label>
            <TextInput
              id={`${option.uid}-value`}
              onChange={handleOptionChange(
                option.uid,
                "value",
                setBreakpointOptions
              )}
              placeholder="Value"
              value={option.value}
            />
          </FormControl>
          {breakpointOptions.length > 1 && (
            <Button
              onClick={() => handleDeleteOption(option.uid)}
              startIcon={<DeleteIcon />}
              variant="negative"
              aria-label="Delete option"
              style={{ marginBottom: tokens.spacingL }}
            />
          )}
        </Stack>
      ))}
      <Button startIcon={<PlusIcon />} onClick={handleAddOption}>
        Add option (size)
      </Button>
      <hr
        style={{
          marginTop: tokens.spacingL,
          marginBottom: tokens.spacingL,
        }}
      />
      <Stack>
        {!canAdd && (
          <Button startIcon={<CopyIcon />} onClick={handleDuplicateBreakpoint}>
            Duplicate '{breakpoint.label}'
          </Button>
        )}
        {canDelete && (
          <Button
            startIcon={<DeleteIcon />}
            variant="negative"
            onClick={handleDeleteBreakpoint}
          >
            Delete breakpoint
          </Button>
        )}
        {canAdd && (
          <Button
            startIcon={<PlusIcon />}
            variant="primary"
            onClick={handleSaveNewBreakpoint}
          >
            Add breakpoint
          </Button>
        )}
      </Stack>
    </Box>
  );
};

export default SetupBreakpoint;
export { SetupBreakpoint };
