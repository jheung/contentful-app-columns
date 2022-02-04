import React, { useState, useEffect, useCallback } from "react";
import { nanoid } from "nanoid";
import slugify from "slugify";
import { css } from "@emotion/css";
import { ContentTypeProps } from "contentful-management";
import tokens from "@contentful/f36-tokens";
import {
  Button,
  Flex,
  Form,
  Heading,
  Paragraph,
  Tabs,
} from "@contentful/f36-components";
import { PlusIcon } from "@contentful/f36-icons";
import {
  AppInstallationParameters,
  BreakpointConfiguration,
  PresetConfiguration,
  ConfigScreenProps,
} from "./ConfigScreen.types";
import {
  DEFAULT_PRESET_PREFIX,
  DEFAULT_BREAKPOINTS_PREFIX,
  DEFAULT_BREAKPOINT_SIZES,
} from "../../constants";
import { PresetConfigurator } from "../../components/PresetConfigurator";
import { BreakpointsConfigurator } from "../../components/BreakpointsConfigurator";

const createDefaultPreset = (
  number: number,
  allContentTypes: ContentTypeProps[],
  breakpoints: string
): PresetConfiguration => {
  const presetName = `Preset ${number}`;

  return {
    id: slugify(presetName, { lower: true }),
    uid: nanoid(),
    name: presetName,
    acceptedContentTypes: allContentTypes?.map(
      (contentType) => contentType.sys.id
    ),
    breakpoints: breakpoints,
  };
};

const createDefaultBreakpoints = (number: number): BreakpointConfiguration => {
  const breakpointsName = `Breakpoints ${number}`;

  return {
    id: slugify(breakpointsName, { lower: true }),
    uid: nanoid(),
    name: breakpointsName,
    breakpoints: [
      {
        uid: nanoid(),
        label: "Desktop",
        value: "desktop",
        options: DEFAULT_BREAKPOINT_SIZES.map((size) => ({
          uid: nanoid(),
          ...size,
        })),
      },
      {
        uid: nanoid(),
        label: "Tablet",
        value: "tablet",
        options: DEFAULT_BREAKPOINT_SIZES.map((size) => ({
          uid: nanoid(),
          ...size,
        })),
      },
      {
        uid: nanoid(),
        label: "Mobile",
        value: "mobile",
        options: DEFAULT_BREAKPOINT_SIZES.map((size) => ({
          uid: nanoid(),
          ...size,
        })),
      },
    ],
  };
};

const ConfigScreen = ({ sdk, cma }: ConfigScreenProps) => {
  const [parameters, setParameters] = useState<AppInstallationParameters>();
  const [allContentTypes, setAllContentTypes] = useState<ContentTypeProps[]>(
    []
  );

  const onConfigure = useCallback(async () => {
    const currentState = await sdk.app.getCurrentState();

    return {
      parameters,
      targetState: currentState,
    };
  }, [parameters, sdk]);

  useEffect(() => {
    sdk.app.onConfigure(() => onConfigure());
  }, [sdk, onConfigure]);

  useEffect(() => {
    (async () => {
      const currentParameters: AppInstallationParameters | null =
        await sdk.app.getParameters();

      const allContentTypes = await cma.contentType.getMany({});
      const sortedAllContentTypes = allContentTypes.items.sort((a, b) =>
        a.name.localeCompare(b.name)
      );
      setAllContentTypes(sortedAllContentTypes);

      if (currentParameters) {
        setParameters(currentParameters);
      } else {
        const initialBreakpoints = createDefaultBreakpoints(1);
        setParameters({
          presets: [
            createDefaultPreset(
              1,
              sortedAllContentTypes,
              initialBreakpoints.id
            ),
          ],
          breakpoints: [initialBreakpoints],
        });
      }
      sdk.app.setReady();
    })();
  }, [sdk, cma]);

  const handlePresetChange = (config: PresetConfiguration, index: number) => {
    const updatedPresets = parameters?.presets ?? [];
    updatedPresets[index] = config;

    setParameters({
      presets: updatedPresets,
      breakpoints: parameters?.breakpoints ?? [],
    });
  };

  const handleAddPreset = () => {
    let newPresetIndex = (parameters?.presets.length ?? 0) + 1;

    if (parameters?.presets) {
      while (
        parameters.presets.some(
          // eslint-disable-next-line no-loop-func
          (preset) =>
            preset.name === `${DEFAULT_PRESET_PREFIX} ${newPresetIndex}`
        )
      ) {
        newPresetIndex += 1;
      }
    }

    const newPreset = createDefaultPreset(
      newPresetIndex,
      allContentTypes,
      parameters?.breakpoints?.[0]?.id ?? `${DEFAULT_BREAKPOINTS_PREFIX} 1`
    );

    setParameters({
      presets: [...(parameters?.presets ?? []), newPreset],
      breakpoints: parameters?.breakpoints ?? [createDefaultBreakpoints(1)],
    });
  };

  const handleDeletePreset = (index: number) => {
    const clonedPresets = [...(parameters?.presets ?? [])];
    const updatedPresets = [
      ...clonedPresets.slice(0, index),
      ...clonedPresets.slice(index + 1),
    ];

    setParameters({
      presets: updatedPresets,
      breakpoints: parameters?.breakpoints ?? [],
    });
  };

  const handleBreakpointsChange = (
    config: BreakpointConfiguration,
    index: number
  ) => {
    const updatedBreakpoints = parameters?.breakpoints ?? [];
    updatedBreakpoints[index] = config;

    setParameters({
      presets: parameters?.presets ?? [],
      breakpoints: updatedBreakpoints,
    });
  };

  const handleAddBreakpoints = () => {
    let newBreakpointsIndex = (parameters?.breakpoints.length ?? 0) + 1;

    if (parameters?.breakpoints) {
      while (
        parameters.breakpoints.some(
          // eslint-disable-next-line no-loop-func
          (breakpoints) =>
            breakpoints.name ===
            `${DEFAULT_BREAKPOINTS_PREFIX} ${newBreakpointsIndex}`
        )
      ) {
        newBreakpointsIndex += 1;
      }
    }

    const newBreakpoints = createDefaultBreakpoints(newBreakpointsIndex);

    setParameters({
      presets: parameters?.presets ?? [],
      breakpoints: [...(parameters?.breakpoints ?? []), newBreakpoints],
    });
  };

  const handleDeleteBreakpoints = (index: number) => {
    const clonedBreakpoints = [...(parameters?.breakpoints ?? [])];
    const updatedBreakpoints = [
      ...clonedBreakpoints.slice(0, index),
      ...clonedBreakpoints.slice(index + 1),
    ];

    setParameters({
      presets: parameters?.presets ?? [],
      breakpoints: updatedBreakpoints,
    });
  };

  return (
    <Flex className={css({ margin: "80px" })}>
      <Form style={{ width: "100%" }}>
        <Heading>Welcome to 🏛 Columns 🏛</Heading>
        <Paragraph>
          You can configure as many presets as you want! Just make sure to
          reference the preset id in your fields' instances!
        </Paragraph>
        <Tabs defaultTab="presets">
          <Tabs.List
            variant="horizontal-divider"
            style={{ marginBottom: tokens.spacingM }}
          >
            <Tabs.Tab panelId="presets">Presets</Tabs.Tab>
            <Tabs.Tab panelId="breakpoints">Breakpoints</Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel id="presets">
            {parameters?.presets?.map((preset, index) => (
              <PresetConfigurator
                key={preset.uid}
                availableContentTypes={allContentTypes}
                breakpoints={parameters.breakpoints}
                canDelete={parameters.presets.length > 1}
                handleDeletePreset={() => handleDeletePreset(index)}
                onChange={(config) => handlePresetChange(config, index)}
                preset={preset}
                style={{ marginBottom: tokens.spacingM }}
              />
            ))}
            <Button startIcon={<PlusIcon />} onClick={handleAddPreset}>
              Add preset
            </Button>
          </Tabs.Panel>
          <Tabs.Panel id="breakpoints">
            {parameters?.breakpoints?.map((breakpoints, index) => (
              <BreakpointsConfigurator
                key={breakpoints.uid}
                breakpoints={breakpoints}
                canDelete={parameters.breakpoints.length > 1}
                handleDeleteBreakpoints={() => handleDeleteBreakpoints(index)}
                onChange={(config) => handleBreakpointsChange(config, index)}
                style={{ marginBottom: tokens.spacingM }}
              />
            ))}
            <Button startIcon={<PlusIcon />} onClick={handleAddBreakpoints}>
              Add breakpoints
            </Button>
          </Tabs.Panel>
        </Tabs>
      </Form>
    </Flex>
  );
};

export default ConfigScreen;
export { ConfigScreen };
