import React from "react";
import { EntryField } from "./";
import { render } from "@testing-library/react";
import { mockSdk } from "../../../test/mocks";

describe("Field component", () => {
  it("Component text exists", () => {
    const { getByText } = render(<EntryField sdk={mockSdk} />);

    expect(getByText("Hello Entry Field Component")).toBeInTheDocument();
  });
});
