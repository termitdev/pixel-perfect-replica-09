import { describe, expect, it } from "vitest";
import { maskPhone, validateLead } from "@/lib/lead";

describe("lead rules", () => {
  it("masks 11-digit mobile", () => expect(maskPhone("11999998888")).toBe("(11) 99999-8888"));
  it("masks 10-digit landline", () => expect(maskPhone("1133334444")).toBe("(11) 3333-4444"));
  it("rejects invalid email", () =>
    expect(validateLead({ nome: "Ana Silva", email: "ana@", telefone: "11999998888" }).email).toBeDefined());
  it("rejects phone with 9 digits", () =>
    expect(validateLead({ nome: "Ana Silva", email: "a@b.co", telefone: "119999988" }).telefone).toBeDefined());
  it("accepts valid lead", () =>
    expect(validateLead({ nome: "Ana Silva", email: "a@b.co", telefone: "(11) 99999-8888" })).toEqual({}));
});
