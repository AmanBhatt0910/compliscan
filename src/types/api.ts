export interface ScanListItem {
  id: string;
  appName: string;
  appUrl: string;
  score: number;
  status: "pass" | "warning" | "fail";
  createdAt: string;
}