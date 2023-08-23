interface adminProfileUpdateInputs {
  access_level?: 'play' | 'comment' | 'super' | 'review' | 'credit_card';
  full_name?: string;
  tel?: string;
  email?: string;
  national_id?: string;
  home_tel?: string;
  full_address?: string;
  profile_pic_url?: string | null;
  profile_pic_fileId?: string | null;
}

export { adminProfileUpdateInputs }
