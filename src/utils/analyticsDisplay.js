const AGE_GROUP_TRANSLATION_KEYS = {
  '<18': 'dashboard.values.ageGroups.lt18',
  '18-24': 'dashboard.values.ageGroups.from18to24',
  '25-34': 'dashboard.values.ageGroups.from25to34',
  '35-44': 'dashboard.values.ageGroups.from35to44',
  '45-54': 'dashboard.values.ageGroups.from45to54',
  '55+': 'dashboard.values.ageGroups.from55Plus',
};

const GENDER_TRANSLATION_KEYS = {
  female: 'dashboard.values.gender.female',
  male: 'dashboard.values.gender.male',
  other: 'dashboard.values.gender.other',
  unknown: 'common.fallback.unknown',
};

const WEIGHT_BUCKET_TRANSLATION_KEYS = {
  '<60': 'dashboard.values.weightBuckets.lt60',
  '60-75': 'dashboard.values.weightBuckets.from60to75',
  '75-90': 'dashboard.values.weightBuckets.from75to90',
  '90+': 'dashboard.values.weightBuckets.from90Plus',
  unknown: 'common.fallback.unknown',
};

const HEIGHT_BUCKET_TRANSLATION_KEYS = {
  '<160': 'dashboard.values.heightBuckets.lt160',
  '160-175': 'dashboard.values.heightBuckets.from160to175',
  '175-190': 'dashboard.values.heightBuckets.from175to190',
  '190+': 'dashboard.values.heightBuckets.from190Plus',
  unknown: 'common.fallback.unknown',
};

const EVENT_TYPE_TRANSLATION_KEYS = {
  'app.started': 'dashboard.eventTypes.appStarted',
  'auth.login_success': 'dashboard.eventTypes.authLoginSuccess',
  'auth.register_success': 'dashboard.eventTypes.authRegisterSuccess',
  'onboarding.started': 'dashboard.eventTypes.onboardingStarted',
  'onboarding.pet_created': 'dashboard.eventTypes.onboardingPetCreated',
  'meal.logged': 'dashboard.eventTypes.mealLogged',
  'meal.deleted': 'dashboard.eventTypes.mealDeleted',
  'training.logged': 'dashboard.eventTypes.trainingLogged',
  'training.deleted': 'dashboard.eventTypes.trainingDeleted',
  'ai.request_started': 'dashboard.eventTypes.aiRequestStarted',
  'ai.request_completed': 'dashboard.eventTypes.aiRequestCompleted',
  'ai.request_failed': 'dashboard.eventTypes.aiRequestFailed',
  'ai.rate_limited': 'dashboard.eventTypes.aiRateLimited',
  'ai.provider_failed': 'dashboard.eventTypes.aiProviderFailed',
  'sleep.permission_requested': 'dashboard.eventTypes.sleepPermissionRequested',
  'sleep.permission_granted': 'dashboard.eventTypes.sleepPermissionGranted',
  'sleep.permission_denied': 'dashboard.eventTypes.sleepPermissionDenied',
  'sleep.sync_started': 'dashboard.eventTypes.sleepSyncStarted',
  'sleep.sync_completed': 'dashboard.eventTypes.sleepSyncCompleted',
  'sleep.sync_success': 'dashboard.eventTypes.sleepSyncCompleted',
  'sleep.sync_failed': 'dashboard.eventTypes.sleepSyncFailed',
};

function getMappedLabel(value, t, mapping) {
  if (value == null || value === '') {
    return t('common.fallback.unknown');
  }

  const translationKey = mapping[String(value)];
  return translationKey ? t(translationKey) : String(value);
}

export function getAgeGroupLabel(value, t) {
  return getMappedLabel(value, t, AGE_GROUP_TRANSLATION_KEYS);
}

export function getGenderLabel(value, t) {
  return getMappedLabel(String(value || '').toLowerCase(), t, GENDER_TRANSLATION_KEYS);
}

export function getWeightBucketLabel(value, t) {
  return getMappedLabel(value, t, WEIGHT_BUCKET_TRANSLATION_KEYS);
}

export function getHeightBucketLabel(value, t) {
  return getMappedLabel(value, t, HEIGHT_BUCKET_TRANSLATION_KEYS);
}

export function getSegmentValueLabel(dimension, value, t) {
  switch (dimension) {
    case 'age':
      return getAgeGroupLabel(value, t);
    case 'gender':
      return getGenderLabel(value, t);
    case 'weight':
      return getWeightBucketLabel(value, t);
    case 'height':
      return getHeightBucketLabel(value, t);
    default:
      return value || t('common.fallback.unknown');
  }
}

export function getEventTypeLabel(value, t) {
  if (!value) {
    return t('common.fallback.unknown');
  }

  const translationKey = EVENT_TYPE_TRANSLATION_KEYS[value];
  return translationKey ? t(translationKey) : value;
}
