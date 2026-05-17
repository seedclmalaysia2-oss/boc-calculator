import type { CalcResult, Eye, EyeInput } from "@/lib/types";
import { CYLINDER_OPTIONS, SPHERE_OPTIONS } from "@/lib/constants";
import { useT } from "@/lib/i18n";
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
  const T = useT();
  const eyeData = (key: Eye) => (key === "re" ? re : le);
  const sideLabel = (key: Eye) => (key === "re" ? T.rightEye : T.leftEye);

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
      title={T.refractionTitle}
      headerRight={
        <span className="ml-auto text-[10.5px] font-bold uppercase tracking-[0.12em] text-ink3">
          {T.unitDioptre}
        </span>
      }
    >
      <EyeColumnHeader />

      <FieldRow
        label={T.sphere}
        re={select("re", "sphere", T.sphere, SPHERE_OPTIONS)}
        le={select("le", "sphere", T.sphere, SPHERE_OPTIONS)}
      />
      <FieldRow
        label={T.cylinder}
        re={select("re", "cylinder", T.cylinder, CYLINDER_OPTIONS)}
        le={select("le", "cylinder", T.cylinder, CYLINDER_OPTIONS)}
      />
      <FieldRow
        label={T.axis}
        re={input("re", "refAxis", T.refractionAxis)}
        le={input("le", "refAxis", T.refractionAxis)}
      />
      <FieldRow
        label={T.va}
        re={input("re", "va", T.visualAcuity)}
        le={input("le", "va", T.visualAcuity)}
      />

      {!simple && (
        <ScreeningTable result={result} reActive={reActive} leActive={leActive} />
      )}
    </Panel>
  );
}
