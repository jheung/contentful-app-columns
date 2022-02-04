import React from "react";
import { render } from "react-dom";
import { createClient } from "contentful-management";
import {
  AppExtensionSDK,
  FieldExtensionSDK,
  init,
  locations,
} from "@contentful/app-sdk";
import type { KnownSDK } from "@contentful/app-sdk";
import { GlobalStyles } from "@contentful/f36-components";

import { ConfigScreen, EntryField } from "./locations";

init((sdk: KnownSDK) => {
  const root = document.getElementById("root");

  const cma = createClient(
    { apiAdapter: sdk.cmaAdapter },
    {
      type: "plain",
      defaults: {
        environmentId: sdk.ids.environment,
        spaceId: sdk.ids.space,
      },
    }
  );

  const ComponentLocationSettings = [
    {
      location: locations.LOCATION_APP_CONFIG,
      component: <ConfigScreen cma={cma} sdk={sdk as AppExtensionSDK} />,
    },
    {
      location: locations.LOCATION_ENTRY_FIELD,
      component: <EntryField sdk={sdk as FieldExtensionSDK} />,
    },
  ];

  // Select a component depending on a location in which the app is rendered.
  ComponentLocationSettings.forEach((componentLocationSetting) => {
    if (sdk.location.is(componentLocationSetting.location)) {
      render(
        <>
          <GlobalStyles />
          {componentLocationSetting.component}
        </>,
        root
      );
    }
  });
});
