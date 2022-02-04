import React, { useState, ChangeEvent, CSSProperties } from "react";
import { nanoid } from "nanoid";
import slugify from "slugify";
import { css } from "@emotion/css";
import tokens from "@contentful/f36-tokens";
import {
  Box,
  Button,
  Collapse,
  Flex,
  FormControl,
  Tabs,
  Text,
  TextInput,
  ToggleButton,
} from "@contentful/f36-components";
import { DeleteIcon, ListBulletedIcon } from "@contentful/f36-icons";
import {
  BreakpointConfiguration,
  BreakpointOption,
} from "../../locations/app-config/ConfigScreen.types";
import {
  DEFAULT_BREAKPOINT_PREFIX,
  DEFAULT_NEW_BREAKPOINT_SIZE,
} from "../../constants";
import { SetupBreakpoint } from "./SetupBreakpoint";

interface BreakpointsConfiguratorProps {
  breakpoints: BreakpointConfiguration;
  canDelete: boolean;
  handleDeleteBreakpoints: () => void;
  onChange: (breakpoints: BreakpointConfiguration) => void;
  style?: CSSProperties | undefined;
}

const BreakpointsConfigurator = ({
  breakpoints,
  canDelete,
  handleDeleteBreakpoints,
  onChange,
  style,
}: BreakpointsConfiguratorProps) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [breakpointsName, setBreakpointsName] = useState(breakpoints.name);
  const [currentTab, setCurrentTab] = useState(
    breakpoints.breakpoints[0].uid ?? "add"
  );

  const generateNewBreakpointLabelAndValue = (
    breakpoints: BreakpointOption[]
  ) => {
    let newBreakpointIndex = (breakpoints.length ?? 0) + 1;

    if (breakpoints) {
      while (
        breakpoints.some(
          // eslint-disable-next-line no-loop-func
          (breakpoint) =>
            breakpoint.label ===
            `${DEFAULT_BREAKPOINT_PREFIX} ${newBreakpointIndex}`
        )
      ) {
        newBreakpointIndex += 1;
      }
    }

    const newBreakpointLabel = `${DEFAULT_BREAKPOINT_PREFIX} ${newBreakpointIndex}`;

    return {
      uid: nanoid(),
      label: newBreakpointLabel,
      value: slugify(newBreakpointLabel, { lower: true }),
      options: [{ uid: nanoid(), ...DEFAULT_NEW_BREAKPOINT_SIZE }],
    };
  };

  const handleBreakpointsNameChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target?.value;

    if (value) {
      setBreakpointsName(value);

      const updatedBreakpoints: BreakpointConfiguration = {
        id: slugify(value, { lower: true }),
        uid: breakpoints.uid,
        name: value,
        breakpoints: breakpoints.breakpoints,
      };

      onChange(updatedBreakpoints);
    }
  };

  const handleChangeBreakpoint = (breakpoint: BreakpointOption) => {
    const updatedBreakpoints: BreakpointConfiguration = {
      id: breakpoints.id,
      uid: breakpoints.uid,
      name: breakpoints.name,
      breakpoints: breakpoints.breakpoints.map((_breakpoint) => {
        if (_breakpoint.uid === breakpoint.uid) {
          return breakpoint;
        }
        return _breakpoint;
      }),
    };

    onChange(updatedBreakpoints);
  };

  const handleAddBreakpoint = (breakpoint: BreakpointOption) => {
    const updatedBreakpoints: BreakpointConfiguration = {
      id: breakpoints.id,
      uid: breakpoints.uid,
      name: breakpoints.name,
      breakpoints: [...breakpoints.breakpoints, breakpoint],
    };

    onChange(updatedBreakpoints);
    setCurrentTab(breakpoint.uid);
  };

  const handleDuplicateBreakpoint = (breakpoint: BreakpointOption) => {
    const newLabelAndValue = generateNewBreakpointLabelAndValue(
      breakpoints.breakpoints
    );
    const updatedBreakpoint = {
      ...breakpoint,
      label: newLabelAndValue.label,
      value: newLabelAndValue.value,
    };
    const updatedBreakpoints: BreakpointConfiguration = {
      id: breakpoints.id,
      uid: breakpoints.uid,
      name: breakpoints.name,
      breakpoints: [...breakpoints.breakpoints, updatedBreakpoint],
    };

    onChange(updatedBreakpoints);
    setCurrentTab(breakpoint.uid);
  };

  const handleDeleteBreakpoint = (uid: string) => {
    const updatedBreakpoints: BreakpointConfiguration = {
      id: breakpoints.id,
      uid: breakpoints.uid,
      name: breakpoints.name,
      breakpoints: breakpoints.breakpoints.filter(
        (breakpoint) => breakpoint.uid !== uid
      ),
    };

    onChange(updatedBreakpoints);
    setCurrentTab(updatedBreakpoints.breakpoints[0].uid);
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
              {breakpoints.name}
            </Text>
            <Text
              fontColor="gray500"
              fontStack="fontStackMonospace"
              marginBottom="none"
            >
              ({breakpoints.id})
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
                <FormControl.Label isRequired>
                  Breakpoints name
                </FormControl.Label>
                <TextInput
                  id={`${breakpoints.id}-name`}
                  onChange={handleBreakpointsNameChange}
                  placeholder="Breakpoint name"
                  value={breakpointsName}
                />
              </FormControl>
            </Flex>
            {canDelete && (
              <Button
                onClick={handleDeleteBreakpoints}
                size="small"
                startIcon={<DeleteIcon />}
                variant="negative"
              >
                Delete breakpoints
              </Button>
            )}
          </Flex>
          <Flex>
            <Tabs
              style={{ width: "100%" }}
              defaultTab={breakpoints.breakpoints[0].uid}
              currentTab={currentTab}
              onTabChange={(tab) => setCurrentTab(tab)}
            >
              <Tabs.List
                variant="horizontal-divider"
                style={{ marginBottom: tokens.spacingM }}
              >
                {breakpoints.breakpoints.map((_breakpoints) => (
                  <Tabs.Tab key={_breakpoints.uid} panelId={_breakpoints.uid}>
                    {_breakpoints.label}
                  </Tabs.Tab>
                ))}
                <Tabs.Tab
                  panelId="add"
                  className={css({
                    marginLeft: "auto",
                    backgroundColor: tokens.colorPositive,
                    color: tokens.colorWhite,
                    borderTopLeftRadius: tokens.borderRadiusMedium,
                    borderTopRightRadius: tokens.borderRadiusMedium,
                    "&:hover": {
                      backgroundColor: tokens.green700,
                    },
                    "&[data-state=active]": {
                      color: tokens.colorWhite,
                    },
                    "&[data-state=active]::before": {
                      backgroundColor: tokens.green900,
                    },
                  })}
                >
                  + Breakpoint
                </Tabs.Tab>
              </Tabs.List>
              {breakpoints.breakpoints.map((breakpoint) => (
                <Tabs.Panel key={breakpoint.uid} id={breakpoint.uid}>
                  <SetupBreakpoint
                    canDelete={breakpoints.breakpoints.length > 1}
                    breakpoint={breakpoint}
                    onChange={handleChangeBreakpoint}
                    onDuplicate={handleDuplicateBreakpoint}
                    onDelete={handleDeleteBreakpoint}
                  />
                </Tabs.Panel>
              ))}
              <Tabs.Panel key="add" id="add">
                <SetupBreakpoint
                  canAdd={true}
                  canDelete={false}
                  breakpoint={generateNewBreakpointLabelAndValue(
                    breakpoints.breakpoints
                  )}
                  onAdd={handleAddBreakpoint}
                />
              </Tabs.Panel>
            </Tabs>
          </Flex>
        </Box>
      </Collapse>
    </div>
  );
};

export default BreakpointsConfigurator;
export { BreakpointsConfigurator };
