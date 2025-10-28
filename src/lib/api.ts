import { API_BASE_URL } from "./constants";

class ApiClient {
  private baseUrl = API_BASE_URL;

  async verifyDegree(studentId: string): Promise<any> {
    const response = await fetch(`${this.baseUrl}/verify/${studentId}`);
    if (!response.ok) {
      throw new Error(`Verification failed: ${response.statusText}`);
    }
    return response.json();
  }

  async logVerification(studentId: string): Promise<any> {
    const response = await fetch(`${this.baseUrl}/verify/${studentId}/log`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error(`Log verification failed: ${response.statusText}`);
    }
    return response.json();
  }

  async issueDegree(formData: FormData): Promise<any> {
    const response = await fetch(`${this.baseUrl}/degree/issue`, {
      method: 'POST',
      body: formData,
    });
    if (!response.ok) {
      throw new Error(`Issue degree failed: ${response.statusText}`);
    }
    return response.json();
  }

  async revokeDegree(studentId: string): Promise<any> {
    const response = await fetch(`${this.baseUrl}/degree/revoke`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ student_id: studentId }),
    });
    if (!response.ok) {
      throw new Error(`Revoke degree failed: ${response.statusText}`);
    }
    return response.json();
  }

  async sponsorTransaction(txBytes: string): Promise<any> {
    const response = await fetch(`${this.baseUrl}/sponsor-tx`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ txBytes }),
    });
    if (!response.ok) {
      throw new Error(`Sponsor transaction failed: ${response.statusText}`);
    }
    return response.json();
  }

  async healthCheck(): Promise<any> {
    const response = await fetch(`${this.baseUrl}/system/health`);
    if (!response.ok) {
      throw new Error(`Health check failed: ${response.statusText}`);
    }
    return response.json();
  }
}

export const apiClient = new ApiClient();