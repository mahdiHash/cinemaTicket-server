interface getAllPlaceRegisters {
  sort?: string;
  cursor?: number;
  backward?: boolean;
  license_id?: string;
  status: string;
}

export{ getAllPlaceRegisters };
