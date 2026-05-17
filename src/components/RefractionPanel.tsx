import type { CalcResult, Eye, EyeInput } from "@/lib/types";
import { CYLINDER_OPTIONS, SPHERE_OPTIONS } from "@/lib/constants";
import { Panel } from "./Panel";
import { EyeColumnHeader, FieldRow, InputCell, SelectCell } from "./fields";
import { ScreeningTable } from "./ScreeningTable";

export function RefractionPanel({
  re,
  le,
  result,
  reActive,
  leActive,
  locked,
  simple,
  onField,
}: {
  re: EyeInput;
  le: EyeInput;
  result: CalcResult;
  reActive: boolean;
  leActive: boolean;
  locked: boolean;
  simple: boolean;
  onField: (eye: Eye, field: keyof EyeInput, value: string) => void;
}) {
  const eyeData = (key: Eye) => (key === "re" ? re : le);
  const sideLabel = (key: Eye) => (key === "re" ? "right eye" : "left eye");

  const select = (
    key: Eye,
    field: "sphere" | "cylinder",
    label: string,
    options: string[],
  ) => (
    <SelectCell
      ariaLabel={`${label} ${sideLabel(key)}`}
      value={eyeData(key)[field]}
      options={options}
      disabled={locked}
      onChange={(v) => onField(key, field, v)}
    />
  );

  const input = (key: Eye, field: "refAxis" | "va", label: string) => (
    <InputCell
      ariaLabel={`${label} ${sideLabel(key)}`}
      inputMode={field === "refAxis" ? "numeric" : "text"}
      value={eyeData(key)[field]}
      disabled={locked}
      onChange={(v) => onField(key, field, v)}
    />
  );

  return (
    <Panel
      step={2}
      title="Refraction"
      headerRight={
        <span className="ml-auto text-[10.5px] font-bold uppercase tracking-[0.12em] text-ink3">
          Dioptre
        </span>
      }
    >
      <EyeColumnHeader />

      <FieldRow
        label="Sphere"
        re={select("re", "sphere", "Sphere", SPHERE_OPTIONS)}
        le={select("le", "sphere", "Sphere", SPHERE_OPTIONS)}
      />
      <FieldRow
        label="Cylinder"
        re={select("re", "cylinder", "Cylinder", CYLINDER_OPTIONS)}
        le={select("le", "cylinder", "Cylinder", CYLINDER_OPTIONS)}
      />
      <FieldRow
        label="Axis"
        re={input("re", "refAxis", "Refraction axis")}
        le={input("le", "refAxis", "Refraction axis")}
      />
      <FieldRow
        label="VA"
        re={input("re", "va", "Visual acuity")}
        le={input("le", "va", "Visual acuity")}
      />

      {!simple && (
        <ScreeningTable result={result} reActive={reActive} leActive={leActive} />
      )}
    </Panel>
  );
}
