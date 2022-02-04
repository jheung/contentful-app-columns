import React, { useState, ChangeEvent, CSSProperties } from "react";
import { ContentTypeProps } from "contentful-management";
import slugify from "slugify";
import tokens from "@contentful/f36-tokens";
import {
  Box,
  Button,
  Checkbox,
  Collapse,
  CopyButton,
  Flex,
  FormControl,
  Grid,
  IconButton,
  Select,
  Text,
  TextInput,
  TextLink,
  ToggleButton,
  Tooltip,
} from "@contentful/f36-components";
import {
  DeleteIcon,
  ListBulletedIcon,
  WarningIcon,
} from "@contentful/f36-icons";
import {
  PresetConfiguration,
  BreakpointConfiguration,
} from "../../locations/app-config/ConfigScreen.types";

interface PresetConfiguratorProps {
  availableContentTypes: ContentTypeProps[] | null;
  breakpoints: BreakpointConfiguration[];
  canDelete: boolean;
  handleDeletePreset: () => void;
  onChange: (preset: PresetConfiguration) => void;
  preset: PresetConfiguration;
  style?: CSSProperties | undefined;
}

const PresetConfigurator = ({
  availableContentTypes,
  breakpoints,
  canDelete,
  handleDeletePreset,
  onChange,
  preset,
  style,
}: PresetConfiguratorProps) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [presetName, setPresetName] = useState(preset.name);

  const handlePresetNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target?.value;

    if (value) {
      setPresetName(value);

      const updatedPreset: PresetConfiguration = {
        id: slugify(value, { lower: true }),
        uid: preset.uid,
        acceptedContentTypes: preset.acceptedContentTypes,
        name: value,
        breakpoints: preset.breakpoints,
      };

      onChange(updatedPreset);
    }
  };

  const handleOnChangeBreakpoints = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;

    if (value) {
      const updatedPreset: PresetConfiguration = {
        ...preset,
        breakpoints: value,
      };

      onChange(updatedPreset);
    }
  };

  const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target?.value;

    if (value) {
      const updatedAcceptedContentTypes = [...preset.acceptedContentTypes];
      const index = updatedAcceptedContentTypes.indexOf(value);

      if (index === -1) {
        updatedAcceptedContentTypes.push(value);
      } else {
        updatedAcceptedContentTypes.splice(index, 1);
      }

      const updatedPreset: PresetConfiguration = {
        ...preset,
        acceptedContentTypes: updatedAcceptedContentTypes,
      };

      onChange(updatedPreset);
    }
  };

  const handleSelectAll = () => {
    const updatedPreset: PresetConfiguration = {
      ...preset,
      acceptedContentTypes:
        availableContentTypes?.map((contentTypes) => contentTypes.sys.id) ?? [],
    };

    onChange(updatedPreset);
  };

  const handleClear = () => {
    const updatedPreset: PresetConfiguration = {
      ...preset,
      acceptedContentTypes: [],
    };

    onChange(updatedPreset);
  };

  return (
    <div style={style}>
      <ToggleButton
        style={{
          display: "block",
          width: "100%",
          maxWidth: "100%",
          textAlign: "left",
        }}
        isActive={isExpanded}
        onToggle={() => {
          setIsExpanded(!isExpanded);
        }}
      >
        <Flex alignItems="center" justifyContent="space-between">
          <Flex alignItems="center">
            <Text
              fontWeight="fontWeightMedium"
              marginBottom="none"
              marginRight="spacingXs"
            >
              {preset.name}
            </Text>
            <Text
              fontColor="gray500"
              fontStack="fontStackMonospace"
              marginBottom="none"
            >
              ({preset.id})
            </Text>
          </Flex>
          <ListBulletedIcon variant="muted" />
        </Flex>
      </ToggleButton>
      <Collapse isExpanded={isExpanded}>
        <Box
          padding="spacingS"
          style={{
            backgroundColor: tokens.gray100,
            borderColor: tokens.gray200,
            borderRadius: tokens.borderRadiusSmall,
            borderStyle: "solid",
            borderWidth: 1,
          }}
        >
          <Flex justifyContent="space-between" alignItems="center">
            <Flex gap={tokens.spacingM}>
              <FormControl as="fieldset">
                <FormControl.Label isRequired>Preset name</FormControl.Label>
                <TextInput.Group>
                  <Tooltip
                    id={`${preset.id}-warning`}
                    content="Updating the preset name will also update the id. Make sure to update your fields' instances!"
                    placement="top"
                  >
                    <IconButton
                      aria-label="Warning"
                      icon={<WarningIcon variant="warning" />}
                      variant="secondary"
                    />
                  </Tooltip>
                  <TextInput
                    id={`${preset.id}-name`}
                    onChange={handlePresetNameChange}
                    placeholder="Preset name"
                    value={presetName}
                  />
                  <Box>
                    <CopyButton
                      tooltipText="Copy preset id to clipboard"
                      value={preset.id}
                    />
                  </Box>
                </TextInput.Group>
              </FormControl>
              <FormControl as="fieldset">
                <FormControl.Label isRequired>Breakpoints</FormControl.Label>
                <Select
                  id={`${preset.id}-breakpoints`}
                  name={`${preset.id}-breakpoints`}
                  value={preset.breakpoints}
                  onChange={handleOnChangeBreakpoints}
                >
                  <Select.Option value="" isDisabled>
                    Please select an option...
                  </Select.Option>
                  {breakpoints.map((breakpoint) => (
                    <Select.Option key={breakpoint.uid} value={breakpoint.id}>
                      {breakpoint.name}
                    </Select.Option>
                  ))}
                </Select>
              </FormControl>
            </Flex>
            {canDelete && (
              <Button
                onClick={handleDeletePreset}
                size="small"
                startIcon={<DeleteIcon />}
                variant="negative"
              >
                Delete preset
              </Button>
            )}
          </Flex>
          <FormControl as="fieldset" marginBottom="none">
            <FormControl.Label as="legend">
              Select the content types that "<em>{preset.name}</em>" accepts.
            </FormControl.Label>
            <Checkbox.Group
              name={`${preset.id}-options`}
              onChange={handleCheckboxChange}
              value={preset.acceptedContentTypes}
            >
              <Flex gap="spacingXs">
                <TextLink
                  as="button"
                  onClick={handleSelectAll}
                  variant="primary"
                >
                  Select all
                </TextLink>
                -
                <TextLink as="button" onClick={handleClear} variant="primary">
                  Clear
                </TextLink>
              </Flex>
              <Grid
                columnGap="spacingM"
                columns={"1fr 1fr 1fr"}
                rowGap="spacingM"
                style={{
                  width: "100%",
                }}
              >
                {availableContentTypes?.map((contentType) => (
                  <Grid.Item key={contentType.sys.id}>
                    <Checkbox
                      key={contentType.sys.id}
                      id={contentType.sys.id}
                      style={{ fontWeight: tokens.fontWeightDemiBold }}
                      value={contentType.sys.id}
                    >
                      {contentType.name}
                    </Checkbox>
                  </Grid.Item>
                ))}
              </Grid>
            </Checkbox.Group>
          </FormControl>
        </Box>
      </Collapse>
    </div>
  );
};

export default PresetConfigurator;
export { PresetConfigurator };
