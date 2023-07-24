interface createAdminInputs {
  access_level: 'play' | 'comment';
  full_name: string;
  tel: string;
  password: string;
  repeatPass: string;
  email: string;
  national_id: string;
  home_tel: string;
  full_address: string;
}

export { createAdminInputs }
