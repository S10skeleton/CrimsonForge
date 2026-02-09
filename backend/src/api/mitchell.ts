import axios, { AxiosInstance } from 'axios';
import { MitchellSpec } from '../../../shared/types';

interface MitchellConfig {
  apiKey: string;
  apiUrl: string;
}

export class MitchellAPIClient {
  private client: AxiosInstance;
  private apiKey: string;

  constructor(config: MitchellConfig) {
    this.apiKey = config.apiKey;
    this.client = axios.create({
      baseURL: config.apiUrl,
      headers: {
        'Authorization': `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json',
      },
    });
  }

  /**
   * Get torque specifications for a specific component
   * @param vin - Vehicle Identification Number
   * @param component - Component name (e.g., "cylinder head bolts")
   */
  async getTorqueSpecs(vin: string, component: string): Promise<MitchellSpec> {
    // TODO: Implement when Mitchell API key is available
    // const response = await this.client.get(`/specs/torque`, {
    //   params: { vin, component }
    // });
    // return response.data;
    
    throw new Error('Mitchell API integration pending - API key required');
  }

  /**
   * Get repair procedures for a specific repair
   * @param vin - Vehicle Identification Number
   * @param procedure - Procedure name (e.g., "timing belt replacement")
   */
  async getProcedure(vin: string, procedure: string): Promise<MitchellSpec> {
    // TODO: Implement when Mitchell API key is available
    throw new Error('Mitchell API integration pending - API key required');
  }

  /**
   * Get technical service bulletins (TSBs) for a vehicle
   * @param vin - Vehicle Identification Number
   * @param symptom - Optional symptom to filter TSBs
   */
  async getTSBs(vin: string, symptom?: string): Promise<MitchellSpec[]> {
    // TODO: Implement when Mitchell API key is available
    throw new Error('Mitchell API integration pending - API key required');
  }

  /**
   * Get component location/diagram
   * @param vin - Vehicle Identification Number
   * @param component - Component name
   */
  async getComponentLocation(vin: string, component: string): Promise<MitchellSpec> {
    // TODO: Implement when Mitchell API key is available
    throw new Error('Mitchell API integration pending - API key required');
  }

  /**
   * Get fluid specifications
   * @param vin - Vehicle Identification Number
   * @param fluidType - Type of fluid (e.g., "engine oil", "coolant")
   */
  async getFluidSpecs(vin: string, fluidType: string): Promise<MitchellSpec> {
    // TODO: Implement when Mitchell API key is available
    throw new Error('Mitchell API integration pending - API key required');
  }

  /**
   * Get diagnostic trouble code (DTC) information
   * @param vin - Vehicle Identification Number
   * @param dtcCode - DTC code (e.g., "P0300")
   */
  async getDTCInfo(vin: string, dtcCode: string): Promise<MitchellSpec> {
    // TODO: Implement when Mitchell API key is available
    throw new Error('Mitchell API integration pending - API key required');
  }

  /**
   * Search for parts by description
   * @param vin - Vehicle Identification Number
   * @param partDescription - Part description or name
   */
  async searchParts(vin: string, partDescription: string): Promise<any[]> {
    // TODO: Implement when Mitchell API key is available
    throw new Error('Mitchell API integration pending - API key required');
  }

  /**
   * Get labor time estimate
   * @param vin - Vehicle Identification Number
   * @param operation - Operation description
   */
  async getLaborTime(vin: string, operation: string): Promise<{ hours: number; description: string }> {
    // TODO: Implement when Mitchell API key is available
    throw new Error('Mitchell API integration pending - API key required');
  }
}

// Export a singleton instance factory
let mitchellClient: MitchellAPIClient | null = null;

export function getMitchellClient(): MitchellAPIClient {
  if (!mitchellClient) {
    const apiKey = process.env.MITCHELL_API_KEY || '';
    const apiUrl = process.env.MITCHELL_API_URL || 'https://api.mitchell.com/v1';
    
    if (!apiKey) {
      console.warn('Mitchell API key not configured - API calls will fail');
    }
    
    mitchellClient = new MitchellAPIClient({ apiKey, apiUrl });
  }
  
  return mitchellClient;
}
