import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ConfirmModal } from "../confirm-modal";

describe("ConfirmModal", () => {
  it("opens on trigger and renders header + description", () => {
    render(
      <ConfirmModal header="Delete pitch?" description="This cannot be undone." onConfirm={() => {}}>
        <button>open</button>
      </ConfirmModal>
    );
    fireEvent.click(screen.getByRole("button", { name: "open" }));
    expect(screen.getByText("Delete pitch?")).toBeDefined();
    expect(screen.getByText("This cannot be undone.")).toBeDefined();
  });

  it("calls onConfirm when Confirm is clicked", () => {
    const onConfirm = vi.fn();
    render(
      <ConfirmModal header="Delete pitch?" onConfirm={onConfirm}>
        <button>open</button>
      </ConfirmModal>
    );
    fireEvent.click(screen.getByRole("button", { name: "open" }));
    fireEvent.click(screen.getByRole("button", { name: "Confirm" }));
    expect(onConfirm).toHaveBeenCalledOnce();
  });

  it("uses the rust destructive action when destructive", () => {
    render(
      <ConfirmModal header="Delete pitch?" onConfirm={() => {}} destructive>
        <button>open</button>
      </ConfirmModal>
    );
    fireEvent.click(screen.getByRole("button", { name: "open" }));
    const confirm = screen.getByRole("button", { name: "Confirm" });
    expect(confirm.className).toContain("bg-destructive");
  });

  it("uses the gold action when not destructive", () => {
    render(
      <ConfirmModal header="Archive?" onConfirm={() => {}}>
        <button>open</button>
      </ConfirmModal>
    );
    fireEvent.click(screen.getByRole("button", { name: "open" }));
    const confirm = screen.getByRole("button", { name: "Confirm" });
    expect(confirm.className).toContain("bg-gold");
  });
});
