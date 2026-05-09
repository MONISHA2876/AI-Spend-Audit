export type AuditData = {
  teamSize: string;
  useCase: string;
};

export type Plan = {
  label: string;
  price: number;
  note?: string;
};

export type ToolConfig = {
  plans: Plan[];
};
