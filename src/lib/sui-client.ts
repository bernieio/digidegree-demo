import { getFullnodeUrl, SuiClient } from "@mysten/sui/client";
import { SUI_NETWORK } from "./constants";

export const suiClient = new SuiClient({
  url: getFullnodeUrl(SUI_NETWORK),
});

export type DegreeObject = {
  id: string;
  student_id: string;
  issuer: string;
  walrus_uri: string;
  proof: number[];
  issued_at: string;
  is_revoked: boolean;
};

export type VerificationResult = {
  valid: boolean;
  degree?: DegreeObject;
  metadata?: {
    student_id: string;
    full_name: string;
    degree_type: string;
    major: string;
    issued_date: string;
    issuer: string;
  };
  error?: string;
};