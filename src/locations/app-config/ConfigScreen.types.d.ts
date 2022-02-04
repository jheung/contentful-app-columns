import { PlainClientAPI } from "contentful-management";
import { AppExtensionSDK } from "@contentful/app-sdk";

export interface AppInstallationParameters {
  presets: PresetConfiguration[];
  breakpoints: BreakpointConfiguration[];
}

export interface SizeOptions {
  uid: string;
  label: string;
  value: string;
}

export interface BreakpointOption {
  uid: string;
  label: string;
  value: string;
  options: SizeOptions[];
}

export interface BreakpointConfiguration {
  id: string;
  uid: string;
  name: string;
  breakpoints: BreakpointOption[];
}

export interface PresetConfiguration {
  id: string;
  uid: string;
  name: string;
  acceptedContentTypes: string[];
  breakpoints: string;
}

interface ConfigScreenProps {
  cma: PlainClientAPI;
  sdk: AppExtensionSDK;
}
