const resources = {
  en: {
    common: {
      appName: 'GymBro Analytics',
      language: {
        english: 'EN',
        russian: 'RU',
        selector: 'Language selector',
        switchToEnglish: 'Switch language to English',
        switchToRussian: 'Switch language to Russian',
      },
      actions: {
        logout: 'Logout',
        close: 'Close',
      },
      states: {
        error: 'Error',
      },
      fallback: {
        unknown: 'Unknown',
      },
      units: {
        ms: 'ms',
      },
    },
    auth: {
      pageTitle: 'GymBro Admin Login',
      loading: 'Loading Auth...',
      accessDeniedAlert: 'Access denied. You must be an administrator.',
      login: {
        title: 'GymBro Admin',
        emailPlaceholder: 'Email',
        passwordPlaceholder: 'Password',
        submit: 'Login to Dashboard',
        errors: {
          notAdmin: 'Access Denied. You are not an administrator.',
          invalidCredentials: 'Login failed. Check credentials.',
        },
      },
    },
    dashboard: {
      pageTitle: 'GymBro Analytics Dashboard',
      title: 'GymBro Analytics',
      headerFallback: 'Dashboard',
      navigation: {
        overview: 'Overview',
        telemetry: 'Telemetry',
        demographics: 'Demographics',
        system: 'System',
      },
      loading: 'Loading Analytics Data...',
      loadFailed: 'Failed to load reports.',
      filters: {
        startDate: 'Start Date',
        endDate: 'End Date',
        granularity: 'Granularity',
        options: {
          hour: 'Hour',
          day: 'Day',
          week: 'Week',
          month: 'Month',
        },
      },
      overview: {
        totalEngagements: 'Total Engagements',
        onboardedUsers: 'Onboarded Users',
        todayDau: 'Today DAU',
        recentApiErrors: 'Recent API Errors',
        charts: {
          dau: 'Daily Active Users (DAU)',
          funnel: 'Global Onboarding Funnel',
        },
        errors: {
          dau: 'Failed to load DAU data.',
          onboarding: 'Failed to load onboarding data.',
        },
        funnel: {
          appInstalled: 'App Installed',
          registered: 'Registered',
          onboarding: 'Onboarding',
          createdPet: 'Created Pet',
        },
      },
      telemetry: {
        charts: {
          hourly: 'Hourly Activity Flow (Tallinn Time)',
          breakdown: 'Telemetry Event Breakdown',
          sleep: 'Sleep Telemetry',
        },
        errors: {
          hourly: 'Failed to load hourly activity.',
          breakdown: 'Failed to load telemetry data.',
          sleep: 'Failed to load sleep telemetry data.',
        },
        empty: {
          breakdown: 'No telemetry events recorded yet.',
          sleep: 'No sleep telemetry data available yet.',
        },
      },
      demographics: {
        usageOverview: {
          title: 'Usage Overview',
          description: 'Global request activity for the selected date range.',
          error: 'Failed to load usage summary data.',
          metrics: {
            totalRequests: {
              title: 'Total Requests',
              subtitle: 'Selected date range',
            },
            activeUsers: {
              title: 'Active Users',
              subtitle: 'Non-admin requesters',
            },
            avgRequestsPerUser: {
              title: 'Avg Requests per User',
              subtitle: 'Across active users',
            },
            avgTokens: {
              title: 'Avg Tokens',
              subtitle: 'Per request',
            },
            avgResponseTime: {
              title: 'Avg Response Time',
              subtitle: 'Per request',
            },
          },
        },
        userDistribution: {
          title: 'User Distribution',
          description: 'How users are distributed across the available demographic categories.',
          charts: {
            age: 'Users by Age Group',
            gender: 'Users by Gender',
            weight: 'Users by Weight',
            height: 'Users by Height',
          },
          errors: {
            age: 'Failed to load age group distribution.',
            gender: 'Failed to load gender distribution.',
            weight: 'Failed to load weight distribution.',
            height: 'Failed to load height distribution.',
          },
          empty: {
            age: 'No age group distribution available yet.',
            gender: 'No gender distribution available yet.',
            weight: 'No weight distribution available yet.',
            height: 'No height distribution available yet.',
          },
        },
        segmentComparison: {
          title: 'Segment Comparison',
          description: 'A direct comparison of usage differences between the most and least active demographic segments.',
          error: 'Failed to load segment comparison data.',
          empty: 'Not enough segment data for comparison yet.',
          labels: {
            topSegment: 'Top segment',
            bottomSegment: 'Bottom segment',
            metric: 'Metric',
            gap: 'Gap',
            differencePercent: 'Difference %',
          },
          dimensions: {
            age: 'Age',
            gender: 'Gender',
            weight: 'Weight',
            height: 'Height',
          },
          metrics: {
            requests_count: 'Requests',
            avg_requests: 'Avg Requests',
          },
          summary: '{{top}} outperformed {{bottom}} by {{percent}}% in the selected period.',
        },
        usageBySegment: {
          title: 'Usage by Segment',
          description: 'How request volume differs across the same demographic groups.',
          charts: {
            age: 'Usage by Age Group',
            gender: 'Requests by Gender',
            weight: 'Requests by Weight',
            height: 'Requests by Height',
          },
          errors: {
            age: 'Failed to load age group analytics.',
            gender: 'Failed to load gender insights data.',
            weight: 'Failed to load weight insights data.',
            height: 'Failed to load height insights data.',
          },
          empty: {
            age: 'No age group analytics available yet.',
            gender: 'No gender data available.',
            weight: 'No weight data available.',
            height: 'No height data available.',
          },
        },
      },
      system: {
        charts: {
          aiHealth: 'AI Provider Health',
          requestsOverTime: 'Requests Over Time',
        },
        errors: {
          aiHealth: 'Failed to load AI health data.',
          activityTimeline: 'Failed to load activity timeline.',
        },
        empty: {
          activityTimeline: 'No activity data available for this range.',
        },
      },
      modal: {
        onboardedUsers: {
          title: 'Onboarded Users',
          searchPlaceholder: 'Search by email...',
          loading: 'Loading onboarded users...',
          error: 'Failed to load onboarded users.',
          empty: 'No onboarded users found.',
          noMatches: 'No matching onboarded users found.',
        },
      },
      tooltips: {
        usageMetrics: {
          requests: 'Requests',
          avgTokens: 'Avg Tokens',
          avgResponseTime: 'Avg Response Time',
        },
      },
      chartSeries: {
        activeUsers: 'Active Users',
        aiSuccess: 'AI Success',
        telemetryEvents: 'Telemetry Events',
        count: 'Count',
        users: 'Users',
        requests: 'Requests',
        avgRequests: 'Avg Requests',
        success: 'Success',
        rateLimited: 'Rate Limited',
        providerErrors: 'Provider Errors',
        activity: 'Activity',
      },
      values: {
        ageGroups: {
          lt18: '<18',
          from18to24: '18-24',
          from25to34: '25-34',
          from35to44: '35-44',
          from45to54: '45-54',
          from55Plus: '55+',
        },
        gender: {
          female: 'Female',
          male: 'Male',
          other: 'Other',
        },
        weightBuckets: {
          lt60: '<60',
          from60to75: '60-75',
          from75to90: '75-90',
          from90Plus: '90+',
        },
        heightBuckets: {
          lt160: '<160',
          from160to175: '160-175',
          from175to190: '175-190',
          from190Plus: '190+',
        },
      },
      eventTypes: {
        appStarted: 'App started',
        authLoginSuccess: 'Login success',
        authRegisterSuccess: 'Registration success',
        onboardingStarted: 'Onboarding started',
        onboardingPetCreated: 'Pet created',
        mealLogged: 'Meal logged',
        mealDeleted: 'Meal deleted',
        trainingLogged: 'Training logged',
        trainingDeleted: 'Training deleted',
        aiRequestStarted: 'AI request started',
        aiRequestCompleted: 'AI request completed',
        aiRequestFailed: 'AI request failed',
        aiRateLimited: 'AI rate limited',
        aiProviderFailed: 'AI provider failed',
        sleepPermissionRequested: 'Sleep permission requested',
        sleepPermissionGranted: 'Sleep permission granted',
        sleepPermissionDenied: 'Sleep permission denied',
        sleepSyncStarted: 'Sleep sync started',
        sleepSyncCompleted: 'Sleep sync completed',
        sleepSyncFailed: 'Sleep sync failed',
      },
    },
  },
  ru: {
    common: {
      appName: 'GymBro Analytics',
      language: {
        english: 'EN',
        russian: 'RU',
        selector: 'Переключатель языка',
        switchToEnglish: 'Переключить язык на английский',
        switchToRussian: 'Переключить язык на русский',
      },
      actions: {
        logout: 'Выйти',
        close: 'Закрыть',
      },
      states: {
        error: 'Ошибка',
      },
      fallback: {
        unknown: 'Неизвестно',
      },
      units: {
        ms: 'мс',
      },
    },
    auth: {
      pageTitle: 'Вход администратора GymBro',
      loading: 'Проверка авторизации...',
      accessDeniedAlert: 'Доступ запрещен. Требуются права администратора.',
      login: {
        title: 'Админка GymBro',
        emailPlaceholder: 'Email',
        passwordPlaceholder: 'Пароль',
        submit: 'Войти в дашборд',
        errors: {
          notAdmin: 'Доступ запрещен. Вы не являетесь администратором.',
          invalidCredentials: 'Не удалось войти. Проверьте учетные данные.',
        },
      },
    },
    dashboard: {
      pageTitle: 'Аналитическая панель GymBro',
      title: 'GymBro Analytics',
      headerFallback: 'Панель',
      navigation: {
        overview: 'Обзор',
        telemetry: 'Телеметрия',
        demographics: 'Демография',
        system: 'Система',
      },
      loading: 'Загрузка аналитики...',
      loadFailed: 'Не удалось загрузить отчеты.',
      filters: {
        startDate: 'Начальная дата',
        endDate: 'Конечная дата',
        granularity: 'Группировка',
        options: {
          hour: 'Час',
          day: 'День',
          week: 'Неделя',
          month: 'Месяц',
        },
      },
      overview: {
        totalEngagements: 'Всего взаимодействий',
        onboardedUsers: 'Пользователи с онбордингом',
        todayDau: 'DAU за сегодня',
        recentApiErrors: 'Недавние ошибки API',
        charts: {
          dau: 'Ежедневно активные пользователи (DAU)',
          funnel: 'Глобальная воронка онбординга',
        },
        errors: {
          dau: 'Не удалось загрузить данные DAU.',
          onboarding: 'Не удалось загрузить данные онбординга.',
        },
        funnel: {
          appInstalled: 'Приложение установлено',
          registered: 'Зарегистрировались',
          onboarding: 'Онбординг',
          createdPet: 'Создали питомца',
        },
      },
      telemetry: {
        charts: {
          hourly: 'Почасовая активность (время Таллинна)',
          breakdown: 'Разбивка событий телеметрии',
          sleep: 'Телеметрия сна',
        },
        errors: {
          hourly: 'Не удалось загрузить почасовую активность.',
          breakdown: 'Не удалось загрузить телеметрию.',
          sleep: 'Не удалось загрузить телеметрию сна.',
        },
        empty: {
          breakdown: 'События телеметрии пока отсутствуют.',
          sleep: 'Данные телеметрии сна пока отсутствуют.',
        },
      },
      demographics: {
        usageOverview: {
          title: 'Обзор использования',
          description: 'Общая активность запросов за выбранный диапазон дат.',
          error: 'Не удалось загрузить сводку использования.',
          metrics: {
            totalRequests: {
              title: 'Всего запросов',
              subtitle: 'Выбранный период',
            },
            activeUsers: {
              title: 'Активные пользователи',
              subtitle: 'Пользователи без админов',
            },
            avgRequestsPerUser: {
              title: 'Среднее запросов на пользователя',
              subtitle: 'Среди активных пользователей',
            },
            avgTokens: {
              title: 'Среднее токенов',
              subtitle: 'На один запрос',
            },
            avgResponseTime: {
              title: 'Среднее время ответа',
              subtitle: 'На один запрос',
            },
          },
        },
        userDistribution: {
          title: 'Распределение пользователей',
          description: 'Как пользователи распределяются по доступным демографическим категориям.',
          charts: {
            age: 'Пользователи по возрастным группам',
            gender: 'Пользователи по полу',
            weight: 'Пользователи по весу',
            height: 'Пользователи по росту',
          },
          errors: {
            age: 'Не удалось загрузить распределение по возрасту.',
            gender: 'Не удалось загрузить распределение по полу.',
            weight: 'Не удалось загрузить распределение по весу.',
            height: 'Не удалось загрузить распределение по росту.',
          },
          empty: {
            age: 'Распределение по возрастным группам пока недоступно.',
            gender: 'Распределение по полу пока недоступно.',
            weight: 'Распределение по весу пока недоступно.',
            height: 'Распределение по росту пока недоступно.',
          },
        },
        segmentComparison: {
          title: 'Сравнение сегментов',
          description: 'Прямое сравнение различий в использовании между наиболее и наименее активными демографическими сегментами.',
          error: 'Не удалось загрузить сравнение сегментов.',
          empty: 'Пока недостаточно данных для сравнения сегментов.',
          labels: {
            topSegment: 'Лучший сегмент',
            bottomSegment: 'Нижний сегмент',
            metric: 'Метрика',
            gap: 'Разрыв',
            differencePercent: 'Разница %',
          },
          dimensions: {
            age: 'Возраст',
            gender: 'Пол',
            weight: 'Вес',
            height: 'Рост',
          },
          metrics: {
            requests_count: 'Запросы',
            avg_requests: 'Среднее запросов',
          },
          summary: '{{top}} опережает {{bottom}} на {{percent}}% за выбранный период.',
        },
        usageBySegment: {
          title: 'Использование по сегментам',
          description: 'Как различается объем запросов в этих же демографических группах.',
          charts: {
            age: 'Использование по возрастным группам',
            gender: 'Запросы по полу',
            weight: 'Запросы по весу',
            height: 'Запросы по росту',
          },
          errors: {
            age: 'Не удалось загрузить аналитику по возрастным группам.',
            gender: 'Не удалось загрузить данные по полу.',
            weight: 'Не удалось загрузить данные по весу.',
            height: 'Не удалось загрузить данные по росту.',
          },
          empty: {
            age: 'Аналитика по возрастным группам пока недоступна.',
            gender: 'Данные по полу недоступны.',
            weight: 'Данные по весу недоступны.',
            height: 'Данные по росту недоступны.',
          },
        },
      },
      system: {
        charts: {
          aiHealth: 'Состояние AI-провайдера',
          requestsOverTime: 'Запросы во времени',
        },
        errors: {
          aiHealth: 'Не удалось загрузить данные о состоянии AI.',
          activityTimeline: 'Не удалось загрузить временную шкалу активности.',
        },
        empty: {
          activityTimeline: 'Для выбранного диапазона данные активности отсутствуют.',
        },
      },
      modal: {
        onboardedUsers: {
          title: 'Пользователи с онбордингом',
          searchPlaceholder: 'Поиск по email...',
          loading: 'Загрузка пользователей с онбордингом...',
          error: 'Не удалось загрузить пользователей с онбордингом.',
          empty: 'Пользователи с онбордингом не найдены.',
          noMatches: 'Совпадающие пользователи не найдены.',
        },
      },
      tooltips: {
        usageMetrics: {
          requests: 'Запросы',
          avgTokens: 'Среднее токенов',
          avgResponseTime: 'Среднее время ответа',
        },
      },
      chartSeries: {
        activeUsers: 'Активные пользователи',
        aiSuccess: 'Успешные AI-запросы',
        telemetryEvents: 'События телеметрии',
        count: 'Количество',
        users: 'Пользователи',
        requests: 'Запросы',
        avgRequests: 'Среднее запросов',
        success: 'Успех',
        rateLimited: 'Лимит превышен',
        providerErrors: 'Ошибки провайдера',
        activity: 'Активность',
      },
      values: {
        ageGroups: {
          lt18: '<18',
          from18to24: '18-24',
          from25to34: '25-34',
          from35to44: '35-44',
          from45to54: '45-54',
          from55Plus: '55+',
        },
        gender: {
          female: 'Женский',
          male: 'Мужской',
          other: 'Другой',
        },
        weightBuckets: {
          lt60: '<60',
          from60to75: '60-75',
          from75to90: '75-90',
          from90Plus: '90+',
        },
        heightBuckets: {
          lt160: '<160',
          from160to175: '160-175',
          from175to190: '175-190',
          from190Plus: '190+',
        },
      },
      eventTypes: {
        appStarted: 'Запуск приложения',
        authLoginSuccess: 'Успешный вход',
        authRegisterSuccess: 'Успешная регистрация',
        onboardingStarted: 'Онбординг начат',
        onboardingPetCreated: 'Питомец создан',
        mealLogged: 'Прием пищи добавлен',
        mealDeleted: 'Прием пищи удален',
        trainingLogged: 'Тренировка добавлена',
        trainingDeleted: 'Тренировка удалена',
        aiRequestStarted: 'AI-запрос начат',
        aiRequestCompleted: 'AI-запрос завершен',
        aiRequestFailed: 'AI-запрос завершился ошибкой',
        aiRateLimited: 'Сработал лимит AI',
        aiProviderFailed: 'Ошибка AI-провайдера',
        sleepPermissionRequested: 'Запрошено разрешение на сон',
        sleepPermissionGranted: 'Разрешение на сон выдано',
        sleepPermissionDenied: 'Разрешение на сон отклонено',
        sleepSyncStarted: 'Синхронизация сна начата',
        sleepSyncCompleted: 'Синхронизация сна завершена',
        sleepSyncFailed: 'Синхронизация сна завершилась ошибкой',
      },
    },
  },
};

resources.en.dashboard = {
  ...resources.en.dashboard,
  navigation: {
    ...resources.en.dashboard.navigation,
    analytics: 'Analytics',
  },
  telemetry: {
    ...resources.en.dashboard.telemetry,
    overview: {
      title: 'Diagnostics Overview',
      description: 'Operational activity and instrumentation health from the current hourly report window.',
      metrics: {
        telemetryEvents: {
          title: 'Telemetry Events',
          subtitle: 'Current report window',
        },
        frontendEvents: {
          title: 'Frontend Events',
          subtitle: 'Logged by client API',
        },
        backendEvents: {
          title: 'Backend Events',
          subtitle: 'Logged by backend services',
        },
        aiSuccess: {
          title: 'AI Successes',
          subtitle: 'Completed AI requests',
        },
      },
    },
    charts: {
      ...resources.en.dashboard.telemetry.charts,
      hourly: 'Hourly Activity Diagnostics',
      hourlyDescription: 'Current hourly report window in Tallinn time. This report does not strictly follow the dashboard date filters.',
    },
    empty: {
      ...resources.en.dashboard.telemetry.empty,
      hourly: 'No hourly diagnostic data available yet.',
    },
  },
  demographics: {
    ...resources.en.dashboard.demographics,
    metricToggleLabel: 'Segment metric',
    metricOptions: {
      requests: 'Requests',
      avgTokens: 'Avg Tokens',
      avgResponseTime: 'Avg Response Time',
    },
    usageBySegment: {
      ...resources.en.dashboard.demographics.usageBySegment,
      description: 'Switch between request volume, average tokens, and average response time for the selected date range.',
      charts: {
        age: 'Age Groups by {{metric}}',
        gender: 'Gender by {{metric}}',
        weight: 'Weight by {{metric}}',
        height: 'Height by {{metric}}',
      },
    },
  },
  analytics: {
    usageOverview: {
      title: 'Usage Overview',
      description: 'Core AI usage KPIs for the selected date range.',
      error: 'Failed to load usage overview data.',
      metrics: {
        totalRequests: {
          title: 'Total AI Requests',
          subtitle: 'Selected date range',
        },
        activeUsers: {
          title: 'Active AI Users',
          subtitle: 'Range-aware requesters',
        },
        requestsPerActiveUser: {
          title: 'Requests per Active User',
          subtitle: 'Across active AI users',
        },
        avgTokensPerRequest: {
          title: 'Avg Tokens per Request',
          subtitle: 'Selected date range',
        },
        avgResponseTime: {
          title: 'Avg Response Time',
          subtitle: 'Selected date range',
        },
        totalOnboardedUsers: {
          title: 'Total Onboarded Users',
          subtitle: 'All-time onboarded users',
          subtitleFallback: 'Fallback from onboarding funnel report',
        },
      },
    },
    usageTrends: {
      title: 'Usage Trends',
      description: 'Switch between requests, tokens, and average response time for the selected date range.',
      metricToggleLabel: 'Trend metric',
      chartTitle: '{{metric}} over Time',
      error: 'Failed to load usage trend data.',
      empty: 'No trend data available for this range.',
      metrics: {
        requests: 'Requests',
        tokens: 'Tokens',
        avgResponseTime: 'Avg Response Time',
      },
    },
    userIntensity: {
      title: 'User Intensity',
      description: 'Current /reports/users snapshot of the most active AI users. This section does not strictly follow the dashboard date filters.',
      charts: {
        intensity: 'Top Users by Request Volume',
      },
      table: {
        title: 'Top Users',
        description: 'Requests, sessions, tokens, response time, and rate-limit pressure by user.',
        headers: {
          user: 'User',
          requests: 'Requests',
          sessions: 'Sessions',
          totalTokens: 'Total Tokens',
          avgResponseTime: 'Avg Response Time',
          rateLimits: 'Rate Limits',
        },
      },
      errors: {
        users: 'Failed to load user reports.',
      },
      empty: {
        users: 'No user usage data available yet.',
      },
    },
    adoption: {
      title: 'Adoption & Conversion',
      description: 'How onboarding completion relates to later AI usage.',
      metrics: {
        totalOnboardedUsers: {
          title: 'Total Onboarded Users',
          subtitle: 'All-time onboarding completions',
        },
        onboardedInRange: {
          title: 'Onboarded in Range',
          subtitle: 'Based on onboarding completion date',
        },
        zeroUsage: {
          title: 'Zero AI Usage',
          subtitle: 'Onboarded users with no AI requests',
        },
        avgRequestsPerOnboarded: {
          title: 'Avg Requests per Onboarded User',
          subtitle: 'Current all-time user usage snapshot',
        },
      },
      charts: {
        onboardedOverTime: 'Onboarded Users over Time',
        onboardedOverTimeDescription: 'Grouped from the existing onboarded users list by onboarding completion date.',
        onboardedSeries: 'Onboarded Users',
      },
      errors: {
        onboarded: 'Failed to load onboarded users.',
      },
      empty: {
        onboarded: 'No onboarded users found in the selected range.',
      },
    },
    engagement: {
      title: 'Engagement vs AI Usage',
      description: 'Compare meals/training engagement events with AI request activity. This section uses current report snapshots rather than the visible date filters.',
      metrics: {
        engagedAvgRequests: {
          title: 'Avg Requests for Engaged Users',
          subtitle: 'Users with meals or training events',
        },
        noEngagementAvgRequests: {
          title: 'Avg Requests with No Engagement',
          subtitle: 'Users with zero meals and training events',
        },
        overlapUsers: {
          title: 'Users with Both Signals',
          subtitle: 'Users with engagement events and AI requests',
        },
      },
      charts: {
        scatter: 'Engagement vs AI Requests',
      },
      axis: {
        engagement: 'Engagement Events',
        requests: 'AI Requests',
      },
      errors: {
        engagement: 'Failed to load engagement comparison data.',
      },
      empty: {
        engagement: 'Not enough engagement and AI usage data for comparison yet.',
      },
    },
  },
};

resources.ru.dashboard = {
  ...resources.ru.dashboard,
  navigation: {
    ...resources.ru.dashboard.navigation,
    analytics: 'Аналитика',
  },
  telemetry: {
    ...resources.ru.dashboard.telemetry,
    overview: {
      title: 'Диагностический обзор',
      description: 'Операционная активность и состояние инструментирования по текущему почасовому окну отчета.',
      metrics: {
        telemetryEvents: {
          title: 'События телеметрии',
          subtitle: 'Текущее окно отчета',
        },
        frontendEvents: {
          title: 'Frontend-события',
          subtitle: 'Логи клиентского API',
        },
        backendEvents: {
          title: 'Backend-события',
          subtitle: 'Логи сервисов бэкенда',
        },
        aiSuccess: {
          title: 'Успешные AI-запросы',
          subtitle: 'Завершенные AI-запросы',
        },
      },
    },
    charts: {
      ...resources.ru.dashboard.telemetry.charts,
      hourly: 'Почасовая диагностика активности',
      hourlyDescription: 'Текущее почасовое окно отчета по времени Таллина. Этот отчет не следует строго выбранному диапазону дат.',
    },
    empty: {
      ...resources.ru.dashboard.telemetry.empty,
      hourly: 'Почасовые диагностические данные пока отсутствуют.',
    },
  },
  demographics: {
    ...resources.ru.dashboard.demographics,
    metricToggleLabel: 'Метрика сегмента',
    metricOptions: {
      requests: 'Запросы',
      avgTokens: 'Средние токены',
      avgResponseTime: 'Среднее время ответа',
    },
    usageBySegment: {
      ...resources.ru.dashboard.demographics.usageBySegment,
      description: 'Переключайтесь между объемом запросов, средними токенами и средним временем ответа для выбранного диапазона дат.',
      charts: {
        age: 'Возрастные группы по метрике {{metric}}',
        gender: 'Пол по метрике {{metric}}',
        weight: 'Весовые группы по метрике {{metric}}',
        height: 'Ростовые группы по метрике {{metric}}',
      },
    },
  },
  analytics: {
    usageOverview: {
      title: 'Обзор использования',
      description: 'Ключевые AI-метрики для выбранного диапазона дат.',
      error: 'Не удалось загрузить обзор использования.',
      metrics: {
        totalRequests: {
          title: 'Всего AI-запросов',
          subtitle: 'Выбранный диапазон дат',
        },
        activeUsers: {
          title: 'Активные AI-пользователи',
          subtitle: 'Пользователи с запросами в диапазоне',
        },
        requestsPerActiveUser: {
          title: 'Запросов на активного пользователя',
          subtitle: 'Среди активных AI-пользователей',
        },
        avgTokensPerRequest: {
          title: 'Средние токены на запрос',
          subtitle: 'Выбранный диапазон дат',
        },
        avgResponseTime: {
          title: 'Среднее время ответа',
          subtitle: 'Выбранный диапазон дат',
        },
        totalOnboardedUsers: {
          title: 'Всего пользователей с онбордингом',
          subtitle: 'Все пользователи с завершенным онбордингом',
          subtitleFallback: 'Резервное значение из отчета по воронке онбординга',
        },
      },
    },
    usageTrends: {
      title: 'Динамика использования',
      description: 'Переключайтесь между запросами, токенами и средним временем ответа для выбранного диапазона дат.',
      metricToggleLabel: 'Метрика тренда',
      chartTitle: '{{metric}} во времени',
      error: 'Не удалось загрузить данные динамики использования.',
      empty: 'Для выбранного диапазона данные тренда отсутствуют.',
      metrics: {
        requests: 'Запросы',
        tokens: 'Токены',
        avgResponseTime: 'Среднее время ответа',
      },
    },
    userIntensity: {
      title: 'Интенсивность пользователей',
      description: 'Текущий снимок /reports/users по самым активным AI-пользователям. Этот раздел не следует строго выбранному диапазону дат.',
      charts: {
        intensity: 'Топ пользователей по числу запросов',
      },
      table: {
        title: 'Топ пользователей',
        description: 'Запросы, сессии, токены, время ответа и превышения лимита по пользователям.',
        headers: {
          user: 'Пользователь',
          requests: 'Запросы',
          sessions: 'Сессии',
          totalTokens: 'Всего токенов',
          avgResponseTime: 'Среднее время ответа',
          rateLimits: 'Лимиты',
        },
      },
      errors: {
        users: 'Не удалось загрузить пользовательские отчеты.',
      },
      empty: {
        users: 'Данные по использованию пользователей пока отсутствуют.',
      },
    },
    adoption: {
      title: 'Активация и конверсия',
      description: 'Как завершение онбординга связано с последующим AI-использованием.',
      metrics: {
        totalOnboardedUsers: {
          title: 'Всего пользователей с онбордингом',
          subtitle: 'Все завершения онбординга',
        },
        onboardedInRange: {
          title: 'Онбординг в диапазоне',
          subtitle: 'По дате завершения онбординга',
        },
        zeroUsage: {
          title: 'Без AI-использования',
          subtitle: 'Пользователи с онбордингом без AI-запросов',
        },
        avgRequestsPerOnboarded: {
          title: 'Среднее запросов на пользователя',
          subtitle: 'Текущий all-time снимок использования',
        },
      },
      charts: {
        onboardedOverTime: 'Пользователи с онбордингом во времени',
        onboardedOverTimeDescription: 'Группировка текущего списка пользователей с онбордингом по дате завершения.',
        onboardedSeries: 'Пользователи с онбордингом',
      },
      errors: {
        onboarded: 'Не удалось загрузить пользователей с онбордингом.',
      },
      empty: {
        onboarded: 'В выбранном диапазоне нет пользователей с онбордингом.',
      },
    },
    engagement: {
      title: 'Вовлеченность и AI-использование',
      description: 'Сравнение событий meals/training с активностью AI-запросов. Раздел использует текущие снимки отчетов, а не видимые фильтры дат.',
      metrics: {
        engagedAvgRequests: {
          title: 'Среднее запросов у вовлеченных пользователей',
          subtitle: 'Пользователи с meals или training событиями',
        },
        noEngagementAvgRequests: {
          title: 'Среднее запросов без вовлеченности',
          subtitle: 'Пользователи без meals и training событий',
        },
        overlapUsers: {
          title: 'Пользователи с обоими сигналами',
          subtitle: 'Есть и события вовлеченности, и AI-запросы',
        },
      },
      charts: {
        scatter: 'Вовлеченность vs AI-запросы',
      },
      axis: {
        engagement: 'События вовлеченности',
        requests: 'AI-запросы',
      },
      errors: {
        engagement: 'Не удалось загрузить данные сравнения вовлеченности.',
      },
      empty: {
        engagement: 'Пока недостаточно данных для сравнения вовлеченности и AI-использования.',
      },
    },
  },
};

export default resources;
