ALTER TABLE "Users"
ADD COLUMN google_access_token TEXT,
ADD COLUMN google_refresh_token TEXT,
ADD COLUMN google_cal_status BOOLEAN DEFAULT false;