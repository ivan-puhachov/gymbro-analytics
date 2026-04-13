const AGE_GROUP_TRANSLATION_KEYS = {
  '<18': 'values.ageGroups.lt18',
  '18-24': 'values.ageGroups.from18to24',
  '25-34': 'values.ageGroups.from25to34',
  '35-44': 'values.ageGroups.from35to44',
  '45-54': 'values.ageGroups.from45to54',
  '55+': 'values.ageGroups.from55Plus',
  unknown: 'common:fallback.unknown',
};

const GENDER_TRANSLATION_KEYS = {
  female: 'values.gender.female',
  male: 'values.gender.male',
  other: 'values.gender.other',
  unknown: 'common:fallback.unknown',
};

const WEIGHT_BUCKET_TRANSLATION_KEYS = {
  '<60': 'values.weightBuckets.lt60',
  '60-75': 'values.weightBuckets.from60to75',
  '75-90': 'values.weightBuckets.from75to90',
  '90+': 'values.weightBuckets.from90Plus',
  unknown: 'common:fallback.unknown',
};

const HEIGHT_BUCKET_TRANSLATION_KEYS = {
  '<160': 'values.heightBuckets.lt160',
  '160-175': 'values.heightBuckets.from160to175',
  '175-190': 'values.heightBuckets.from175to190',
  '190+': 'values.heightBuckets.from190Plus',
  unknown: 'common:fallback.unknown',
};

function getMappedLabel(value, t, mapping) {
  const normalizedValue = String(value ?? '').trim();

  if (!normalizedValue) {
    return t('common:fallback.unknown');
  }

  const lowerCasedValue = normalizedValue.toLowerCase();
  const lookupValue = ['unknown', 'null', 'undefined', 'n/a', 'na', 'none'].includes(lowerCasedValue)
    ? 'unknown'
    : normalizedValue;
  const translationKey = mapping[lookupValue];

  return translationKey ? t(translationKey) : lookupValue;
}

export function getAgeGroupLabel(value, t) {
  return getMappedLabel(value, t, AGE_GROUP_TRANSLATION_KEYS);
}

export function getGenderLabel(value, t) {
  return getMappedLabel(String(value || '').trim().toLowerCase(), t, GENDER_TRANSLATION_KEYS);
}

export function getWeightBucketLabel(value, t) {
  return getMappedLabel(value, t, WEIGHT_BUCKET_TRANSLATION_KEYS);
}

export function getHeightBucketLabel(value, t) {
  return getMappedLabel(value, t, HEIGHT_BUCKET_TRANSLATION_KEYS);
}

export function getSegmentValueLabel(dimension, value, t) {
  switch (String(dimension || '').trim().toLowerCase()) {
    case 'age':
      return getAgeGroupLabel(value, t);
    case 'gender':
      return getGenderLabel(value, t);
    case 'weight':
      return getWeightBucketLabel(value, t);
    case 'height':
      return getHeightBucketLabel(value, t);
    default:
      return String(value ?? '').trim() || t('common:fallback.unknown');
  }
}
