import { IsString, IsBoolean, IsOptional, IsArray, IsEnum } from 'class-validator';

export class UpdatePreferencesDto {
  @IsOptional()
  @IsEnum(['light', 'dark'])
  theme?: string;

  @IsOptional()
  @IsString()
  language?: string;

  @IsOptional()
  @IsString()
  timezone?: string;

  @IsOptional()
  @IsBoolean()
  emailNotifications?: boolean;

  @IsOptional()
  @IsBoolean()
  pushNotifications?: boolean;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  notificationTypes?: string[];

  @IsOptional()
  @IsBoolean()
  showProfile?: boolean;

  @IsOptional()
  @IsBoolean()
  showProgress?: boolean;

  @IsOptional()
  @IsBoolean()
  showAchievements?: boolean;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  preferredCommunicationChannels?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  preferredLearningStyles?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  interests?: string[];

  @IsOptional()
  @IsBoolean()
  autoPlayVideos?: boolean;

  @IsOptional()
  @IsBoolean()
  showCaptions?: boolean;

  @IsOptional()
  @IsString()
  preferredVideoQuality?: string;

  @IsOptional()
  @IsBoolean()
  receiveMarketingEmails?: boolean;

  @IsOptional()
  @IsBoolean()
  receiveNewsletters?: boolean;

  @IsOptional()
  @IsBoolean()
  showOnlineStatus?: boolean;
}
