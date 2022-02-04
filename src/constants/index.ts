const DEFAULT_PRESET_PREFIX = "Preset";

const DEFAULT_BREAKPOINTS_PREFIX = "Breakpoints";

const DEFAULT_BREAKPOINT_PREFIX = "Breakpoint";

const DEFAULT_BREAKPOINT_SIZES = [
  {
    value: "12",
    label: "1/1 (Full)",
  },
  {
    value: "9",
    label: "3/4 (75%)",
  },
  {
    value: "8",
    label: "2/3 (66.67%)",
  },
  {
    value: "6",
    label: "1/2 (50%)",
  },
  {
    value: "4",
    label: "1/3 (33.33%)",
  },
  {
    value: "3",
    label: "1/4 (25%)",
  },
];

const DEFAULT_NEW_BREAKPOINT_SIZE = { label: "1/1 (Full)", value: "12" };

const DEFAULT_COLUMN_SETTINGS = {
  columnSizes: {
    desktop: {
      value: "6",
      isCustom: false,
    },
    tablet: {
      value: "12",
      isCustom: false,
    },
    mobile: {
      value: "12",
      isCustom: false,
    },
  },
  items: [],
};

export {
  DEFAULT_PRESET_PREFIX,
  DEFAULT_BREAKPOINTS_PREFIX,
  DEFAULT_BREAKPOINT_PREFIX,
  DEFAULT_BREAKPOINT_SIZES,
  DEFAULT_NEW_BREAKPOINT_SIZE,
  DEFAULT_COLUMN_SETTINGS,
};
