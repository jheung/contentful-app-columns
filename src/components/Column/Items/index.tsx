import React from "react";
import tokens from "@contentful/f36-tokens";
import {
  CombinedLinkActions,
  MultipleEntryReferenceEditor,
} from "@contentful/field-editor-reference";
import { Box, Note } from "@contentful/f36-components";
import { ColumnItemsProps, Item } from "../Columns.types.d";

const ColumnItems = ({
  allowedContentModels,
  items,
  onChange,
  sdk,
}: ColumnItemsProps) => (
  <Box
    padding="spacingS"
    style={{
      borderBottomLeftRadius: tokens.borderRadiusMedium,
      borderBottomRightRadius: tokens.borderRadiusMedium,
      borderColor: tokens.gray400,
      borderStyle: "solid",
      borderWidth: "0 1px 1px 1px",
    }}
  >
    <MultipleEntryReferenceEditor
      hasCardEditActions={true}
      isInitiallyDisabled={false}
      parameters={{
        instance: {
          showCreateEntityAction: true,
          showLinkEntityAction: true,
        },
      }}
      renderCustomActions={(props) => {
        return allowedContentModels?.length ? (
          <CombinedLinkActions
            {...props}
            contentTypes={props.contentTypes.filter((contentType) =>
              allowedContentModels.includes(contentType.sys.id)
            )}
            onLinkExisting={async () => {
              sdk.dialogs
                .selectMultipleEntries<Item>({
                  contentTypes: allowedContentModels,
                })
                .then((selectedEntries) => {
                  const newEntries = selectedEntries?.map((entry) => ({
                    sys: {
                      id: entry?.sys?.id,
                      type: "Link",
                      linkType: entry?.sys?.type,
                    },
                  }));

                  if (!newEntries) {
                    return;
                  }

                  const updatedColumns = [...items, ...newEntries];
                  onChange(updatedColumns);
                });
            }}
          />
        ) : (
          <Note title="Uh oh" variant="negative">
            It seems like the allowed content types preset selected isn't valid
            - please reach out to your friendly developer!
          </Note>
        );
      }}
      sdk={sdk}
      viewType="link"
    />
  </Box>
);

export default ColumnItems;
export { ColumnItems };
